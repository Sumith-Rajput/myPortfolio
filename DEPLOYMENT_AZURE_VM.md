# Azure VM Deployment Guide

## Quick Start

Deploy your React portfolio website to Azure VM (4.242.17.165)

### Prerequisites

1. SSH access to your Azure VM
2. Project files either:
   - Already on the VM, or
   - Transferred via SCP/Git

### Option 1: Deploy from Local Machine

1. **Transfer files to VM:**
   ```bash
   scp -r . azureuser@4.242.17.165:/tmp/portfolio-app
   scp deploy-azure-vm.sh azureuser@4.242.17.165:/tmp/
   ```

2. **SSH into VM:**
   ```bash
   ssh azureuser@4.242.17.165
   ```

3. **Move files and run script:**
   ```bash
   sudo mv /tmp/portfolio-app /var/www/portfolio-app
   sudo mv /tmp/deploy-azure-vm.sh /var/www/portfolio-app/
   cd /var/www/portfolio-app
   sudo chmod +x deploy-azure-vm.sh
   sudo ./deploy-azure-vm.sh
   ```

### Option 2: Deploy from VM

1. **SSH into VM:**
   ```bash
   ssh azureuser@4.242.17.165
   ```

2. **Clone or transfer your project:**
   ```bash
   # Option A: Clone from Git
   git clone <your-repo-url> /var/www/portfolio-app
   
   # Option B: Upload via SCP from local machine first
   ```

3. **Run deployment script:**
   ```bash
   cd /var/www/portfolio-app
   sudo chmod +x deploy-azure-vm.sh
   sudo ./deploy-azure-vm.sh
   ```

## What the Script Does

1. ✅ Installs Node.js 20.x and npm
2. ✅ Installs nginx web server
3. ✅ Installs PM2 process manager
4. ✅ Copies project files to `/var/www/portfolio-app`
5. ✅ Installs frontend and backend dependencies
6. ✅ Builds React application
7. ✅ Configures nginx to serve React app and proxy API calls
8. ✅ Sets up PM2 to run backend server
9. ✅ Configures firewall rules
10. ✅ Starts all services

## Access Your Website

After deployment, your portfolio will be available at:
- **Frontend:** http://4.242.17.165
- **Backend API:** http://4.242.17.165/api

## Troubleshooting

### Check Service Status

```bash
# Check nginx
sudo systemctl status nginx

# Check backend
pm2 list
pm2 logs portfolio-backend

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart backend
pm2 restart portfolio-backend

# Restart nginx
sudo systemctl restart nginx
```

### Update Application

```bash
cd /var/www/portfolio-app
git pull  # If using Git
npm install
npm run build
pm2 restart portfolio-backend
sudo systemctl reload nginx
```

### Port Issues

If port 80 is already in use:
```bash
# Check what's using port 80
sudo lsof -i :80

# Or change nginx port in /etc/nginx/sites-available/portfolio
```

### File Permissions

If you see permission errors:
```bash
sudo chown -R www-data:www-data /var/www/portfolio-app
sudo chmod -R 755 /var/www/portfolio-app
```

## Manual Configuration

If the script fails, you can manually configure:

### 1. Install Dependencies
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
```

### 2. Build Application
```bash
cd /var/www/portfolio-app
npm install
cd backend && npm install && cd ..
npm run build
```

### 3. Start Backend
```bash
cd /var/www/portfolio-app
pm2 start backend/server.js --name portfolio-backend
pm2 save
pm2 startup
```

### 4. Configure Nginx
Edit `/etc/nginx/sites-available/portfolio` (see script for config)

### 5. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Security Notes

- The script sets up basic security headers
- Consider adding SSL/HTTPS with Let's Encrypt
- Update firewall rules as needed
- Keep Node.js and npm updated
- Regularly update system packages

## Next Steps

1. **Set up domain name** (optional): Point DNS to 4.242.17.165
2. **Add SSL certificate** (recommended): Use Let's Encrypt
3. **Configure monitoring**: Set up PM2 monitoring
4. **Backup strategy**: Regular backups of `/var/www/portfolio-app` and `/var/log/portfolio`

