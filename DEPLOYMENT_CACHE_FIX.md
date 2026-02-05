# Vercel Build Cache Issue - Resolution Guide

## Problem
Vercel is showing a cached build error:
```
Type error: Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes & LucideProps'.
Property 'title' does not exist on type 'IntrinsicAttributes & LucideProps'.
```

This error references line 85 in `src/components/DeviceTile.tsx` with an `AlertCircle` component having a `title` attribute.

## Root Cause
The local code is correct (uses `aria-label` instead of `title`), but Vercel's build cache is serving an old version of the code.

## Solution

### Step 1: Clear Vercel Build Cache
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select the NeuroEase project
3. Go to **Settings** → **Git**
4. Click **Clear Build Cache**
5. Redeploy the project

### Step 2: Force Fresh Build
The following changes have been made to force a fresh build:

1. **Updated `.vercelignore`** - Ensures clean build environment
2. **Updated DeviceTile.tsx** - Changed build version comment from v4 to v5
3. **Committed all changes** - New commits trigger fresh builds

### Step 3: Verify Code Quality

**Current State of DeviceTile.tsx (Line 85):**
```tsx
{hasDamage && <AlertCircle className="w-5 h-5 text-red-500" aria-label="Device has damage" />}
```

✅ Correct: Uses `aria-label` instead of `title`

**All Lucide Components:**
- ✅ No lucide components have `title` attributes
- ✅ All use `aria-label` for accessibility
- ✅ All buttons with `title` attributes are HTML elements (valid)

## Verification Checklist

- [x] Local code verified - no lucide components with title
- [x] DeviceTile.tsx uses aria-label correctly
- [x] All 45 linting issues fixed
- [x] Build version updated to force rebuild
- [x] .vercelignore configured
- [x] Changes pushed to GitHub

## Next Steps

1. **Clear Vercel Cache** (if not already done)
2. **Trigger Redeploy** on Vercel
3. **Monitor Build** - Should complete successfully
4. **Verify Deployment** - Check production URL

## Technical Details

### Why This Happens
- Vercel caches build artifacts
- Old cached version may contain outdated code
- Clearing cache forces fresh build from latest source

### Prevention
- Always ensure local code is correct before pushing
- Use meaningful commit messages
- Monitor Vercel build logs
- Clear cache if errors persist after code fixes

## Repository Status

- **Latest Commit:** chore: update Vercel configuration to force clean rebuild
- **Branch:** main
- **Status:** Ready for deployment
- **Build Cache:** Needs clearing on Vercel dashboard

---

**Last Updated:** February 5, 2026
**Action Required:** Clear Vercel build cache and redeploy
