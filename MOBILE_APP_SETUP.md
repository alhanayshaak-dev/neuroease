# Mobile App Setup - PWA Configuration

## Overview
The NeuroEase app is now configured as a Progressive Web App (PWA) to display in a mobile frame instead of a web browser.

## What Was Added

### 1. Web App Manifest (`public/manifest.json`)
- Defines app metadata (name, description, icons)
- Sets display mode to `standalone` (removes browser UI)
- Configures app orientation, theme colors, and shortcuts
- Includes app icons for different sizes and purposes

### 2. Mobile Meta Tags (`src/app/layout.tsx`)
- `mobile-web-app-capable`: Enables mobile web app mode
- `apple-mobile-web-app-capable`: iOS support
- `apple-mobile-web-app-status-bar-style`: iOS status bar styling
- `theme-color`: Sets browser theme color
- Apple touch icons for home screen

### 3. Browser Configuration (`public/browserconfig.xml`)
- Windows tile configuration
- Custom tile colors and icons

### 4. Robots.txt (`public/robots.txt`)
- SEO configuration
- Sitemap reference

## How to Install as Mobile App

### On Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home screen"
4. The app will install as a standalone app

### On iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will install as a standalone app

## Display Mode
- **Standalone**: App displays without browser UI (address bar, etc.)
- **Full Screen**: App takes up entire screen
- **Minimal UI**: Shows only essential browser controls

## What You Need to Add

To fully support the PWA, you should add app icons to the `public/` folder:

```
public/
├── icon-192.png          (192x192 PNG)
├── icon-512.png          (512x512 PNG)
├── icon-maskable-192.png (192x192 PNG with safe zone)
├── icon-maskable-512.png (512x512 PNG with safe zone)
├── icon-96.png           (96x96 PNG for shortcuts)
├── mstile-150x150.png    (150x150 PNG for Windows)
├── screenshot-540.png    (540x720 PNG for mobile)
└── screenshot-1280.png   (1280x720 PNG for desktop)
```

## Icon Requirements

### Regular Icons
- Transparent background
- App logo/branding
- Sizes: 192x192, 512x512, 96x96

### Maskable Icons
- Safe zone: 40% of icon size from edges
- Used for adaptive icons on Android
- Sizes: 192x192, 512x512

### Screenshots
- Mobile: 540x720 (portrait)
- Desktop: 1280x720 (landscape)
- Used in app store listings

## Testing

### Local Testing
```bash
npm run dev
# Open http://localhost:3000
# Use DevTools to test PWA features
```

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run PWA audit
4. Check for issues

## Deployment

After adding icons:
1. Commit changes
2. Push to GitHub
3. Vercel will automatically deploy
4. Clear Vercel cache if needed
5. Test on mobile devices

## Current Status

✅ PWA manifest configured  
✅ Mobile meta tags added  
✅ Standalone display mode enabled  
⏳ App icons needed (add to `public/` folder)  

## Next Steps

1. **Create App Icons**
   - Design or generate icons
   - Add to `public/` folder
   - Ensure proper sizing and formats

2. **Test on Devices**
   - Install on Android device
   - Install on iOS device
   - Verify display and functionality

3. **Monitor Performance**
   - Check Lighthouse scores
   - Monitor app usage
   - Gather user feedback

## Resources

- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Apple Web App Configuration](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

---

**Status:** PWA Configuration Complete  
**Latest Commit:** 73264df  
**Next Action:** Add app icons to `public/` folder

