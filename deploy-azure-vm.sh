#!/bin/bash

# Azure VM Deployment Script for React Portfolio Website
# This script sets up your portfolio website on Azure VM (4.242.17.165)
# Usage: ./deploy-azure-vm.sh

set -e  # Exit on error

VM_IP="4.242.17.165"
APP_DIR="/var/www/portfolio-app"
APP_USER="www-data"
BACKEND_PORT=3001
FRONTEND_PORT=80

echo "=========================================="
echo "🚀 Azure VM Portfolio Deployment Script"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install Node.js and npm
echo "📦 Installing Node.js and npm..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Verify Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Failed to install Node.js"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install nginx
echo "📦 Installing nginx..."
apt-get install -y nginx

# Install PM2 for process management
echo "📦 Installing PM2..."
npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
mkdir -p $APP_DIR
mkdir -p $APP_DIR/backend
mkdir -p $APP_DIR/build

# Copy project files (assuming script is run from project root)
echo "📋 Copying project files..."
if [ -d "." ]; then
    # Copy all files except node_modules and .git
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='build' \
        --exclude='.vscode' --exclude='*.log' \
        ./ $APP_DIR/
else
    echo "⚠️  Warning: Could not find project files in current directory"
    echo "   Please ensure you're running this script from the project root"
    echo "   Or manually copy files to $APP_DIR"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd $APP_DIR
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd $APP_DIR/backend
if [ -f "package.json" ]; then
    npm install
else
    echo "⚠️  Warning: backend/package.json not found"
fi

# Build React application
echo "🔨 Building React application..."
cd $APP_DIR
# Set API URL to use relative path for production
export VITE_API_URL="/api"
npm run build

if [ ! -d "$APP_DIR/build" ] || [ -z "$(ls -A $APP_DIR/build)" ]; then
    echo "❌ Build failed or build directory is empty"
    exit 1
fi

echo "✅ Build completed successfully"

# Create backend environment file
echo "📝 Creating backend environment file..."
cat > $APP_DIR/backend/.env << EOF
PORT=$BACKEND_PORT
NODE_ENV=production
FRONTEND_URL=http://$VM_IP
EOF

# Create PM2 ecosystem file
echo "📝 Creating PM2 configuration..."
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'portfolio-backend',
    script: './backend/server.js',
    cwd: '$APP_DIR',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: $BACKEND_PORT
    },
    error_file: '/var/log/portfolio/backend-error.log',
    out_file: '/var/log/portfolio/backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
EOF

# Create log directory
mkdir -p /var/log/portfolio
chown -R $APP_USER:$APP_USER /var/log/portfolio

# Configure nginx
echo "📝 Configuring nginx..."
cat > /etc/nginx/sites-available/portfolio << EOF
server {
    listen 80;
    server_name $VM_IP;
    
    root $APP_DIR/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API proxy to backend
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Serve static files
    location / {
        try_files \$uri \$uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Error pages
    error_page 404 /index.html;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🔍 Testing nginx configuration..."
nginx -t

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R $APP_USER:$APP_USER $APP_DIR
chmod -R 755 $APP_DIR

# Configure firewall
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow $BACKEND_PORT/tcp
    echo "✅ Firewall rules added"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --permanent --add-port=$BACKEND_PORT/tcp
    firewall-cmd --reload
    echo "✅ Firewall rules added"
else
    echo "⚠️  No firewall manager found. Please manually open ports 80, 443, and $BACKEND_PORT"
fi

# Start backend with PM2
echo "🚀 Starting backend server..."
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# Start and enable nginx
echo "🚀 Starting nginx..."
systemctl restart nginx
systemctl enable nginx

# Wait a moment for services to start
sleep 3

# Check services status
echo ""
echo "=========================================="
echo "📊 Service Status"
echo "=========================================="
echo ""

# Check nginx
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
fi

# Check backend
if pm2 list | grep -q "portfolio-backend.*online"; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not running"
    echo "   Check logs: pm2 logs portfolio-backend"
fi

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📍 Your portfolio website is now available at:"
echo "   http://$VM_IP"
echo ""
echo "🔧 Useful commands:"
echo "   - View backend logs: pm2 logs portfolio-backend"
echo "   - Restart backend: pm2 restart portfolio-backend"
echo "   - Restart nginx: sudo systemctl restart nginx"
echo "   - View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "   - Check nginx status: sudo systemctl status nginx"
echo "   - Update app: cd $APP_DIR && git pull && npm run build && pm2 restart portfolio-backend && sudo systemctl restart nginx"
echo ""
echo "📝 Files location:"
echo "   - Application: $APP_DIR"
echo "   - Build output: $APP_DIR/build"
echo "   - Backend: $APP_DIR/backend"
echo "   - Nginx config: /etc/nginx/sites-available/portfolio"
echo "   - PM2 config: $APP_DIR/ecosystem.config.js"
echo ""

