import { GitHubClient } from '@/lib/github';
import { parseReadme } from '@/lib/parsers/markdown';
import { readPortfolioConfig, readProjectsConfig, writeProjectsConfig } from '@/lib/config';
import { Project } from '@/types/project';

export class GitHubSyncService {
  private client: GitHubClient;

  constructor(token?: string) {
    this.client = new GitHubClient(token);
  }

  async sync(): Promise<void> {
    console.log('[GitHub Sync] Starting sync...');
    
    try {
      const portfolio = await readPortfolioConfig();
      const existingProjects = await readProjectsConfig();
      
      // Separate professional and personal projects
      const professionalProjects = existingProjects.filter(p => p.category === 'professional');
      const existingPersonalProjects = existingProjects.filter(p => p.category === 'personal');
      
      // Fetch all repos from GitHub
      console.log(`[GitHub Sync] Fetching repos for user: ${portfolio.githubUsername}`);
      const repos = await this.client.getUserRepos(portfolio.githubUsername);
      console.log(`[GitHub Sync] Found ${repos.length} repositories`);
      
      // Process each repo
      const personalProjects: Project[] = [];
      
      for (const repo of repos) {
        try {
          // Get README
          const branch = await this.client.getRepoDefaultBranch(portfolio.githubUsername, repo.name);
          const readme = await this.client.getRepoReadme(portfolio.githubUsername, repo.name, branch);
          
          if (!readme) {
            console.log(`[GitHub Sync] Skipping ${repo.name}: No README found`);
            continue;
          }
          
          // Parse README
          const parsed = parseReadme(readme, portfolio.githubUsername, repo.name, branch);
          
          if (!parsed.abstract || parsed.abstract.trim().length === 0) {
            console.log(`[GitHub Sync] Skipping ${repo.name}: No Abstract section found`);
            continue;
          }
          
          // Check if already exists (using GitHub repo ID for stability across renames)
          const existing = existingPersonalProjects.find(p => p.id === repo.id.toString());
          
          // Merge technologies from README and repo topics, prioritizing README
          const technologies = parsed.technologies && parsed.technologies.length > 0
            ? parsed.technologies
            : repo.topics || [];

          const project: Project = {
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description || '',
            abstract: parsed.abstract,
            category: 'personal',
            image: parsed.imageUrl,
            technologies,
            githubUrl: repo.html_url,
            language: repo.language || undefined,
            stars: repo.stargazers_count,
            topics: repo.topics,
            updatedAt: repo.updated_at,
            createdAt: repo.created_at,
          };
          
          // Update existing or add new
          if (existing) {
            // Update if data changed
            if (
              existing.abstract !== project.abstract ||
              existing.image !== project.image ||
              existing.description !== project.description
            ) {
              console.log(`[GitHub Sync] Updating ${repo.name}`);
              personalProjects.push(project);
            } else {
              personalProjects.push(existing);
            }
          } else {
            console.log(`[GitHub Sync] Adding new project: ${repo.name}`);
            personalProjects.push(project);
          }
        } catch (error) {
          console.error(`[GitHub Sync] Error processing ${repo.name}:`, error);
          // Continue with other repos
        }
      }
      
      // Full sync: merge professional and personal projects
      const allProjects = [...professionalProjects, ...personalProjects];
      
      // Write updated projects
      await writeProjectsConfig(allProjects);
      console.log(`[GitHub Sync] Sync complete. Total projects: ${allProjects.length} (${professionalProjects.length} professional, ${personalProjects.length} personal)`);
      
    } catch (error) {
      console.error('[GitHub Sync] Sync failed:', error);
      throw error;
    }
  }
}

