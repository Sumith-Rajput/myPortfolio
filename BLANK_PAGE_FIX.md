# Fix Blank Page Issue

## Why Blank Page Happens

A blank page usually means:
1. **JavaScript files not loading** → React app never mounts
2. **Console errors** → App crashes before rendering
3. **Assets not deployed** → Files missing on server

## Quick Diagnostic (Do This First!)

### Step 1: Open Browser DevTools

1. Visit: `https://ambitious-mud-099772e10.3.azurestaticapps.net/`
2. Press **F12** to open DevTools
3. Check **Console tab** - Are there any errors?
4. Check **Network tab** - Are there any failed requests (red)?

### Step 2: Check What Errors You See

**Common Errors:**

#### Error 1: `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"`
- **Cause**: MIME type configuration issue
- **Fix**: Config file should have `mimeTypes` section (already configured)

#### Error 2: `Failed to load resource: the server responded with a status of 404`
- **Cause**: Assets not deployed or wrong paths
- **Fix**: Check if assets are accessible

#### Error 3: `Uncaught SyntaxError: Unexpected token '<'`
- **Cause**: Getting HTML instead of JavaScript
- **Fix**: Navigation fallback serving index.html for JS files

#### Error 4: `Failed to fetch` (API calls)
- **Cause**: Backend not running or CORS issue
- **Fix**: Check backend health endpoint

### Step 3: Test Direct URLs

Open these in new browser tabs:

```
https://ambitious-mud-099772e10.3.azurestaticapps.net/assets/index-BVx7RZRk.js
```
- ✅ Should show JavaScript code
- ❌ If blank/404: Assets not deployed

```
https://ambitious-mud-099772e10.3.azurestaticapps.net/assets/index-YmRivSyc.css
```
- ✅ Should show CSS code
- ❌ If blank/404: CSS not deployed

## Quick Fixes

### Fix 1: Clear Browser Cache

1. **Hard Refresh**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. **Or use Incognito/Private window**
3. **Or clear cache**: Settings → Clear browsing data → Cached images and files

### Fix 2: Trigger Fresh Deployment

The blank page might be due to an incomplete deployment. Trigger a new one:

```bash
git commit --allow-empty -m "Trigger deployment to fix blank page"
git push origin main
```

Wait 2-3 minutes for deployment to complete, then check the site again.

### Fix 3: Check GitHub Actions Status

1. Go to: `https://github.com/Sumith-Rajput/myPortfolio/actions`
2. Check latest workflow run:
   - ✅ All steps should be green
   - ❌ If any step failed, check the logs

### Fix 4: Verify Assets Are Deployed

1. **Azure Portal** → **Static Web Apps** → Your app
2. **Deployment history** → Latest deployment
3. **Browse** → Check if files are there
4. Look for:
   - `index.html`
   - `assets/` folder with `.js` and `.css` files
   - `staticwebapp.config.json`

### Fix 5: Check Console for Specific Errors

If DevTools shows errors, the specific error message will tell us what's wrong:

**Copy the exact error message** and we can fix it specifically.

## Most Likely Causes & Solutions

### 1. JavaScript Files Not Loading (404)

**Symptoms:**
- Network tab shows 404 for `.js` files
- Console shows "Failed to load module script"

**Solution:**
- Verify deployment completed
- Check `output_location: "build"` in workflow
- Trigger new deployment

### 2. MIME Type Error

**Symptoms:**
- Console shows "Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'application/octet-stream'"

**Solution:**
- `staticwebapp.config.json` should have `mimeTypes` section (already configured)
- Verify config file is deployed
- Hard refresh browser

### 3. React App Not Mounting

**Symptoms:**
- No console errors
- Network tab shows all files loaded successfully
- But page is still blank

**Solution:**
- Check if `#root` element exists in HTML
- Verify React is loading: Check console for "React" errors
- Check for runtime errors in console

### 4. API Calls Failing

**Symptoms:**
- Page loads but no content
- Console shows API 404 errors

**Solution:**
- Test backend: `https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health`
- Verify `VITE_API_URL` secret is correct
- Check backend is running in Azure Portal

## Next Steps

1. **Open DevTools** (F12) and check Console tab
2. **Share the error message** you see (if any)
3. **Check Network tab** - note any failed requests
4. **Try the quick fixes above**

## Still Blank After Fixes?

Please share:
1. **Console errors** (exact messages)
2. **Network tab failures** (which URLs are 404?)
3. **GitHub Actions status** (did deployment succeed?)
4. **Azure Portal deployment status**

This will help us pinpoint the exact issue!
