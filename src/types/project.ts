export type ProjectCategory = "professional" | "personal";

export interface Project {
  id: string;
  name: string;
  description: string; // GitHub repo description
  abstract: string;
  overview?: string;
  readmeDescription?: string; // Parsed from README Description section
  projectDescription?: string;
  category: ProjectCategory;
  image?: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  language?: string;
  stars?: number;
  topics?: string[];
  updatedAt: string;
  createdAt: string;
}
