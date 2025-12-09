import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_DIR = path.join(process.cwd(), 'config');

const defaultPortfolio = {
  name: "Your Name",
  title: "Your Title",
  bio: "Your bio goes here",
  email: "your.email@example.com",
  githubUsername: "your-username",
  capabilities: ["Capability 1", "Capability 2"],
  skills: ["Skill 1", "Skill 2", "Skill 3"],
  experience: [],
  socialLinks: {
    linkedin: "",
    twitter: "",
    website: ""
  }
};

const defaultProjects: any[] = [];

async function ensureConfigDir(): Promise<void> {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create config directory:', error);
    throw error;
  }
}

async function initConfig(): Promise<void> {
  try {
    await ensureConfigDir();

    const portfolioPath = path.join(CONFIG_DIR, 'portfolio.json');
    const projectsPath = path.join(CONFIG_DIR, 'projects.json');

    // Create portfolio.json if it doesn't exist
    try {
      await fs.access(portfolioPath);
      console.log('portfolio.json already exists, skipping...');
    } catch {
      await fs.writeFile(portfolioPath, JSON.stringify(defaultPortfolio, null, 2), 'utf-8');
      console.log('Created portfolio.json');
    }

    // Create projects.json if it doesn't exist
    try {
      await fs.access(projectsPath);
      console.log('projects.json already exists, skipping...');
    } catch {
      await fs.writeFile(projectsPath, JSON.stringify(defaultProjects, null, 2), 'utf-8');
      console.log('Created projects.json');
    }

    console.log('Configuration files initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize config files:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initConfig().catch(console.error);
}

export { initConfig };

