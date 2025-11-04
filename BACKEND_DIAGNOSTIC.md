# Backend API Diagnostic Guide

## Quick Test URLs

When you access these URLs in your browser, here's what should happen:

### ✅ Should Work:
1. **Root**: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/`
   - Should return JSON with API information

2. **Health Check**: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health`
   - Should return: `{"status":"ok","message":"Portfolio API is running"}`

3. **Personal Info**: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/personal`
   - Should return your personal data

### ❌ Will Return 404:
- `/api` (without specific endpoint) - This is expected! There's no route for just `/api`

## Troubleshooting Steps

### Step 1: Check Azure App Service Status

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: **App Services** → `sumith-portfolio-api-g3dra2a9g6haaxev`
3. Check **Overview**:
   - Status should be **"Running"**
   - If it shows "Stopped", click **Start**

### Step 2: Check Application Logs

1. In Azure Portal → Your App Service
2. Go to **Log stream** (under Monitoring)
3. Look for:
   - `🚀 Backend server running on http://localhost:PORT`
   - Any error messages
   - If you see errors about missing files or modules, the deployment didn't complete

### Step 3: Verify Startup Command

1. Azure Portal → App Service → **Configuration** → **General settings**
2. Check **Startup Command**:
   - Should be: `node server.js`
   - If empty or different, update it

### Step 4: Check Application Settings

1. Azure Portal → App Service → **Configuration** → **Application settings**
2. Verify these settings exist:
   - `FRONTEND_URL` = `https://ambitious-mud-099772e10.3.azurestaticapps.net`
   - `NODE_ENV` = `production`
   - `PORT` (usually auto-set by Azure, but can be explicit)

### Step 5: Check Deployed Files

1. Azure Portal → App Service → **Development Tools** → **Console**
2. Run: `ls -la`
3. You should see:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `data.json`
   - `node_modules/` folder

### Step 6: Test Locally

If the Azure deployment isn't working, test locally first:

```bash
cd backend
npm install
node server.js
```

Then test: `http://localhost:3001/api/health`

## Common Issues and Fixes

### Issue 1: "Cannot find module"
**Solution**: 
- Check that `package.json` exists in backend folder
- Verify `node_modules` was deployed
- In Azure Portal → Console, run: `npm install --production`

### Issue 2: "Port already in use"
**Solution**: 
- Azure sets PORT automatically via environment variable
- Your code uses `process.env.PORT || 3001` which is correct
- No action needed

### Issue 3: "Cannot find data.json"
**Solution**: 
- Verify `data.json` exists in backend folder
- Check file permissions in Azure Console

### Issue 4: Server not starting
**Solution**:
1. Check logs for errors
2. Verify startup command: `node server.js`
3. Try restarting the App Service

## Manual Fix: Restart and Redeploy

If nothing works, try this:

1. **Stop** the App Service
2. Wait 30 seconds
3. **Start** the App Service
4. Wait 1-2 minutes for startup
5. Test the health endpoint again

Or trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger backend redeployment"
git push origin main
```

## Contact Points

- **Backend URL**: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net`
- **Health Check**: Add `/api/health` to the URL
- **Frontend URL**: `https://ambitious-mud-099772e10.3.azurestaticapps.net`

