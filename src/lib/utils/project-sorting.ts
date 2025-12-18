import { Project } from "@/types/project";

/**
 * Sort personal projects by: Stars (desc) -> Updated Time (desc) -> Created Time (desc)
 * @param projects - Array of projects to sort
 * @returns Sorted array of projects
 */
export function sortPersonalProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    // 1. Sort by stars (descending) - higher stars first
    const starsA = a.stars ?? 0;
    const starsB = b.stars ?? 0;
    if (starsA !== starsB) {
      return starsB - starsA;
    }

    // 2. Sort by updated time (descending) - more recent first
    const updatedA = new Date(a.updatedAt).getTime();
    const updatedB = new Date(b.updatedAt).getTime();
    if (updatedA !== updatedB) {
      return updatedB - updatedA;
    }

    // 3. Sort by created time (descending) - more recent first
    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();
    return createdB - createdA;
  });
}

/**
 * Sort professional projects by updated time (descending)
 * @param projects - Array of projects to sort
 * @returns Sorted array of projects
 */
export function sortProfessionalProjects(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
