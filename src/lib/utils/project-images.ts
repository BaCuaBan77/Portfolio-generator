import { promises as fs } from 'fs';
import path from 'path';

const PROJECT_IMAGES_DIR = path.join(process.cwd(), 'config', 'project-images');
const PUBLIC_PROJECT_IMAGES_DIR = path.join(process.cwd(), 'public', 'config', 'project-images');

/**
 * Process project image path - if it's a local path, copy to public and return public URL
 * @param imagePath - Original image path (can be URL or local path)
 * @returns Public URL path, original URL, or original path if file not found (to preserve property in JSON)
 */
export async function processProjectImagePath(imagePath: string | undefined): Promise<string | undefined> {
  if (!imagePath) {
    return undefined;
  }

  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Extract filename from various path formats
  let fileName: string;
  
  if (imagePath.startsWith('/config/project-images/')) {
    // Path is already in public URL format (e.g., "/config/project-images/screenshot.png")
    // Extract filename but still need to ensure file is copied to public directory
    fileName = path.basename(imagePath);
  } else if (imagePath.startsWith('./project-images/')) {
    // Extract filename from path like ./project-images/image.png
    // (projects.json is in config/, so this is relative to config/)
    fileName = path.basename(imagePath);
  } else if (imagePath.startsWith('./config/project-images/')) {
    // Extract filename from path like ./config/project-images/image.png
    fileName = path.basename(imagePath);
  } else if (imagePath.includes('/')) {
    // Extract filename from any other path
    fileName = path.basename(imagePath);
  } else {
    // It's just a filename
    fileName = imagePath;
  }

  try {
    // Ensure public directory exists
    await fs.mkdir(PUBLIC_PROJECT_IMAGES_DIR, { recursive: true });

    const sourcePath = path.join(PROJECT_IMAGES_DIR, fileName);
    const destPath = path.join(PUBLIC_PROJECT_IMAGES_DIR, fileName);

    // Check if source file exists
    try {
      await fs.access(sourcePath);
    } catch {
      console.warn(`Project image not found: ${sourcePath}`);
      return imagePath;
    }

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

    // Return public URL path
    return `/config/project-images/${fileName}`;
  } catch (error) {
    console.error(`Failed to process project image ${imagePath}:`, error);
    return imagePath;
  }
}

/**
 * Copy all images from config/project-images to public/config/project-images
 * This is useful for Docker builds and initialization
 */
export async function copyAllProjectImages(): Promise<void> {
  try {
    // Ensure directories exist
    await fs.mkdir(PROJECT_IMAGES_DIR, { recursive: true });
    await fs.mkdir(PUBLIC_PROJECT_IMAGES_DIR, { recursive: true });

    // Read all files from source directory
    const files = await fs.readdir(PROJECT_IMAGES_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );

    // Copy each image
    for (const file of imageFiles) {
      const sourcePath = path.join(PROJECT_IMAGES_DIR, file);
      const destPath = path.join(PUBLIC_PROJECT_IMAGES_DIR, file);
      
      try {
        await fs.copyFile(sourcePath, destPath);
        console.log(`Copied project image: ${file}`);
      } catch (error) {
        console.warn(`Failed to copy ${file}:`, error);
      }
    }

    if (imageFiles.length > 0) {
      console.log(`Successfully copied ${imageFiles.length} project images to public directory`);
    }
  } catch (error) {
    console.error('Failed to copy project images:', error);
  }
}

