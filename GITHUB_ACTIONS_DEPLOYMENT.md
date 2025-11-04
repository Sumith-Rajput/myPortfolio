# GitHub Actions Deployment Guide

This guide will help you deploy your portfolio application to Azure using GitHub Actions.

## Quick Start

### 1. Create Azure Resources

#### Option A: Azure Portal (Recommended)

1. **Backend - Azure App Service**:
   - Go to Azure Portal → Create Resource → Web App
   - Name: `yourname-portfolio-api`
   - Runtime stack: Node.js 18 LTS
   - OS: Linux
   - Plan: Free (F1) or Basic (B1)

2. **Frontend - Azure Static Web App**:
   - Go to Azure Portal → Create Resource → Static Web App
   - Name: `yourname-portfolio`
   - Deployment: GitHub
   - Connect to your GitHub account
   - Select repository: `Sumith-Rajput/myPortfolio`
   - Branch: `main`
   - Build Presets: Custom
   - App location: `/`
   - Output location: `dist`
   - API location: Leave empty (backend is separate)

#### Option B: Azure CLI

```bash
# Login to Azure
az login

# Create Resource Group
az group create --name portfolio-rg --location eastus

# Create App Service Plan
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

### 2. Get Azure Credentials

#### For Backend (App Service):

**Option 1: Publish Profile (Easier)**
1. Go to Azure Portal → Your App Service
2. Get Publish Profile → Download
3. Copy the contents

**Option 2: Service Principal (More Secure)**
```bash
az ad sp create-for-rbac --name "portfolio-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/portfolio-rg \
  --sdk-auth
```
Copy the JSON output.

#### For Frontend (Static Web App):

1. Go to Azure Portal → Your Static Web App
2. Settings → Deployment tokens
3. Copy the deployment token

### 3. Configure GitHub Secrets

Go to your GitHub repository: `https://github.com/Sumith-Rajput/myPortfolio`

**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

#### Required Secrets:

1. **`AZURE_WEBAPP_NAME`**
   - Value: `yourname-portfolio-api` (your backend app service name)

2. **`AZURE_RESOURCE_GROUP`**
   - Value: `portfolio-rg` (your resource group name)

3. **`AZURE_CREDENTIALS`** (Service Principal method)
   - Value: The JSON output from the service principal creation
   - OR use `AZURE_WEBAPP_PUBLISH_PROFILE` (Publish Profile method)

4. **`AZURE_WEBAPP_PUBLISH_PROFILE`** (Alternative to AZURE_CREDENTIALS)
   - Value: Contents of the downloaded publish profile file

5. **`AZURE_STATIC_WEB_APPS_API_TOKEN`**
   - Value: Deployment token from Static Web App

6. **`VITE_API_URL`**
   - Value: `https://yourname-portfolio-api.azurewebsites.net/api`
   - This is your backend API URL

### 4. Configure Azure App Service

In Azure Portal → Your App Service → Configuration:

**Application Settings**:
```
NODE_ENV = production
FRONTEND_URL = https://yourname-portfolio.azurestaticapps.net
PORT = 8080 (or leave default)
```

**General Settings**:
- Startup Command: `node server.js`

### 5. Workflow Files

The repository includes these workflow files:

- **`.github/workflows/deploy.yml`** - Complete deployment (frontend + backend)
- **`.github/workflows/deploy-frontend.yml`** - Frontend only
- **`.github/workflows/deploy-backend.yml`** - Backend only
- **`.github/workflows/ci.yml`** - CI pipeline for testing

### 6. Trigger Deployment

Once secrets are configured:

1. **Automatic**: Push to `main` branch triggers deployment
2. **Manual**: Go to Actions tab → Select workflow → Run workflow

## Workflow Details

### Combined Deployment (`deploy.yml`)

This workflow:
1. Builds frontend (React)
2. Builds backend (Node.js)
3. Deploys backend to Azure App Service
4. Deploys frontend to Azure Static Web Apps

### Separate Workflows

- **`deploy-frontend.yml`**: Only deploys frontend (triggers on frontend file changes)
- **`deploy-backend.yml`**: Only deploys backend (triggers on backend file changes)

### CI Pipeline (`ci.yml`)

Runs on:
- Pull requests to main
- Pushes to main

Validates:
- Dependencies installation
- Frontend build
- Backend setup

## Troubleshooting

### Backend Deployment Fails

**Error: "Failed to deploy"**
- Check `AZURE_WEBAPP_NAME` secret matches your app service name
- Verify `AZURE_CREDENTIALS` or `AZURE_WEBAPP_PUBLISH_PROFILE` is correct
- Ensure `AZURE_RESOURCE_GROUP` is correct

**Error: "Startup command failed"**
- Check startup command in Azure Portal: `node server.js`
- Verify Node.js version is 18 LTS
- Check Application Insights logs in Azure Portal

### Frontend Deployment Fails

**Error: "Invalid API token"**
- Regenerate deployment token in Static Web App
- Update `AZURE_STATIC_WEB_APPS_API_TOKEN` secret

**Error: "Build failed"**
- Check `VITE_API_URL` secret is set correctly
- Verify build works locally: `npm run build`
- Check workflow logs for specific errors

### CORS Issues

If frontend can't connect to backend:
1. Update `FRONTEND_URL` in App Service configuration
2. Verify CORS in `backend/server.js` allows your frontend URL
3. Check backend logs in Azure Portal

### Environment Variables

**Backend** (Azure App Service):
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your frontend URL
- `PORT`: Azure sets this automatically

**Frontend** (Build time):
- `VITE_API_URL`: Your backend API URL (set in GitHub secrets)

## Manual Deployment (Alternative)

If you prefer to deploy manually:

### Backend
```bash
# Install Azure CLI
az login

# Deploy
az webapp deployment source config-zip \
  --resource-group portfolio-rg \
  --name yourname-portfolio-api \
  --src backend.zip
```

### Frontend
```bash
# Build
npm run build

# Deploy to Static Web App
az staticwebapp deploy \
  --name yourname-portfolio \
  --resource-group portfolio-rg \
  --app-location "/" \
  --output-location "dist"
```

## Monitoring

- **Backend**: Azure Portal → App Service → Log stream
- **Frontend**: Azure Portal → Static Web App → Deployment history
- **GitHub Actions**: Repository → Actions tab

## Next Steps

- [ ] Set up custom domain
- [ ] Configure SSL certificates
- [ ] Set up Application Insights
- [ ] Configure staging environment
- [ ] Add automated testing to CI pipeline
- [ ] Set up monitoring and alerts

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [Azure Login Action](https://github.com/Azure/login)

## Support

For issues:
1. Check workflow logs in GitHub Actions
2. Review Azure Portal logs
3. Verify all secrets are set correctly
4. Check this guide's troubleshooting section

