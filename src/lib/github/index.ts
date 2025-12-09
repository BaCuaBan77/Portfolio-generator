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
  private baseUrl = 'https://api.github.com';
  private token?: string;
  private rateLimitRemaining = 60;
  private rateLimitReset = 0;

  constructor(token?: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(url, { headers });

    // Handle rate limiting
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    if (remaining) this.rateLimitRemaining = parseInt(remaining);
    if (reset) this.rateLimitReset = parseInt(reset);

    if (response.status === 403 && this.rateLimitRemaining === 0) {
      const resetTime = new Date(this.rateLimitReset * 1000);
      throw new Error(`Rate limit exceeded. Resets at ${resetTime.toISOString()}`);
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await this.request<GitHubRepo[]>(`/users/${username}/repos?page=${page}&per_page=100&sort=updated`);
      
      if (data.length === 0) {
        hasMore = false;
      } else {
        repos.push(...data);
        page++;
      }
    }

    return repos;
  }

  async getRepoReadme(username: string, repo: string, branch: string = 'main'): Promise<string | null> {
    try {
      const content = await this.request<GitHubContent>(`/repos/${username}/${repo}/readme`);
      
      if (content.encoding === 'base64') {
        const decoded = Buffer.from(content.content, 'base64').toString('utf-8');
        return decoded;
      }
      
      return content.content;
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getRepoDefaultBranch(username: string, repo: string): Promise<string> {
    const repoData = await this.request<GitHubRepo>(`/repos/${username}/${repo}`);
    return repoData.default_branch || 'main';
  }

  getRateLimitInfo() {
    return {
      remaining: this.rateLimitRemaining,
      reset: new Date(this.rateLimitReset * 1000),
    };
  }
}

