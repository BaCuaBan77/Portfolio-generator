# Portfolio Website - Project Specifications & Requirements

## 1. Project Overview

A modern, responsive portfolio website generator that showcases personal information, domains, and projects. The system is designed for single-user deployment via Docker, automatically syncing with GitHub repositories to display project information. Users provide configuration files (portfolio info and UI styles), and the system handles GitHub integration, README parsing, and automatic updates.

## 2. Core Features

### 2.1 Static Content Sections
- **About/Introduction Section**
  - Personal introduction with name and title
  - Brief bio/background
  - Professional summary
  - Profile picture support:
    - Local profile picture from `config/profile-pic/` directory
    - Automatic fallback to GitHub avatar if local picture not found
    - Profile picture automatically copied to public folder on initialization
    - Supports: jpg, jpeg, png, gif, webp formats
  - Social media links with icons (GitHub, LinkedIn, X/Twitter, Website)

- **Domains/Skills Section**
  - Displays domains (high-level areas of expertise) from `portfolio.json`
  - Displays skills organized by category (SkillGroup structure)
  - Each skill group has a category name and array of items
  - Example categories: Languages, Frameworks, Cloud/DevOps, Engineering, Management
  - Brief overview of technical competencies
  - Technologies and tools displayed as categorized badges

- **Professional Experience Section**
  - Displays work history from `portfolio.json` using Material-UI Timeline
  - Alternating timeline layout (left/right cards)
  - Shows company, position, dates, and description
  - Date badges displayed on opposite side of timeline
  - Reverse-chronological order
  - Highlights key achievements and responsibilities
  - Expandable descriptions with "See more" functionality
  - Expandable achievements list (independent from description)
  - Timeline dots with work icons
  - Responsive design for mobile, tablet, and desktop

- **Projects Section**
  - Two distinct categories:
    1. **Professional Projects** - Work done for companies/employers
    2. **Personal Projects** - Personal projects for learning and exploration
  - Each project card displays:
    - Project image (extracted from README for personal projects)
    - Project title
    - Abstract/description (from README, with markdown rendering)
    - Technologies used (displayed as badges)
    - Links (GitHub, live demo if available)
    - Project category badge
  - **Project Detail Modal**:
    - Click any project card to open a detailed modal overlay
    - Full abstract with markdown formatting rendered (bold, italic, lists)
    - Complete project metadata (language, stars, created/updated dates)
    - All technologies displayed (not limited to 5)
    - Action buttons for GitHub and live demo
    - Modal features:
      - Close with ESC key
      - Close by clicking backdrop
      - Close button in top-right corner
      - Scroll prevention when modal is open
      - Smooth animations with Framer Motion

### 2.2 Dynamic Content (GitHub Integration)
- **Automatic Personal Project Discovery**
  - Fetches all public repositories from configured GitHub username
  - Filters repositories: must have README with "Abstract" section
  - Excludes repositories already present in configuration file
  - Extracts project information from README files
  - All GitHub repos are automatically categorized as "Personal Projects"

- **Manual Professional Projects**
  - Professional projects are manually maintained in configuration file
  - No automatic GitHub integration for professional projects
  - Can include projects without GitHub repos or private company repos
  - Preserved during automatic sync operations

- **Update Mechanism**
  - **Full Sync Strategy**: Adds new repos, updates existing ones, removes deleted repos
  - Runs automatically on first startup (initial sync)
  - Weekly scheduled sync (configurable via environment variable, default: 7 days)
  - Background service runs independently from web server
  - Updates merged `projects.json` configuration file

## 3. Technical Requirements

### 3.1 Frontend
- **Framework:**
  - **Next.js with Server-Side Rendering (SSR)**
  - TypeScript for type safety
  - App Router architecture

- **Rendering Strategy:**
  - Server-Side Rendering (SSR) for always-current data
  - All configuration files read at runtime (on each request)
  - No build-time configuration dependencies
  - Always displays latest data from config files
  - Changes to config files take effect on next request (no rebuild needed)

- **Styling:**
  - Modern, responsive design using CSS Modules (Tailwind removed)
  - Mobile-first approach with responsive breakpoints
  - Multiple page styles available (component-based selection via environment variable)
  - Page style selection via `PORTFOLIO_STYLE` environment variable
  - Available styles: `default` (DefaultPage), `aesthetic` (AestheticPage)
  - Extensible system for adding new page styles
  - Theme-specific variables defined in layout CSS modules for consistent theming
  - Framer Motion for smooth animations and transitions
  - Material-UI (MUI) components for timeline and UI elements
  - All configuration changes require direct file editing (no UI editor)
  - Changes take effect immediately on next request (restart required for env var changes)

- **Features:**
  - Smooth scrolling
  - Animations/transitions
  - Project filtering by category
  - Search functionality
  - Loading states

### 3.2 GitHub Integration

**Built-in GitHub Sync Service:**
- **Architecture:**
  - Integrated GitHub API client built into the application
  - Background service runs independently from web server
  - GitHub username read at runtime from `config/portfolio.json` (file-based, not UI-editable)
  - Fetches all public repositories for the configured user
  - Reads username on each sync operation (changes take effect on next sync)

- **Authentication:**
  - GitHub Personal Access Token is optional (via environment variable)
  - Works without token: 60 requests/hour (unauthenticated)
  - With token: 5,000 requests/hour (recommended for reliability)
  - Token stored securely in environment variables, never in config files

- **Sync Process:**
  1. Fetch all public repositories from GitHub API
  2. Filter repositories:
     - Must have README file
     - README must contain "Abstract" section
     - Exclude repos already in `projects.json` config
  3. For each valid repo:
     - Fetch README content
     - Parse and extract "Abstract" section
     - Extract repository metadata (name, description, language, topics, etc.)
     - Format as project object
  4. Full sync operation:
     - Add new repositories (not in config)
     - Update existing repositories (if data changed)
     - Remove repositories that no longer exist on GitHub
  5. Preserve professional projects (category: "professional")
  6. Write updated data to `config/projects.json`

- **Scheduling:**
  - Runs automatically on first startup (initial sync)
  - Weekly scheduled sync (configurable via `SYNC_INTERVAL_DAYS` env var, default: 7 days)
  - Uses node-cron or similar for scheduling
  - Runs as independent background process
  - Logs all sync operations

- **Error Handling:**
  - Graceful handling of rate limits
  - Retry logic for failed requests
  - Continues processing even if individual repos fail
  - Logs errors for debugging

**README Parsing Requirements:**
- Parse README.md files (markdown format)
- Extract content from "Abstract" section (## Abstract or ### Abstract)
- Extract full content until next heading (## or ###), including all subsections like "Key Features"
- Extract first image from README:
  - Prioritize HTML `<img>` tags (often at top of README)
  - Fallback to markdown image syntax: `![alt text](url)`
  - Skip images in code blocks (documentation examples)
  - Resolve relative image paths to absolute URLs (relative to repository)
- Support markdown formatting in UI (rendered as HTML):
  - Bold text: `**text**` or `__text__`
  - Italic text: `*text*` or `_text_`
  - Lists: `- item` or `* item`
  - Line breaks preserved
- Filter out repos without README or Abstract section
- Unit tests included for all parsing functions

### 3.3 Project Categorization

**Categorization Strategy:**

- **Professional Projects:**
  - Manually maintained in configuration file
  - User manually adds/updates professional project entries in `config/projects.json`
  - Category field: `"category": "professional"`
  - Can include projects without GitHub repos or private repositories
  - Full control over project data (title, description, abstract, technologies, links, etc.)
  - Preserved during automatic sync operations (never removed or overwritten by sync)

- **Personal Projects:**
  - Automatically discovered from GitHub repositories
  - All GitHub repos are treated as personal projects by default
  - Category field: `"category": "personal"`
  - Data extracted from GitHub API and README files
  - Automatically added/updated/removed during weekly sync

**Data Storage:**
- Single merged `config/projects.json` file containing both categories
- Projects distinguished by `category` field
- Full sync preserves professional projects while updating personal projects

## 4. Data Structure

### 4.1 Project Data Model
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "abstract": "string (from README)",
  "category": "professional" | "personal",
  "image": "string (optional, URL from README)",
  "technologies": ["string"],
  "githubUrl": "string",
  "liveUrl": "string (optional)",
  "readmeUrl": "string",
  "updatedAt": "datetime",
  "createdAt": "datetime",
  "language": "string (primary language)",
  "stars": "number",
  "topics": ["string"]
}
```

### 4.2 Configuration

**Main Configuration (`config/portfolio.json`):**
```json
{
  "name": "string",
  "title": "string",
  "bio": "string",
  "email": "string",
  "githubUsername": "string",
  "profilePictureUrl": "string | null (auto-populated)",
  "domains": ["string"],
  "skills": [
    {
      "category": "string",
      "items": ["string"]
    }
  ],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string (ISO date or 'YYYY-MM')",
      "endDate": "string (ISO date or 'YYYY-MM') | 'Present'",
      "description": "string",
      "achievements": ["string (optional)"]
    }
  ],
  "socialLinks": {
    "linkedin": "string (optional)",
    "twitter": "string (optional)",
    "website": "string (optional)"
  }
}
```

**Field Descriptions:**
- `name` - Full name
- `title` - Professional title/role
- `bio` - Brief biography/description
- `email` - Contact email
- `githubUsername` - GitHub username for repository syncing
- `profilePictureUrl` - Profile picture URL (auto-populated, local file or GitHub avatar)
- `domains` - Array of high-level domains/areas of expertise (e.g., "Full-Stack Development", "Cloud Architecture")
- `skills` - Array of skill groups, each with:
  - `category` - Category name (e.g., "Languages", "Frameworks", "Cloud / DevOps")
  - `items` - Array of specific skills in that category (e.g., ["TypeScript", "JavaScript"])
- `experience` - Array of professional work experience entries
  - `company` - Company/organization name
  - `position` - Job title/position
  - `startDate` - Start date (ISO format or 'YYYY-MM')
  - `endDate` - End date (ISO format, 'YYYY-MM', or 'Present' for current position)
  - `description` - Job description/responsibilities (supports truncation with "See more")
  - `achievements` - Array of key achievements (optional, supports truncation with "See more")
- `socialLinks` - Object containing social media and website links

**Projects Configuration (`config/projects.json`):**
```json
[
  {
    "id": "string (repo name or custom id)",
    "name": "string",
    "description": "string",
    "abstract": "string (from README for personal projects)",
    "category": "professional" | "personal",
    "image": "string (optional, URL extracted from README for personal projects)",
    "technologies": ["string"],
    "githubUrl": "string",
    "liveUrl": "string (optional)",
    "language": "string (primary language, from GitHub)",
    "stars": "number (from GitHub)",
    "topics": ["string (from GitHub)"],
    "updatedAt": "datetime (ISO string)",
    "createdAt": "datetime (ISO string)"
  }
]
```

**Page Style Configuration (Environment Variables):**
- `PORTFOLIO_STYLE` - Page style selection (enum: 'default' | 'aesthetic')
- `THEME` - Layout theme for the `default` style (enum: 'light' | 'dark')
- Set in `.env` file or environment variables
- Default values:
  - `PORTFOLIO_STYLE`: `'default'`
  - `THEME`: `'light'`
- Changes require application restart to take effect
- System uses component-based page styles instead of CSS themes

**Available Page Styles:**
- `default` - Clean, professional default page style (DefaultPage component)
  - Minimalist warm color scheme with light and dark variants (controlled via `THEME`)
  - MUI Timeline for experience section
  - Smooth scroll animations with Framer Motion
  - Responsive design for all screen sizes
- `aesthetic` - Modern, artistic page style (AestheticPage component)
  - Alternative layout and visual design
  - Enhanced visual elements
- Additional page styles can be added by creating new components in `app/layouts/` directory

**Custom CSS File (`config/custom.css`):**
- This feature has been removed to simplify theming and avoid fragile global overrides.
- Styling customization is now done by editing or extending the built-in theme CSS modules.

**Environment Variables:**
- `GITHUB_TOKEN` (optional, recommended for higher rate limits)
- `SYNC_INTERVAL_DAYS` (optional, default: 7)
- `PORT` (optional, default: 3000)
- `PORTFOLIO_STYLE` (optional, default: 'default', enum: 'default' | 'aesthetic')
- `THEME` (optional, default: 'light', enum: 'light' | 'dark')

**Initialization:**
- System auto-creates default config files on first run if they don't exist
- Generates empty arrays/objects with proper structure
- Includes example values as comments for guidance

**Configuration Notes:** 
- **Runtime Config Files (read on each request):**
  - `portfolio.json` - Personal info and GitHub username (file-based editing)
  - `projects.json` - Project data (updated by sync service, can be manually edited)
  
- **Environment Variables:**
  - `PORTFOLIO_STYLE` - Page style selection (enum-based, set in `.env` file)
  - `THEME` - Layout theme for the `default` style (enum-based, set in `.env` file)
  - `GITHUB_TOKEN` - GitHub Personal Access Token (optional)
  - `SYNC_INTERVAL_DAYS` - Sync frequency in days (optional, default: 7)
  - `PORT` - Server port (optional, default: 3000)
  
- **File-based Editing (No UI Editor):**
  - All configuration changes require direct file editing
  - GitHub username: Edit `portfolio.json` → Changes take effect on next sync
  - Page style: Edit `.env` file (set `PORTFOLIO_STYLE`) → Restart required
  - Layout theme: Edit `.env` file (set `THEME`) → Restart required
  - Portfolio info: Edit `portfolio.json` → Changes take effect on next request
  - Professional projects: Edit `projects.json` → Changes take effect on next request
  - Profile picture: Place image in `config/profile-pic/` → Run `npm run init:config`
  
- All GitHub repositories are automatically treated as personal projects
- Professional projects must be manually added to `config/projects.json` with `"category": "professional"`
- GitHub username is read from `portfolio.json` at runtime, token from environment variable
- Profile picture: Local file takes precedence, falls back to GitHub avatar

## 5. README Abstract Extraction

### 5.1 Expected README Format
```markdown
# Project Name

![Project Image](./screenshot.png)
or
![Project Image](https://example.com/image.png)

## Abstract

[Project description and abstract content here]

## Features

...

## Installation

...
```

**Image Extraction:**
- System looks for the first image in the README (markdown image syntax: `![alt text](url)`)
- Can be relative path (e.g., `./screenshot.png`) or absolute URL
- Relative paths are resolved relative to the repository root
- If no image found, project card displays without image or uses placeholder

**Image URL Resolution:**
- **Absolute URLs** (e.g., `https://example.com/image.png`):
  - Used directly in `<img src="...">` tag
  - No transformation needed
  - Can be from external CDN, image hosting services, or other domains
  
- **Relative Paths** (e.g., `./screenshot.png`, `images/hero.png`):
  - Resolved to GitHub's raw content URL
  - Format: `https://raw.githubusercontent.com/{username}/{repo}/{branch}/{path}`
  - Example: `./screenshot.png` → `https://raw.githubusercontent.com/user/repo/main/screenshot.png`
  - Default branch is typically `main` or `master` (can be determined from repo metadata)
  
- **Image Display:**
  - Images are displayed in project cards using standard HTML `<img>` tag
  - Images are loaded directly from resolved URLs (no proxy needed)
  - Supports lazy loading for performance
  - Fallback placeholder if image fails to load
  - Responsive image sizing (maintains aspect ratio)

### 5.2 Parsing Strategy
- Look for "## Abstract" or "### Abstract" heading
- Extract content until next heading (## or ###)
- Extract first image from README:
  - Search for markdown image syntax: `![alt text](url)`
  - Extract image URL (can be relative or absolute)
  - **If absolute URL**: Use as-is (e.g., `https://example.com/image.png`)
  - **If relative path**: Resolve to GitHub raw content URL:
    - Get repository default branch from GitHub API
    - Construct URL: `https://raw.githubusercontent.com/{username}/{repo}/{branch}/{path}`
    - Example: `./screenshot.png` in `user/my-repo` (main branch) → `https://raw.githubusercontent.com/user/my-repo/main/screenshot.png`
  - Store resolved absolute URL in project data model
- Support markdown formatting (converted to HTML for display)
- Filter repositories: only include repos with README containing Abstract section
- Fallback: Use repository description if abstract not found
- Fallback: Use first paragraph of README if no abstract section
- Image fallback: If no image found, project displays without image or uses placeholder
- Repos without README or Abstract are excluded from sync

### 5.3 GitHub Sync Service Implementation

**Service Architecture:**
```
Application Startup
  ↓
Initialize Scheduler
  ↓
First Run: Execute Initial Sync
  ↓
Schedule Weekly Sync (node-cron)
  ↓
Background Process (Independent from Web Server)
  ├─ Fetch All Repos from GitHub API
  ├─ Filter: Must have README with Abstract
  ├─ Parse README and Extract:
  │   ├─ Abstract section
  │   └─ First image (if available)
  ├─ Resolve relative image paths to absolute URLs
  ├─ Compare with Existing projects.json
  ├─ Full Sync: Add/Update/Remove
  └─ Write Updated projects.json
```

**Implementation Details:**
- GitHub API client with rate limit handling
- Markdown parser for README extraction (abstract and images)
- Image URL resolver (converts relative paths to absolute URLs)
- Config file manager for reading/writing projects.json
- Scheduler service for weekly automation
- Error handling and logging

### 5.4 Page Style System

**Runtime Process:**
- `PORTFOLIO_STYLE` environment variable is read at application startup
- Page style enum value is used to select corresponding page component
- Page style components are located in `app/layouts/` directory
- Selected page component is rendered via Next.js App Router
- `custom.css` is loaded after default styles (if exists) for overrides
- Changes to `custom.css` take effect immediately on next request
- Changes to `PORTFOLIO_STYLE` require application restart

**Implementation:**
- Application reads `PORTFOLIO_STYLE` from environment variables at startup
- Validates page style enum value against available page components
- Renders corresponding page component (DefaultPage, AestheticPage, etc.)
- Each page style is a complete React component with its own layout
- CSS variables defined in `globals.css` for consistent theming
- Loads `config/custom.css` if it exists (after default styles)
- Custom CSS can override any component styles

**Page Style System:**
- Page style components stored in `app/layouts/` directory
- Each page style is a complete React component with full layout
- Components can share reusable components from `components/` directory
- Easy to add new page styles by creating new components
- Users select page style via `PORTFOLIO_STYLE` environment variable
- Custom CSS allows unlimited customization beyond page styles
- Uses Tailwind CSS for utility-first styling
- Framer Motion for animations and transitions
- Material-UI for advanced components (Timeline, etc.)

**Benefits:**
- Simple page style selection via environment variable
- Easy style switching (change env var and restart)
- Component-based approach ensures consistent, tested designs
- Custom CSS provides flexibility for advanced users
- Extensible system for adding new page styles
- No separate CSS theme files needed

## 6. User Experience (UX) Requirements

### 6.1 Navigation
- Smooth scroll navigation
- Floating sticky header with active section highlighting
- Active section highlighted with sliding background animation
- Section anchors with automatic URL hash updates
- URL hash syncs with active section as you scroll
- Click navigation links to jump to sections
- Responsive header design for all screen sizes

### 6.2 Project Display
- Grid layout with responsive columns (1 on mobile, 2 on tablet, 3 on desktop)
- Filter by category (All, Professional, Personal)
- Project cards with hover effects and smooth animations
- **Project Detail Modal**:
  - Click any project card to view full details
  - Markdown-rendered abstract with full formatting support
  - Complete project information and metadata
  - Scroll prevention when modal is open (body scroll locked)
  - Keyboard shortcuts (ESC to close)
  - Backdrop click to close
  - Smooth open/close animations

### 6.3 Performance
- Fast initial load
- Lazy loading for images
- Optimized API calls
- Caching strategy

### 6.4 Responsive Design
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 7. Deployment & Hosting

### 7.1 Deployment Method
- **Docker Container** (Primary deployment method)
  - Single-user local deployment
  - Dockerfile with Node.js runtime
  - docker-compose.yml for easy setup
  - Volume mounts for config files (user-provided)
  - Environment variables for GitHub token and sync interval

### 7.2 Docker Configuration
- Multi-stage build for optimization
- Volume mounts:
  - `./config:/app/config` - User-provided configuration files
  - `./data:/app/data` - Generated data (optional)
  - `./.env:/app/.env` - Environment variables (optional, can use docker-compose env)
- Environment variables:
  - `GITHUB_TOKEN` (optional)
  - `SYNC_INTERVAL_DAYS` (optional, default: 7)
  - `PORT` (optional, default: 3000)
  - `PORTFOLIO_STYLE` (optional, default: 'default')
- Health check endpoint
- Background services run alongside web server

### 7.3 User Setup Process
1. Clone/download portfolio project
2. Provide configuration files in `config/` directory:
   - `portfolio.json` (with GitHub username) - runtime config, file-based editing
   - `projects.json` (can start empty, auto-populated) - runtime config
   - `custom.css` (optional, for custom styling overrides) - runtime config, file-based editing
3. Create `.env` file or set environment variables:
   - `PORTFOLIO_STYLE` (optional, default: 'default', enum: 'default' | 'aesthetic')
   - `GITHUB_TOKEN` (optional, recommended for higher rate limits)
   - `SYNC_INTERVAL_DAYS` (optional, default: 7)
   - `PORT` (optional, default: 3000)
4. Build Docker image (one-time build)
5. Run `docker-compose up`
6. System performs initial sync on first startup
7. Portfolio accessible at configured port

**Configuration Updates:**
- Runtime config files (read on each request): `portfolio.json`, `projects.json`, `custom.css`
- Changes to runtime config files take effect immediately on next request
- Environment variables: `PORTFOLIO_STYLE`, `THEME`, `GITHUB_TOKEN`, `SYNC_INTERVAL_DAYS`, `PORT`
- Changes to environment variables require application restart
- All changes require direct file editing (no UI editor)
- GitHub username changes take effect on next sync operation
- Page style selection: Edit `.env` file (set `PORTFOLIO_STYLE`) → Restart required
- Custom styling: Edit `custom.css` → Changes take effect on next request

## 8. Security Considerations

- GitHub token security (if used)
- Environment variables for sensitive data
- Rate limiting handling
- CORS configuration (if needed)

## 9. Future Enhancements (Optional)

- Blog section
- Contact form
- Analytics integration
- Multi-language support
- Project tags/filtering
- Project detail pages
- RSS feed
- Sitemap generation

## 10. Clarifications & Decisions

1. **Technology Stack:**
   - ✅ **Selected:** Next.js with Server-Side Rendering (SSR)
   - ✅ **Selected:** TypeScript
   - ✅ **Selected:** Theme customization via JSON + custom CSS

2. **GitHub Integration:**
   - ✅ **Selected:** Built-in GitHub sync service (not n8n)
   - ✅ **Selected:** GitHub username in `portfolio.json`
   - ✅ **Selected:** GitHub token optional (works without, recommends with)
   - ✅ **Selected:** Full sync strategy (add/update/remove)
   - ✅ **Selected:** Weekly scheduler (configurable)

3. **Project Categorization:**
   - ✅ **Clarified:** Professional projects manually maintained
   - ✅ **Clarified:** All GitHub repos are personal projects
   - ✅ **Clarified:** Single merged `projects.json` with category field

4. **Deployment:**
   - ✅ **Selected:** Docker container for local deployment
   - ✅ **Selected:** Single-user system
   - ✅ **Selected:** Config files provided by user

5. **Initialization:**
   - ✅ **Selected:** Auto-create config files on first run

6. **Configuration:**
   - ✅ **Selected:** Runtime config files (read on each request): `portfolio.json`, `projects.json`, `custom.css`
   - ✅ **Selected:** Page style selection via environment variable (`PORTFOLIO_STYLE`)
- ✅ **Selected:** Profile picture support with local file and GitHub avatar fallback
- ✅ **Selected:** SkillGroup structure for categorized skills display
- ✅ **Selected:** MUI Timeline for professional experience section
   - ✅ **Selected:** All changes require file-based editing (not UI-editable)
   - ✅ **Selected:** Config file changes take effect immediately, env var changes require restart

7. **Page Style System:**
   - ✅ **Selected:** Component-based page style selection via `PORTFOLIO_STYLE` environment variable
   - ✅ **Selected:** Multiple ready-made page styles (default, aesthetic, etc.)
   - ✅ **Selected:** Separate `custom.css` file for advanced styling overrides
   - ✅ **Selected:** Tailwind CSS for utility-first styling
   - ✅ **Selected:** Framer Motion for animations
   - ✅ **Selected:** Material-UI for advanced components (Timeline)
- ✅ **Selected:** Jest for unit testing with TypeScript support
- ✅ **Selected:** Markdown rendering for project abstracts
- ✅ **Selected:** Project detail modal with scroll prevention
- ✅ **Selected:** Dynamic URL hash updates on scroll

## 11. Project Structure

```
portfolio/
├── src/ (Source code)
│   ├── app/ (Next.js App Router)
│   │   ├── layout.tsx (Root layout with MUI ThemeProvider)
│   │   ├── page.tsx (Page style router)
│   │   ├── globals.css (Global styles and CSS variables)
│   │   └── layouts/ (Page layout components)
│   │       ├── Default/ (Default theme)
│   │       │   ├── components/ (React components)
│   │       │   │   ├── ExperienceTimeline.tsx (MUI Timeline component)
│   │       │   │   ├── ProfilePicture.tsx (Profile picture handler)
│   │       │   │   └── ProjectCard.tsx (Reusable project card with detail modal)
│   │       │   ├── styles/ (CSS modules)
│   │       │   │   ├── DefaultPage.module.css
│   │       │   │   ├── ProfilePicture.module.css
│   │       │   │   └── ProjectCard.module.css
│   │       │   └── DefaultPage.tsx (Main page component)
│   │       └── Aesthetic/ (Aesthetic theme)
│   │           └── AestheticPage.tsx (Aesthetic page layout)
│   ├── lib/ (Core libraries organized by domain)
│   │   ├── config/ (Configuration management)
│   │   │   └── index.ts (Config file operations)
│   │   ├── github/ (GitHub API integration)
│   │   │   └── index.ts (GitHub API client)
│   │   ├── parsers/ (Content parsing utilities)
│   │   │   └── markdown.ts (README parsing)
│   │   ├── utils/ (General utilities)
│   │   │   ├── profile-picture.ts (Profile picture logic)
│   │   │   └── markdown-renderer.ts (Markdown to HTML renderer)
│   │   └── core/ (Core application logic)
│   │       ├── scheduler.ts (Cron scheduler)
│   │       └── startup.ts (Application startup)
│   ├── services/ (Background services)
│   │   └── github-sync.ts (GitHub sync service)
│   └── types/ (TypeScript type definitions)
│       ├── portfolio.ts (Portfolio data types)
│       └── project.ts (Project data types)
├── config/ (User-provided, volume mounted)
│   ├── portfolio.json (Portfolio configuration)
│   ├── projects.json (Projects data)
│   └── profile-pic/ (Profile picture directory)
├── docker/ (Docker configuration)
│   ├── Dockerfile (Docker build file)
│   └── docker-compose.yml (Docker Compose config)
├── scripts/ (Utility scripts)
│   └── init-config.ts (Configuration initialization)
├── public/ (Static assets)
│   └── config/ (Public config assets)
│       └── profile-pic/ (Public profile pictures)
├── .env (User-provided, or set via docker-compose)
│   └── PORTFOLIO_STYLE, THEME, GITHUB_TOKEN, etc.
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

**Next Steps:**
1. Review and comment on this specification
2. Answer clarification questions
3. Proceed with design mockups/wireframes
4. Begin implementation

