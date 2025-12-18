import {
  sortPersonalProjects,
  sortProfessionalProjects,
} from "@/lib/utils/project-sorting";
import { Project } from "@/types/project";

describe("Project Sorting Utilities", () => {
  const createProject = (
    id: string,
    category: "professional" | "personal",
    stars?: number,
    updatedAt?: string,
    createdAt?: string
  ): Project => ({
    id,
    name: `Project ${id}`,
    description: `Description for ${id}`,
    abstract: `Abstract for ${id}`,
    category,
    technologies: [],
    githubUrl: `https://github.com/user/${id}`,
    updatedAt: updatedAt || "2024-01-01T00:00:00Z",
    createdAt: createdAt || "2024-01-01T00:00:00Z",
    stars,
  });

  describe("sortPersonalProjects", () => {
    it("should sort projects by stars in descending order", () => {
      const projects: Project[] = [
        createProject("1", "personal", 10, "2024-01-01T00:00:00Z"),
        createProject("2", "personal", 50, "2024-01-01T00:00:00Z"),
        createProject("3", "personal", 5, "2024-01-01T00:00:00Z"),
        createProject("4", "personal", 100, "2024-01-01T00:00:00Z"),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("4"); // 100 stars
      expect(sorted[1].id).toBe("2"); // 50 stars
      expect(sorted[2].id).toBe("1"); // 10 stars
      expect(sorted[3].id).toBe("3"); // 5 stars
    });

    it("should sort by updated time when stars are equal", () => {
      const projects: Project[] = [
        createProject(
          "1",
          "personal",
          10,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        createProject(
          "2",
          "personal",
          10,
          "2024-03-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        createProject(
          "3",
          "personal",
          10,
          "2024-02-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("2"); // Most recently updated
      expect(sorted[1].id).toBe("3");
      expect(sorted[2].id).toBe("1"); // Least recently updated
    });

    it("should sort by created time when stars and updated time are equal", () => {
      const projects: Project[] = [
        createProject(
          "1",
          "personal",
          10,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        createProject(
          "2",
          "personal",
          10,
          "2024-01-01T00:00:00Z",
          "2024-03-01T00:00:00Z"
        ),
        createProject(
          "3",
          "personal",
          10,
          "2024-01-01T00:00:00Z",
          "2024-02-01T00:00:00Z"
        ),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("2"); // Most recently created
      expect(sorted[1].id).toBe("3");
      expect(sorted[2].id).toBe("1"); // Least recently created
    });

    it("should handle projects with undefined stars (treat as 0)", () => {
      const projects: Project[] = [
        createProject("1", "personal", 10, "2024-01-01T00:00:00Z"),
        createProject("2", "personal", undefined, "2024-01-01T00:00:00Z"),
        createProject("3", "personal", 5, "2024-01-01T00:00:00Z"),
        createProject("4", "personal", undefined, "2024-01-01T00:00:00Z"),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("1"); // 10 stars
      expect(sorted[1].id).toBe("3"); // 5 stars
      // Projects with undefined stars (treated as 0) should come last
      expect(["2", "4"]).toContain(sorted[2].id);
      expect(["2", "4"]).toContain(sorted[3].id);
    });

    it("should handle projects with null stars (treat as 0)", () => {
      const projects: Project[] = [
        createProject("1", "personal", 10, "2024-01-01T00:00:00Z"),
        createProject("2", "personal", null as any, "2024-01-01T00:00:00Z"),
        createProject("3", "personal", 5, "2024-01-01T00:00:00Z"),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("1"); // 10 stars
      expect(sorted[1].id).toBe("3"); // 5 stars
      expect(sorted[2].id).toBe("2"); // null stars (treated as 0)
    });

    it("should handle complex sorting with all criteria", () => {
      const projects: Project[] = [
        // High stars, recent update
        createProject(
          "1",
          "personal",
          100,
          "2024-03-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        // High stars, older update
        createProject(
          "2",
          "personal",
          100,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        // Medium stars, recent update
        createProject(
          "3",
          "personal",
          50,
          "2024-03-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        // Same stars and update, different created
        createProject(
          "4",
          "personal",
          50,
          "2024-02-01T00:00:00Z",
          "2024-03-01T00:00:00Z"
        ),
        createProject(
          "5",
          "personal",
          50,
          "2024-02-01T00:00:00Z",
          "2024-02-01T00:00:00Z"
        ),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("1"); // 100 stars, recent update
      expect(sorted[1].id).toBe("2"); // 100 stars, older update
      expect(sorted[2].id).toBe("3"); // 50 stars, recent update
      expect(sorted[3].id).toBe("4"); // 50 stars, same update, newer created
      expect(sorted[4].id).toBe("5"); // 50 stars, same update, older created
    });

    it("should return empty array for empty input", () => {
      const sorted = sortPersonalProjects([]);
      expect(sorted).toEqual([]);
    });

    it("should return single project unchanged", () => {
      const projects: Project[] = [
        createProject("1", "personal", 10, "2024-01-01T00:00:00Z"),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe("1");
    });

    it("should not mutate the original array", () => {
      const projects: Project[] = [
        createProject("1", "personal", 10, "2024-01-01T00:00:00Z"),
        createProject("2", "personal", 50, "2024-01-01T00:00:00Z"),
      ];

      const originalOrder = projects.map((p) => p.id);
      const sorted = sortPersonalProjects(projects);

      // Original array should be unchanged
      expect(projects.map((p) => p.id)).toEqual(originalOrder);
      // Sorted array should be different
      expect(sorted.map((p) => p.id)).not.toEqual(originalOrder);
      expect(sorted[0].id).toBe("2");
    });

    it("should handle projects with same stars, updated, and created time", () => {
      const projects: Project[] = [
        createProject(
          "1",
          "personal",
          10,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        createProject(
          "2",
          "personal",
          10,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        createProject(
          "3",
          "personal",
          10,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
      ];

      const sorted = sortPersonalProjects(projects);

      // All projects are equal, so order may vary but all should be present
      expect(sorted).toHaveLength(3);
      expect(sorted.map((p) => p.id).sort()).toEqual(["1", "2", "3"]);
    });
  });

  describe("sortProfessionalProjects", () => {
    it("should sort projects by updated time in descending order", () => {
      const projects: Project[] = [
        createProject("1", "professional", undefined, "2024-01-01T00:00:00Z"),
        createProject("2", "professional", undefined, "2024-03-01T00:00:00Z"),
        createProject("3", "professional", undefined, "2024-02-01T00:00:00Z"),
        createProject("4", "professional", undefined, "2024-04-01T00:00:00Z"),
      ];

      const sorted = sortProfessionalProjects(projects);

      expect(sorted[0].id).toBe("4"); // Most recently updated
      expect(sorted[1].id).toBe("2");
      expect(sorted[2].id).toBe("3");
      expect(sorted[3].id).toBe("1"); // Least recently updated
    });

    it("should handle projects with same updated time", () => {
      const projects: Project[] = [
        createProject(
          "1",
          "professional",
          undefined,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        createProject(
          "2",
          "professional",
          undefined,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
        createProject(
          "3",
          "professional",
          undefined,
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z"
        ),
      ];

      const sorted = sortProfessionalProjects(projects);

      // All projects have same updated time, so order may vary but all should be present
      expect(sorted).toHaveLength(3);
      expect(sorted.map((p) => p.id).sort()).toEqual(["1", "2", "3"]);
    });

    it("should return empty array for empty input", () => {
      const sorted = sortProfessionalProjects([]);
      expect(sorted).toEqual([]);
    });

    it("should return single project unchanged", () => {
      const projects: Project[] = [
        createProject("1", "professional", undefined, "2024-01-01T00:00:00Z"),
      ];

      const sorted = sortProfessionalProjects(projects);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe("1");
    });

    it("should not mutate the original array", () => {
      const projects: Project[] = [
        createProject("1", "professional", undefined, "2024-01-01T00:00:00Z"),
        createProject("2", "professional", undefined, "2024-03-01T00:00:00Z"),
      ];

      const originalOrder = projects.map((p) => p.id);
      const sorted = sortProfessionalProjects(projects);

      // Original array should be unchanged
      expect(projects.map((p) => p.id)).toEqual(originalOrder);
      // Sorted array should be different
      expect(sorted.map((p) => p.id)).not.toEqual(originalOrder);
      expect(sorted[0].id).toBe("2");
    });

    it("should handle projects with various updated times", () => {
      const projects: Project[] = [
        createProject(
          "1",
          "professional",
          undefined,
          "2023-12-01T00:00:00Z",
          "2023-01-01T00:00:00Z"
        ),
        createProject(
          "2",
          "professional",
          undefined,
          "2024-06-15T12:30:00Z",
          "2023-06-01T00:00:00Z"
        ),
        createProject(
          "3",
          "professional",
          undefined,
          "2024-01-15T08:00:00Z",
          "2023-03-01T00:00:00Z"
        ),
        createProject(
          "4",
          "professional",
          undefined,
          "2024-12-31T23:59:59Z",
          "2023-12-01T00:00:00Z"
        ),
      ];

      const sorted = sortProfessionalProjects(projects);

      expect(sorted[0].id).toBe("4"); // Most recent: 2024-12-31
      expect(sorted[1].id).toBe("2"); // 2024-06-15
      expect(sorted[2].id).toBe("3"); // 2024-01-15
      expect(sorted[3].id).toBe("1"); // Oldest: 2023-12-01
    });

    it("should ignore stars field for professional projects", () => {
      const projects: Project[] = [
        createProject("1", "professional", 100, "2024-01-01T00:00:00Z"),
        createProject("2", "professional", 5, "2024-03-01T00:00:00Z"),
        createProject("3", "professional", 50, "2024-02-01T00:00:00Z"),
      ];

      const sorted = sortProfessionalProjects(projects);

      // Should sort by updated time, not stars
      expect(sorted[0].id).toBe("2"); // Most recently updated (regardless of stars)
      expect(sorted[1].id).toBe("3");
      expect(sorted[2].id).toBe("1"); // Least recently updated
    });
  });

  describe("Edge Cases", () => {
    it("should handle projects with invalid date strings gracefully", () => {
      const projects: Project[] = [
        {
          ...createProject("1", "personal", 10, "2024-01-01T00:00:00Z"),
          updatedAt: "invalid-date",
        },
        {
          ...createProject("2", "personal", 10, "2024-01-01T00:00:00Z"),
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      // Should not throw, but may produce unexpected results with invalid dates
      expect(() => sortPersonalProjects(projects)).not.toThrow();
    });

    it("should handle very large star counts", () => {
      const projects: Project[] = [
        createProject("1", "personal", 1000000, "2024-01-01T00:00:00Z"),
        createProject("2", "personal", 500000, "2024-01-01T00:00:00Z"),
        createProject("3", "personal", 999999, "2024-01-01T00:00:00Z"),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("1"); // 1,000,000 stars
      expect(sorted[1].id).toBe("3"); // 999,999 stars
      expect(sorted[2].id).toBe("2"); // 500,000 stars
    });

    it("should handle negative star counts (edge case)", () => {
      const projects: Project[] = [
        createProject("1", "personal", -10, "2024-01-01T00:00:00Z"),
        createProject("2", "personal", 0, "2024-01-01T00:00:00Z"),
        createProject("3", "personal", 10, "2024-01-01T00:00:00Z"),
      ];

      const sorted = sortPersonalProjects(projects);

      expect(sorted[0].id).toBe("3"); // 10 stars (positive)
      expect(sorted[1].id).toBe("2"); // 0 stars
      expect(sorted[2].id).toBe("1"); // -10 stars (negative, comes last)
    });
  });
});

