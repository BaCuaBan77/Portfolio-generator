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
      const repos = await this.client.getUserRepos(portfolio.githubUsername);
      console.log(`[GitHub Sync] Found ${repos.length} repositories`);

      // Process each repo
      const personalProjects: Project[] = [];

      for (const repo of repos) {
        try {
          // Use full_name (owner/repo) to handle repos from different owners/orgs
          const branch = await this.client.getRepoDefaultBranch(repo.full_name);

          // Skip if repo is not accessible (404)
          if (!branch) {
            console.log(
              `[GitHub Sync] Skipping ${repo.name}: Repository not accessible (404)`
            );
            continue;
          }

          // Get README using full_name
          const readme = await this.client.getRepoReadme(
            repo.full_name,
            undefined,
            branch
          );

          if (!readme) {
            console.log(`[GitHub Sync] Skipping ${repo.name}: No README found`);
            continue;
          }

          // Parse README - extract owner and repo from full_name
          const [owner, repoName] = repo.full_name.split("/");
          const parsed = parseReadme(readme, owner, repoName, branch);

          // Check if at least one of the description fields exists
          const hasContent =
            (parsed.abstract && parsed.abstract.trim().length > 0) ||
            (parsed.description && parsed.description.trim().length > 0) ||
            (parsed.overview && parsed.overview.trim().length > 0) ||
            (parsed.projectDescription &&
              parsed.projectDescription.trim().length > 0);

          if (!hasContent) {
            console.log(
              `[GitHub Sync] Skipping ${repo.name}: No Abstract/Overview/Description/Project Description section found`
            );
            continue;
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

          // Store all parsed content fields
          const project: Project = {
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description || "", // GitHub repo description
            abstract: parsed.abstract || "",
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
          console.error(`[GitHub Sync] Error processing ${repo.name}:`, error);
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
