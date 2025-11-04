# Azure DevOps Deployment Guide

Quick guide to deploy your portfolio app to Azure using Azure DevOps.

## Quick Start

### 1. Create Azure Resources

#### Option 1: Azure Portal (Recommended for beginners)

1. **Backend (App Service)**:
   - Portal → Create Resource → Web App
   - Name: `yourname-portfolio-api`
   - Runtime: Node.js 18 LTS
   - OS: Linux
   - Plan: Free (F1) or Basic (B1)

2. **Frontend (Static Web App)**:
   - Portal → Create Resource → Static Web App
   - Name: `yourname-portfolio`
   - Deployment: Other (we'll use Azure DevOps)
   - Copy the deployment token

#### Option 2: Azure CLI

```bash
# Login
az login

# Create resource group
az group create --name portfolio-rg --location eastus

# Create App Service Plan (Free tier)
az appservice plan create \
  --name portfolio-plan \
  --resource-group portfolio-rg \
  --sku FREE \
  --is-linux

# Create Backend App Service
az webapp create \
  --resource-group portfolio-rg \
  --plan portfolio-plan \
  --name yourname-portfolio-api \
  --runtime "NODE:18-lts"

# Create Static Web App
az staticwebapp create \
  --name yourname-portfolio \
  --resource-group portfolio-rg \
  --location eastus
```

### 2. Set Up Azure DevOps

1. **Create Project**:
   - Go to https://dev.azure.com
   - New Project → Name: "portfolio-app"

2. **Import Repository**:
   - Repos → Import → GitHub
   - Repository: `Sumith-Rajput/myPortfolio`

3. **Create Service Connection**:
   - Project Settings → Service Connections → New
   - Azure Resource Manager → Service Principal
   - Select subscription and resource group
   - Name it: `Azure-Subscription`

4. **Create Variable Group**:
   - Pipelines → Library → Variable Group
   - Name: `portfolio-variables`
   - Variables to add:
     ```
     azureSubscription: Azure-Subscription
     azureAppServiceName: yourname-portfolio-api
     azureStaticWebAppSecret: <paste-your-static-web-app-token>
     VITE_API_URL: https://yourname-portfolio-api.azurewebsites.net/api
     ```

### 3. Create Pipeline

1. **New Pipeline**:
   - Pipelines → New Pipeline
   - GitHub → Select `Sumith-Rajput/myPortfolio`
   - Existing Azure Pipelines YAML file
   - Path: `azure-pipelines-simple.yml`

2. **Review and Run**:
   - Review the pipeline
   - Save and run

### 4. Configure Backend App Service

In Azure Portal → Your App Service → Configuration:

**Application Settings**:
```
NODE_ENV = production
FRONTEND_URL = https://yourname-portfolio.azurestaticapps.net
```

**General Settings**:
- Startup Command: `node server.js`

### 5. Update Frontend API URL

The pipeline uses `VITE_API_URL` from variables. Make sure it points to your backend:
```
https://yourname-portfolio-api.azurewebsites.net/api
```

## Pipeline Files

- `azure-pipelines.yml` - Full pipeline with separate stages
- `azure-pipelines-simple.yml` - Simplified single-stage pipeline (recommended)

## Troubleshooting

### Backend won't start
- Check startup command: `node server.js`
- Verify Node.js version: 18 LTS
- Check logs: App Service → Log stream

### Frontend can't connect to backend
- Verify CORS is configured in backend
- Check `VITE_API_URL` in pipeline variables
- Ensure backend URL is accessible

### Build fails
- Check Node.js version in pipeline
- Verify all dependencies in package.json
- Check build logs in Azure DevOps

## Manual Deployment (Alternative)

If you prefer manual deployment:

### Backend
```bash
# Zip the backend folder
cd backend
zip -r ../backend.zip .

# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group portfolio-rg \
  --name yourname-portfolio-api \
  --src backend.zip
```

### Frontend
```bash
# Build frontend
npm run build

# Deploy to Static Web App
az staticwebapp deploy \
  --name yourname-portfolio \
  --resource-group portfolio-rg \
  --app-location "/" \
  --output-location "dist"
```

## Next Steps

- [ ] Set up custom domain
- [ ] Configure SSL certificates
- [ ] Set up monitoring
- [ ] Configure staging environment
- [ ] Set up automated testing

## Support

For detailed information, see `.azure/deployment-guide.md`

