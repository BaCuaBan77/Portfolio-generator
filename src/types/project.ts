export type ProjectCategory = 'professional' | 'side-project';

export interface Project {
  id: string;
  name: string;
  description: string;
  abstract: string;
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

