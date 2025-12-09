import { promises as fs } from 'fs';
import path from 'path';

const PROFILE_PIC_DIR = path.join(process.cwd(), 'config', 'profile-pic');
const PUBLIC_PROFILE_PIC_DIR = path.join(process.cwd(), 'public', 'config', 'profile-pic');

export async function getProfilePictureUrl(githubUsername: string): Promise<string | null> {
  // First, try to find a local profile picture
  try {
    const files = await fs.readdir(PROFILE_PIC_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    if (imageFiles.length > 0) {
      const imageFile = imageFiles[0];
      
      // Ensure public directory exists
      try {
        await fs.mkdir(PUBLIC_PROFILE_PIC_DIR, { recursive: true });
      } catch (error) {
        // Directory might already exist, continue
      }
      
      // Copy file to public directory if it doesn't exist or is outdated
      const sourcePath = path.join(PROFILE_PIC_DIR, imageFile);
      const destPath = path.join(PUBLIC_PROFILE_PIC_DIR, imageFile);
      
      try {
        // Check if file needs to be copied (doesn't exist or source is newer)
        const sourceStats = await fs.stat(sourcePath);
        let needsCopy = true;
        
        try {
          const destStats = await fs.stat(destPath);
          needsCopy = sourceStats.mtime > destStats.mtime;
        } catch {
          // Destination doesn't exist, needs copy
          needsCopy = true;
        }
        
        if (needsCopy) {
          await fs.copyFile(sourcePath, destPath);
        }
      } catch (error) {
        // If copy fails, still return the path (might work if file already exists)
        console.warn(`Failed to copy profile picture to public folder: ${error}`);
      }
      
      // Use the first image found - serve from public directory
      return `/config/profile-pic/${imageFile}`;
    }
  } catch (error) {
    // Directory doesn't exist or can't be read, continue to GitHub fallback
  }

  // Fallback to GitHub avatar
  if (githubUsername) {
    // GitHub avatars are available at size 420px
    return `https://github.com/${githubUsername}.png?size=420`;
  }

  return null;
}

