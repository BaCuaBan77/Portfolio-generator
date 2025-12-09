import { promises as fs } from 'fs';
import path from 'path';
import { Portfolio } from '@/types/portfolio';
import { Project } from '@/types/project';
import { getProfilePictureUrl } from '@/lib/utils/profile-picture';

const CONFIG_DIR = path.join(process.cwd(), 'config');

export async function readPortfolioConfig(): Promise<Portfolio> {
  const filePath = path.join(CONFIG_DIR, 'portfolio.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const portfolio = JSON.parse(fileContents);
    
    // Add profile picture URL to portfolio object
    const profilePictureUrl = await getProfilePictureUrl(portfolio.githubUsername);
    portfolio.profilePictureUrl = profilePictureUrl;
    
    return portfolio;
  } catch (error) {
    throw new Error(`Failed to read portfolio.json: ${error}`);
  }
}

export async function readProjectsConfig(): Promise<Project[]> {
  const filePath = path.join(CONFIG_DIR, 'projects.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {
    // Return empty array if file doesn't exist
    return [];
  }
}

export async function writeProjectsConfig(projects: Project[]): Promise<void> {
  const filePath = path.join(CONFIG_DIR, 'projects.json');
  try {
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write projects.json: ${error}`);
  }
}

export async function readCustomCSS(): Promise<string | null> {
  const filePath = path.join(CONFIG_DIR, 'custom.css');
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return fileContents;
  } catch (error) {
    // Return null if file doesn't exist
    return null;
  }
}

