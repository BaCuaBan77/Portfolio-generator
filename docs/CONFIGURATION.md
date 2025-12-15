# Configuration Guide

This guide covers all configuration options for your Portfolio Generator.

## 📋 Table of Contents

- [Portfolio Configuration](#portfolio-configuration)
- [Projects Configuration](#projects-configuration)
- [Environment Variables](#environment-variables)
- [Profile Picture](#profile-picture)
- [Custom Styling](#custom-styling)

---

## Portfolio Configuration

### Location
`config/portfolio.json`

This file is automatically created on first run with default values. Edit it with your personal information.

### Complete Example

```json
{
  "name": "Your Name",
  "title": "Your Professional Title",
  "bio": "Brief description about yourself and what you do. Keep it concise and engaging.",
  "email": "your.email@example.com",
  "githubUsername": "your-github-username",
  "domains": [
    "FinTech",
    "Healthcare",
    "E-commerce"
  ],
  "skills": [
    {
      "category": "Languages",
      "items": ["TypeScript", "JavaScript", "Python", "Go"]
    },
    {
      "category": "Frameworks",
      "items": ["React", "Next.js", "Node.js", "Express"]
    },
    {
      "category": "Tools",
      "items": ["Docker", "Kubernetes", "AWS", "GitHub Actions"]
    },
    {
      "category": "Databases",
      "items": ["PostgreSQL", "MongoDB", "Redis"]
    }
  ],
  "experience": [
    {
      "company": "Current Company",
      "position": "Senior Software Engineer",
      "startDate": "2020-01",
      "endDate": "Present",
      "description": "Lead development of scalable microservices architecture serving millions of users.",
      "achievements": [
        "Reduced deployment time by 70% through CI/CD automation",
        "Architected and deployed cloud infrastructure serving 1M+ users",
        "Mentored team of 5 junior developers"
      ]
    },
    {
      "company": "Previous Company",
      "position": "Software Engineer",
      "startDate": "2018-06",
      "endDate": "2019-12",
      "description": "Developed and maintained web applications using React and Node.js.",
      "achievements": [
        "Built real-time dashboard processing 10K+ events/second",
        "Improved API response time by 40%"
      ]
    }
  ],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/yourprofile",
    "twitter": "https://twitter.com/yourhandle",
    "website": "https://yourwebsite.com"
  }
}
```

### Field Reference

> **Note:** Type definitions follow TypeScript interfaces defined in `src/types/portfolio.ts`

#### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Your full name | `"John Doe"` |
| `title` | string | Your professional title | `"Full-Stack Developer"` |
| `bio` | string | Brief bio (2-3 sentences) | `"Passionate developer..."` |
| `email` | string | Contact email | `"john@example.com"` |
| `githubUsername` | string | GitHub username for repo syncing | `"johndoe"` |

#### Optional Fields

| Field | Type | Description | Recommendations |
|-------|------|-------------|-----------------|
| `domains` | string[] | Industry domains/sectors you work in | 2-4 domains (e.g., FinTech, Healthcare, Defense) |
| `skills` | [SkillGroup](#skillgroup-type)[] | Skills organized by category | 3-6 categories max |
| `experience` | [Experience](#experience-type)[] | Work experience entries | Most recent first |
| `socialLinks` | [SocialLinks](#sociallinks-type) | Links to your profiles | Supports: LinkedIn, Twitter, Website |

### TypeScript Type Definitions

#### SkillGroup Type

```typescript
interface SkillGroup {
  category: string;    // Skill category name (e.g., "Languages", "Frameworks")
  items: string[];     // Array of skills in this category
}
```

#### Experience Type

```typescript
interface Experience {
  company: string;           // Company name
  position: string;          // Job title/position
  startDate: string;         // Start date in YYYY-MM format
  endDate: string | 'Present'; // End date in YYYY-MM format or "Present"
  description: string;       // Brief role description
  achievements?: string[];   // Optional array of achievements
}
```

#### SocialLinks Type

```typescript
interface SocialLinks {
  linkedin?: string;   // LinkedIn profile URL
  twitter?: string;    // Twitter/X profile URL
  website?: string;    // Personal website URL
}
```

> **Note:** Only these three platforms are currently supported and rendered in the portfolio UI.

### Skills Structure

See [SkillGroup Type](#skillgroup-type) definition above for the full interface.

Skills are organized by category for better presentation:

```json
"skills": [
  {
    "category": "Category Name",
    "items": ["Skill 1", "Skill 2", "Skill 3"]
  }
]
```

**Recommended Categories:**
- Languages
- Frameworks
- Tools & Platforms
- Databases
- Cloud Services
- DevOps & CI/CD

**Best Practices:**
- Use 3-6 categories
- Include 3-8 items per category
- List most important skills first
- Be specific (e.g., "React 19" instead of just "Frontend")

### Domains

Domains represent the **industry verticals or sectors** where you have experience building software, not technical capabilities.

**Examples:**
- FinTech (Financial Technology)
- Healthcare / MedTech
- E-commerce / Retail
- Defense / Aerospace
- IoT (Internet of Things)
- EdTech (Education Technology)
- Logistics / Supply Chain
- Telecommunications
- Real Estate / PropTech
- Energy / GreenTech
- Gaming / Entertainment
- Government / Public Sector
- Cybersecurity
- Automotive
- Agriculture / AgriTech

**Best Practices:**
- List 2-4 domains you're most familiar with
- Choose domains where you understand the business context and challenges
- Order by experience level or relevance
- Think about the industries your projects and work experience span

### Experience Structure

See [Experience Type](#experience-type) definition above for the full interface.

```json
"experience": [
  {
    "company": "Company Name",
    "position": "Job Title",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM or Present",
    "description": "Brief overview of your role",
    "achievements": [
      "Quantifiable achievement 1",
      "Quantifiable achievement 2"
    ]
  }
]
```

**Date Format:**
- `startDate`: `"YYYY-MM"` (e.g., `"2020-01"`)
- `endDate`: `"YYYY-MM"` or `"Present"` for current positions

**Best Practices:**
- List experiences in reverse chronological order (most recent first)
- Use quantifiable achievements (numbers, percentages, impact)
- Keep descriptions concise and action-oriented
- 2-4 achievements per role is ideal

### Social Links

See [SocialLinks Type](#sociallinks-type) definition above for the full interface.

**Supported Platforms:**

```json
"socialLinks": {
  "linkedin": "https://linkedin.com/in/yourprofile",
  "twitter": "https://twitter.com/yourhandle",
  "website": "https://yourwebsite.com"
}
```

**Currently Supported:**
- ✅ **LinkedIn** - Professional networking profile
- ✅ **Twitter/X** - Social media profile
- ✅ **Website** - Personal website or blog

All fields are optional. Only add the platforms you want to display.

---

## Projects Configuration

### Location
`config/projects.json`

This file is automatically created and managed by the GitHub sync service. However, you can manually add **professional projects**.

### How It Works

**Automatic (Personal Projects):**
- Synced from your GitHub repositories weekly
- Requires a README with an "Abstract" section
- First image in README used as project image
- Technologies parsed from README or repo topics

**Manual (Professional Projects):**
- Added manually to `config/projects.json`
- Never automatically removed
- Full control over content and display

### Adding Professional Projects Manually

Edit `config/projects.json` and add your professional projects:

```json
[
  {
    "id": "unique-project-id",
    "name": "Project Name",
    "description": "Brief one-line description of the project",
    "abstract": "Detailed project description. Explain the problem, your solution, and the impact. This appears in the project modal.",
    "category": "professional",
    "technologies": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "AWS"
    ],
    "githubUrl": "https://github.com/company/project",
    "liveUrl": "https://project-demo.com",
    "image": "https://example.com/project-screenshot.png",
    "featured": true
  },
  {
    "id": "another-professional-project",
    "name": "Enterprise Dashboard",
    "description": "Real-time analytics dashboard for enterprise clients",
    "abstract": "Built a comprehensive analytics dashboard that processes over 100K events per second. Implemented real-time data visualization, custom alerting system, and role-based access control. Reduced time-to-insight by 60% for clients.",
    "category": "professional",
    "technologies": [
      "Vue.js",
      "Python",
      "FastAPI",
      "Redis",
      "Docker"
    ],
    "liveUrl": "https://dashboard.example.com",
    "image": "https://example.com/dashboard-screenshot.png"
  }
]
```

### Project Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | ✅ | string | Unique identifier (use kebab-case) |
| `name` | ✅ | string | Project name |
| `description` | ✅ | string | Brief one-line description |
| `abstract` | ✅ | string | Detailed description (shown in modal) |
| `category` | ✅ | string | `"professional"` or `"personal"` |
| `technologies` | ✅ | string[] | List of technologies used |
| `githubUrl` | ❌ | string | GitHub repository URL (optional) |
| `liveUrl` | ❌ | string | Live demo/production URL (optional) |
| `image` | ❌ | string | Project screenshot/image URL (optional) |
| `featured` | ❌ | boolean | Feature this project (optional) |

### Best Practices for Projects

**Professional Projects:**
- Highlight business impact and results
- Include metrics (users served, performance improvements, etc.)
- Use high-quality screenshots
- Link to live demos when possible
- Don't include confidential company information

**Personal Projects (Auto-Synced):**
- Ensure your GitHub README has an "Abstract" section
- Add a screenshot as the first image in README
- List technologies in a "Technologies" section
- Keep README well-formatted and informative

**README Format for Auto-Sync:**

```markdown
# Project Name

![Project Screenshot](./screenshot.png)

## Abstract

Your project description here. This will be extracted and shown on your portfolio.
Explain what the project does, why you built it, and what you learned.

## Technologies

- React
- TypeScript
- Node.js
- PostgreSQL

## Features

- Feature 1
- Feature 2

## Installation

...
```

**Important:** 
- The "Abstract" section is **required** for auto-sync
- Projects without an abstract will be skipped
- First image in README becomes the project thumbnail

---

## Environment Variables

### Location
`.env` file in the same directory as `docker-compose.yml`

### Available Variables

```env
# GitHub Integration (Required for syncing repos)
GITHUB_TOKEN=your_github_personal_access_token

# Theme Selection (Optional, default: default)
PORTFOLIO_THEME=default

# Sync Interval (Optional, default: 7 days)
SYNC_INTERVAL_DAYS=7

# Server Port (Optional, default: 3000)
PORT=3000
```

### GITHUB_TOKEN (Recommended)

**Purpose:** Authenticate with GitHub API to sync repositories

**How to Get:**
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Portfolio Website")
4. Select scopes:
   - ✅ `repo` - Full control of private repositories (for private repos)
   - ✅ `public_repo` - Access to public repositories (for public only)
5. Set expiration (recommended: 90 days or no expiration for production)
6. Click "Generate token"
7. Copy the token immediately (you can't see it again!)
8. Add to `.env`: `GITHUB_TOKEN=ghp_your_token_here`

**Benefits:**
- ✅ Access both public AND private repositories
- ✅ 5,000 API requests/hour (vs 60 without token)
- ✅ Reliable automatic syncing
- ✅ No rate limit issues

**Without Token:**
- ❌ Only public repositories
- ❌ 60 API requests/hour
- ⚠️ May hit rate limits during sync

### PORTFOLIO_THEME

**Purpose:** Select the page style/theme

**Options:**
- `default` - Warm minimalism design (professional)
- `aesthetic` - Modern artistic design
- More themes coming soon!

**Example:**
```env
PORTFOLIO_THEME=default
```

### SYNC_INTERVAL_DAYS

**Purpose:** How often to automatically sync GitHub repositories

**Default:** `7` (weekly)

**Example:**
```env
SYNC_INTERVAL_DAYS=7
```

**Recommendations:**
- `7` - Weekly (recommended for active developers)
- `1` - Daily (if you push projects frequently)
- `30` - Monthly (for stable portfolios)

### PORT

**Purpose:** Server port number

**Default:** `3000`

**Example:**
```env
PORT=3000
```

---

## Profile Picture

### Location
`config/profile-pic/`

Place your profile picture in this directory. The system automatically detects and uses it.

### Setup

```bash
# Copy your profile picture
cp /path/to/your/photo.jpg config/profile-pic/profile.jpg
```

### Supported Formats
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

### Requirements
- Any filename is fine
- Only one image should be in the directory
- Recommended size: 400x400px or larger
- Square aspect ratio works best

### Fallback
If no profile picture is found, your **GitHub avatar** is automatically used.

## Applying Configuration Changes

### For `portfolio.json` and `projects.json`
Changes take effect **immediately** on next page load. No restart needed.

```bash
# Edit config
nano config/portfolio.json

# Refresh browser - changes visible!
```

### For `.env` variables
Requires **container restart**:

```bash
# Edit environment variables
nano .env

# Restart container
docker-compose restart
```

### For profile picture
If you add/change the profile picture **after** initial setup:

```bash
# Add new picture
cp new-photo.jpg config/profile-pic/

# Restart container to re-copy to public folder
docker-compose restart
```

---

## Troubleshooting

### Projects not syncing
1. Check `GITHUB_TOKEN` is set correctly in `.env`
2. Verify `githubUsername` in `portfolio.json` is correct
3. Ensure GitHub repos have README with "Abstract" section
4. Check logs: `docker-compose logs -f`

### Changes not appearing
1. Clear browser cache (hard refresh: Ctrl+F5 or Cmd+Shift+R)
2. For `.env` changes: restart container
3. For JSON changes: just refresh browser

### Profile picture not showing
1. Ensure picture is in `config/profile-pic/` directory
2. Check file format is supported (jpg, png, gif, webp)
3. Restart container: `docker-compose restart`
4. Fallback: GitHub avatar will be used automatically

### Rate limit errors
1. Add `GITHUB_TOKEN` to `.env`
2. Increase `SYNC_INTERVAL_DAYS` to reduce sync frequency
3. Check token hasn't expired

---

## Need Help?

- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 🐛 [Open an Issue](https://github.com/BaCuaBan77/Portfolio-generator/issues)

