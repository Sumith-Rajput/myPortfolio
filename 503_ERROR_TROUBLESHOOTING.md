# Troubleshooting 503 Service Unavailable Error

## What is a 503 Error?

A **503 Service Unavailable** error means:
- Azure App Service is running
- But your Node.js backend server is **not responding**
- This usually means the server crashed or failed to start

## Common Causes

### 1. **Server Failed to Start (Most Common)**
- Missing `data.json` file
- Invalid JSON in `data.json`
- Missing dependencies (`node_modules` not deployed)
- Server crashed during startup

### 2. **Port Binding Issues**
- Port already in use
- Wrong port configuration
- Azure PORT environment variable not set

### 3. **Missing Files**
- `data.json` not deployed
- `server.js` not found
- `package.json` missing

### 4. **Application Crashed**
- Runtime error in server code
- Uncaught exception
- Memory issues

## Immediate Fixes

### Step 1: Check Azure Log Stream

1. Go to **Azure Portal** → **App Services**
2. Select: `sumith-portfolio-api-g3dra2a9g6haaxev`
3. Go to **Log stream** (under Monitoring)
4. Look for:
   - ✅ `✅ data.json file found and valid` - Good!
   - ✅ `🚀 Backend server running on port XXXX` - Good!
   - ❌ `❌ CRITICAL: data.json file missing or invalid` - Problem!
   - ❌ `❌ Server failed to start` - Problem!
   - ❌ `❌ Uncaught Exception` - Problem!

### Step 2: Restart the App Service

1. Azure Portal → App Service → **Overview**
2. Click **Restart**
3. Wait 1-2 minutes
4. Check Log stream again
5. Test the health endpoint: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health`

### Step 3: Check Deployed Files

1. Azure Portal → App Service → **Development Tools** → **Console**
2. Run: `ls -la`
3. Verify you see:
   ```
   server.js
   package.json
   data.json
   node_modules/ (folder)
   ```

### Step 4: Verify Startup Command

1. Azure Portal → App Service → **Configuration** → **General settings**
2. **Startup Command** should be: `node server.js`
3. If different, update and click **Save**
4. Restart the app

## Detailed Troubleshooting

### Issue: "data.json file missing or invalid"

**Symptoms:**
- Log stream shows: `❌ CRITICAL: data.json file missing or invalid`

**Fix:**
1. Check if `backend/data.json` exists in your repository
2. Verify it's valid JSON (no syntax errors)
3. Redeploy:
   ```bash
   git commit --allow-empty -m "Redeploy backend"
   git push origin main
   ```

### Issue: "Cannot find module"

**Symptoms:**
- Log stream shows module errors
- `Error: Cannot find module 'express'`

**Fix:**
1. Azure Portal → Console
2. Run: `npm install --production`
3. Restart the app

### Issue: "Port already in use"

**Symptoms:**
- Log stream shows: `Port XXXX is already in use`

**Fix:**
1. Azure Portal → Configuration → Application settings
2. Check if `PORT` is set manually
3. Remove it (Azure sets this automatically)
4. Restart the app

### Issue: Server Starts but Still 503

**Symptoms:**
- Logs show server started successfully
- But API calls return 503

**Possible Causes:**
1. **Health Probe Failure** - Azure health check failing
2. **Request Timeout** - Server too slow to respond
3. **Process Crashed** - Server started then crashed

**Fix:**
1. Check **Log stream** for recent errors
2. Test health endpoint directly in browser
3. Check **Metrics** → **Http Server Errors**
4. Verify server is binding to `0.0.0.0` (not `localhost`)

## Verification Steps

After applying fixes, verify:

1. **Health Endpoint**: 
   - Open: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health`
   - Should return: `{"status":"ok","message":"Portfolio API is running"}`

2. **Root Endpoint**:
   - Open: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/`
   - Should return API information

3. **Log Stream**:
   - Should show: `✅ Server ready to accept connections`

## Enhanced Error Logging

The updated `server.js` now includes:
- ✅ Startup validation for `data.json`
- ✅ Better error messages
- ✅ Process error handlers (catches crashes)
- ✅ File path logging (helps debug deployment issues)

## Manual Deployment Verification

If automated deployment isn't working:

1. **Zip backend folder**:
   ```bash
   cd backend
   zip -r ../backend-deploy.zip .
   ```

2. **Deploy via Azure Portal**:
   - App Service → **Deployment Center** → **Manual deployment**
   - Upload `backend-deploy.zip`

3. **Or use Azure CLI**:
   ```bash
   az webapp deployment source config-zip \
     --resource-group <your-resource-group> \
     --name sumith-portfolio-api-g3dra2a9g6haaxev \
     --src backend-deploy.zip
   ```

## Still Not Working?

1. **Check GitHub Actions logs**:
   - Repository → Actions → Latest workflow run
   - Look for deployment errors

2. **Verify App Service Plan**:
   - Azure Portal → App Service → **Overview**
   - Check if App Service Plan is active
   - Verify it's not suspended or paused

3. **Check Application Insights**:
   - App Service → **Application Insights**
   - Look for exceptions and failures

4. **Review Metrics**:
   - App Service → **Metrics**
   - Check CPU, Memory, HTTP Server Errors

## Next Steps After Fix

Once the server is running:
1. Test all API endpoints
2. Verify frontend can connect
3. Monitor logs for any issues
4. Set up Application Insights alerts

## Quick Reference

- **Backend URL**: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net`
- **Health Check**: `/api/health`
- **Log Stream**: Azure Portal → App Service → Log stream
- **Startup Command**: `node server.js`
- **Required Files**: `server.js`, `package.json`, `data.json`
