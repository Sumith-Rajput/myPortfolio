# Troubleshooting 404 Errors

## Common Causes of 404 Errors

### 1. **API Endpoint 404 (Most Common)**
**Symptom**: Browser console shows 404 for API calls like `/api/personal`, `/api/projects`, etc.

**Possible Causes**:
- `VITE_API_URL` secret is missing or incorrect
- Backend API is not deployed or not running
- CORS configuration issue
- Wrong API base URL

**How to Fix**:

1. **Check VITE_API_URL Secret**:
   - Go to: `https://github.com/Sumith-Rajput/myPortfolio/settings/secrets/actions`
   - Verify `VITE_API_URL` is set to: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api`
   - Note: Must include `/api` at the end

2. **Test Backend API Directly**:
   - Open: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health`
   - Should return: `{"status":"ok","message":"Portfolio API is running"}`
   - If this fails, backend is not deployed correctly

3. **Check Backend Deployment**:
   - Azure Portal → App Service → Logs
   - Verify the app is running
   - Check for startup errors

### 2. **Static Asset 404**
**Symptom**: 404 for files like `index-BVx7RZRk.js`, `index-YmRivSyc.css`

**Possible Causes**:
- Build output not deployed correctly
- Incorrect path in `index.html`
- Static Web App configuration issue

**How to Fix**:
- Rebuild and redeploy frontend
- Check `build` folder exists after build
- Verify `vite.config.js` has `outDir: 'build'`

### 3. **Route 404 (React Router)**
**Symptom**: Page loads but routes like `/about`, `/projects` return 404

**Possible Causes**:
- `staticwebapp.config.json` misconfigured
- Missing navigation fallback

**How to Fix**:
- Verify `staticwebapp.config.json` has correct `navigationFallback.rewrite`
- Should be: `"rewrite": "/index.html"`

## Diagnostic Steps

### Step 1: Check Browser Console
1. Open your site: `https://ambitious-mud-099772e10.3.azurestaticapps.net`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for red error messages
5. Go to **Network** tab
6. Filter by "Failed" or "404"
7. Click on failed requests to see details

### Step 2: Verify API URL
Check what URL the frontend is using:
1. Open browser console
2. Type: `console.log(import.meta.env.VITE_API_URL)`
3. Should show: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api`

### Step 3: Test Backend Endpoints
Test each endpoint directly:
- Health: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health`
- Personal: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/personal`
- Projects: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/projects`

### Step 4: Check Azure App Service
1. Azure Portal → App Services
2. Select: `sumith-portfolio-api-g3dra2a9g6haaxev`
3. Check **Overview** → Status should be "Running"
4. Check **Log stream** for errors
5. Check **Configuration** → Application settings:
   - `FRONTEND_URL` should be: `https://ambitious-mud-099772e10.3.azurestaticapps.net`
   - `NODE_ENV` should be: `production`

## Quick Fixes

### Fix 1: Update VITE_API_URL Secret
```
GitHub → Settings → Secrets → Actions → VITE_API_URL
Value: https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api
```
Then redeploy frontend.

### Fix 2: Restart Backend
```bash
Azure Portal → App Service → Overview → Restart
```

### Fix 3: Rebuild and Redeploy
```bash
# Trigger a new deployment
git commit --allow-empty -m "Fix: Rebuild and redeploy"
git push origin main
```

## Still Not Working?

1. Check GitHub Actions workflow logs
2. Check Azure App Service logs
3. Verify all secrets are set correctly
4. Test backend API endpoints directly in browser
5. Check browser console for specific error messages

