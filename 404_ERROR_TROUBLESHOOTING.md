# Troubleshooting 404 Errors

## The Error

```
Failed to load resource: the server responded with a status of 404 ()
```

This is a generic error that means a resource (file, API endpoint, etc.) was not found. You need to identify **which specific resource** is returning 404.

## Step 1: Identify What's 404

### In Browser DevTools:

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Reload the page** (Ctrl+Shift+R to clear cache)
4. **Look for red entries** - these are failed requests
5. **Click on each red entry** to see:
   - **Request URL**: What file/endpoint is missing?
   - **Status Code**: Should show `404`
   - **Type**: Is it `script`, `fetch`, `xhr`, `css`, `img`, etc.?

### Common 404 Sources:

1. **JavaScript/CSS Files** (`/assets/index-xxx.js`, `/assets/index-xxx.css`)
2. **API Endpoints** (`/api/personal`, `/api/projects`, etc.)
3. **Images** (`/profile-photo.jpg`, `/vite.svg`, etc.)
4. **Other Static Assets**

## Step 2: Diagnose by Resource Type

### If JavaScript/CSS Files are 404

**Symptom**: Red entries for files like `/assets/index-BVx7RZRk.js` or `/assets/index-YmRivSyc.css`

**Possible Causes**:
1. Build output not deployed correctly
2. Files not in `build/assets/` folder
3. Wrong file paths in `index.html`

**How to Fix**:

1. **Verify build completed**:
   - Check GitHub Actions logs
   - Ensure "Build frontend" step succeeded
   - Verify `build/` folder exists after build

2. **Check deployed files**:
   - Azure Portal → Static Web App → Deployment history
   - Verify `build/assets/` folder is deployed

3. **Verify paths in built HTML**:
   - The built `index.html` should reference `/assets/index-xxx.js`
   - Paths should be absolute (start with `/`)

4. **Check GitHub Actions workflow**:
   ```yaml
   output_location: "build"  # Should be "build", not "dist"
   skip_app_build: true      # Should be true
   ```

### If API Endpoints are 404

**Symptom**: Red entries for `/api/personal`, `/api/projects`, etc.

**Possible Causes**:
1. Backend not deployed
2. Wrong `VITE_API_URL` configuration
3. CORS issues
4. API URL incorrect

**How to Fix**:

1. **Check backend is running**:
   ```
   https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health
   ```
   Should return: `{"status":"ok","message":"Portfolio API is running"}`

2. **Verify VITE_API_URL secret**:
   - GitHub → Settings → Secrets → Actions
   - Check `VITE_API_URL` is set correctly
   - Should be: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api`
   - **Must include `/api` at the end**

3. **Check backend deployment**:
   - Azure Portal → App Service → Logs
   - Verify backend is running
   - Check for startup errors

4. **Verify CORS configuration**:
   - Backend should allow requests from frontend domain
   - Check `backend/server.js` CORS settings

### If Images are 404

**Symptom**: Red entries for `/profile-photo.jpg`, `/vite.svg`, etc.

**Possible Causes**:
1. Images not in `public/` folder
2. Images not copied to `build/` during build
3. Wrong image paths

**How to Fix**:

1. **Verify images exist**:
   - Images should be in `public/` folder (not `src/`)
   - Vite automatically copies `public/` to `build/`

2. **Check image paths in code**:
   - Should be: `/profile-photo.jpg` (absolute)
   - Not: `./profile-photo.jpg` (relative)

3. **Verify build output**:
   - After build, check `build/` folder
   - Images from `public/` should be in `build/`

## Step 3: Quick Diagnostics

### Check What's Actually Deployed

1. **Visit your site root**:
   ```
   https://ambitious-mud-099772e10.3.azurestaticapps.net/
   ```

2. **Try accessing assets directly**:
   ```
   https://ambitious-mud-099772e10.3.azurestaticapps.net/assets/index-BVx7RZRk.js
   ```
   - ✅ Should return JavaScript code
   - ❌ If 404, assets aren't deployed

3. **Check API directly**:
   ```
   https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health
   ```
   - ✅ Should return JSON
   - ❌ If 404, backend isn't deployed/running

### Check Browser Console for Specific Errors

Look for:
- `Failed to fetch` → API connectivity issue
- `404 (Not Found)` → Resource missing
- `CORS error` → Backend CORS configuration
- `Failed to load module script` → MIME type or path issue

## Step 4: Common Fixes

### Fix 1: Rebuild and Redeploy

If assets are missing:

1. **Trigger a new deployment**:
   - Push a small change to `main` branch
   - Or manually trigger GitHub Actions workflow

2. **Verify build step**:
   - GitHub Actions → Latest workflow run
   - Check "Build frontend" step completed
   - Verify no errors in logs

### Fix 2: Verify Workflow Configuration

Check `.github/workflows/deploy-frontend.yml`:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}

- name: Deploy to Azure Static Web Apps
  uses: Azure/static-web-apps-deploy@v1
  with:
    output_location: "build"  # Must be "build"
    skip_app_build: true      # Must be true
```

### Fix 3: Verify Build Output

After deployment, the `build/` folder should contain:
```
build/
├── index.html
├── assets/
│   ├── index-xxx.js    ← JavaScript files
│   └── index-xxx.css   ← CSS files
└── staticwebapp.config.json
```

### Fix 4: Check Backend Deployment

If API is 404:

1. **Azure Portal → App Service → Logs**:
   - Check application logs
   - Look for startup errors
   - Verify server is listening

2. **Test backend directly**:
   - Use Postman or curl
   - Test: `GET /api/health`

3. **Check backend deployment logs**:
   - GitHub Actions → Backend deployment workflow
   - Verify deployment succeeded

## Step 5: Detailed Diagnostics

### Network Tab Analysis

1. Open DevTools → Network tab
2. Filter by status code `404`
3. For each 404:
   - Note the **Request URL**
   - Note the **Type** (script, fetch, etc.)
   - Check **Response** tab (should be empty or error message)

### Console Tab Analysis

Look for specific error messages:
- `GET /assets/xxx.js 404` → Asset missing
- `GET /api/xxx 404` → API endpoint missing
- `Failed to fetch` → Network/CORS issue

## Step 6: Verification Checklist

After fixes, verify:

- [ ] Build step completes without errors
- [ ] `build/` folder contains `index.html` and `assets/` folder
- [ ] Built `index.html` references `/assets/` files (not `/src/`)
- [ ] Assets are accessible directly via URL
- [ ] Backend API `/api/health` returns success
- [ ] `VITE_API_URL` secret is set correctly
- [ ] Browser cache is cleared (hard refresh)
- [ ] No 404 errors in Network tab

## Getting Help

When reporting issues, include:

1. **Specific resource that's 404**:
   - Full URL that's failing
   - Type (script, fetch, css, etc.)

2. **Browser console errors**:
   - Copy exact error messages
   - Include stack traces if available

3. **Network tab details**:
   - Screenshot of failed requests
   - Request URL and status code

4. **Deployment logs**:
   - GitHub Actions workflow logs
   - Azure Portal deployment history

5. **Backend status**:
   - Is `/api/health` accessible?
   - Backend logs from Azure Portal

## Quick Test Commands

### Test Frontend Assets
```bash
# Replace with your actual file hash
curl -I https://ambitious-mud-099772e10.3.azurestaticapps.net/assets/index-BVx7RZRk.js
# Should return 200 OK
```

### Test Backend API
```bash
curl https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health
# Should return: {"status":"ok","message":"Portfolio API is running"}
```

## Most Common Issues

1. **Assets 404**: Build output not deployed → Check workflow `output_location`
2. **API 404**: Backend not running → Check App Service logs
3. **Wrong paths**: Source paths in HTML → Rebuild and redeploy
4. **Cache**: Old files cached → Hard refresh (Ctrl+Shift+R)
