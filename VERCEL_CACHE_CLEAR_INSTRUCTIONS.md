# Vercel Build Cache Clear Instructions

## Issue
Vercel is showing a build error with old cached code:
```
Type error: Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes & LucideProps'.
Property 'title' does not exist on type 'IntrinsicAttributes & LucideProps'.
```

This error references line 85 in DeviceTile.tsx with `title="Device has damage"` on AlertCircle component.

## Root Cause
The local code is **correct** - the AlertCircle is properly wrapped in a div with `aria-label` and has NO title attribute. However, Vercel's build cache is serving stale/old code from a previous build.

## Solution: Clear Vercel Build Cache

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to https://vercel.com/dashboard

2. **Select Your Project**
   - Click on the "NeuroEase" project

3. **Access Settings**
   - Click "Settings" in the top navigation

4. **Clear Build Cache**
   - Go to "Git" section in the left sidebar
   - Look for "Build Cache" section
   - Click "Clear Build Cache" button

5. **Redeploy**
   - Go back to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Select "Redeploy"
   - Choose "Use existing Build Cache" → NO (to force fresh build)

### Method 2: Via Git Push (Already Done)

A new commit has been pushed to force cache invalidation:
```
c685b95 - chore: force Vercel cache invalidation - rebuild with correct AlertCircle implementation
```

This should trigger Vercel to rebuild automatically.

### Method 3: Manual Redeploy

1. Go to Vercel Dashboard
2. Select NeuroEase project
3. Go to "Deployments" tab
4. Click the three dots (...) on the latest deployment
5. Select "Redeploy"
6. Vercel will rebuild with the latest code

---

## What the Correct Code Looks Like

### ✅ CORRECT (Current Local Code)
```tsx
{hasDamage && (
  <div aria-label="Device has damage">
    <AlertCircle className="w-5 h-5 text-red-500" />
  </div>
)}
```

### ❌ INCORRECT (Old Cached Code)
```tsx
{hasDamage && <AlertCircle className="w-5 h-5 text-red-500" title="Device has damage" />}
```

---

## Verification

After clearing cache and redeploying:

1. **Check Build Logs**
   - Go to Vercel Dashboard
   - Select NeuroEase project
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Check "Build Logs" for success

2. **Expected Output**
   ```
   ✅ Build successful
   ✅ No TypeScript errors
   ✅ No ESLint violations
   ✅ Deployment to production
   ```

3. **Test Production**
   - Visit the deployed URL
   - Check for any console errors
   - Test device status display

---

## Why This Happens

Vercel caches build artifacts to speed up deployments. Sometimes when code is updated, the cache isn't automatically invalidated. This is especially common when:

1. Multiple commits are pushed quickly
2. Build errors occur and are then fixed
3. Cache needs manual clearing

The solution is to either:
- Clear the cache manually via Vercel Dashboard
- Push a new commit to trigger a fresh build (already done)

---

## Current Status

| Item | Status |
|------|--------|
| Local Code | ✅ Correct (AlertCircle wrapped in div with aria-label) |
| GitHub | ✅ Latest code pushed (commit c685b95) |
| Vercel Cache | ⏳ Needs clearing or will auto-clear on next build |
| Expected Build | ✅ Will succeed after cache clear |

---

## Next Steps

1. **Clear Vercel Build Cache** (via Dashboard or automatic on next build)
2. **Redeploy** the project
3. **Monitor Build Logs** for success
4. **Verify Production** deployment

---

## Support

If the issue persists after clearing cache:

1. Check that the latest commit (c685b95) is deployed
2. Verify DeviceTile.tsx line 85 shows the wrapped AlertCircle
3. Check Vercel build logs for any other errors
4. Contact Vercel support if cache clearing doesn't work

---

**Last Updated:** February 5, 2026  
**Latest Commit:** c685b95  
**Status:** Ready for cache clear and redeploy

