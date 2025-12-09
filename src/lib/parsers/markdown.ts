export interface ParsedReadme {
  abstract: string;
  imageUrl?: string;
}

export function extractAbstract(markdown: string): string {
  // Look for ## Abstract or ### Abstract heading
  const abstractRegex = /^#{2,3}\s+Abstract\s*\n([\s\S]*?)(?=^#{1,3}\s|\n*$)/m;
  const match = markdown.match(abstractRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // No Abstract section found - return empty string (project will be skipped)
  return '';
}

export function extractFirstImage(markdown: string): string | null {
  // Look for markdown image syntax: ![alt text](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const match = markdown.match(imageRegex);
  
  if (match && match[2]) {
    return match[2].trim();
  }
  
  return null;
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
  
  let imageUrl: string | undefined;
  if (imagePath) {
    imageUrl = resolveImageUrl(imagePath, username, repo, branch);
  }
  
  return {
    abstract,
    imageUrl,
  };
}

