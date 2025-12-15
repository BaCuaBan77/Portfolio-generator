import { promises as fs } from 'fs';
import path from 'path';

const PROFILE_PIC_DIR = path.join(process.cwd(), 'config', 'profile-pic');

export async function getProfilePictureUrl(githubUsername: string): Promise<string | null> {
  // First, try to find a local profile picture
  try {
    const files = await fs.readdir(PROFILE_PIC_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    if (imageFiles.length > 0) {
      // Use the first image found (most recent if sorted)
      const imageFile = imageFiles[0];
      
      // Return path to be served via route handler (no copying needed)
      // The route handler at /config/profile-pic/[...path] will serve the file directly from config/
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

