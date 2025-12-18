# Contributing to Portfolio Generator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.19.4 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Docker** (optional, for testing container builds)

### Development Setup

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Portfolio-generator.git
   cd Portfolio-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Initialize configuration**

   ```bash
   npm run init:config
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your GitHub token (optional for development)
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`

## 📝 Contribution Guidelines

### Code Style

- Follow existing TypeScript/React patterns
- Use functional components with hooks
- Use CSS Modules for styling
- Write meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Follow the conventional commits format:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding or updating tests
chore: maintenance tasks
```

**Examples:**

- `feat: add dark mode theme`
- `fix: resolve Docker build error`
- `docs: update README with new deployment instructions`

### Pull Requests

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write clean, well-documented code
   - Test your changes thoroughly
   - Update documentation if needed

3. **Test locally**

   ```bash
   npm run dev  # Test development build
   npm run build  # Test production build
   npm test  # Run test suite
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: your descriptive message"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of your changes
   - Link any related issues

### Pull Request Checklist

- [ ] Code follows project conventions
- [ ] Changes have been tested locally
- [ ] Documentation has been updated
- [ ] Commit messages are clear and follow conventions
- [ ] No unnecessary files or dependencies added
- [ ] Tests pass (if applicable)

## 🎯 Areas for Contribution

### High Priority

- 🐛 **Bug Fixes** - Fix reported issues
- 📚 **Documentation** - Improve guides and examples
- ♿ **Accessibility** - Improve screen reader support, keyboard navigation
- 📱 **Mobile Responsiveness** - Enhance mobile experience

### Features

- 🎨 **New Themes** - Create additional page layouts
- 🌐 **Internationalization** - Add multi-language support
- 🎯 **README Parsing** - Support more markdown formats
- 📊 **Analytics** - Add optional analytics integration
- 🔍 **Search** - Add project search functionality

### Technical Improvements

- ⚡ **Performance** - Optimize build times, runtime performance
- 🧪 **Testing** - Expand test coverage
- 🔒 **Security** - Security improvements and audits
- 📦 **Docker** - Optimize Docker builds

## 🔧 Reusable Utilities

The project includes several utility functions that should be reused across themes and components. These utilities ensure consistency, reduce code duplication, and follow established patterns.

**📖 For detailed documentation on all available utilities, see [Reusable Utilities Guide](./REUSABLE_UTILITIES.md)**

### Quick Reference

- **Project Sorting** (`@/lib/utils/project-sorting`) - Sort projects by stars, updated time, and created time
- **Markdown Renderer** (`@/lib/utils/markdown-renderer`) - Convert markdown strings to HTML (for bio, abstracts, descriptions, etc.)
- **Profile Picture** (`@/lib/utils/profile-picture`) - Resolve profile picture URLs with GitHub fallback
- **Project Images** (`@/lib/utils/project-images`) - Process and copy project images to public directory

### Quick Example

```typescript
import {
  sortPersonalProjects,
  sortProfessionalProjects,
} from "@/lib/utils/project-sorting";
import { renderMarkdown } from "@/lib/utils/markdown-renderer";

// Sort projects
const professionalProjects = sortProfessionalProjects(
  projects.filter((p) => p.category === "professional")
);
const personalProjects = sortPersonalProjects(
  projects.filter((p) => p.category === "personal")
);

// Render markdown
const html = renderMarkdown(project.abstract);
```

**Why use these utilities?**

- ✅ Ensures consistent behavior across all themes
- ✅ Centralized logic for easier maintenance
- ✅ Follows established patterns and best practices
- ✅ Reduces code duplication

See the [Reusable Utilities Guide](./REUSABLE_UTILITIES.md) for complete documentation, examples, and best practices for each utility.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Add tests for new features
- Update tests when modifying existing features
- Test files are located in `__tests__/` directory
- Use descriptive test names

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layouts/           # Page layouts
│   │   ├── Default/       # Default theme
│   │   │   ├── components/    # React components (TSX)
│   │   │   │   ├── ExperienceTimeline.tsx
│   │   │   │   ├── ProfilePicture.tsx
│   │   │   │   └── ProjectCard.tsx
│   │   │   ├── styles/       # CSS modules
│   │   │   │   ├── DefaultPage.module.css
│   │   │   │   ├── ProfilePicture.module.css
│   │   │   │   └── ProjectCard.module.css
│   │   │   └── DefaultPage.tsx
│   │   └── Aesthetic/     # Aesthetic theme
│   ├── globals.css        # Global styles
│   └── page.tsx           # Theme router
├── lib/                   # Core libraries
│   ├── config/           # Configuration management
│   ├── github/           # GitHub API client
│   ├── parsers/          # Markdown parsing
│   └── utils/            # Utilities
│       ├── markdown-renderer.ts
│       ├── profile-picture.ts
│       ├── project-images.ts
│       └── project-sorting.ts  # Project sorting utilities
├── services/             # Background services
│   └── github-sync.ts    # GitHub sync service
└── types/                # TypeScript types
```

## 🎨 Adding a New Theme

1. **Create the theme directory structure:**

   ```bash
   src/app/layouts/YourTheme/
   ├── components/          # React components (optional)
   │   └── YourComponent.tsx
   ├── styles/              # CSS modules
   │   ├── YourThemePage.module.css
   │   └── YourComponent.module.css (if needed)
   └── YourThemePage.tsx   # Main page component
   ```

2. **Follow the Default theme structure:**

   - Place React components (`.tsx`) in `components/` directory
   - Place CSS modules (`.module.css`) in `styles/` directory
   - Keep the main page component (`YourThemePage.tsx`) at the theme root
   - **Use project sorting utilities** from `@/lib/utils/project-sorting` for consistent project ordering:

     ```typescript
     import {
       sortPersonalProjects,
       sortProfessionalProjects,
     } from "@/lib/utils/project-sorting";

     // Sort projects before displaying
     const professionalProjects = sortProfessionalProjects(
       projects.filter((p) => p.category === "professional")
     );
     const personalProjects = sortPersonalProjects(
       projects.filter((p) => p.category === "personal")
     );
     ```

3. **Update `src/app/page.tsx`** to include your theme in the router:

   ```typescript
   import YourThemePage from '@/app/layouts/YourTheme/YourThemePage';

   // In the switch statement:
   case 'yourtheme':
     return <YourThemePage portfolio={portfolio} projects={projects} />;
   ```

4. **Update environment variable** - Add your theme option to `PORTFOLIO_STYLE` in `.env`:

   ```env
   PORTFOLIO_STYLE=yourtheme
   ```

5. **Document your theme** in the README under the "Key Features" section

**Example structure:**

```
src/app/layouts/YourTheme/
├── components/
│   ├── CustomCard.tsx
│   └── CustomHeader.tsx
├── styles/
│   ├── YourThemePage.module.css
│   ├── CustomCard.module.css
│   └── CustomHeader.module.css
└── YourThemePage.tsx
```

## 🐛 Reporting Issues

### Before Submitting an Issue

1. Check if the issue already exists
2. Test with the latest version
3. Provide detailed information

### Issue Template

```markdown
**Description:**
Clear description of the issue

**Steps to Reproduce:**

1. Step one
2. Step two
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**

- OS: [e.g., macOS 14.0]
- Node.js: [e.g., 20.19.4]
- Docker: [e.g., 24.0.6]
- Browser: [e.g., Chrome 120]

**Screenshots:**
If applicable
```

## 📞 Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Report bugs via GitHub Issues
- 📧 **Email**: For security issues, email directly

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🎉 Recognition

Contributors will be:

- Listed in the repository contributors
- Mentioned in release notes (for significant contributions)
- Appreciated in the community!

Thank you for contributing to Portfolio Generator! 🙏
