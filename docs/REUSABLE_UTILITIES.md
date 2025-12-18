# Reusable Utilities

This document provides detailed information about the reusable utility functions available in the Portfolio Generator. These utilities are designed to be shared across themes and components to ensure consistency and reduce code duplication.

## 📋 Table of Contents

- [Project Sorting](#project-sorting)
- [Markdown Renderer](#markdown-renderer)
- [Profile Picture](#profile-picture)
- [Project Images](#project-images)

---

## Project Sorting

**Location:** `@/lib/utils/project-sorting`

Project sorting utilities ensure consistent ordering of projects across all themes. These functions handle the sorting logic for both professional and personal projects according to established rules.

### Available Functions

#### `sortPersonalProjects(projects: Project[]): Project[]`

Sorts personal projects using a multi-level sorting strategy:

1. **Primary Sort:** GitHub stars (descending) - Projects with more stars appear first
2. **Secondary Sort:** Updated time (descending) - More recently updated projects appear first
3. **Tertiary Sort:** Created time (descending) - More recently created projects appear first

**Parameters:**

- `projects` - Array of `Project` objects to sort

**Returns:**

- New sorted array (original array is not modified)

**Behavior:**

- Projects without stars (`stars` is `undefined` or `null`) are treated as having 0 stars
- All sorting is done in descending order (highest/newest first)
- The function creates a copy of the array, so the original is not mutated

**Usage Example:**

```typescript
import { sortPersonalProjects } from "@/lib/utils/project-sorting";
import { Project } from "@/types/project";

// In your theme component
const allProjects: Project[] = await readProjectsConfig();
const personalProjects = sortPersonalProjects(
  allProjects.filter((p) => p.category === "personal")
);

// personalProjects is now sorted: stars → updated → created
```

**Why This Sorting Order?**

- Stars indicate project popularity and quality
- Updated time shows active maintenance
- Created time provides a fallback for projects with equal stars and update times

#### `sortProfessionalProjects(projects: Project[]): Project[]`

Sorts professional projects by updated time (most recent first).

**Parameters:**

- `projects` - Array of `Project` objects to sort

**Returns:**

- New sorted array (original array is not modified)

**Behavior:**

- Sorts by `updatedAt` field in descending order
- Most recently updated projects appear first
- The function creates a copy of the array, so the original is not mutated

**Usage Example:**

```typescript
import { sortProfessionalProjects } from "@/lib/utils/project-sorting";
import { Project } from "@/types/project";

// In your theme component
const allProjects: Project[] = await readProjectsConfig();
const professionalProjects = sortProfessionalProjects(
  allProjects.filter((p) => p.category === "professional")
);

// professionalProjects is now sorted by most recently updated
```

**Why This Sorting Order?**

- Professional projects are typically work-related and don't have GitHub stars
- Updated time reflects recent work and relevance
- Simple, predictable sorting for professional work

### Complete Example

```typescript
import {
  sortPersonalProjects,
  sortProfessionalProjects,
} from "@/lib/utils/project-sorting";
import { Project } from "@/types/project";

export default function YourThemePage({ projects }: { projects: Project[] }) {
  // Sort projects according to established rules
  const professionalProjects = sortProfessionalProjects(
    projects.filter((p) => p.category === "professional")
  );

  const personalProjects = sortPersonalProjects(
    projects.filter((p) => p.category === "personal")
  );

  // Display sorted projects
  return (
    <div>
      <section>
        <h2>Professional Projects</h2>
        {professionalProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>

      <section>
        <h2>Personal Projects</h2>
        {personalProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </div>
  );
}
```

### Best Practices

- ✅ **Always use these utilities** when displaying projects in new themes
- ✅ **Filter by category first**, then sort (as shown in examples)
- ✅ **Don't create custom sorting logic** - use these functions for consistency
- ❌ **Don't modify the original projects array** - these functions handle copying internally

---

## Markdown Renderer

**Location:** `@/lib/utils/markdown-renderer`

A lightweight markdown renderer that converts markdown syntax to HTML. Can be used for any markdown string including portfolio bios, project abstracts, descriptions, or any other text content that needs formatting.

### Available Functions

#### `renderMarkdown(markdown: string): string`

Converts markdown text to HTML with support for common formatting:

**Supported Markdown Features:**

- **Bold text:** `**text**` or `__text__` → `<strong>text</strong>`
- **Italic text:** `*text*` or `_text_` → `<em>text</em>`
- **Unordered lists:** `- item` or `* item` → `<ul><li>item</li></ul>`
- **Line breaks:** Newlines → `<br>` tags

**Parameters:**

- `markdown` - String containing markdown text

**Returns:**

- HTML string with markdown converted to HTML tags

**Security Features:**

- Automatically escapes HTML to prevent XSS attacks
- Escapes `&`, `<`, and `>` characters before processing

**Usage Examples:**

```typescript
import { renderMarkdown } from "@/lib/utils/markdown-renderer";

// For project abstracts
const projectAbstract = `
This is a **bold** statement and this is *italic* text.

Key features:
- Feature one
- Feature two
- Feature three
`;

// For portfolio bio
const portfolioBio = `
I'm a **full-stack developer** with experience in:
- Frontend development
- Backend architecture
- Cloud infrastructure
`;

// For any markdown text
const html = renderMarkdown(projectAbstract);
// or
const bioHtml = renderMarkdown(portfolioBio);
```

**In React Components:**

```typescript
import { renderMarkdown } from "@/lib/utils/markdown-renderer";

// Rendering project abstract
function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="abstract"
      dangerouslySetInnerHTML={{
        __html: renderMarkdown(project.abstract),
      }}
    />
  );
}

// Rendering portfolio bio
function AboutSection({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div
      className="bio"
      dangerouslySetInnerHTML={{
        __html: renderMarkdown(portfolio.bio),
      }}
    />
  );
}
```

**Limitations:**

- Does not support code blocks, headers, links, or images
- Designed for simple formatting in text content
- For full markdown support, consider using a library like `marked` or `remark`

**Best Practices:**

- ✅ Use for any markdown text content (bios, abstracts, descriptions, etc.)
- ✅ Safe to use with user-generated content (XSS protection included)
- ✅ Works well with `dangerouslySetInnerHTML` in React
- ✅ Perfect for portfolio bios, project descriptions, and similar content
- ❌ Don't use for complex markdown documents (use a full markdown library instead)

---

## Profile Picture

**Location:** `@/lib/utils/profile-picture`

Utility for resolving profile picture URLs with automatic fallback to GitHub avatar.

### Available Functions

#### `getProfilePictureUrl(githubUsername: string): Promise<string | null>`

Resolves the profile picture URL with the following priority:

1. **Local Profile Picture:** Checks `config/profile-pic/` directory for image files
2. **GitHub Avatar Fallback:** Uses GitHub avatar if no local picture is found
3. **Null:** Returns `null` if no GitHub username is provided

**Parameters:**

- `githubUsername` - GitHub username for fallback avatar

**Returns:**

- `Promise<string | null>` - URL to profile picture or `null` if unavailable

**Supported Image Formats:**

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

**Behavior:**

- Searches `config/profile-pic/` directory for image files
- Uses the first image found (alphabetically sorted)
- Returns local path in format: `/config/profile-pic/filename.jpg`
- Falls back to GitHub avatar: `https://github.com/{username}.png?size=420`
- Returns `null` if directory doesn't exist and no GitHub username provided

**Usage Example:**

```typescript
import { getProfilePictureUrl } from "@/lib/utils/profile-picture";

// In server component or API route
const portfolio = await readPortfolioConfig();
const profilePictureUrl = await getProfilePictureUrl(portfolio.githubUsername);

// Use the URL in your component
<ProfilePicture profilePictureUrl={profilePictureUrl} name={portfolio.name} />;
```

**File Structure:**

```
config/
└── profile-pic/
    └── profile.jpg  (or any supported image format)
```

**Best Practices:**

- ✅ Place only one image file in `config/profile-pic/`
- ✅ Use square aspect ratio images (e.g., 400x400px or larger)
- ✅ Optimize images before adding (compress to reduce file size)
- ✅ Always provide `githubUsername` for fallback support
- ❌ Don't place multiple images (only the first one will be used)

---

## Project Images

**Location:** `@/lib/utils/project-images`

Utilities for processing and managing project image paths. Handles copying local images to the public directory and resolving various path formats.

### Available Functions

#### `processProjectImagePath(imagePath: string | undefined): Promise<string | undefined>`

Processes project image paths and copies local images to the public directory.

**Parameters:**

- `imagePath` - Image path (can be URL, local path, or filename)

**Returns:**

- `Promise<string | undefined>` - Public URL path, original URL, or `undefined`

**Supported Path Formats:**

1. **External URL:** `https://example.com/image.png` → Returns as-is
2. **Public URL format:** `/config/project-images/screenshot.png` → Extracts filename and copies
3. **Relative path:** `./project-images/image.png` → Extracts filename and copies
4. **Filename only:** `screenshot.png` → Copies from `config/project-images/`

**Behavior:**

- External URLs (starting with `http://` or `https://`) are returned unchanged
- Local images are copied from `config/project-images/` to `public/config/project-images/`
- Only copies if destination doesn't exist or source is newer (optimization)
- Returns public URL format: `/config/project-images/filename.png`
- Returns original path if file not found (to preserve JSON structure)

**Usage Example:**

```typescript
import { processProjectImagePath } from "@/lib/utils/project-images";

// In server component or API route
const projects = await readProjectsConfig();
const processedProjects = await Promise.all(
  projects.map(async (project) => ({
    ...project,
    image: await processProjectImagePath(project.image),
  }))
);

// Now projects have processed image URLs ready for display
```

**File Structure:**

```
config/
└── project-images/
    ├── project1-screenshot.png
    └── project2-dashboard.jpg

public/
└── config/
    └── project-images/  (auto-created, contains copied images)
```

#### `copyAllProjectImages(): Promise<void>`

Copies all images from `config/project-images/` to `public/config/project-images/`. Useful for Docker builds and initialization.

**Returns:**

- `Promise<void>`

**Behavior:**

- Creates directories if they don't exist
- Finds all image files in `config/project-images/`
- Copies each image to public directory
- Logs progress and errors to console

**Supported Image Formats:**

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`

**Usage Example:**

```typescript
import { copyAllProjectImages } from "@/lib/utils/project-images";

// During application startup or initialization
await copyAllProjectImages();
console.log("All project images copied to public directory");
```

**Best Practices:**

- ✅ Use `processProjectImagePath` when processing individual projects
- ✅ Use `copyAllProjectImages` during initialization or build
- ✅ Store images in `config/project-images/` directory
- ✅ Use descriptive filenames (e.g., `project-name-screenshot.png`)
- ✅ Optimize images before adding (compress to reduce file size)
- ✅ Keep images under 2MB for better performance
- ❌ Don't manually copy images to `public/` directory (let the utility handle it)

---

## General Best Practices

### When to Use These Utilities

- ✅ **Creating new themes** - Use all utilities for consistency
- ✅ **Modifying existing themes** - Replace custom logic with utilities
- ✅ **Adding new features** - Check if utilities can help before writing new code
- ✅ **Processing project data** - Use sorting and image processing utilities

### Import Patterns

```typescript
// Recommended: Import only what you need
import { sortPersonalProjects } from "@/lib/utils/project-sorting";
import { renderMarkdown } from "@/lib/utils/markdown-renderer";

// Or import multiple from same module
import {
  sortPersonalProjects,
  sortProfessionalProjects,
} from "@/lib/utils/project-sorting";
```

### Error Handling

All utilities are designed to handle errors gracefully:

- **Project Sorting:** Returns empty array if input is invalid
- **Markdown Renderer:** Returns empty string if input is null/undefined
- **Profile Picture:** Returns null if no picture found
- **Project Images:** Returns original path if processing fails

### Performance Considerations

- **Project Sorting:** Creates array copies (O(n log n) complexity)
- **Markdown Renderer:** Lightweight, synchronous processing
- **Profile Picture:** Async file system operations
- **Project Images:** Async file operations with caching (only copies if needed)

---

## Contributing New Utilities

If you create a new utility function that could be reused:

1. **Place it in `src/lib/utils/`** directory
2. **Add TypeScript types** and JSDoc comments
3. **Write unit tests** in `__tests__/lib/utils/`
4. **Document it here** in this file
5. **Update CONTRIBUTING.md** to reference it

---

## Related Documentation

- [Configuration Guide](./CONFIGURATION.md) - How to configure projects and images
- [Contributing Guide](./CONTRIBUTING.md) - General contribution guidelines
- [Project Specifications](./PROJECT_SPECIFICATIONS.md) - Technical requirements
