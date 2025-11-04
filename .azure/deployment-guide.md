# Azure DevOps Deployment Guide

This guide will help you deploy your portfolio application to Azure using Azure DevOps.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **Azure DevOps Organization**: Create one at https://dev.azure.com
3. **Azure Resources**: 
   - Azure App Service (for backend)
   - Azure Static Web Apps (for frontend) OR Azure App Service

## Step 1: Create Azure Resources

### Option A: Using Azure Portal

1. **Create App Service for Backend**:
   - Go to Azure Portal → Create Resource → Web App
   - Name: `your-portfolio-backend`
   - Runtime stack: Node.js 18 LTS
   - Operating System: Linux
   - Region: Choose closest to you
   - App Service Plan: Create new (Free tier available for testing)

2. **Create Static Web App for Frontend**:
   - Go to Azure Portal → Create Resource → Static Web App
   - Name: `your-portfolio-frontend`
   - Deployment details: Select "Other" for deployment source
   - Note the deployment token

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create Resource Group
az group create --name portfolio-rg --location eastus

# Create App Service Plan
az appservice plan create --name portfolio-plan --resource-group portfolio-rg --sku FREE --is-linux

# Create Backend App Service
az webapp create --resource-group portfolio-rg --plan portfolio-plan --name your-portfolio-backend --runtime "NODE:18-lts"

# Create Static Web App
az staticwebapp create --name your-portfolio-frontend --resource-group portfolio-rg --location eastus
```

## Step 2: Set Up Azure DevOps

1. **Create a New Project**:
   - Go to https://dev.azure.com
   - Create a new project called "portfolio-app"

2. **Connect Repository**:
   - Go to Repos → Import
   - Import from GitHub: `https://github.com/Sumith-Rajput/myPortfolio`

3. **Create Service Connection**:
   - Go to Project Settings → Service Connections
   - Create new → Azure Resource Manager
   - Authentication: Managed Identity or Service Principal
   - Select your subscription and resource group

4. **Create Variable Group**:
   - Go to Pipelines → Library
   - Create Variable Group: `portfolio-variables`
   - Add variables:
     - `azureSubscription`: Your service connection name
     - `azureAppServiceName`: Your backend app service name (e.g., `your-portfolio-backend`)
     - `azureStaticWebAppSecret`: Your Static Web App deployment token
     - `VITE_API_URL`: Your backend API URL (e.g., `https://your-portfolio-backend.azurewebsites.net/api`)

## Step 3: Configure Pipeline

1. **Create Pipeline**:
   - Go to Pipelines → New Pipeline
   - Select your repository (GitHub)
   - Choose "Existing Azure Pipelines YAML file"
   - Select `azure-pipelines.yml` or `azure-pipelines-simple.yml`

2. **Update Pipeline Variables**:
   - Edit the pipeline YAML file if needed
   - Update service connection names and app names

## Step 4: Configure Backend App Service

1. **Set Environment Variables**:
   - Go to Azure Portal → Your App Service → Configuration
   - Add Application Settings:
     - `PORT`: `8080` (or leave default)
     - `NODE_ENV`: `production`

2. **Set Startup Command**:
   - Go to Configuration → General Settings
   - Startup Command: `node server.js`

3. **Enable CORS** (if needed):
   - Add CORS allowed origins in Azure Portal or configure in code

## Step 5: Configure Frontend

1. **Update API URL**:
   - Update `VITE_API_URL` in pipeline variables to point to your backend
   - Or update it in `.env` file before building

2. **Static Web App Configuration**:
   - Create `staticwebapp.config.json` in root if using Static Web Apps:
   ```json
   {
     "routes": [
       {
         "route": "/*",
         "serve": "/index.html",
         "statusCode": 200
       }
     ],
     "navigationFallback": {
       "fallback": "/index.html"
     }
   }
   ```

## Step 6: Run Pipeline

1. **Manual Trigger**:
   - Go to Pipelines → Run Pipeline
   - Select your branch (main)
   - Click Run

2. **Automatic Trigger**:
   - Pipeline will automatically run on pushes to main branch

## Troubleshooting

### Backend Issues

- **Port Configuration**: Ensure your backend listens on the port provided by Azure (process.env.PORT)
- **Missing Dependencies**: Check that all dependencies are in package.json
- **CORS Errors**: Configure CORS in your Express server to allow your frontend domain

### Frontend Issues

- **API URL**: Ensure VITE_API_URL is set correctly in pipeline variables
- **Build Failures**: Check Node version compatibility
- **Static Web App**: Ensure deployment token is correct

### Common Fixes

1. **Update server.js to use PORT from environment**:
   ```javascript
   const PORT = process.env.PORT || 3001;
   ```

2. **Add CORS configuration in backend**:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true
   }));
   ```

## Next Steps

- Set up custom domain
- Configure SSL certificates
- Set up monitoring and logging
- Configure CI/CD for multiple environments (dev, staging, prod)

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure DevOps Pipelines](https://docs.microsoft.com/azure/devops/pipelines/)

