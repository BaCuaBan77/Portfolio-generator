interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  default_branch: string;
  updated_at: string;
  created_at: string;
}

interface GitHubContent {
  content: string;
  encoding: string;
}

export class GitHubClient {
  private baseUrl = "https://api.github.com";
  private token?: string;
  private rateLimitRemaining = 60;
  private rateLimitReset = 0;

  constructor(token?: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (this.token) {
      headers["Authorization"] = `token ${this.token}`;
    }

    const response = await fetch(url, { headers });

    // Handle rate limiting
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    if (remaining) this.rateLimitRemaining = parseInt(remaining);
    if (reset) this.rateLimitReset = parseInt(reset);

    if (response.status === 403 && this.rateLimitRemaining === 0) {
      const resetTime = new Date(this.rateLimitReset * 1000);
      throw new Error(
        `Rate limit exceeded. Resets at ${resetTime.toISOString()}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    let hasMore = true;

    // If token is provided, use /user/repos to get both public and private repos
    // Otherwise, use /users/{username}/repos for public repos only
    while (hasMore) {
      const endpoint = this.token
        ? `/user/repos?page=${page}&per_page=100&sort=updated&visibility=all&affiliation=owner`
        : `/users/${username}/repos?page=${page}&per_page=100&sort=updated`;

      const data = await this.request<GitHubRepo[]>(endpoint);

      if (data.length === 0) {
        hasMore = false;
      } else {
        repos.push(...data);
        page++;
      }
    }

    return repos;
  }

  async getRepoReadme(
    usernameOrFullName: string,
    repo?: string,
    branch: string = "main"
  ): Promise<string | null> {
    try {
      // Support both full_name format (owner/repo) and separate username/repo
      const repoPath = repo
        ? `/repos/${usernameOrFullName}/${repo}/readme`
        : `/repos/${usernameOrFullName}/readme`;
      const content = await this.request<GitHubContent>(repoPath);

      if (content.encoding === "base64") {
        const decoded = Buffer.from(content.content, "base64").toString(
          "utf-8"
        );
        return decoded;
      }

      return content.content;
    } catch (error: any) {
      if (error.message?.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  async getRepoDefaultBranch(
    usernameOrFullName: string,
    repo?: string
  ): Promise<string | null> {
    try {
      // Support both full_name format (owner/repo) and separate username/repo
      const repoPath = repo
        ? `/repos/${usernameOrFullName}/${repo}`
        : `/repos/${usernameOrFullName}`;
      const repoData = await this.request<GitHubRepo>(repoPath);
      return repoData.default_branch || "main";
    } catch (error: any) {
      // If repo doesn't exist (404) or is inaccessible, return null to signal skip
      if (error.message?.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  getRateLimitInfo() {
    return {
      remaining: this.rateLimitRemaining,
      reset: new Date(this.rateLimitReset * 1000),
    };
  }
}
