# Portfolio Website Generator
<p align="center">
  <img src="./Thumbnail.png" alt="Portfolio Website Thumbnail" width="700"/>
</p>



## Abstract
Let's be honest—you're busy building awesome projects 💻, but updating your portfolio? That's always "on the list" 📝. When opportunity knocks 🚪 (job applications, freelance gigs, or just showing off your work), you're stuck spending hours writing descriptions, grabbing screenshots 📸, and manually updating everything. Sound familiar? 😅 

This portfolio generator has your back! It automatically syncs with your GitHub repositories, pulls project details straight from your README files, and keeps everything fresh without you lifting a finger. You keep coding, and your portfolio stays updated. It's that simple.

**Key Features:**
- 🚀 **Automatic GitHub Integration** - Syncs your repos weekly and shows off both public and private projects (just add a token). Your portfolio grows as you code!
- 🎯 **Smart README Parsing** - Already wrote a great README? Perfect! This tool grabs descriptions, images, tech stacks, and abstracts from your existing files. Write once, use everywhere.
- 🎨 **Configurable Page Styles** - Pick from sleek, professionally designed layouts, and you can switch themes in seconds with one environment variable. Current supported styles are:
  - Warm Minimalism (Default)
  - Aesthetic
  - More are coming soon!

## 🚀 Quick Start (Using Docker)

The easiest way to get started is using the pre-built Docker image:

### Prerequisites
- Docker and Docker Compose installed ([Get Docker](https://docs.docker.com/get-docker/))
- A GitHub account

### 1. Get the Docker Compose File

```bash
# Create a directory for your portfolio
mkdir my-portfolio && cd my-portfolio

# Download docker-compose.yml
curl -o docker-compose.yml https://raw.githubusercontent.com/BaCuaBan77/Portfolio-generator/main/docker/docker-compose.yml

# Create config directory
mkdir -p config
```

### 2. Run the Container (Config Files Created Automatically)

```bash
docker-compose up -d
```

On first run, the container automatically creates default configuration files in `./config/`:
- `portfolio.json` - Your personal information
- `projects.json` - Projects data (auto-synced from GitHub)
- `profile-pic/` - Directory for your profile picture
- `project-images/` - Directory for project screenshots

### 3. Configure Your Portfolio & Projects

The container automatically created configuration files in `./config/`. Now customize them:

#### **Portfolio Configuration** (`config/portfolio.json`)
Edit with your personal information:
- Name, title, short bio, motto, bio, email
- GitHub username (for automatic repo syncing)
- Domains (industry sectors: FinTech, Healthcare, Defense, etc.)
- Skills (organized by category: Languages, Frameworks, Tools)
- Work experience
- Certifications
- Education
- Social links

#### **Projects Configuration** (`config/projects.json`)
- **Personal Projects**: Automatically synced from your GitHub repos (requires README with "Abstract" section)
- **Professional Projects**: Add manually to showcase work projects or NDA projects
- **Project Images**: Add screenshots to `config/project-images/` and reference them as `./project-images/filename.png`

#### **Environment Variables** (`.env`)
Set up GitHub integration and preferences:
```env
GITHUB_TOKEN=your_github_token         # For syncing repos (recommended)
PORTFOLIO_STYLE=default                # Page style: 'default' or 'aesthetic'
THEME=light                            # Layout theme for Default style: 'light' or 'dark'
SYNC_INTERVAL_DAYS=7                   # How often to sync (days)
```

#### **Profile Picture** (optional)
Add your photo to `config/profile-pic/` or use your GitHub avatar automatically.

---

**📖 Complete Configuration Guide:** See [docs/CONFIGURATION.md](./docs/CONFIGURATION.md) for:
- Detailed field explanations
- How to add professional projects manually
- GitHub token setup (for private repos)
- Custom styling options
- Best practices and examples

---

### 4. Restart to Apply Changes

```bash
docker-compose restart
```

Visit `http://localhost:3000` 🎉

Your portfolio will automatically sync with your GitHub repositories!

---

## 🌐 Make Your Website Public

Once your container is running locally or on a server, you’ll probably want others to see it..  🌍  
Here are a few simple options to put it on the internet:

### High-Level Steps

- **1. Choose where to host it**
  - Any VPS / cloud provider that supports Docker will work (e.g., DigitalOcean, Hetzner, Linode, AWS, etc.), or you can run it on your self-hosted server (but you need to handle the networking yourself).

- **2. Attach a custom domain (optional but recommended)**
  - Buy a domain from any registrar.
  - Use the registrar’s or provider’s DNS documentation to point your domain to your server (A/AAAA records).

- **3. Add HTTPS**
  - Use your provider’s recommended reverse proxy/load balancer solution (Nginx, Caddy, Traefik, Cloudflare, etc.).
  - Follow their official guides to issue and renew HTTPS certificates (often via Let’s Encrypt).

For concrete examples, check your chosen provider’s documentation for:
- “Deploy Docker app” or “Host a containerized app”
- “Point a domain to a server”
- “Enable HTTPS with Let’s Encrypt”

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements.

**Quick Start for Contributors:**
1. Fork the repository
2. Clone and install: `npm install`
3. Make your changes
4. Test locally: `npm run dev`
5. Submit a Pull Request

**📖 Full Contribution Guide:** See [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

## 📚 Documentation

- **[Configuration Guide](./docs/CONFIGURATION.md)** - Complete configuration reference for portfolio and projects
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - For developers who want to contribute

## Technologies

- Next.js 15
- React 19
- TypeScript
- Framer Motion (animations)
- Material-UI
- Node.js
- GitHub REST API
- Docker & Docker Compose
- GitHub Actions

---

## License

ISC License

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

**Built with ❤️ using Next.js, TypeScript, and Material-UI**
