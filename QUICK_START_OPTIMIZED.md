# Quick Start - Optimized Build

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:3001/**

### 3. Access the App
- **Main Page**: http://localhost:3001/
- **Guardian Dashboard**: http://localhost:3001/guardian
- **Patient Page**: http://localhost:3001/patient
- **Devices**: http://localhost:3001/devices
- **Care Circle**: http://localhost:3001/care-circle
- **Community**: http://localhost:3001/community

## Expected Load Times (Optimized)
- **First Load**: ~2-3 seconds
- **Subsequent Loads**: ~1-1.5 seconds
- **Page Navigation**: <500ms

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Troubleshooting

### App Still Loading Slowly?
1. **Clear cache**: `rm -r .next node_modules/.cache`
2. **Restart server**: Stop and run `npm run dev` again
3. **Check network**: Ensure internet connection for Supabase
4. **Check browser**: Clear browser cache (Ctrl+Shift+Delete)

### Port Already in Use?
```bash
# Kill process on port 3001
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### Build Errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance Features Enabled
✅ Code splitting for vendor chunks
✅ Optimized CSS compilation
✅ Non-blocking accessibility initialization
✅ Conditional minification (dev vs prod)
✅ Tailwind CSS optimization

## Environment Variables
Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-key
NEXT_PUBLIC_APP_NAME=NeuroEase
NEXT_PUBLIC_APP_TAGLINE=Ease. Elevate. Empower.
NEXT_PUBLIC_ENABLE_COMMUNITY_LIBRARY=true
NEXT_PUBLIC_ENABLE_AI_INSIGHTS=true
NEXT_PUBLIC_ENABLE_DEVICE_TRACKING=true
```

## Deployment

### Vercel Deployment
```bash
# Push to GitHub
git push origin main

# Vercel will auto-deploy
# Check: https://vercel.com/dashboard
```

### Manual Build
```bash
npm run build
npm start
```

## Support
For issues or questions, check:
- PERFORMANCE_OPTIMIZATION.md - Performance details
- CLEANUP_FIX_SUMMARY.md - Recent fixes
- CLEANUP_SUMMARY.md - Code cleanup details

---

**Status**: ✅ Optimized and ready for development/deployment
