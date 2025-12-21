import {
  extractAbstract,
  extractOverview,
  extractDescription,
  extractProjectDescription,
  extractFirstImage,
  resolveImageUrl,
  parseReadme,
} from "@/lib/parsers/markdown";
import * as fs from "fs";
import * as path from "path";

describe("Markdown Parsing Functions", () => {
  let readmeContent: string;

  beforeAll(() => {
    // Read the actual README.md file for testing
    const readmePath = path.join(__dirname, "../../resources/README.md");
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, "utf-8");
    } else {
      // Fallback: read from project root
      const rootReadmePath = path.join(__dirname, "../../../README.md");
      readmeContent = fs.existsSync(rootReadmePath)
        ? fs.readFileSync(rootReadmePath, "utf-8")
        : "";
    }
  });

  describe("extractAbstract", () => {
    it("should extract abstract from markdown with ## Abstract heading", () => {
      const markdown = `# Project Name

## Abstract

This is the abstract content that should be extracted.
It can span multiple lines.

**Key Features:**
- Feature 1
- Feature 2

## Features

Some features here.`;

      const result = extractAbstract(markdown);
      expect(result).toContain(
        "This is the abstract content that should be extracted"
      );
      expect(result).toContain("It can span multiple lines");
      expect(result).toContain("**Key Features:**");
      expect(result).toContain("Feature 1");
      expect(result).toContain("Feature 2");
      // "Features" appears in "**Key Features:**" so we check for the section heading instead
      expect(result).not.toContain("## Features");
    });

    it("should extract abstract from markdown with ### Abstract heading", () => {
      const markdown = `# Project

### Abstract

This is the abstract content.

## Next Section`;

      const result = extractAbstract(markdown);
      expect(result).toContain("This is the abstract content");
      expect(result).not.toContain("Next Section");
    });

    it("should return empty string when no Abstract section exists", () => {
      const markdown = `# Project

## Features

Some features here.`;

      const result = extractAbstract(markdown);
      expect(result).toBe("");
    });

    it("should extract abstract from actual README.md file", () => {
      if (!readmeContent) {
        console.warn("README.md not found, skipping test");
        return;
      }

      const result = extractAbstract(readmeContent);
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("portfolio generator");
      // Should include the Key Features section
      expect(result).toContain("Key Features");
      expect(result).toContain("Automatic GitHub Integration");
      expect(result).toContain("Multiple Page Styles");
      expect(result).toContain("Fully Responsive");
    });

    it("should handle abstract with markdown formatting", () => {
      const markdown = `# Project

## Abstract

This is **bold** text and *italic* text.

- List item 1
- List item 2

## Next Section`;

      const result = extractAbstract(markdown);
      expect(result).toContain("**bold**");
      expect(result).toContain("*italic*");
      expect(result).toContain("List item 1");
      expect(result).toContain("List item 2");
    });

    it("should stop at next heading (## or ###)", () => {
      const markdown = `# Project

## Abstract

This is the abstract.

## Features

Features content.

### Installation

Install content.`;

      const result = extractAbstract(markdown);
      expect(result).toContain("This is the abstract");
      expect(result).not.toContain("Features");
      expect(result).not.toContain("Installation");
    });

    it("should handle empty abstract section", () => {
      const markdown = `# Project

## Abstract

## Features`;

      const result = extractAbstract(markdown);
      expect(result).toBe("");
    });

    it("should extract full abstract including Key Features section", () => {
      const markdown = `# Project

## Abstract

This is the main description.

**Key Features:**
- Feature 1
- Feature 2
- Feature 3

More content here.

## Prerequisites`;

      const result = extractAbstract(markdown);
      expect(result).toContain("This is the main description");
      expect(result).toContain("**Key Features:**");
      expect(result).toContain("Feature 1");
      expect(result).toContain("Feature 2");
      expect(result).toContain("Feature 3");
      expect(result).toContain("More content here");
      expect(result).not.toContain("Prerequisites");
    });

    it("should extract content from Overview heading", () => {
      const markdown = `# Project

## Overview

This is the overview content.
It can span multiple lines.

## Features

Some features here.`;

      const result = extractOverview(markdown);
      expect(result).toContain("This is the overview content");
      expect(result).toContain("It can span multiple lines");
      expect(result).not.toContain("## Features");
    });

    it("should extract content from Description heading", () => {
      const markdown = `# Project

## Description

This is the description content.

**Details:**
- Detail 1
- Detail 2

## Installation`;

      const result = extractDescription(markdown);
      expect(result).toContain("This is the description content");
      expect(result).toContain("**Details:**");
      expect(result).toContain("Detail 1");
      expect(result).toContain("Detail 2");
      expect(result).not.toContain("Installation");
    });

    it("should extract content from Project Description heading", () => {
      const markdown = `# Project

## Project Description

This is the project description.
It includes important details about the project.

## Next Section`;

      const result = extractProjectDescription(markdown);
      expect(result).toContain("This is the project description");
      expect(result).toContain(
        "It includes important details about the project"
      );
      expect(result).not.toContain("Next Section");
    });

    it("should prioritize Abstract over other headings when both exist", () => {
      const markdown = `# Project

## Abstract

This is the abstract content.

## Overview

This is overview content that should not be extracted.`;

      const result = extractAbstract(markdown);
      expect(result).toContain("This is the abstract content");
      expect(result).not.toContain("This is overview content");
    });

    it("should be case-insensitive for heading names", () => {
      const markdown = `# Project

## overview

This is the overview content in lowercase.

## Features`;

      const result = extractOverview(markdown);
      expect(result).toContain("This is the overview content in lowercase");
      expect(result).not.toContain("Features");
    });

    it("should support ### heading level for all heading names", () => {
      const markdown = `# Project

### Description

This is the description with ### heading.

## Next Section`;

      const result = extractDescription(markdown);
      expect(result).toContain("This is the description with ### heading");
      expect(result).not.toContain("Next Section");
    });

    it("should extract abstract from heading at end of file without newline", () => {
      const markdown = `# Project

## Features

Some features here.

## Abstract
This is the abstract at the end of the file.`;

      const result = extractAbstract(markdown);
      expect(result).toContain("This is the abstract at the end of the file");
    });

    it("should extract overview from heading at end of file", () => {
      const markdown = `# Project

## Overview
Overview content at end of file`;

      const result = extractOverview(markdown);
      expect(result).toContain("Overview content at end of file");
    });

    it("should extract description from heading at end of file", () => {
      const markdown = `# Project

## Description
Description content at end of file`;

      const result = extractDescription(markdown);
      expect(result).toContain("Description content at end of file");
    });

    it("should extract project description from heading at end of file", () => {
      const markdown = `# Project

## Project Description
Project description content at end of file`;

      const result = extractProjectDescription(markdown);
      expect(result).toContain("Project description content at end of file");
    });
  });

  describe("extractFirstImage", () => {
    it("should extract first image URL from markdown", () => {
      const markdown = `# Project

![Project Image](./screenshot.png)

## Abstract`;

      const result = extractFirstImage(markdown);
      expect(result).toBe("./screenshot.png");
    });

    it("should extract absolute image URL", () => {
      const markdown = `# Project

![Project Image](https://example.com/image.png)`;

      const result = extractFirstImage(markdown);
      expect(result).toBe("https://example.com/image.png");
    });

    it("should extract first image when multiple images exist", () => {
      const markdown = `# Project

![First Image](./image1.png)
![Second Image](./image2.png)`;

      const result = extractFirstImage(markdown);
      expect(result).toBe("./image1.png");
    });

    it("should return null when no image exists", () => {
      const markdown = `# Project

## Abstract

No images here.`;

      const result = extractFirstImage(markdown);
      expect(result).toBeNull();
    });

    it("should extract image from actual README.md file", () => {
      if (!readmeContent) {
        console.warn("README.md not found, skipping test");
        return;
      }

      const result = extractFirstImage(readmeContent);
      // README has HTML img tag at the top
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should extract HTML img tag before markdown images", () => {
      const markdown = `<img src="public/thumbnail.png" alt="Thumbnail" />

![Markdown Image](./screenshot.png)`;

      const result = extractFirstImage(markdown);
      expect(result).toBe("public/thumbnail.png");
    });

    it("should handle image with alt text containing special characters", () => {
      const markdown = `![Image with "quotes" and 'apostrophes'](./image.png)`;

      const result = extractFirstImage(markdown);
      expect(result).toBe("./image.png");
    });

    it("should handle image with spaces in path", () => {
      const markdown = `![Image](./my image.png)`;

      const result = extractFirstImage(markdown);
      expect(result).toBe("./my image.png");
    });

    it("should skip images in code blocks", () => {
      const markdown = `# Project

\`\`\`
![Example Image](./screenshot.png)
\`\`\`

![Real Image](./real.png)`;

      const result = extractFirstImage(markdown);
      expect(result).toBe("./real.png");
    });
  });

  describe("resolveImageUrl", () => {
    it("should return absolute URL as-is", () => {
      const result = resolveImageUrl(
        "https://example.com/image.png",
        "user",
        "repo",
        "main"
      );
      expect(result).toBe("https://example.com/image.png");
    });

    it("should resolve relative path starting with ./", () => {
      const result = resolveImageUrl(
        "./screenshot.png",
        "user",
        "repo",
        "main"
      );
      expect(result).toBe(
        "https://raw.githubusercontent.com/user/repo/main/screenshot.png"
      );
    });

    it("should resolve relative path starting with /", () => {
      const result = resolveImageUrl(
        "/images/screenshot.png",
        "user",
        "repo",
        "main"
      );
      expect(result).toBe(
        "https://raw.githubusercontent.com/user/repo/main/images/screenshot.png"
      );
    });

    it("should resolve relative path without prefix", () => {
      const result = resolveImageUrl("screenshot.png", "user", "repo", "main");
      expect(result).toBe(
        "https://raw.githubusercontent.com/user/repo/main/screenshot.png"
      );
    });

    it("should handle different branch names", () => {
      const result = resolveImageUrl("./image.png", "user", "repo", "develop");
      expect(result).toBe(
        "https://raw.githubusercontent.com/user/repo/develop/image.png"
      );
    });

    it("should handle nested paths", () => {
      const result = resolveImageUrl(
        "./assets/images/screenshot.png",
        "user",
        "repo",
        "main"
      );
      expect(result).toBe(
        "https://raw.githubusercontent.com/user/repo/main/assets/images/screenshot.png"
      );
    });

    it("should handle http:// URLs", () => {
      const result = resolveImageUrl(
        "http://example.com/image.png",
        "user",
        "repo",
        "main"
      );
      expect(result).toBe("http://example.com/image.png");
    });
  });

  describe("parseReadme", () => {
    it("should parse markdown with abstract and relative image", () => {
      const markdown = `# Project

![Screenshot](./screenshot.png)

## Abstract

This is the project abstract.`;

      const result = parseReadme(markdown, "username", "repo", "main");
      expect(result.abstract).toContain("This is the project abstract");
      // Image should be found even if it's before the Abstract section
      expect(result.imageUrl).toBe(
        "https://raw.githubusercontent.com/username/repo/main/screenshot.png"
      );
    });

    it("should parse markdown with abstract and absolute image", () => {
      const markdown = `# Project

![Screenshot](https://example.com/image.png)

## Abstract

This is the project abstract.`;

      const result = parseReadme(markdown, "username", "repo", "main");
      expect(result.abstract).toContain("This is the project abstract");
      expect(result.imageUrl).toBe("https://example.com/image.png");
    });

    it("should parse markdown with abstract but no image", () => {
      const markdown = `# Project

## Abstract

This is the project abstract.`;

      const result = parseReadme(markdown, "username", "repo", "main");
      expect(result.abstract).toContain("This is the project abstract");
      expect(result.imageUrl).toBeUndefined();
    });

    it("should parse markdown with image but no abstract", () => {
      const markdown = `# Project

![Screenshot](./image.png)

## Features

Some features.`;

      const result = parseReadme(markdown, "username", "repo", "main");
      expect(result.abstract).toBe("");
      expect(result.imageUrl).toBe(
        "https://raw.githubusercontent.com/username/repo/main/image.png"
      );
    });

    it("should parse markdown with neither abstract nor image", () => {
      const markdown = `# Project

## Features

Some features.`;

      const result = parseReadme(markdown, "username", "repo", "main");
      expect(result.abstract).toBe("");
      expect(result.imageUrl).toBeUndefined();
    });

    it("should parse actual README.md file", () => {
      if (!readmeContent) {
        console.warn("README.md not found, skipping test");
        return;
      }

      const result = parseReadme(
        readmeContent,
        "testuser",
        "portfolio",
        "main"
      );
      expect(result.abstract).toBeTruthy();
      expect(result.abstract.length).toBeGreaterThan(0);
      expect(result.abstract).toContain("portfolio generator");
      // Should include Key Features
      expect(result.abstract).toContain("Key Features");
      expect(result).toHaveProperty("imageUrl");
    });

    it("should handle complex markdown with multiple sections", () => {
      const markdown = `# Project Name

![Project Screenshot](./project-image.png)

## Abstract

This is a comprehensive project abstract that spans multiple lines.

It includes:
- Feature 1
- Feature 2
- Feature 3

**Bold text** and *italic text* are supported.

## Features

Detailed features here.

## Installation

Install instructions.`;

      const result = parseReadme(markdown, "username", "repo", "main");
      expect(result.abstract).toContain("comprehensive project abstract");
      expect(result.abstract).toContain("Feature 1");
      expect(result.abstract).toContain("**Bold text**");
      expect(result.abstract).not.toContain("## Features");
      expect(result.abstract).not.toContain("## Installation");
      expect(result.imageUrl).toBe(
        "https://raw.githubusercontent.com/username/repo/main/project-image.png"
      );
    });

    it("should handle image before abstract section", () => {
      const markdown = `# Project

![Image](./image.png)

## Abstract

Abstract content.`;

      const result = parseReadme(markdown, "user", "repo", "main");
      expect(result.abstract).toContain("Abstract content");
      expect(result.imageUrl).toBe(
        "https://raw.githubusercontent.com/user/repo/main/image.png"
      );
    });

    it("should handle image after abstract section", () => {
      const markdown = `# Project

## Abstract

Abstract content.

![Image](./image.png)`;

      const result = parseReadme(markdown, "user", "repo", "main");
      expect(result.abstract).toContain("Abstract content");
      expect(result.imageUrl).toBe(
        "https://raw.githubusercontent.com/user/repo/main/image.png"
      );
    });
  });
});
