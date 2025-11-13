# Identify Which Resource is 404ing

## Step-by-Step: Find the Exact File Returning 404

When you see "Failed to load resource: the server responded with a status of 404 ()", you need to identify **which specific file** is failing.

### Step 1: Open Network Tab

1. **Open your site in Incognito mode**
2. **Open DevTools**: Press `F12` (or right-click → Inspect)
3. **Go to Network tab**: Click on "Network" at the top

### Step 2: Reload and Filter

1. **Reload the page**: Press `Ctrl + Shift + R` (hard refresh)
2. **Filter for 404s**:
   - In the Network tab, look for a filter/search box
   - Type: `status-code:404` (or just look for red entries)
   - OR click the status column to sort by status code

### Step 3: Identify the Failed Resource

Look for entries with:
- **Red color** (indicates error)
- **Status: 404**
- **Red status text**

**Click on the 404 entry** to see details:
- **Name**: The file that's 404ing (e.g., `index-YmRivSyc.css`, `index-BVx7RZRk.js`)
- **Type**: What type of file (CSS, JS, img, fetch, etc.)
- **Status**: Should show `404`
- **URL**: The full URL that's failing

### Step 4: Common Files to Check

Check these specific resources in the Network tab:

#### ✅ **Should Work (Status: 200)**
- `index.html` → Should be 200
- `/assets/index-*.js` → Should be 200
- `/assets/index-*.css` → Should be 200

#### ❌ **Expected 404s (These are OK)**
- `/src/main.jsx` → 404 is correct (source file)
- `/src/*` → 404 is correct (source files)
- `/*.jsx` → 404 is correct (source files)

### Step 5: Report Back

Once you identify the failing resource, note:
1. **File name**: e.g., `index-YmRivSyc.css`
2. **File type**: CSS, JS, image, API call, etc.
3. **Full URL**: Copy the full URL
4. **Status code**: Should be 404

## Quick Diagnostic

### If CSS File is 404
```
Failed: /assets/index-YmRivSyc.css (Status: 404)
```
**Problem**: CSS asset not deployed
**Fix**: Check deployment logs, verify assets are in build output

### If JS File is 404
```
Failed: /assets/index-BVx7RZRk.js (Status: 404)
```
**Problem**: JavaScript asset not deployed
**Fix**: Check deployment logs, verify assets are in build output

### If API Call is 404
```
Failed: /api/personal (Status: 404)
```
**Problem**: Backend API not accessible
**Fix**: Check backend deployment, verify VITE_API_URL secret

### If Image is 404
```
Failed: /profile-photo.jpg (Status: 404)
```
**Problem**: Image file missing
**Fix**: Check if image exists in public folder

## What to Tell Me

After checking the Network tab, tell me:
1. **What file is 404ing?** (exact name)
2. **Is it a CSS, JS, API, or image?**
3. **What's the status code?** (should be 404)
4. **Is your site blank, or does it load partially?**

This will help me identify the exact issue!
