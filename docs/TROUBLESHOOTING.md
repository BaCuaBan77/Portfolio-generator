# Troubleshooting Guide

This guide helps you resolve common issues when running the Portfolio Website Generator.

## Permission Denied Error When Syncing

If you encounter an error like `EACCES: permission denied, open '/app/config/projects.json'` when the GitHub sync runs, this is a file permissions issue. The container runs as user `nextjs` (uid 1001), but the mounted `config` directory may have different ownership.

### Fix the permissions on your host machine:

```bash
# Navigate to your portfolio directory
cd my-portfolio

# Fix ownership (replace 1001 with the container's user ID if different)
sudo chown -R 1001:1001 config/

# Or make the directory writable by the group
sudo chmod -R 775 config/
```

### Alternative: Fix permissions using Docker (if you have root access):

```bash
# Stop the container
docker-compose down

# Fix permissions by running a temporary container
docker run --rm -v "$(pwd)/config:/app/config" -u root \
  bacuaban77/portfolio-generator:latest \
  chown -R 1001:1001 /app/config

# Start the container again
docker-compose up -d
```

**Note:** After fixing permissions, restart the container:

```bash
docker-compose restart
```

## Server Action Error

If you encounter an error like `Failed to find Server Action "x"` or similar Next.js build errors, this is typically caused by a corrupted or stale build cache in the `.next` directory.

### Solution: Rebuild the Docker container

```bash
# Stop and remove the container
docker-compose down

# Remove the old image (optional, but recommended for a clean rebuild)
docker rmi bacuaban77/portfolio-generator:latest

# Pull the latest image and start fresh
docker-compose pull
docker-compose up -d
```

### If you're building from source:

```bash
# Stop the container
docker-compose down

# Remove the .next build directory (if it exists in your project)
rm -rf .next

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

**Note:** This error can also occur if the container was interrupted during a build. A clean rebuild usually resolves it.

