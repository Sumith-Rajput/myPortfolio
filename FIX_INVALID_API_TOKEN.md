# Fix "No matching Static Web App was found or the api key was invalid"

## Problem

The deployment is failing with:
```
The content server has rejected the request with: BadRequest
Reason: No matching Static Web App was found or the api key was invalid.
```

This means the GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_MUD_099772E10` is either:
- ❌ Missing
- ❌ Invalid/expired
- ❌ Not matching your Static Web App

## Solution: Regenerate Deployment Token

### Step 1: Go to Azure Portal

1. Open: https://portal.azure.com
2. Navigate to: **Static Web Apps** → **ambitious-mud-099772e10** (or your Static Web App name)
3. In the left sidebar, click **"Manage deployment token"**

### Step 2: Copy the New Token

1. You'll see a deployment token (long string)
2. **Click "Copy"** to copy the token
3. **⚠️ Important**: Save this token - you'll need it in the next step

### Step 3: Update GitHub Secret

1. Go to your GitHub repository: `https://github.com/Sumith-Rajput/myPortfolio`
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Find the secret: **`AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_MUD_099772E10`**
5. Click **"Update"** (or create it if it doesn't exist)
6. Paste the new token from Step 2
7. Click **"Update secret"**

### Step 4: Verify Secret Name

The secret name must match exactly:
- **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_MUD_099772E10`
- **Case-sensitive**: Must match exactly

### Step 5: Trigger New Deployment

After updating the secret, trigger a new deployment:

1. Go to: `https://github.com/Sumith-Rajput/myPortfolio/actions`
2. Click **"Run workflow"** on the latest workflow
3. Select branch: `main`
4. Click **"Run workflow"**

Or simply make a small change and push to `main`.

## Alternative: Check Static Web App Name

If the token doesn't work, verify:

1. **Azure Portal** → **Static Web Apps**
2. Check the **exact name** of your Static Web App
3. The workflow file name should match:
   - Static Web App name: `ambitious-mud-099772e10`
   - Workflow file: `azure-static-web-apps-ambitious-mud-099772e10.yml`
   - Secret name: `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_MUD_099772E10`

## If Token Still Doesn't Work

1. **Delete the Static Web App** and create a new one (if needed)
2. **Reconnect GitHub** integration
3. Azure will auto-generate a new workflow with the correct token
4. Update the workflow to use `build` instead of `dist` if needed

## Quick Checklist

- [ ] Navigated to Azure Portal → Static Web App
- [ ] Clicked "Manage deployment token"
- [ ] Copied the token
- [ ] Updated GitHub secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_MUD_099772E10`
- [ ] Triggered new deployment
- [ ] Verified deployment succeeds

## Expected Result

After updating the token and triggering a new deployment:
- ✅ Deployment should succeed
- ✅ No "BadRequest" errors
- ✅ Assets deployed correctly
- ✅ Site accessible at: `https://ambitious-mud-099772e10.3.azurestaticapps.net/`

