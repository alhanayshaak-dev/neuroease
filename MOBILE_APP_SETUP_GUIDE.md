# Mobile App Setup Guide - NeuroEase PWA

## Overview

Your NeuroEase app is now configured as a **Progressive Web App (PWA)** that can be installed on mobile devices and displayed in a mobile frame.

---

## What Was Added

### 1. Web App Manifest (`public/manifest.json`)
- Defines app metadata (name, icons, display mode)
- Sets display mode to `standalone` (full-screen mobile app)
- Includes app icons for different sizes
- Specifies theme colors and orientation

### 2. Mobile Meta Tags (in `src/app/layout.tsx`)
- `apple-mobile-web-app-capable`: Enables iOS installation
- `apple-mobile-web-app-status-bar-style`: Customizes iOS status bar
- `mobile-web-app-capable`: Enables Android installation
- `theme-color`: Sets browser chrome color
- Apple touch icons for home screen

---

## How to Install on Mobile Devices

### iOS (iPhone/iPad)

1. **Open Safari** and navigate to your deployed app URL
2. **Tap the Share button** (square with arrow)
3. **Select "Add to Home Screen"**
4. **Name the app** (default: "NeuroEase")
5. **Tap "Add"**
6. The app will appear on your home screen as a native app

### Android

1. **Open Chrome** and navigate to your deployed app URL
2. **Tap the menu** (three dots in top right)
3. **Select "Install app"** or **"Add to Home screen"**
4. **Confirm installation**
5. The app will appear on your home screen as a native app

---

## Mobile Frame Display

Once installed, the app will display in a **mobile frame** with:
- ✅ Full-screen display (no browser chrome)
- ✅ Native app appearance
- ✅ Status bar integration
- ✅ Home screen icon
- ✅ App switcher support

---

## App Icons Required

To fully support mobile installation, you need to add app icons to `public/`:

### Required Icon Files

```
public/
├── icon-192.png          (192x192 - Android home screen)
├── icon-512.png          (512x512 - Android splash screen)
├── icon-maskable-192.png (192x192 - Adaptive icon)
├── icon-maskable-512.png (512x512 - Adaptive icon)
├── screenshot-1.png      (540x720 - App store preview)
└── screenshot-2.png      (540x720 - App store preview)
```

### Icon Specifications

**Standard Icons (192x192 & 512x512)**
- Format: PNG with transparency
- Should include full app branding
- Used on home screen and app switcher

**Maskable Icons (192x192 & 512x512)**
- Format: PNG with transparency
- Safe zone: Center 66% of image
- Used for adaptive icons on Android 8+
- Allows OS to apply custom shapes

**Screenshots (540x720)**
- Format: PNG
- Portrait orientation
- Show key app features
- Used in app store listings

---

## Configuration Details

### Manifest Settings

```json
{
  "display": "standalone",      // Full-screen app mode
  "orientation": "portrait-primary",  // Portrait orientation
  "theme_color": "#0f172a",     // Browser chrome color
  "background_color": "#ffffff", // Splash screen color
  "start_url": "/"              // App entry point
}
```

### Viewport Settings

```typescript
{
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',         // Use full screen (notch support)
  maximumScale: 1,              // Prevent zoom
  userScalable: false           // Disable user zoom
}
```

---

## Testing Mobile Installation

### Local Testing

1. **Build the app locally:**
   ```bash
   npm run build
   npm run start
   ```

2. **Open on mobile device:**
   - Use your computer's IP address: `http://192.168.x.x:3000`
   - Or use ngrok for HTTPS tunnel

3. **Test installation:**
   - Follow iOS or Android installation steps above
   - Verify app displays in full-screen mode

### Production Testing

1. **Deploy to Vercel** (already done)
2. **Visit deployed URL** on mobile device
3. **Install app** using browser menu
4. **Verify full-screen display**

---

## Troubleshooting

### App Not Installing

**Problem:** "Install app" option not appearing

**Solutions:**
- Ensure HTTPS is used (Vercel provides this)
- Check manifest.json is accessible at `/manifest.json`
- Verify meta tags are in HTML head
- Clear browser cache and try again

### App Shows Web Browser Chrome

**Problem:** App displays with browser address bar

**Solutions:**
- Ensure `display: "standalone"` in manifest
- Check `apple-mobile-web-app-capable` meta tag
- Reinstall app (clear from home screen first)
- Update browser to latest version

### Icons Not Showing

**Problem:** App icon is blank or generic

**Solutions:**
- Add icon files to `public/` directory
- Ensure icon filenames match manifest
- Use PNG format with transparency
- Verify icon dimensions (192x192, 512x512)
- Clear app cache and reinstall

### Status Bar Issues (iOS)

**Problem:** Status bar color not matching

**Solutions:**
- Update `apple-mobile-web-app-status-bar-style`
- Use `black-translucent` for dark apps
- Reinstall app on iOS device

---

## Next Steps

1. **Add App Icons**
   - Create or generate icons for `public/` directory
   - Use tools like: https://www.favicon-generator.org/

2. **Test on Real Devices**
   - Install on iPhone and Android
   - Test all features in full-screen mode
   - Verify responsive design

3. **Monitor Installation**
   - Track PWA installations in analytics
   - Monitor app performance
   - Gather user feedback

4. **Optimize for Mobile**
   - Ensure touch targets are 48px minimum
   - Test on various screen sizes
   - Optimize images for mobile

---

## PWA Features Enabled

✅ **Installable** - Can be installed on home screen  
✅ **Standalone** - Runs in full-screen mode  
✅ **Responsive** - Works on all screen sizes  
✅ **Mobile-Optimized** - Touch-friendly interface  
✅ **Status Bar Integration** - Native appearance  
✅ **App Switcher Support** - Appears in app switcher  

---

## Resources

- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Apple Web App Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Android PWA Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)

---

**Latest Commit:** b474054  
**Status:** ✅ PWA Configuration Complete

