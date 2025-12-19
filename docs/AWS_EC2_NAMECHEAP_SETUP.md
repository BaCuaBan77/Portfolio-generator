# AWS EC2 + Namecheap Setup Guide

This guide will walk you through setting up your portfolio on AWS EC2 with a custom domain from Namecheap, including HTTPS setup using NGINX Proxy Manager (a web-based interface for managing Nginx reverse proxies and SSL certificates).

## Prerequisites

- An AWS account
- A domain purchased from Namecheap (or any domain registrar)

## Step 1: Launch an EC2 Instance

### 1.1 Create EC2 Instance

1. Log in to the [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **EC2** service
3. Click **Launch Instance**

### 1.2 Configure Instance

**Name and tags:**

- Name: `portfolio-server` (or your preferred name)

**Application and OS Images:**

- Choose **Debian** (recommended: Debian 12 or later)

**Instance type:**

- For a portfolio site, `t2.micro` (Free Tier eligible) or `t2.small` is sufficient

**Key pair:**

- Create a new key pair or select an existing one
- **Important:** Download the `.pem` file and store it securely
- You'll need this to SSH into your server

**Network settings:**

- Allow SSH traffic from your IP (or `0.0.0.0/0` for any IP - less secure)
- Allow HTTP traffic from anywhere (`0.0.0.0/0`)
- Allow HTTPS traffic from anywhere (`0.0.0.0/0`)

**Configure storage:**

- 8 GB (Free Tier) or 20 GB is sufficient

### 1.3 Launch Instance

1. Review your settings
2. Click **Launch Instance**
3. Wait for the instance to be in "Running" state

### 1.4 Get Your Instance Details

1. Note your instance's **Public IPv4 address** (e.g., `54.123.45.67`)
2. Note your instance's **Public IPv4 DNS** (e.g., `ec2-54-123-45-67.compute-1.amazonaws.com`)

## Step 2: Connect to Your EC2 Instance

### 2.1 SSH into Your Server

On Mac/Linux:

```bash
chmod 400 your-key.pem
ssh -i your-key.pem admin@your-ec2-public-ip
```

On Windows (using PowerShell or Git Bash):

```bash
ssh -i your-key.pem admin@your-ec2-public-ip
```

Replace:

- `your-key.pem` with your downloaded key file path
- `your-ec2-public-ip` with your instance's public IP address

### 2.2 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

## Step 3: Install Docker and Docker Compose

### 3.1 Install Docker

```bash
# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

### 3.2 Log Out and Log Back In

For the group changes to take effect:

```bash
exit
```

Then SSH back into your server.

## Step 4: Configure AWS Security Group

### 4.1 Update Security Group Rules

1. In AWS Console, go to **EC2** → **Security Groups**
2. Select your instance's security group
3. Click **Edit inbound rules**

**Add/Verify these rules:**

- **SSH (22)**: Your IP or `0.0.0.0/0` (less secure)
- **HTTP (80)**: `0.0.0.0/0` (for NGINX Proxy Manager)
- **HTTPS (443)**: `0.0.0.0/0` (for NGINX Proxy Manager)
- **Custom TCP (81)**: Your IP or `0.0.0.0/0` (for NGINX Proxy Manager admin interface - recommended to restrict to your IP for security)

4. Click **Save rules**

## Step 5: Configure Domain with Namecheap

### 5.1 Get Your EC2 Public IP

Make sure you have your EC2 instance's **Public IPv4 address** (e.g., `54.123.45.67`)

### 5.2 Configure DNS in Namecheap

1. Log in to your [Namecheap account](https://www.namecheap.com/)
2. Go to **Domain List** → Select your domain → **Manage**
3. Navigate to **Advanced DNS** tab

### 5.3 Add DNS Records

**Remove default records** (if any) and add these:

**A Record for Root Domain:**

- **Type**: A Record
- **Host**: `@`
- **Value**: Your EC2 Public IPv4 address (e.g., `54.123.45.67`)
- **TTL**: Automatic (or 30 min)

**Save all changes**

> **Note:** DNS propagation can take 24-48 hours, but usually completes within a few hours. You can check propagation status using tools like [whatsmydns.net](https://www.whatsmydns.net/)

## Step 6: Deploy Your Portfolio

### 6.1 Clone Your Repository

On your EC2 server:

```bash
# Clone your private repository
git clone https://github.com/your-username/my-portfolio.git
cd my-portfolio
```

### 6.2 Create `.env` File

```bash
nano .env
```

Add your environment variables:

```env
GITHUB_TOKEN=your_github_token
PORTFOLIO_STYLE=default
THEME=light
SYNC_INTERVAL_DAYS=7
PORT=3000
```

Save and exit (Ctrl+X, then Y, then Enter)

### 6.3 Set Permissions

```bash
chmod -R 777 ./config
```

### 6.4 Start Docker Container

```bash
docker compose up -d
```

### 6.5 Verify Deployment

Check if the container is running:

```bash
docker ps
```

You should see your portfolio container running.

## Step 7: Install NGINX Proxy Manager

NGINX Proxy Manager provides a web-based interface for managing reverse proxies and SSL certificates, making it much easier than manually configuring Nginx.

### 7.1 Create Directory for NGINX Proxy Manager Data

```bash
mkdir -p ~/nginx-proxy-manager/data
mkdir -p ~/nginx-proxy-manager/letsencrypt
cd ~/nginx-proxy-manager
```

### 7.2 Create Docker Compose File for NGINX Proxy Manager

```bash
nano docker-compose.yml
```

Add the following configuration:

```yaml
version: "3.8"

services:
  nginx-proxy-manager:
    image: "jc21/nginx-proxy-manager:latest"
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

Save and exit (Ctrl+X, then Y, then Enter)

### 7.3 Start NGINX Proxy Manager

```bash
docker compose up -d
```

### 7.4 Access NGINX Proxy Manager Web Interface

1. Open your web browser and navigate to: `http://your-ec2-public-ip:81`
2. You'll see the login page with default credentials:
   - **Email**: `admin@example.com`
   - **Password**: `changeme`
3. **Important:** Log in and change the default password immediately

### 7.5 Configure Your Domain in NGINX Proxy Manager

1. In the NGINX Proxy Manager interface, click **Proxy Hosts** → **Add Proxy Host**

2. Fill in the **Details** tab:

   - **Domain Names**: Enter your domain (e.g., `yourdomain.com`, `www.yourdomain.com`)
   - **Scheme**: `http`
   - **Forward Hostname/IP**: `portfolio` (container name - both containers will be on the default Docker network)
   - **Forward Port**: `3000`
   - **Cache Assets**: Enable (optional)
   - **Block Common Exploits**: Enable (recommended)
   - **Websockets Support**: Enable (recommended)

3. Click **SSL** tab:

   - **SSL Certificate**: Select **Request a new SSL Certificate**
   - **Force SSL**: Enable
   - **HTTP/2 Support**: Enable
   - **HSTS Enabled**: Enable (recommended)
   - **HSTS Subdomains**: Enable (optional)
   - **Accept Terms of Service**: Check the box

4. Click **Save**

> **Note:** The SSL certificate will be automatically requested and installed. This may take a few minutes. Make sure your DNS is properly configured and pointing to your server before requesting the certificate.

### 7.6 Verify SSL Certificate

After saving, wait a few minutes for the certificate to be issued. You should see a green checkmark next to your domain in the Proxy Hosts list. If there's an error, check that:

- Your DNS is properly configured and propagated
- Ports 80 and 443 are open in your AWS Security Group
- Your domain is pointing to the correct IP address

## Step 8: Verify Everything Works

### 8.1 Test Your Portfolio

1. Visit `http://yourdomain.com` - should redirect to HTTPS
2. Visit `https://yourdomain.com` - should show your portfolio

### 8.2 Check Logs (if needed)

```bash
# View portfolio container logs
cd ~/my-portfolio
docker compose logs -f

# View NGINX Proxy Manager logs
cd ~/nginx-proxy-manager
docker compose logs -f

# Or view logs via NGINX Proxy Manager web interface
# Go to http://your-ec2-public-ip:81 → System → Logs
```

## Troubleshooting

### Cannot Access Portfolio

1. **Check Security Group**: Ensure ports 80, 443, and 81 (NGINX Proxy Manager admin) are open
2. **Check Docker**: `docker ps` to see if containers are running (both portfolio and nginx-proxy-manager)
3. **Check NGINX Proxy Manager**: Access `http://your-ec2-public-ip:81` to verify it's running
4. **Check Proxy Host Configuration**: In NGINX Proxy Manager, verify your proxy host is configured correctly
5. **Check Logs**:
   - Portfolio: `cd ~/my-portfolio && docker compose logs`
   - NGINX Proxy Manager: Access via web interface at `http://your-ec2-public-ip:81` → System → Logs

### DNS Not Resolving

1. Wait for DNS propagation (can take up to 48 hours)
2. Check DNS records in Namecheap
3. Verify A records point to correct IP
4. Use `dig yourdomain.com` or `nslookup yourdomain.com` to check DNS

### SSL Certificate Issues

1. Ensure DNS is properly configured and propagated (wait 15-30 minutes after DNS changes)
2. Check that ports 80 and 443 are open in security group
3. In NGINX Proxy Manager web interface:
   - Go to **Proxy Hosts** → Select your domain → **SSL** tab
   - Check certificate status
   - If certificate failed, delete and recreate the proxy host, or manually request certificate again
4. Check NGINX Proxy Manager logs via web interface: **System** → **Logs**

### Container Not Starting

1. **Portfolio Container:**

   - Check `.env` file exists and has correct values
   - Check config folder permissions: `ls -la config/`
   - View container logs: `cd ~/my-portfolio && docker compose logs`
   - Verify container is running: `docker ps | grep portfolio`
   - Check container name is set to `portfolio` (required for NGINX Proxy Manager to reach it)

2. **NGINX Proxy Manager:**
   - View container logs: `cd ~/nginx-proxy-manager && docker compose logs`
   - Verify ports 80, 443, and 81 are not in use: `sudo netstat -tulpn | grep -E ':(80|443|81)'`
   - Verify both containers are on the same network: `docker network inspect bridge | grep -A 5 portfolio`

## Security Best Practices

1. **Restrict SSH Access**: In Security Group, limit SSH (port 22) to your IP only
2. **Secure NGINX Proxy Manager**:
   - Change default admin password immediately
   - Consider restricting access to port 81 (NGINX Proxy Manager admin) to your IP only in Security Group
3. **Use Strong Passwords**: For NGINX Proxy Manager and any other services
4. **Keep System Updated**: Regularly run `sudo apt update && sudo apt upgrade`
5. **Monitor Logs**: Regularly check application and system logs via NGINX Proxy Manager web interface
6. **Backup Configuration**:
   - Keep your config files backed up in your private GitHub repo
   - Backup NGINX Proxy Manager data: `~/nginx-proxy-manager/data` directory
7. **Remove Direct Port Access**: After setting up NGINX Proxy Manager, you can remove port 3000 from Security Group since all traffic goes through ports 80/443

## Next Steps

- Your portfolio is now live at `https://yourdomain.com`!
- Updates to your portfolio configuration will automatically sync when you push to GitHub and pull on the server
- SSL certificates will auto-renew automatically via NGINX Proxy Manager (uses Let's Encrypt)
- Access NGINX Proxy Manager admin panel at `http://your-ec2-public-ip:81` to manage your proxy hosts and SSL certificates

For more information, refer to:

- [User Manual](./USER_MANUAL.md) - General deployment guide

- [Configuration Guide](./CONFIGURATION.md) - Configuration guide for porfolio, projects, and .env file

- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions
