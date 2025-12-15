import { readProjectsConfig } from '@/lib/config';
import { processProjectImagePath } from '@/lib/utils/project-images';
import * as fs from 'fs';
import path from 'path';

// Mock fs.promises module
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    promises: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
    },
  };
});

// Mock project-images utility
jest.mock('@/lib/utils/project-images', () => ({
  processProjectImagePath: jest.fn(),
}));

// Mock profile-picture utility
jest.mock('@/lib/utils/profile-picture', () => ({
  getProfilePictureUrl: jest.fn().mockResolvedValue(null),
}));

describe('config/index', () => {
  const mockFs = (fs as any).promises as jest.Mocked<typeof fs.promises>;
  const mockProcessProjectImagePath = processProjectImagePath as jest.MockedFunction<
    typeof processProjectImagePath
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readProjectsConfig', () => {
    it('should process project image paths when reading projects', async () => {
      const projectsData = [
        {
          id: 'project1',
          name: 'Project 1',
          image: 'screenshot.png',
        },
        {
          id: 'project2',
          name: 'Project 2',
          image: 'https://example.com/image.png',
        },
        {
          id: 'project3',
          name: 'Project 3',
          image: './project-images/photo.png',
        },
      ];

      mockFs.readFile.mockResolvedValue(JSON.stringify(projectsData));
      mockProcessProjectImagePath
        .mockResolvedValueOnce('/config/project-images/screenshot.png')
        .mockResolvedValueOnce('https://example.com/image.png')
        .mockResolvedValueOnce('/config/project-images/photo.png');

      const result = await readProjectsConfig();

      expect(result).toHaveLength(3);
      expect(mockProcessProjectImagePath).toHaveBeenCalledTimes(3);
      expect(mockProcessProjectImagePath).toHaveBeenCalledWith('screenshot.png');
      expect(mockProcessProjectImagePath).toHaveBeenCalledWith('https://example.com/image.png');
      expect(mockProcessProjectImagePath).toHaveBeenCalledWith('./project-images/photo.png');

      expect(result[0].image).toBe('/config/project-images/screenshot.png');
      expect(result[1].image).toBe('https://example.com/image.png');
      expect(result[2].image).toBe('/config/project-images/photo.png');
    });

    it('should handle projects without images', async () => {
      const projectsData = [
        {
          id: 'project1',
          name: 'Project 1',
        },
        {
          id: 'project2',
          name: 'Project 2',
          image: undefined,
        },
      ];

      mockFs.readFile.mockResolvedValue(JSON.stringify(projectsData));
      mockProcessProjectImagePath.mockResolvedValue(undefined);

      const result = await readProjectsConfig();

      expect(result).toHaveLength(2);
      expect(mockProcessProjectImagePath).toHaveBeenCalledTimes(2);
      expect(result[0].image).toBeUndefined();
      expect(result[1].image).toBeUndefined();
    });

    it('should return empty array if projects.json does not exist', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await readProjectsConfig();

      expect(result).toEqual([]);
      expect(mockProcessProjectImagePath).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON gracefully', async () => {
      mockFs.readFile.mockResolvedValue('invalid json');

      // The function catches all errors and returns empty array
      const result = await readProjectsConfig();
      expect(result).toEqual([]);
    });

    it('should process all project images in parallel', async () => {
      const projectsData = Array.from({ length: 10 }, (_, i) => ({
        id: `project${i}`,
        name: `Project ${i}`,
        image: `image${i}.png`,
      }));

      mockFs.readFile.mockResolvedValue(JSON.stringify(projectsData));
      mockProcessProjectImagePath.mockResolvedValue('/config/project-images/processed.png');

      const result = await readProjectsConfig();

      expect(result).toHaveLength(10);
      expect(mockProcessProjectImagePath).toHaveBeenCalledTimes(10);
      result.forEach((project) => {
        expect(project.image).toBe('/config/project-images/processed.png');
      });
    });

    it('should preserve all other project properties', async () => {
      const projectsData = [
        {
          id: 'project1',
          name: 'Project 1',
          description: 'Description',
          abstract: 'Abstract',
          category: 'professional',
          technologies: ['React', 'TypeScript'],
          image: 'screenshot.png',
          githubUrl: 'https://github.com/user/repo',
          liveUrl: 'https://example.com',
          featured: true,
        },
      ];

      mockFs.readFile.mockResolvedValue(JSON.stringify(projectsData));
      mockProcessProjectImagePath.mockResolvedValue('/config/project-images/screenshot.png');

      const result = await readProjectsConfig();

      expect(result[0]).toMatchObject({
        id: 'project1',
        name: 'Project 1',
        description: 'Description',
        abstract: 'Abstract',
        category: 'professional',
        technologies: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/user/repo',
        liveUrl: 'https://example.com',
        featured: true,
        image: '/config/project-images/screenshot.png',
      });
    });
  });
});

