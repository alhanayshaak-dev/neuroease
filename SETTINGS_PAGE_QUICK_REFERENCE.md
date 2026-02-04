# Settings Page - Quick Reference Guide

## File Structure

```
src/
├── app/guardian/settings/
│   └── page.tsx                          # Main settings page
└── components/
    ├── SettingsPersonalTab.tsx           # Tab 1: Personal info
    ├── SettingsAccessibilityTab.tsx      # Tab 2: Accessibility
    ├── SettingsDisplayTab.tsx            # Tab 3: Display/Theme
    ├── SettingsNotificationsTab.tsx      # Tab 4: Notifications
    ├── SettingsSecurityTab.tsx           # Tab 5: Security
    ├── SettingsPrivacyTab.tsx            # Tab 6: Privacy
    ├── SettingsBackupTab.tsx             # Tab 7: Backup
    ├── SettingsIntegrationsTab.tsx       # Tab 8: Integrations
    ├── SettingsComplianceTab.tsx         # Tab 9: Compliance
    └── SettingsAboutTab.tsx              # Tab 10: About
```

## Tab Overview

| Tab | Features | Key Components |
|-----|----------|-----------------|
| **Personal** | Name, email, phone, location, relationship | Edit mode, save/cancel, logout |
| **Accessibility** | Text size, dyslexic font, high contrast, language | Toggles, dropdowns, radio buttons |
| **Display** | Color scheme, accent color | Radio buttons, color swatches |
| **Notifications** | Sound, vibration, DND schedule | Toggles, time pickers |
| **Security** | 2FA, biometric, password, login activity | Toggles, modals, activity list |
| **Privacy** | Analytics, data logs, export, delete | Toggles, modals, confirmation dialogs |
| **Backup** | Auto backup, history, restore, recovery codes | Toggles, modals, history list |
| **Integrations** | Connected apps, API keys, marketplace | Lists, connect/disconnect buttons |
| **Compliance** | HIPAA, GDPR, audit trails, data retention | Expandable sections, status badges |
| **About** | Version, build, legal docs, support | Links, buttons, info display |

## Color Scheme

```
Primary Colors:
- Background: #000000 (black)
- Surface: #001a33 (navy-900)
- Accent: #14b8a6 (teal)
- Text: #ffffff (white)
- Secondary Text: #9ca3af (gray-400)

State Colors:
- Success: #22c55e (green)
- Warning: #f59e0b (amber)
- Error: #ef4444 (red)
- Info: #3b82f6 (blue)
```

## Component Props

### SettingsPersonalTab
```tsx
interface PersonalTabProps {
  onLogout?: () => void;
}
```

### Other Tabs
No props required - all state is managed internally.

## Key Features

### Toggles
- Button-based toggles with "Enabled"/"Disabled" text
- Teal background when enabled
- Black/50 background when disabled

### Modals
- Fixed positioning with z-50
- Dark overlay background
- Centered content
- Close buttons and action buttons

### Forms
- Input fields with teal borders
- Placeholder text in gray
- Full-width inputs
- Proper spacing and labels

### Lists
- Scrollable containers
- Consistent item styling
- Action buttons (remove, disconnect, etc.)
- Status indicators

## Responsive Breakpoints

```
Mobile: < 768px
- 2-column tab grid
- Full-width content
- Stacked layouts

Tablet: 768px - 1024px
- 3-column tab grid
- Optimized spacing

Desktop: > 1024px
- 5-column tab grid
- Max-width container (max-w-7xl)
```

## Icon Usage

All icons from Lucide React:
- User, Mail, Phone, MapPin, Briefcase (Personal)
- Eye, Type, Contrast, Globe (Accessibility)
- Moon, Sun, Palette (Display)
- Volume2, Vibrate, Clock (Notifications)
- Lock, Fingerprint, Key, Activity (Security)
- BarChart3, Download, Trash2 (Privacy)
- HardDrive, Calendar, RotateCcw, AlertCircle (Backup)
- Zap, Code, Store (Integrations)
- FileText, Shield, FileCheck (Compliance)
- Info, BookOpen, Mail (About)

## State Management

Each component uses React hooks:
```tsx
const [activeTab, setActiveTab] = useState('personal');
const [isEditing, setIsEditing] = useState(false);
const [showModal, setShowModal] = useState(false);
```

## Styling Classes

### Common Classes
```
Containers:
- bg-navy-900 border border-teal-600/30 rounded-lg p-6

Buttons:
- bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold
- bg-teal-600/20 border border-teal-600 text-teal-400

Inputs:
- bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white

Text:
- text-white font-bold (headers)
- text-gray-300 font-semibold (labels)
- text-gray-400 text-sm (secondary)
```

## Accessibility Features

✅ All buttons have `type="button"`
✅ Proper label associations
✅ Semantic HTML structure
✅ High contrast colors
✅ Keyboard navigation support
✅ Focus states on interactive elements
✅ ARIA labels where needed

## Performance Considerations

- Components are modular and lazy-loadable
- State is local to each component
- No unnecessary re-renders
- Efficient event handling
- Optimized for mobile devices

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing Checklist

- [ ] All tabs load correctly
- [ ] Tab switching works smoothly
- [ ] Toggles update state
- [ ] Modals open/close properly
- [ ] Forms accept input
- [ ] Buttons are clickable
- [ ] Responsive design works on mobile
- [ ] Icons display correctly
- [ ] Colors match design spec
- [ ] No console errors

## Deployment Notes

1. Ensure GuardianLayout component is available
2. Ensure Lucide React is installed
3. Ensure Tailwind CSS is configured
4. Test on multiple devices
5. Verify all links work
6. Check accessibility compliance

## Future Integration Points

- Connect to backend API for data persistence
- Implement real authentication
- Add analytics tracking
- Integrate with notification service
- Connect to backup service
- Implement 2FA setup flow
- Add biometric enrollment
- Connect to compliance reporting system
