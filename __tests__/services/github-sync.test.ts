import { GitHubSyncService } from "@/services/github-sync";
import { GitHubClient } from "@/lib/github";
import { parseReadme } from "@/lib/parsers/markdown";
import {
  readPortfolioConfig,
  readProjectsConfig,
  writeProjectsConfig,
} from "@/lib/config";
import { Project } from "@/types/project";

// Mock dependencies
jest.mock("@/lib/github");
jest.mock("@/lib/parsers/markdown");
jest.mock("@/lib/config");

describe("GitHubSyncService", () => {
  let syncService: GitHubSyncService;
  let mockClient: jest.Mocked<GitHubClient>;
  let mockReadPortfolioConfig: jest.MockedFunction<typeof readPortfolioConfig>;
  let mockReadProjectsConfig: jest.MockedFunction<typeof readProjectsConfig>;
  let mockWriteProjectsConfig: jest.MockedFunction<typeof writeProjectsConfig>;
  let mockParseReadme: jest.MockedFunction<typeof parseReadme>;

  const mockPortfolio = {
    githubUsername: "testuser",
  };

  const mockRepo = {
    id: 123456789,
    name: "test-repo",
    full_name: "testuser/test-repo",
    description: "Test repository description",
    html_url: "https://github.com/testuser/test-repo",
    language: "TypeScript",
    stargazers_count: 42,
    topics: ["react", "typescript"],
    default_branch: "main",
    updated_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-01T10:00:00Z",
  };

  const mockReadme = `# Test Repo

## Abstract
This is a test repository with an abstract section.

## Key Features
- Feature 1
- Feature 2
`;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    // Setup mocks
    mockClient = {
      getUserRepos: jest.fn(),
      getRepoDefaultBranch: jest.fn(),
      getRepoReadme: jest.fn(),
    } as any;

    (GitHubClient as jest.MockedClass<typeof GitHubClient>).mockImplementation(
      () => mockClient
    );

    mockReadPortfolioConfig = readPortfolioConfig as jest.MockedFunction<
      typeof readPortfolioConfig
    >;
    mockReadProjectsConfig = readProjectsConfig as jest.MockedFunction<
      typeof readProjectsConfig
    >;
    mockWriteProjectsConfig = writeProjectsConfig as jest.MockedFunction<
      typeof writeProjectsConfig
    >;
    mockParseReadme = parseReadme as jest.MockedFunction<typeof parseReadme>;

    syncService = new GitHubSyncService("test-token");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("sync", () => {
    it("should add new project when it does not exist", async () => {
      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "This is a test repository with an abstract section.",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://example.com/image.png",
        technologies: ["React", "TypeScript"],
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      expect(writtenProjects).toHaveLength(1);
      expect(writtenProjects[0]).toMatchObject({
        id: "123456789",
        name: "test-repo",
        description: "Test repository description",
        abstract: "This is a test repository with an abstract section.",
        category: "personal",
        stars: 42,
        language: "TypeScript",
        topics: ["react", "typescript"],
      });
    });

    it("should always update existing project with latest GitHub data", async () => {
      const existingProject: Project = {
        id: "123456789",
        name: "test-repo",
        description: "Old description",
        abstract: "Old abstract",
        category: "personal",
        image: "https://old-image.com/image.png",
        technologies: ["Old Tech"],
        githubUrl: "https://github.com/testuser/test-repo",
        language: "JavaScript",
        stars: 10,
        topics: ["old-topic"],
        updatedAt: "2024-01-10T10:00:00Z",
        createdAt: "2024-01-01T10:00:00Z",
        liveUrl: "https://example.com", // Manual field that should be preserved
      };

      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([existingProject]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "New abstract from README",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://new-image.com/image.png",
        technologies: ["React", "TypeScript"],
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      expect(writtenProjects).toHaveLength(1);

      // Verify all GitHub fields are updated
      expect(writtenProjects[0]).toMatchObject({
        id: "123456789",
        name: "test-repo",
        description: "Test repository description", // Updated from GitHub
        abstract: "New abstract from README", // Updated from README
        stars: 42, // Updated from GitHub
        language: "TypeScript", // Updated from GitHub
        topics: ["react", "typescript"], // Updated from GitHub
        updatedAt: "2024-01-15T10:00:00Z", // Updated from GitHub
        createdAt: "2024-01-01T10:00:00Z", // Updated from GitHub
        image: "https://new-image.com/image.png", // Updated from README
        technologies: ["React", "TypeScript"], // Updated from README
      });

      // Verify manual field is preserved
      expect(writtenProjects[0].liveUrl).toBe("https://example.com");
    });

    it("should update existing project even when abstract, image, and description haven't changed", async () => {
      const existingProject: Project = {
        id: "123456789",
        name: "test-repo",
        description: "Test repository description", // Same as GitHub
        abstract: "This is a test repository with an abstract section.", // Same as README
        category: "personal",
        image: "https://example.com/image.png", // Same as README
        technologies: ["React", "TypeScript"],
        githubUrl: "https://github.com/testuser/test-repo",
        language: "JavaScript",
        stars: 10, // Different from GitHub (42)
        topics: ["old-topic"], // Different from GitHub
        updatedAt: "2024-01-10T10:00:00Z", // Different from GitHub
        createdAt: "2024-01-01T10:00:00Z",
      };

      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([existingProject]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "This is a test repository with an abstract section.",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://example.com/image.png",
        technologies: ["React", "TypeScript"],
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];

      // Verify that stars, topics, and updatedAt are updated even though abstract/image/description are the same
      expect(writtenProjects[0].stars).toBe(42); // Updated from 10
      expect(writtenProjects[0].topics).toEqual(["react", "typescript"]); // Updated
      expect(writtenProjects[0].updatedAt).toBe("2024-01-15T10:00:00Z"); // Updated
    });

    it("should preserve professional projects", async () => {
      const professionalProject: Project = {
        id: "professional-1",
        name: "Professional Project",
        description: "Professional project description",
        abstract: "Professional abstract",
        category: "professional",
        technologies: ["React"],
        githubUrl: "https://github.com/testuser/professional",
        updatedAt: "2024-01-01T10:00:00Z",
        createdAt: "2024-01-01T10:00:00Z",
      };

      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([professionalProject]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "This is a test repository with an abstract section.",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://example.com/image.png",
        technologies: ["React", "TypeScript"],
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];

      // Should have both professional and personal projects
      expect(writtenProjects).toHaveLength(2);
      const professional = writtenProjects.find(
        (p) => p.category === "professional"
      );
      const personal = writtenProjects.find((p) => p.category === "personal");

      expect(professional).toEqual(professionalProject);
      expect(personal).toBeDefined();
      expect(personal?.category).toBe("personal");
    });

    it("should skip repos without README", async () => {
      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(null);

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      expect(writtenProjects).toHaveLength(0);
    });

    it("should skip repos without Abstract/Overview/Description/Project Description section", async () => {
      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(
        "# Test Repo\nNo abstract, overview, description, or project description here"
      );
      mockParseReadme.mockReturnValue({
        abstract: "", // Empty abstract
        overview: "", // Empty overview
        description: "", // Empty description
        projectDescription: "", // Empty project description
        imageUrl: undefined,
        technologies: undefined,
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      expect(writtenProjects).toHaveLength(0);
    });

    it("should handle multiple repos", async () => {
      const repo1 = { ...mockRepo, id: 111, name: "repo1" };
      const repo2 = { ...mockRepo, id: 222, name: "repo2" };
      const repo3 = { ...mockRepo, id: 333, name: "repo3" };

      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([]);
      mockClient.getUserRepos.mockResolvedValue([
        repo1 as any,
        repo2 as any,
        repo3 as any,
      ]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "This is a test repository with an abstract section.",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://example.com/image.png",
        technologies: ["React", "TypeScript"],
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      expect(writtenProjects).toHaveLength(3);
      expect(writtenProjects.map((p) => p.name)).toEqual([
        "repo1",
        "repo2",
        "repo3",
      ]);
    });

    it("should continue processing other repos if one fails", async () => {
      const repo1 = { ...mockRepo, id: 111, name: "repo1" };
      const repo2 = { ...mockRepo, id: 222, name: "repo2" };

      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([]);
      mockClient.getUserRepos.mockResolvedValue([repo1 as any, repo2 as any]);
      mockClient.getRepoDefaultBranch
        .mockResolvedValueOnce("main")
        .mockRejectedValueOnce(new Error("Failed to get branch"));
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "This is a test repository with an abstract section.",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://example.com/image.png",
        technologies: ["React", "TypeScript"],
      });

      await syncService.sync();

      // Should still process repo1 even though repo2 failed
      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      expect(writtenProjects).toHaveLength(1);
      expect(writtenProjects[0].name).toBe("repo1");
    });

    it("should use repo topics when README has no technologies", async () => {
      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "This is a test repository with an abstract section.",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://example.com/image.png",
        technologies: undefined, // No technologies in README
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      expect(writtenProjects[0].technologies).toEqual(["react", "typescript"]);
    });

    it("should prioritize README technologies over repo topics", async () => {
      mockReadPortfolioConfig.mockResolvedValue(mockPortfolio as any);
      mockReadProjectsConfig.mockResolvedValue([]);
      mockClient.getUserRepos.mockResolvedValue([mockRepo as any]);
      mockClient.getRepoDefaultBranch.mockResolvedValue("main");
      mockClient.getRepoReadme.mockResolvedValue(mockReadme);
      mockParseReadme.mockReturnValue({
        abstract: "This is a test repository with an abstract section.",
        overview: "",
        description: "",
        projectDescription: "",
        imageUrl: "https://example.com/image.png",
        technologies: ["React", "TypeScript", "Next.js"], // README has technologies
      });

      await syncService.sync();

      expect(mockWriteProjectsConfig).toHaveBeenCalledTimes(1);
      const writtenProjects = mockWriteProjectsConfig.mock.calls[0][0];
      // Should use README technologies, not repo topics
      expect(writtenProjects[0].technologies).toEqual([
        "React",
        "TypeScript",
        "Next.js",
      ]);
    });
  });
});
