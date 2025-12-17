export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  achievements?: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  description: string;
  url: string;
}

export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Portfolio {
  name: string;
  title: string;
  shortBio?: string;
  motto?: string;
  bio: string;
  email: string;
  githubUsername: string;
  profilePictureUrl: string | null;
  domains: string[];
  skills: SkillGroup[];
  experience?: Experience[];
  socialLinks: SocialLinks;
  certifications?: Certification[];
  education?: Education[];
}

