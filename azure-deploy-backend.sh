#!/bin/bash
# Azure App Service deployment script for backend
# This script can be used as a custom deployment script in Azure App Service

echo "Starting backend deployment..."

# Install production dependencies
cd backend
npm ci --production

echo "Backend deployment completed successfully!"

