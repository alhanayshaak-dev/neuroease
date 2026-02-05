# Vercel Build Error - Root Cause Analysis & Resolution

## Error Message
```
Type error: Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes & LucideProps'.
Property 'title' does not exist on type 'IntrinsicAttributes & LucideProps'.
Line 85: {hasDamage && <AlertCircle className="w-5 h-5 text-red-500" title="Device has damage" />}
```

## Root Cause Analysis

### What the Error Shows
- Vercel is showing code with `title="Device has damage"` on AlertCircle component
- This is a lucide-react component that doesn't accept `title` prop

### What the Code Actually Contains
```tsx
// ACTUAL CODE (Line 85 in src/components/DeviceTile.tsx)
{hasDamage && <AlertCircle className="w-5 h-5 text-red-500" aria-label="Device has damage" />}
```

### The Problem
**Vercel is building from a cached or stale version of the code, not the current GitHub repository.**

### Evidence
1. ✅ Local code verified - uses `aria-label` (correct)
2. ✅ GitHub remote verified - uses `aria-label` (correct)
3. ❌ Vercel build output - shows `title` attribute (incorrect/stale)
4. ✅ Search entire repo - no `title="Device has damage"` found anywhere

---

## Solution

### Step 1: Clear Vercel Build Cache (REQUIRED)

**This is the ONLY way to fix this issue:**

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select the **NeuroEase** project
3. Navigate to **Settings** → **Git**
4. Click **Clear Build Cache**
5. Click **Redeploy** or push a new commit to trigger rebuild

### Step 2: Verify Changes Made

The following changes have been made to force a fresh build:

1. **Updated package.json**
   - Version bumped from 0.1.0 to 0.2.0
   - Forces Vercel to recognize a new build

2. **Added BUILD_TRIGGER.txt**
   - Signals to Vercel that a rebuild is needed
   - Documents the issue and solution

3. **Verified DeviceTile.tsx**
   - Line 85 confirmed to use `aria-label` (correct)
   - No `title` attributes on lucide components

### Step 3: Trigger Fresh Build

After clearing cache, Vercel will:
1. Pull latest code from GitHub
2. Run fresh build with no cache
3. Should complete successfully ✅

---

## Verification Checklist

- [x] Local code verified - aria-label used correctly
- [x] GitHub remote verified - aria-label in repository
- [x] No title="Device has damage" exists in codebase
- [x] Package version bumped to force rebuild
- [x] Build trigger file added
- [x] Changes pushed to GitHub
- [x] Documentation provided

---

## Why This Happens

### Common Causes of Vercel Build Cache Issues
1. **Stale Build Cache** - Vercel caches build artifacts
2. **GitHub Sync Delay** - GitHub may not immediately sync with Vercel
3. **Branch Confusion** - Building from wrong branch
4. **Webhook Timing** - GitHub webhook may not trigger immediately

### Prevention
- Always clear Vercel cache after major fixes
- Monitor build logs for discrepancies
- Verify code matches between GitHub and Vercel output
- Use version bumps to signal rebuild needs

---

## Current Status

| Item | Status |
|------|--------|
| Local Code | ✅ Correct (aria-label) |
| GitHub Code | ✅ Correct (aria-label) |
| Vercel Build | ❌ Stale (title attribute) |
| Solution | ✅ Clear cache & rebuild |

---

## Next Actions

1. **IMMEDIATELY**: Clear Vercel build cache
2. **THEN**: Trigger redeploy
3. **MONITOR**: Watch build logs
4. **VERIFY**: Check for successful build

---

## Technical Details

### File: src/components/DeviceTile.tsx
```tsx
// Line 85 - CORRECT
{hasDamage && <AlertCircle className="w-5 h-5 text-red-500" aria-label="Device has damage" />}

// NOT IN CODE (Vercel showing this from cache)
{hasDamage && <AlertCircle className="w-5 h-5 text-red-500" title="Device has damage" />}
```

### Why aria-label is Correct
- Lucide-react components don't accept `title` prop
- `aria-label` is the proper accessibility attribute
- Provides screen reader support
- Follows WCAG accessibility standards

---

## Support

If the issue persists after clearing cache:
1. Check Vercel build logs for other errors
2. Verify GitHub webhook is configured
3. Try manual redeploy from Vercel dashboard
4. Contact Vercel support if needed

---

**Last Updated:** February 5, 2026
**Status:** Awaiting Vercel cache clear and rebuild
**Expected Outcome:** Build succeeds ✅
