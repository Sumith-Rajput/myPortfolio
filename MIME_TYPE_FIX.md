# Understanding and Fixing the MIME Type Error

## The Error

```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec.
```

## What This Means

- **Browser expects**: JavaScript files (`.js`, `.mjs`) should have MIME type `application/javascript`
- **Server is sending**: `application/octet-stream` (generic binary file type)
- **Why it fails**: Modern browsers enforce strict MIME type checking for ES6 module scripts (`type="module"`)

## Root Cause

Azure Static Web Apps sometimes serves JavaScript files with incorrect MIME types, especially when:
1. The `staticwebapp.config.json` file is missing or not properly configured
2. The config file isn't in the deployed build output
3. Route-specific headers aren't matching correctly
4. The `mimeTypes` section isn't being applied

## Current Configuration

The `staticwebapp.config.json` now includes:
1. **mimeTypes section**: Primary method for setting MIME types based on file extensions
2. **Route-specific headers**: Backup method for JavaScript files with explicit Content-Type headers
3. **Proper route ordering**: Specific routes before wildcard routes

## Verification Steps

### 1. Check if Config File is Deployed

After deployment, verify the config is in the build output:
- The workflow should copy `staticwebapp.config.json` to the `build/` directory
- Check GitHub Actions logs for: "✅ Copied staticwebapp.config.json to build directory"

### 2. Test the Deployment

1. **Clear browser cache completely** (Important!)
2. Open Developer Tools (F12)
3. Go to Network tab
4. Reload the page
5. Click on a `.js` file (e.g., `index-xxx.js`)
6. Check the Response Headers - should show: `Content-Type: application/javascript`

### 3. Check Browser Console

Look for:
- The exact file that's failing to load
- The MIME type being returned
- Any 404 errors

## If Error Persists

### Option 1: Verify Config File Location

Ensure `staticwebapp.config.json` is:
- ✅ In the repository root
- ✅ Copied to `build/` directory during deployment
- ✅ Deployed with the static files

### Option 2: Check Route Patterns

Azure Static Web Apps uses glob patterns. The current patterns:
- `/assets/**/*.js` - Matches nested paths
- `/assets/*.js` - Matches direct assets
- `/*.js` - Matches root-level JS files
- `/*.mjs` - Matches module files

### Option 3: Simplify Configuration

If route headers cause validation errors, try relying solely on `mimeTypes`:

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
    "rewrite": "/index.html",
    "exclude": ["/api/*", "*.{css,scss,js,mjs,png,gif,ico,jpg,svg,woff,woff2,ttf,eot}"]
  },
  "mimeTypes": {
    ".js": "application/javascript",
    ".mjs": "application/javascript"
  }
}
```

### Option 4: Check Azure Portal

1. Go to Azure Portal → Your Static Web App
2. Check Configuration → Routes
3. Verify the config is applied
4. Check Deployment History for errors

## Deployment Checklist

- [ ] `staticwebapp.config.json` exists in repository root
- [ ] Workflow copies config to `build/` directory
- [ ] Config file is deployed (check GitHub Actions logs)
- [ ] Browser cache is cleared
- [ ] Test in incognito/private window
- [ ] Check Network tab for actual MIME types

## Expected Result

After a successful fix:
- JavaScript files load without MIME type errors
- Browser console shows no module script errors
- Network tab shows `Content-Type: application/javascript` for `.js` files
- React app loads and functions correctly

## Additional Resources

- [Azure Static Web Apps Configuration](https://docs.microsoft.com/azure/static-web-apps/configuration)
- [MIME Types Documentation](https://docs.microsoft.com/azure/static-web-apps/configuration#mime-types)
