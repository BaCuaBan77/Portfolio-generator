export interface ParsedReadme {
  abstract: string;
  imageUrl?: string;
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

