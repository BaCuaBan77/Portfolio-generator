import * as fs from 'fs';
import path from 'path';

// Mock fs.promises module
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    promises: {
      mkdir: jest.fn(),
      access: jest.fn(),
      stat: jest.fn(),
      copyFile: jest.fn(),
      readdir: jest.fn(),
    },
  };
});

import { processProjectImagePath, copyAllProjectImages } from '@/lib/utils/project-images';

describe('project-images utilities', () => {
  const mockFs = (fs as any).promises as jest.Mocked<typeof fs.promises>;
  const actualCwd = process.cwd();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processProjectImagePath', () => {
    it('should return undefined for undefined input', async () => {
      const result = await processProjectImagePath(undefined);
      expect(result).toBeUndefined();
    });

    it('should return external HTTP URL as-is', async () => {
      const url = 'http://example.com/image.png';
      const result = await processProjectImagePath(url);
      expect(result).toBe(url);
      expect(mockFs.copyFile).not.toHaveBeenCalled();
    });

    it('should return external HTTPS URL as-is', async () => {
      const url = 'https://example.com/image.png';
      const result = await processProjectImagePath(url);
      expect(result).toBe(url);
      expect(mockFs.copyFile).not.toHaveBeenCalled();
    });

    it('should process filename-only path', async () => {
      const imagePath = 'screenshot.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'screenshot.png');
      const destPath = path.join(actualCwd, 'public', 'config', 'project-images', 'screenshot.png');

      mockFs.access.mockResolvedValue(undefined);
      // Mock stat to return different times so copy is needed
      const sourceTime = new Date('2024-01-02');
      const destTime = new Date('2024-01-01');
      mockFs.stat
        .mockResolvedValueOnce({ mtime: sourceTime } as any) // source
        .mockRejectedValueOnce(new Error('Not found')); // dest doesn't exist
      mockFs.copyFile.mockResolvedValue(undefined);

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe('/config/project-images/screenshot.png');
      expect(mockFs.mkdir).toHaveBeenCalled();
      expect(mockFs.access).toHaveBeenCalledWith(sourcePath);
      expect(mockFs.copyFile).toHaveBeenCalledWith(sourcePath, destPath);
    });

    it('should process relative path starting with ./project-images/', async () => {
      const imagePath = './project-images/image.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'image.png');
      const destPath = path.join(actualCwd, 'public', 'config', 'project-images', 'image.png');

      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat
        .mockResolvedValueOnce({ mtime: new Date('2024-01-02') } as any)
        .mockRejectedValueOnce(new Error('Not found'));
      mockFs.copyFile.mockResolvedValue(undefined);

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe('/config/project-images/image.png');
      expect(mockFs.access).toHaveBeenCalledWith(sourcePath);
      expect(mockFs.copyFile).toHaveBeenCalledWith(sourcePath, destPath);
    });

    it('should process path starting with ./config/project-images/', async () => {
      const imagePath = './config/project-images/image.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'image.png');
      const destPath = path.join(actualCwd, 'public', 'config', 'project-images', 'image.png');

      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat
        .mockResolvedValueOnce({ mtime: new Date('2024-01-02') } as any)
        .mockRejectedValueOnce(new Error('Not found'));
      mockFs.copyFile.mockResolvedValue(undefined);

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe('/config/project-images/image.png');
      expect(mockFs.access).toHaveBeenCalledWith(sourcePath);
      expect(mockFs.copyFile).toHaveBeenCalledWith(sourcePath, destPath);
    });

    it('should process path starting with /config/project-images/', async () => {
      const imagePath = '/config/project-images/image.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'image.png');
      const destPath = path.join(actualCwd, 'public', 'config', 'project-images', 'image.png');

      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat
        .mockResolvedValueOnce({ mtime: new Date('2024-01-02') } as any)
        .mockRejectedValueOnce(new Error('Not found'));
      mockFs.copyFile.mockResolvedValue(undefined);

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe('/config/project-images/image.png');
      expect(mockFs.access).toHaveBeenCalledWith(sourcePath);
      expect(mockFs.copyFile).toHaveBeenCalledWith(sourcePath, destPath);
    });

    it('should return original path if source file does not exist', async () => {
      const imagePath = 'nonexistent.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'nonexistent.png');

      mockFs.access.mockRejectedValue(new Error('File not found'));

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe(imagePath); // Return original path to preserve property in JSON
      expect(mockFs.copyFile).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Project image not found')
      );

      consoleSpy.mockRestore();
    });

    it('should not copy if destination exists and is newer', async () => {
      const imagePath = 'screenshot.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'screenshot.png');
      const destPath = path.join(actualCwd, 'public', 'config', 'project-images', 'screenshot.png');

      const oldDate = new Date('2024-01-01');
      const newDate = new Date('2024-01-02');

      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat
        .mockResolvedValueOnce({ mtime: oldDate } as any) // source
        .mockResolvedValueOnce({ mtime: newDate } as any); // dest

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe('/config/project-images/screenshot.png');
      expect(mockFs.copyFile).not.toHaveBeenCalled();
    });

    it('should copy if source is newer than destination', async () => {
      const imagePath = 'screenshot.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'screenshot.png');
      const destPath = path.join(actualCwd, 'public', 'config', 'project-images', 'screenshot.png');

      const oldDate = new Date('2024-01-01');
      const newDate = new Date('2024-01-02');

      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat
        .mockResolvedValueOnce({ mtime: newDate } as any) // source
        .mockResolvedValueOnce({ mtime: oldDate } as any); // dest
      mockFs.copyFile.mockResolvedValue(undefined);

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe('/config/project-images/screenshot.png');
      expect(mockFs.copyFile).toHaveBeenCalledWith(sourcePath, destPath);
    });

    it('should copy if destination does not exist', async () => {
      const imagePath = 'screenshot.png';
      const sourcePath = path.join(actualCwd, 'config', 'project-images', 'screenshot.png');
      const destPath = path.join(actualCwd, 'public', 'config', 'project-images', 'screenshot.png');

      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat
        .mockResolvedValueOnce({ mtime: new Date() } as any) // source
        .mockRejectedValueOnce(new Error('Not found')); // dest
      mockFs.copyFile.mockResolvedValue(undefined);

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe('/config/project-images/screenshot.png');
      expect(mockFs.copyFile).toHaveBeenCalledWith(sourcePath, destPath);
    });

    it('should handle errors gracefully', async () => {
      const imagePath = 'screenshot.png';

      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await processProjectImagePath(imagePath);

      expect(result).toBe(imagePath); // Return original path to preserve property in JSON
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to process project image'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('copyAllProjectImages', () => {
    it('should copy all image files from config to public directory', async () => {
      const files = ['image1.png', 'image2.jpg', 'readme.txt', 'image3.webp'];
      const imageFiles = ['image1.png', 'image2.jpg', 'image3.webp'];

      // Mock mkdir to succeed (needed for the function to proceed)
      mockFs.mkdir.mockResolvedValue(undefined as any);
      mockFs.readdir.mockResolvedValue(files as any);
      mockFs.copyFile.mockResolvedValue(undefined);

      await copyAllProjectImages();

      expect(mockFs.mkdir).toHaveBeenCalled();
      expect(mockFs.readdir).toHaveBeenCalledWith(path.join(actualCwd, 'config', 'project-images'));
      expect(mockFs.copyFile).toHaveBeenCalledTimes(3);

      imageFiles.forEach((file) => {
        const sourcePath = path.join(actualCwd, 'config', 'project-images', file);
        const destPath = path.join(actualCwd, 'public', 'config', 'project-images', file);
        expect(mockFs.copyFile).toHaveBeenCalledWith(sourcePath, destPath);
      });
    });

    it('should handle empty directory', async () => {
      mockFs.mkdir.mockResolvedValue(undefined as any);
      mockFs.readdir.mockResolvedValue([] as any);

      await copyAllProjectImages();

      expect(mockFs.readdir).toHaveBeenCalledWith(path.join(actualCwd, 'config', 'project-images'));
      expect(mockFs.copyFile).not.toHaveBeenCalled();
    });

    it('should filter out non-image files', async () => {
      const files = ['readme.txt', 'config.json', 'script.js'];
      mockFs.mkdir.mockResolvedValue(undefined as any);
      mockFs.readdir.mockResolvedValue(files as any);

      await copyAllProjectImages();

      expect(mockFs.copyFile).not.toHaveBeenCalled();
    });

    it('should handle copy errors gracefully', async () => {
      const files = ['image1.png', 'image2.jpg'];
      mockFs.mkdir.mockResolvedValue(undefined as any);
      mockFs.readdir.mockResolvedValue(files as any);
      mockFs.copyFile
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Copy failed'));

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await copyAllProjectImages();

      // Both files should be attempted, even if one fails
      expect(mockFs.copyFile).toHaveBeenCalledTimes(2);
      // Should log warning for the failed copy
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to copy'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle directory read errors gracefully', async () => {
      mockFs.readdir.mockRejectedValue(new Error('Permission denied'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await copyAllProjectImages();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to copy project images'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});

