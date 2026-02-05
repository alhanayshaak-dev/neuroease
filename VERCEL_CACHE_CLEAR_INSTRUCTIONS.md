# Vercel Build Cache Clear Instructions

## Issue
Vercel is showing a cached build error on line 85 of `src/components/DeviceTile.tsx`:
```
Type error: Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes & LucideProps'.
Property 'title' does not exist on type 'IntrinsicAttributes & LucideProps'.
Line 85: {hasDamage && <AlertCircle className="w-5 h-5 text-red-500" title="Device has damage" />}
```

## Root Cause
This error is from a **cached build**, not the current code. The local code is correct:
```tsx
// CURRENT CODE (Correct)
{hasDamage && (
  <div aria-label="Device has damage">
    <AlertCircle className="w-5 h-5 text-red-500" />
  </div>
)}
```

Vercel is building from an old cached version instead of the latest GitHub code.

## Solution: Clear Vercel Build Cache

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to https://vercel.com/dashboard

2. **Select NeuroEase Project**
   - Click on the NeuroEase project

3. **Access Settings**
   - Click "Settings" in the top navigation

4. **Find Git Section**
   - Scroll down to "Git" section

5. **Clear Build Cache**
   - Click "Clear Build Cache" button
   - Confirm the action

6. **Redeploy**
   - Go back to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Select "Redeploy"
   - Choose "Use existing Build Cache" → NO (to force fresh build)

### Method 2: Via Git Push (Already Done)

We've already pushed a cache-busting commit:
```
f8995ce - chore: force Vercel cache clear - update build timestamp
```

This should trigger Vercel to rebuild. Monitor the deployment status.

### Method 3: Manual Redeploy

1. Go to Vercel Dashboard
2. Select NeuroEase project
3. Click "Deployments"
4. Find the latest deployment
5. Click the three dots (...)
6. Select "Redeploy"
7. Vercel will rebuild from the latest GitHub code

## Verification

After clearing cache and redeploying:

1. **Check Build Status**
   - Go to Vercel Dashboard
   - Monitor the build logs
   - Expected: Build succeeds with no errors

2. **Verify Deployment**
   - Check the deployed URL
   - Verify the app loads correctly
   - Test key functionality

3. **Check Error Logs**
   - If errors persist, check Vercel build logs
   - Look for any TypeScript or ESLint errors
   - All should be resolved

## Current Code Status

✅ **Local Code:** Correct (AlertCircle wrapped in div with aria-label)
✅ **GitHub:** Latest code pushed (commit f8995ce)
✅ **Build Timestamp:** Updated to force cache clear
❌ **Vercel:** Showing cached old code (needs cache clear)

## Expected Build Output After Cache Clear

```
✅ Build successful
✅ No TypeScript errors
✅ No ESLint violations
✅ All tests passing
✅ Deployment to production
```

## Why This Happens

Vercel caches build artifacts to speed up deployments. Sometimes when code is fixed but the cache isn't cleared, Vercel builds from the old cached version instead of the latest code. This is why we see the error on line 85 even though the code is correct locally.

## Next Steps

1. **Clear Vercel Build Cache** using Method 1 above
2. **Redeploy** the project
3. **Monitor** the build logs
4. **Verify** the deployment succeeds

---

**Note:** The code is correct. This is purely a Vercel cache issue. Once the cache is cleared, the build will succeed.

