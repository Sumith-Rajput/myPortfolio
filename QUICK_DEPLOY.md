# Quick Deployment Guide

## Deploy to Azure VM (4.242.17.165)

### Steps:

1. **Transfer files to VM:**
   ```bash
   # From your local machine
   scp -r . azureuser@4.242.17.165:/tmp/portfolio-app
   scp deploy-azure-vm.sh azureuser@4.242.17.165:/tmp/
   ```

2. **SSH into VM:**
   ```bash
   ssh azureuser@4.242.17.165
   ```

3. **Run deployment script:**
   ```bash
   sudo mv /tmp/portfolio-app /var/www/portfolio-app
   sudo mv /tmp/deploy-azure-vm.sh /var/www/portfolio-app/
   cd /var/www/portfolio-app
   sudo chmod +x deploy-azure-vm.sh
   sudo ./deploy-azure-vm.sh
   ```

4. **Access your website:**
   - Open: http://4.242.17.165

### What Gets Installed:

- Node.js 20.x
- npm
- nginx (web server)
- PM2 (process manager)

### What Gets Configured:

- React app built and served via nginx
- Backend API running on port 3001 via PM2
- nginx reverse proxy for `/api` routes
- Firewall rules for ports 80, 443, 3001
- Services auto-start on boot

### Useful Commands After Deployment:

```bash
# Check backend status
pm2 list
pm2 logs portfolio-backend

# Check nginx status
sudo systemctl status nginx

# Restart services
pm2 restart portfolio-backend
sudo systemctl restart nginx

# Update application
cd /var/www/portfolio-app
git pull  # if using git
npm run build
pm2 restart portfolio-backend
sudo systemctl reload nginx
```

### Troubleshooting:

- **Website not loading?** Check nginx: `sudo systemctl status nginx`
- **API not working?** Check backend: `pm2 logs portfolio-backend`
- **Port already in use?** Check: `sudo lsof -i :80`

For detailed information, see `DEPLOYMENT_AZURE_VM.md`

