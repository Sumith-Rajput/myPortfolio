# Fix MIME Type Issues via Azure Portal

If the `staticwebapp.config.json` approach isn't working, you can configure MIME types directly in Azure Portal.

## Method 1: Verify Config File is Deployed

1. **Go to Azure Portal** → **Static Web Apps** → Your app
2. **Go to Configuration** → **Routes**
3. Check if your `staticwebapp.config.json` is being read
4. If not visible, the config file might not be deployed correctly

## Method 2: Configure via Azure Portal (Alternative)

Since `staticwebapp.config.json` might not be applying MIME types correctly, you can try:

### Option A: Update the Static Web App Configuration

1. **Azure Portal** → **Static Web Apps** → Your app
2. **Settings** → **Configuration**
3. Look for MIME type settings or custom headers
4. Add custom headers if available:
   - Header: `Content-Type`
   - Value: `application/javascript`
   - Apply to: `*.js` and `*.mjs` files

### Option B: Use Custom Domain Configuration

If available in your Static Web App tier, configure custom headers via:
1. **Azure Portal** → **Static Web Apps** → Your app
2. **Custom domains** → **Configuration**
3. Add custom headers for JavaScript files

## Method 3: Verify Deployment

### Check if Config File is in Build Output

1. **GitHub Actions** → Latest workflow run
2. Look for: "✅ Copied staticwebapp.config.json to build directory"
3. If this message appears, the config is being copied
4. Check the deployment logs for any errors

### Verify Config File Location

The config file should be:
- ✅ In repository root: `staticwebapp.config.json`
- ✅ Copied to: `build/staticwebapp.config.json` during deployment
- ✅ Deployed with the static files

## Method 4: Test Config File

After deployment, verify the config is being read:

1. **Azure Portal** → **Static Web Apps** → Your app
2. **Configuration** → **Routes**
3. You should see your routes configured
4. If empty, the config file isn't being applied

## Method 5: Manual Verification

### Check What Files Are Deployed

1. **Azure Portal** → **Static Web Apps** → Your app
2. **Development Tools** → **Console** (if available)
3. Or check **Deployment history** → **Browse**

### Test MIME Type in Browser

1. Open your site in browser
2. Open Developer Tools (F12)
3. Go to **Network** tab
4. Reload the page
5. Click on a `.js` file (e.g., `assets/index-xxx.js`)
6. Check **Response Headers**
7. Look for `Content-Type` header
8. Should show: `application/javascript`

## Method 6: Alternative Config Location

Try placing `staticwebapp.config.json` in the `public` folder:

1. Move `staticwebapp.config.json` to `public/staticwebapp.config.json`
2. Update workflow to copy from `public/` instead
3. Redeploy

## Method 7: Check Azure Static Web Apps Documentation

The issue might be version-specific. Check:
- [Azure Static Web Apps Configuration](https://docs.microsoft.com/azure/static-web-apps/configuration)
- Known issues with MIME types in your Static Web App tier
- Whether your tier supports custom MIME type configuration

## Current Status

Your current config relies on:
- ✅ `mimeTypes` section for automatic MIME type detection
- ✅ No route headers (to avoid validation conflicts)
- ✅ Proper exclusions in navigation fallback

## Next Steps

1. **Verify deployment** - Check GitHub Actions logs
2. **Check Azure Portal** - Verify routes are configured
3. **Test in browser** - Check Network tab for actual MIME types
4. **Clear cache** - Hard refresh (Ctrl+Shift+R) or incognito mode
5. **Check browser console** - Look for specific file that's failing

## If Still Not Working

Consider:
1. **Upgrading Static Web App tier** - Some features require higher tiers
2. **Using Azure CDN** - Configure MIME types at CDN level
3. **Custom domain with CDN** - More control over headers
4. **Contact Azure Support** - May be a platform issue

## Quick Test

After any changes, test:
```
https://ambitious-mud-099772e10.3.azurestaticapps.net/assets/index-[HASH].js
```

Replace `[HASH]` with the actual hash from your deployment. Check the `Content-Type` header in the response.
