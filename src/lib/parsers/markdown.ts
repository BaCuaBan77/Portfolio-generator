export interface ParsedReadme {
  abstract: string;
  imageUrl?: string;
  technologies?: string[];
}

export function extractAbstract(markdown: string): string {
  // Look for ## Abstract or ### Abstract heading
  const abstractHeadingRegex = /^#{2,3}\s+Abstract\s*\n/m;
  const headingMatch = markdown.match(abstractHeadingRegex);
  
  if (!headingMatch || !headingMatch.index) {
    return '';
  }
  
  // Find the start of the abstract content (after the heading)
  const abstractStart = headingMatch.index + headingMatch[0].length;
  
  // Find the next heading (## or ###) or end of string
  const remainingText = markdown.substring(abstractStart);
  const nextHeadingMatch = remainingText.match(/^#{1,3}\s/m);
  
  if (nextHeadingMatch && nextHeadingMatch.index !== undefined) {
    // Extract content up to the next heading
    return remainingText.substring(0, nextHeadingMatch.index).trim();
  }
  
  // No next heading found, return all remaining content
  return remainingText.trim();
}

export function extractFirstImage(markdown: string): string | null {
  // First, try to find HTML img tags (often used at the top of READMEs)
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const htmlMatch = markdown.match(htmlImgRegex);
  
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1].trim();
  }
  
  // Remove code blocks to avoid matching example images in documentation
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, '');
  
  // Look for markdown image syntax: ![alt text](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const match = withoutCodeBlocks.match(imageRegex);
  
  if (match && match[2]) {
    return match[2].trim();
  }
  
  return null;
}

export function extractTechnologies(markdown: string): string[] {
  // Look for ## Technologies, ### Technologies, ## Tech Stack, etc.
  const techHeadingRegex = /^#{2,3}\s+(Technologies|Technology|Tech Stack|Built With|Stack)\s*\n/im;
  const headingMatch = markdown.match(techHeadingRegex);
  
  if (!headingMatch || !headingMatch.index) {
    return [];
  }
  
  // Find the start of the technologies content (after the heading)
  const techStart = headingMatch.index + headingMatch[0].length;
  
  // Find the next heading (## or ###) or end of string
  const remainingText = markdown.substring(techStart);
  const nextHeadingMatch = remainingText.match(/^#{1,3}\s/m);
  
  let techContent: string;
  if (nextHeadingMatch && nextHeadingMatch.index !== undefined) {
    techContent = remainingText.substring(0, nextHeadingMatch.index).trim();
  } else {
    techContent = remainingText.trim();
  }
  
  // Extract technologies from various formats:
  // - Bullet lists: - Technology or * Technology
  // - Comma-separated: Tech1, Tech2, Tech3
  // - Badge images: ![badge](url)
  const technologies: string[] = [];
  
  // Extract from bullet points
  const bulletRegex = /^[\s-*]+(.+)$/gm;
  let match;
  while ((match = bulletRegex.exec(techContent)) !== null) {
    const tech = match[1].trim()
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links, keep text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images/badges
      .replace(/`([^`]+)`/g, '$1') // Remove code formatting
      .trim();
    
    if (tech && tech.length > 0 && tech.length < 50) {
      technologies.push(tech);
    }
  }
  
  // If no bullet points found, try comma-separated
  if (technologies.length === 0) {
    const cleaned = techContent
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images/badges
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/`([^`]+)`/g, '$1') // Remove code formatting
      .trim();
    
    const commaSeparated = cleaned.split(/[,\n]/).map(t => t.trim()).filter(t => t.length > 0 && t.length < 50);
    technologies.push(...commaSeparated);
  }
  
  return technologies.slice(0, 20); // Limit to 20 technologies
}

export function resolveImageUrl(
  imagePath: string,
  username: string,
  repo: string,
  branch: string
): string {
  // If already absolute URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove leading ./ or / from relative path
  const cleanPath = imagePath.replace(/^\.?\//, '');
  
  // Construct GitHub raw content URL
  return `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${cleanPath}`;
}

export function parseReadme(
  markdown: string,
  username: string,
  repo: string,
  branch: string
): ParsedReadme {
  const abstract = extractAbstract(markdown);
  const imagePath = extractFirstImage(markdown);
  const technologies = extractTechnologies(markdown);
  
  let imageUrl: string | undefined;
  if (imagePath) {
    imageUrl = resolveImageUrl(imagePath, username, repo, branch);
  }
  
  return {
    abstract,
    imageUrl,
    technologies: technologies.length > 0 ? technologies : undefined,
  };
}

