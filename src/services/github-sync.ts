import { GitHubClient } from "@/lib/github";
import { parseReadme } from "@/lib/parsers/markdown";
import {
  readPortfolioConfig,
  readProjectsConfig,
  writeProjectsConfig,
} from "@/lib/config";
import { Project } from "@/types/project";

export class GitHubSyncService {
  private client: GitHubClient;

  constructor(token?: string) {
    this.client = new GitHubClient(token);
  }

  async sync(): Promise<void> {
    console.log("[GitHub Sync] Starting sync...");

    try {
      const portfolio = await readPortfolioConfig();
      const existingProjects = await readProjectsConfig();

      // Separate professional and personal projects
      const professionalProjects = existingProjects.filter(
        (p) => p.category === "professional"
      );
      const existingPersonalProjects = existingProjects.filter(
        (p) => p.category === "personal"
      );

      // Fetch all repos from GitHub
      console.log(
        `[GitHub Sync] Fetching repos for user: ${portfolio.githubUsername}`
      );
      const allRepos = await this.client.getUserRepos(portfolio.githubUsername);
      console.log(`[GitHub Sync] Found ${allRepos.length} repositories`);
      
      // Filter repos to only include those owned by the config username
      // (when token is used, it may return repos from other users/orgs)
      const ownerCounts = new Map<string, number>();
      allRepos.forEach((repo) => {
        const [owner] = repo.full_name.split('/');
        ownerCounts.set(owner, (ownerCounts.get(owner) || 0) + 1);
      });
      
      const repos = allRepos.filter((repo) => {
        const [owner] = repo.full_name.split('/');
        return owner.toLowerCase() === portfolio.githubUsername.toLowerCase();
      });
      
      if (repos.length < allRepos.length) {
        console.log(
          `[GitHub Sync] Filtered to ${repos.length} repos owned by ${portfolio.githubUsername} (excluded ${allRepos.length - repos.length} repos from other owners)`
        );
        console.log(`[GitHub Sync] Repo owners found: ${Array.from(ownerCounts.entries()).map(([owner, count]) => `${owner} (${count})`).join(', ')}`);
        if (repos.length === 0 && ownerCounts.size > 0) {
          const mostCommonOwner = Array.from(ownerCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];
          console.log(`[GitHub Sync] ⚠️  Warning: No repos found for "${portfolio.githubUsername}". Most common owner is "${mostCommonOwner}".`);
          console.log(`[GitHub Sync] 💡 Tip: Update "githubUsername" in config/portfolio.json to "${mostCommonOwner}" or use a token that belongs to "${portfolio.githubUsername}"`);
        }
      }

      // Process each repo
      const personalProjects: Project[] = [];

      for (const repo of repos) {
        try {
          // Extract owner from full_name (format: "owner/repo") to handle cases where
          // token is used and repos might belong to different user than config
          const [owner] = repo.full_name.split('/');
          const branch = repo.default_branch || 'main';
          let readme: string | null = null;
          
          try {
            readme = await this.client.getRepoReadme(
              owner,
              repo.name,
              branch
            );

            console.log(`[GitHub Sync] README fetched for ${repo.name} (owner: ${owner})`);
          } catch (error: any) {
            const errorMessage = error?.message || String(error);
            console.error(
              `[GitHub Sync] Error fetching README for repo "${repo.name}" (${repo.html_url}): ${errorMessage}`
            );
            // Continue to next repo if README fetch fails
            continue;
          }

          if (!readme) {
            console.log(`[GitHub Sync] Skipping ${repo.name}: No README found`);
            continue;
          }

          // Parse README
          const parsed = parseReadme(
            readme,
            
            owner,
            repo.name,
            branch
          );

          // If no Abstract section found, use repo description or first paragraph as fallback
          let abstract = parsed.abstract?.trim();
          if (!abstract || abstract.length === 0) {
            // Try to use repo description as fallback
            if (repo.description && repo.description.trim().length > 0) {
              abstract = repo.description;
              console.log(
                `[GitHub Sync] ${repo.name}: No Abstract section found, using repo description as fallback`
              );
            } else {
              // Try to extract first meaningful paragraph from README
              const firstParagraph = readme
                .split('\n\n')
                .find(p => p.trim().length > 20 && !p.trim().startsWith('#'));
              if (firstParagraph) {
                abstract = firstParagraph.trim().substring(0, 500); // Limit to 500 chars
                console.log(
                  `[GitHub Sync] ${repo.name}: No Abstract section found, using first paragraph as fallback`
                );
              } else {
                console.log(
                  `[GitHub Sync] Skipping ${repo.name}: No Abstract section, description, or meaningful content found`
                );
                continue;
              }
            }
          }

          // Check if already exists (using GitHub repo ID for stability across renames)
          const existing = existingPersonalProjects.find(
            (p) => p.id === repo.id.toString()
          );

          // Merge technologies from README and repo topics, prioritizing README
          const technologies =
            parsed.technologies && parsed.technologies.length > 0
              ? parsed.technologies
              : repo.topics || [];

          const project: Project = {
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description || "", // GitHub repo description
            abstract: abstract || undefined,
            overview:
              parsed.overview && parsed.overview.trim().length > 0
                ? parsed.overview
                : undefined,
            readmeDescription:
              parsed.description && parsed.description.trim().length > 0
                ? parsed.description
                : undefined,
            projectDescription:
              parsed.projectDescription &&
              parsed.projectDescription.trim().length > 0
                ? parsed.projectDescription
                : undefined,
            contribution:
              parsed.contribution && parsed.contribution.trim().length > 0
                ? parsed.contribution
                : undefined,
            category: "personal",
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
            // Always update with latest GitHub data to keep star counts, descriptions, etc. in sync
            // Preserve any manual fields that don't come from GitHub (like liveUrl)
            const updatedProject: Project = {
              ...project,
              liveUrl: existing.liveUrl, // Preserve manual field
            };
            console.log(`[GitHub Sync] Updating ${repo.name}`);
            personalProjects.push(updatedProject);
          } else {
            console.log(`[GitHub Sync] Adding new project: ${repo.name}`);
            personalProjects.push(project);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`[GitHub Sync] Error processing repo "${repo.name}" (${repo.html_url}): ${errorMessage}`);
          if (error instanceof Error && error.stack) {
            console.error(`[GitHub Sync] Stack trace for ${repo.name}:`, error.stack);
          }
          // Continue with other repos
        }
      }

      // Full sync: merge professional and personal projects
      const allProjects = [...professionalProjects, ...personalProjects];

      // Write updated projects
      await writeProjectsConfig(allProjects);
      console.log(
        `[GitHub Sync] Sync complete. Total projects: ${allProjects.length} (${professionalProjects.length} professional, ${personalProjects.length} personal)`
      );
    } catch (error) {
      console.error("[GitHub Sync] Sync failed:", error);
      throw error;
    }
  }
}
