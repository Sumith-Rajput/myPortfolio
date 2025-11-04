# Troubleshooting: "Unexpected token '<'" Error

## The Error

```
Uncaught SyntaxError: Unexpected token '<' (at main.jsx:7:3)
```

## What This Means

This error occurs when the browser tries to load a JavaScript file but receives HTML instead. The browser expects JavaScript code but gets HTML (which starts with `<!DOCTYPE html>` or `<`), causing a syntax error.

## Common Causes

### 1. **Source Files Being Requested Instead of Built Files**

**Problem**: The browser is trying to load `/src/main.jsx` (source file) instead of `/assets/index-xxx.js` (built file).

**Why it happens**:
- An old or cached `index.html` is being served that references `/src/main.jsx`
- The built `index.html` wasn't deployed correctly
- Azure Static Web Apps is serving the source `index.html` instead of the built one

**Solution**: Ensure only built files are deployed, and the built `index.html` references `/assets/` files.

### 2. **Navigation Fallback Serving HTML for Missing Files**

**Problem**: When a file doesn't exist (like `/src/main.jsx`), Azure's navigationFallback serves `index.html` instead of returning 404.

**Solution**: Exclude `/src/*` from navigationFallback and add a specific route that returns 404.

### 3. **Build Output Not Deployed Correctly**

**Problem**: The `build` folder contents aren't being deployed, so source files are being served.

**Solution**: Verify the workflow is deploying from `build/` folder, not repository root.

## Fix Applied

The `staticwebapp.config.json` has been updated to:

1. **Return 404 for `/src/*` requests**:
   ```json
   {
     "route": "/src/*",
     "statusCode": 404
   }
   ```

2. **Exclude `/src/*` from navigationFallback**:
   ```json
   "exclude": ["/api/*", "*.{css,scss,js,mjs,...}", "/assets/*", "/src/*"]
   ```

This ensures that:
- Requests to `/src/*` return 404 (file not found) instead of serving `index.html`
- The navigationFallback doesn't catch `/src/*` requests

## Verification Steps

### Step 1: Check Built HTML

After deployment, verify the deployed `index.html` contains:
```html
<script type="module" crossorigin src="/assets/index-xxx.js"></script>
```

**NOT**:
```html
<script type="module" src="/src/main.jsx"></script>
```

### Step 2: Test Direct File Access

1. Open browser DevTools (F12) → Network tab
2. Navigate to your site
3. Check which JavaScript file is being requested:
   - ✅ Should be: `/assets/index-xxx.js`
   - ❌ Should NOT be: `/src/main.jsx`

### Step 3: Check Response for `/src/main.jsx`

1. Try to access: `https://yoursite.azurestaticapps.net/src/main.jsx`
2. Should return: `404 Not Found`
3. Should NOT return: HTML content (index.html)

### Step 4: Clear Browser Cache

1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Or use incognito/private window
3. This ensures you're not loading cached HTML

## Expected Behavior

### ✅ Correct Deployment

- Built `index.html` references `/assets/index-xxx.js`
- JavaScript files are served from `/assets/` folder
- Requests to `/src/*` return 404
- No "Unexpected token '<'" errors

### ❌ Incorrect Deployment

- `index.html` references `/src/main.jsx`
- Browser requests `/src/main.jsx`
- Server returns `index.html` (HTML) instead of JavaScript
- Browser tries to parse HTML as JavaScript → Error

## Prevention

1. **Always deploy from `build/` folder**, never from source
2. **Verify workflows** use `output_location: "build"`
3. **Check built HTML** before deployment
4. **Use correct exclude patterns** in navigationFallback
5. **Add explicit routes** for source paths to return 404

## Related Issues

- If you see this error, you might also see:
  - 404 errors for `/src/main.jsx`
  - Empty or blank page
  - Console errors about missing modules

## Still Having Issues?

1. **Check GitHub Actions logs**: Verify the build step completed successfully
2. **Check Azure Portal**: Deployment history → Verify files were deployed
3. **Inspect Network tab**: See exactly what files are being requested
4. **Verify config file**: Ensure `staticwebapp.config.json` is deployed correctly
