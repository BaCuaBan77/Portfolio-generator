# 🚀 User Manual - General Deployment

The easiest way to get started is using the pre-built Docker image:

## Prerequisites

- Docker and Docker Compose installed ([Get Docker](https://docs.docker.com/get-docker/))
- A GitHub account
- A Linux server (for deployment)

## Deployment Instructions

### Step 1: Initialize Git Repository and Setup Configuration (On Your Local PC)

> **Note:** This step is performed on your local PC/workstation, not on the server. This allows you to use **VSCode** or any text editor to easily edit the JSON configuration files.

1. **Create a new project in VS Code:**

   - Open VS Code
   - Create a new project/folder called `my-portfolio`
   - Create a folder called `config` inside the project

2. **Download configuration files:**

   In the VS Code terminal, download the configuration files from the repository:

```bash
# Navigate to the config folder
cd config

# Download portfolio.json and projects.json from the repository
curl -o portfolio.json https://raw.githubusercontent.com/BaCuaBan77/Portfolio-generator/main/config/portfolio.json
curl -o projects.json https://raw.githubusercontent.com/BaCuaBan77/Portfolio-generator/main/config/projects.json

# Go back to project root
cd ..

# Download docker-compose.yml
curl -o docker-compose.yml https://raw.githubusercontent.com/BaCuaBan77/Portfolio-generator/main/docker/docker-compose.yml

# Add .env to .gitignore to avoid committing sensitive environment variables
echo ".env" >> .gitignore

```

3. **Initialize Git repository:**

```bash
# Initialize git repository
git init
```

4. **Prepare your portfolio content:**

Edit `portfolio.json` with your personal information

> [!TIP]
> For step-by-step guidance, see the [Portfolio Configuration](./CONFIGURATION.md#portfolio-configuration) section:

- Name, title, short bio, motto, bio, email
- GitHub username (for automatic repo syncing)
- Domains (industry sectors: FinTech, Healthcare, Defense, etc.)
- Skills (organized by category: Languages, Frameworks, Tools)
- Work experience
- Certifications
- Education
- Social links

Edit `projects.json` to customize your projects:

> [!TIP]
> For step-by-step guidance, see the [Project Configuration](./CONFIGURATION.md#projects-configuration) section:

- **Personal Projects**: Automatically synced from your GitHub repos (requires README with "Abstract" section)
- **Professional Projects**: Add manually to showcase work projects or NDA projects
- **Project Images**: Add screenshots to `config/project-images/` and reference them as `config/project-images/filename.png`

**Add images to your portfolio:**

- **Profile Picture**: You only need to add one profile photo to the `config/profile-pic/` directory. The file name does not matter; the system uses whichever image you add. If you don't add a profile picture, your GitHub avatar will be used automatically (not recommended due to lower image quality).
- **Project Images**: Add project screenshots or images to the `config/project-images/` directory. Reference them in your `projects.json` file as `config/project-images/${filename}}.${extension}`.

5. **Commit and push to GitHub:**

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial portfolio configuration"

# Add remote repository (create a private repository on GitHub first)
git remote add origin https://github.com/your-username/my-portfolio.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy on Your Server

> **Note:** This step is performed on your deployment server (Linux server recommended).

> [!TIP]
> For AWS EC2 + Namecheap + NGINX Proxy Manager setup, refer to [this document](./AWS_EC2_NAMECHEAP_SETUP.md) for more details

1. **Clone the repository on your deployment server:**

```bash
# Clone your private repository
git clone https://github.com/your-username/my-portfolio.git
cd my-portfolio
```

2. **Create `.env` file:**

Create a `.env` file in the root of your repository with the following content:

```env
GITHUB_TOKEN=your_github_token         # For syncing repos (recommended)
PORTFOLIO_STYLE=default                # Page style: 'default' or 'aesthetic'
THEME=light                            # Layout theme for Default style: 'light' or 'dark'
SYNC_INTERVAL_DAYS=7                   # How often to sync (days)
PORT=3000                              # Port number (default: 3000)
```

> [!WARNING]
> Make sure to add `.env` to your `.gitignore` file to keep your secrets safe!

3. **Set permissions for config folder:**

```bash
chmod -R 777 ./config
```

4. **Start the container:**

```bash
docker-compose up -d
```

5. **Verify deployment:**

Visit `http://your-server-ip:3000` or your configured domain 🎉

> [!TIP]
> If your server is on the cloud, you need to forward ports and add firewall rules.

> [!TIP]
> If there are any problems, refer to [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

Your portfolio will automatically sync with your GitHub repositories!

---

## Updating Your Portfolio

> [!Note]
> All personal projects in your GitHub account that include an accepted README schema (with an "Abstract" section, as described in the configuration guide) will be automatically synced to your portfolio—no manual updates needed for these projects!

This section covers how to update your **professional projects** (manually added projects), your main portfolio details (such as name, bio, skills, education, etc.), or any other configuration files. Follow these steps whenever you make changes to your configuration or add new professional projects.

After making changes to your configuration files on your local PC (using VSCode or any text editor):

1. **On your local PC, commit and push changes:**

```bash
git add config/
git commit -m "Update portfolio configuration"
git push
```

2. **On your deployment server, pull the latest changes:**

```bash
cd your-portfolio-repo
git pull
```

3. Verify the updates in your portfolio. Everything should be updated automatically without any restarts

---

**📖 Complete Configuration Guide:** See [docs/CONFIGURATION.md](./CONFIGURATION.md) for:

- Detailed field explanations
- How to add professional projects manually
- GitHub token setup (for private repos)
- Custom styling options
- Best practices and examples
