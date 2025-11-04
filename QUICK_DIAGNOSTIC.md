# Quick Diagnostic Checklist

## ✅ Step-by-Step Site Check

### 1. Open Your Site
Visit: **https://ambitious-mud-099772e10.3.azurestaticapps.net/**

### 2. Check Browser Console (F12)

**What to look for:**
- ❌ Red errors in Console tab
- ❌ Red entries in Network tab (404, 500, etc.)
- ✅ Page loads completely
- ✅ No console errors

### 3. Check Network Tab

**Filter by Status Code:**
1. Open Network tab (F12)
2. Click filter icon (funnel)
3. Check "Failed" or filter by "404"
4. Note which resources are failing

**Common Failed Resources:**
- `/assets/index-xxx.js` → Assets not deployed
- `/api/personal` → Backend API issue
- `/profile-photo.jpg` → Image missing

### 4. Quick URL Tests

**Test these URLs directly in your browser:**

#### Frontend Assets (use your actual file hash):
```
https://ambitious-mud-099772e10.3.azurestaticapps.net/assets/index-BVx7RZRk.js
```
- ✅ Should show JavaScript code
- ❌ If 404: Assets not deployed

```
https://ambitious-mud-099772e10.3.azurestaticapps.net/assets/index-YmRivSyc.css
```
- ✅ Should show CSS code
- ❌ If 404: CSS not deployed

#### Backend API:
```
https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api/health
```
- ✅ Should return: `{"status":"ok","message":"Portfolio API is running"}`
- ❌ If 404: Backend not deployed/running

#### Frontend Index:
```
https://ambitious-mud-099772e10.3.azurestaticapps.net/
```
- ✅ Should show your portfolio page
- ❌ If blank/error: Check console for errors

### 5. Check Deployment Status

#### GitHub Actions:
1. Go to: https://github.com/Sumith-Rajput/myPortfolio/actions
2. Check latest workflow run
3. Verify all steps completed ✅
4. Look for any errors

#### Azure Portal:
1. Azure Portal → Static Web Apps → Your app
2. Check "Deployment history"
3. Verify latest deployment succeeded
4. Check "Logs" for any errors

### 6. Common Issues & Quick Fixes

#### Issue: Blank Page / White Screen
**Cause**: JavaScript files not loading
**Fix**: 
- Check Network tab for failed JS requests
- Verify assets are deployed
- Clear browser cache (Ctrl+Shift+R)

#### Issue: API Calls Failing (404)
**Cause**: Backend not running or wrong URL
**Fix**:
- Test backend health endpoint directly
- Verify `VITE_API_URL` secret is correct
- Check Azure App Service logs

#### Issue: Assets 404
**Cause**: Build output not deployed
**Fix**:
- Trigger new deployment
- Verify `output_location: "build"` in workflow
- Check build step completed successfully

### 7. What to Report

If issues persist, share:

1. **Browser Console Errors**:
   - Copy exact error messages
   - Screenshot if possible

2. **Network Tab Failures**:
   - Which URLs are 404?
   - Status codes (404, 500, etc.)

3. **Deployment Status**:
   - GitHub Actions: ✅ or ❌
   - Azure Portal: Latest deployment status

4. **URL Test Results**:
   - Which URLs work?
   - Which URLs fail?

### 8. Quick Actions

**If site is completely down:**
```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

**If backend is down:**
- Check Azure App Service → Logs
- Restart App Service from Azure Portal
- Verify backend deployment succeeded

**If assets are missing:**
- Check GitHub Actions build logs
- Verify `build/` folder contents
- Ensure workflow uses `output_location: "build"`

