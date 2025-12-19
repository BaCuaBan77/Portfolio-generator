# Portfolio Website Generator

<p align="center">
  <img src="./Thumbnail.png" alt="Portfolio Website Thumbnail" width="700"/>
</p>

## Abstract

Let's be honest—you're busy building awesome projects, but updating your portfolio? That's always "on the list". When opportunity knocks (job applications, freelance gigs, or just showing off your work), you're stuck spending hours writing descriptions, grabbing screenshots, and manually updating everything. Sound familiar? 😅

This portfolio generator has your back! It automatically syncs with your GitHub repositories, pulls project details straight from your README files, and keeps everything fresh without you lifting a finger. You keep coding, and your portfolio stays updated. It's that simple.

**Key Features:**

- 🚀 **Automatic GitHub Integration** - Syncs your repos weekly and shows off both public and private projects (just add a token). Your portfolio grows as you code!
- 🎯 **Smart README Parsing** - Already wrote a great README? Perfect! This tool grabs descriptions, images, tech stacks, and abstracts from your existing files. Write once, use everywhere.
- 🎨 **Configurable Page Styles** - Pick from sleek, professionally designed layouts, and you can switch themes in seconds with one environment variable. Current supported styles are:
  - Warm Minimalism (Default)
  - Aesthetic
  - More are coming soon!

## 🚀 Quick Start

For detailed deployment instructions, see the **[User Manual](./docs/USER_MANUAL.md)**.

The quick overview:

1. Initialize a git repository and copy example configuration files from the `config` folder
2. Modify `portfolio.json` and `projects.json` with your information
3. Copy `docker-compose.yml` to your repository
4. Push to GitHub in a private repository
5. On your deployment server: clone the repo, create `.env` file, set permissions, and run `docker-compose up -d`

**📖 Full Step-by-Step Guide:** See [docs/USER_MANUAL.md](./docs/USER_MANUAL.md) for complete deployment instructions.

---

## 🌐 Make Your Website Public

Once your container is running locally or on a server, you’ll probably want others to see it.. 🌍
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

- **[User Manual](./docs/USER_MANUAL.md)** - Step-by-step deployment and setup guide
- **[AWS EC2 + Namecheap Setup](./docs/AWS_EC2_NAMECHEAP_SETUP.md)** - Detailed guide for deploying on AWS EC2 with custom domain
- **[Configuration Guide](./docs/CONFIGURATION.md)** - Complete configuration reference for portfolio and projects
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - For developers who want to contribute
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)** - Solutions to common issues and errors

## 🔧 Troubleshooting

Encountering issues? Check out our **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)** for solutions to common problems including:

- Permission denied errors when syncing with GitHub
- Server Action errors and build cache issues
- And more...

---

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
