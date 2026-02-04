# NeuroFlow UI Components Specification

**Mobile-first design. Icons only. No emojis. Dark mode default. Consistent header & nav.**

---

## DESIGN TOKENS

### Colors
```
Primary: #14B8A6 (Teal)
Secondary: #001F3F (Navy)
Background: #000000 (Black)
Text: #F3F4F6 (Light Gray)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Danger: #EF4444 (Red)
Neutral: #6B7280 (Gray)
```

### Typography
```
Heading 1: 32px, Bold, Line-height 1.2
Heading 2: 24px, Bold, Line-height 1.3
Heading 3: 20px, Semi-bold, Line-height 1.4
Body: 16px, Regular, Line-height 1.5
Small: 14px, Regular, Line-height 1.4
Caption: 12px, Regular, Line-height 1.3
```

### Spacing
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Border Radius
```
sm: 4px
md: 8px
lg: 12px
full: 9999px
```

---

## LAYOUT STRUCTURE

### Header Bar (Fixed, All Pages)
```
Height: 64px
Background: #000000
Border-bottom: 1px solid #1F2937

Layout:
[Avatar + Name] [Logo] [Settings | Notifications | Device Status]

Left Section (24px padding):
- User avatar (40x40px, circular)
- User name (16px, semi-bold)
- Support level badge (12px, teal background)

Center Section:
- NeuroFlow logo (teal neon brain icon)
- "NeuroFlow" text (20px, bold)

Right Section (24px padding):
- Settings icon (24x24px, clickable)
- Notifications bell (24x24px, with badge count)
- Device status indicator (connected/disconnected)
```

### Navigation Bar (Fixed Bottom, All Pages)
```
Height: 64px
Background: #000000
Border-top: 1px solid #1F2937

Layout: 5 equal sections
- Dashboard (icon + label)
- CareCircle (icon + label)
- Patient (icon + label)
- Devices (icon + label)
- Community (icon + label)

Active state: Teal text + teal underline
Inactive state: Gray text
```

### Main Content Area
```
Padding: 16px (mobile), 24px (tablet)
Max-width: 100% (mobile), 1200px (desktop)
Margin-top: 64px (header)
Margin-bottom: 64px (nav bar)
```

---

## COMPONENT SPECIFICATIONS

### 1. STATUS INDICATOR
```
Component: StatusBadge
Props: status ('calm' | 'rising' | 'overload')

Calm:
- Background: #10B981 (Green)
- Text: "Calm"
- Icon: Checkmark

Rising:
- Background: #F59E0B (Amber)
- Text: "Rising"
- Icon: Alert triangle

Overload:
- Background: #EF4444 (Red)
- Text: "Overload predicted in 6 min"
- Icon: Alert circle

Size: 32px height, 12px font
Padding: 8px 12px
Border-radius: 8px
```

### 2. DEVICE TILE
```
Component: DeviceTile
Props: device (object), isConnected (boolean)

Layout:
[Icon] [Device Name] [Battery %]
[Status] [Action Button]

Dimensions: Full width, 120px height
Background: #1F2937
Border: 1px solid #374151
Border-radius: 12px
Padding: 16px

Connected state:
- Border: Teal
- Status: "Connected"
- Battery icon: Green

Disconnected state:
- Border: Gray
- Status: "Disconnected"
- Battery icon: Gray
- Action: "Reconnect" button

Battery indicator:
- 0-20%: Red
- 21-50%: Amber
- 51-100%: Green
```

### 3. STRESS GRAPH
```
Component: StressChart
Props: data (array), timeRange ('5min' | '1hour' | '1day' | '1week')

Chart type: Line chart (Recharts)
X-axis: Time
Y-axis: Stress score (0-100)
Line color: Teal (#14B8A6)
Fill: Teal with 20% opacity
Height: 200px
Responsive: Yes

Interaction:
- Hover: Show tooltip with exact value
- Tap: Show details for that time point
```

### 4. CAROUSEL (Horizontal)
```
Component: HorizontalCarousel
Props: items (array), itemWidth (number)

Layout: Scrollable horizontal list
Item spacing: 12px
Padding: 16px
Snap: Yes (to item)
Show scroll indicator: Yes (bottom)

Item card:
- Width: 280px (mobile), 320px (tablet)
- Height: Auto
- Background: #1F2937
- Border-radius: 12px
- Padding: 16px
- Shadow: 0 4px 6px rgba(0,0,0,0.3)
```

### 5. CAROUSEL (Vertical)
```
Component: VerticalCarousel
Props: items (array)

Layout: Scrollable vertical list
Item spacing: 12px
Padding: 16px
Snap: Yes (to item)

Item card:
- Width: 100%
- Height: Auto
- Background: #1F2937
- Border-radius: 12px
- Padding: 16px
- Shadow: 0 4px 6px rgba(0,0,0,0.3)
```

### 6. BUTTON
```
Component: Button
Props: variant ('primary' | 'secondary' | 'danger'), size ('sm' | 'md' | 'lg'), disabled (boolean)

Primary:
- Background: #14B8A6 (Teal)
- Text: #000000 (Black)
- Hover: Darker teal
- Active: Even darker teal

Secondary:
- Background: #1F2937 (Dark gray)
- Text: #F3F4F6 (Light gray)
- Border: 1px solid #374151
- Hover: Lighter gray background

Danger:
- Background: #EF4444 (Red)
- Text: #FFFFFF (White)
- Hover: Darker red

Sizes:
- sm: 32px height, 12px font, 8px padding
- md: 40px height, 14px font, 12px padding
- lg: 48px height, 16px font, 16px padding

Border-radius: 8px
Disabled: 50% opacity, cursor not-allowed
```

### 7. INPUT FIELD
```
Component: Input
Props: type ('text' | 'email' | 'password' | 'number'), placeholder, value, onChange

Height: 40px
Width: 100%
Background: #1F2937
Border: 1px solid #374151
Border-radius: 8px
Padding: 12px
Font: 14px
Color: #F3F4F6

Focus:
- Border: 2px solid #14B8A6
- Box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1)

Placeholder: #6B7280
Disabled: 50% opacity, cursor not-allowed
```

### 8. SLIDER
```
Component: Slider
Props: min, max, value, onChange, label

Height: 40px
Width: 100%
Track: #374151
Fill: #14B8A6
Thumb: 20x20px, #14B8A6, circular
Padding: 12px

Label: Above slider, 14px, semi-bold
Value display: Right side, 16px, teal

Interaction:
- Drag: Smooth
- Tap: Jump to position
```

### 9. TOGGLE SWITCH
```
Component: Toggle
Props: checked (boolean), onChange, label

Height: 32px
Width: 56px
Background (off): #374151
Background (on): #14B8A6
Thumb: 28x28px, circular, white
Border-radius: 16px
Transition: 200ms

Label: Left or right, 14px
Interaction: Tap to toggle
```

### 10. MODAL
```
Component: Modal
Props: isOpen (boolean), onClose, title, children

Overlay: Black with 50% opacity
Modal:
- Width: 90% (mobile), 500px (tablet)
- Background: #1F2937
- Border-radius: 12px
- Padding: 24px
- Box-shadow: 0 20px 25px rgba(0,0,0,0.5)

Header:
- Title: 20px, bold
- Close button: Top-right, 24x24px

Content: Scrollable if needed
Footer: Optional action buttons

Animation: Fade in/out, 200ms
```

### 11. CARD
```
Component: Card
Props: children, variant ('default' | 'elevated' | 'outlined')

Default:
- Background: #1F2937
- Border: None
- Shadow: 0 4px 6px rgba(0,0,0,0.3)

Elevated:
- Background: #1F2937
- Border: None
- Shadow: 0 10px 15px rgba(0,0,0,0.5)

Outlined:
- Background: #000000
- Border: 1px solid #374151
- Shadow: None

Padding: 16px
Border-radius: 12px
```

### 12. BADGE
```
Component: Badge
Props: label, variant ('success' | 'warning' | 'danger' | 'info')

Success: Green background, white text
Warning: Amber background, black text
Danger: Red background, white text
Info: Teal background, black text

Height: 24px
Padding: 4px 8px
Font: 12px, semi-bold
Border-radius: 4px
```

### 13. PERMISSION MATRIX
```
Component: PermissionMatrix
Props: guardians (array), permissions (array)

Layout: Table-like grid
Rows: Guardian names
Columns: Permission types

Cell:
- Checked: Teal checkmark
- Unchecked: Gray empty box
- Disabled: Gray with strikethrough

Interaction:
- Tap to toggle (if editable)
- Show tooltip on hover

Responsive: Horizontal scroll on mobile
```

### 14. GESTURE EDITOR
```
Component: GestureEditor
Props: gestures (array), onSave

Layout:
[Gesture Type] [Action] [Modes] [Edit] [Delete]

Gesture Type:
- Dropdown: long-press, swipe-up, swipe-down, double-tap, triple-tap, custom

Action:
- Dropdown: List of all available actions

Modes:
- Multi-select: School, Work, Home, Transit, Custom

Edit button: Opens modal to configure
Delete button: Removes gesture

Add new: "+" button at bottom
```

### 15. CHART (Stress by Location)
```
Component: LocationChart
Props: data (array)

Chart type: Bar chart (Recharts)
X-axis: Location names
Y-axis: Average stress score
Bar color: Teal
Height: 250px
Responsive: Yes

Interaction:
- Hover: Show exact value
- Tap: Show details for that location
```

### 16. TIMELINE
```
Component: Timeline
Props: events (array)

Layout: Vertical list
Event item:
- Time: Left side, 12px, gray
- Icon: Circle, teal or gray
- Content: Right side, 14px
- Divider: Vertical line between items

Event types:
- Overload: Red icon
- Alert: Amber icon
- Success: Green icon
- General: Teal icon

Interaction:
- Tap: Show full details
- Swipe: Dismiss
```

### 17. MEDICATION TRACKER
```
Component: MedicationTracker
Props: medications (array), onUpdate

Layout: List of medications
Item:
- Name: 16px, semi-bold
- Dosage: 14px, gray
- Frequency: 14px, gray
- Checkbox: Taken today
- Time: When taken

Interaction:
- Tap checkbox: Mark as taken
- Tap time: Edit time
- Swipe: Delete

Add new: "+" button at bottom
```

### 18. APPOINTMENT CARD
```
Component: AppointmentCard
Props: appointment (object)

Layout:
[Icon] [Type] [Time]
[Title]
[Location]
[Sensory Prep] [Notes]

Dimensions: Full width, auto height
Background: #1F2937
Border-radius: 12px
Padding: 16px

Time: 14px, teal
Title: 16px, semi-bold
Location: 14px, gray
Sensory prep: 12px, italic, amber background
Notes: 12px, gray

Interaction:
- Tap: Show full details
- Swipe: Edit or delete
```

### 19. COMMUNITY STRATEGY CARD
```
Component: StrategyCard
Props: strategy (object)

Layout:
[Avatar] [Name] [Verified Badge]
[Title]
[Category Tags]
[Description]
[Rating] [Helped Count]

Dimensions: Full width, auto height
Background: #1F2937
Border-radius: 12px
Padding: 16px

Avatar: 32x32px, circular
Name: 14px, semi-bold
Verified badge: Teal checkmark
Title: 16px, bold
Tags: 12px, teal background
Description: 14px, gray
Rating: 5-star display, 12px
Helped count: 12px, gray

Interaction:
- Tap: Show full details
- Tap rating: Rate strategy
- Tap "Try": Add to my strategies
```

### 20. EMERGENCY BUTTON
```
Component: EmergencyButton
Props: onPress

Dimensions: 64x64px, circular
Background: #EF4444 (Red)
Icon: Alert circle, white, 32x32px
Position: Fixed, bottom-right, 24px from edges
Shadow: 0 10px 15px rgba(239, 68, 68, 0.5)

Hover: Darker red, larger shadow
Active: Pulse animation

Interaction:
- Tap: Trigger emergency mode
- Long-press: Show confirmation
```

---

## RESPONSIVE BREAKPOINTS

```
Mobile: 0px - 640px
Tablet: 641px - 1024px
Desktop: 1025px+

Mobile-first approach:
- Design for mobile first
- Add media queries for larger screens
- Use flexible layouts (flexbox, grid)
```

---

## ACCESSIBILITY REQUIREMENTS

- Minimum touch target: 48x48px
- Color contrast: WCAG AA (4.5:1 for text)
- No time pressure: Forms don't auto-submit
- Clear labels: All inputs have labels
- Keyboard navigation: All interactive elements
- Screen reader support: Semantic HTML, ARIA labels
- Reduced motion: Respect prefers-reduced-motion
- Large text option: Font size up to 24px
- High contrast mode: Support high contrast colors

---

## ANIMATION GUIDELINES

- Transitions: 200ms ease-in-out
- Modals: Fade in/out, 200ms
- Buttons: Scale on press, 100ms
- Carousels: Smooth scroll, 300ms
- Charts: Animate on load, 500ms
- Disable animations: Respect prefers-reduced-motion

---

## DARK MODE

- Default: Dark mode ON
- Background: #000000
- Cards: #1F2937
- Borders: #374151
- Text: #F3F4F6
- Accents: #14B8A6 (Teal)

---

## ICON SPECIFICATIONS

All icons from Lucide React. No emojis or text symbols.

Common icons:
- Dashboard: LayoutDashboard
- CareCircle: Users
- Patient: User
- Devices: Smartphone
- Community: Share2
- Settings: Settings
- Notifications: Bell
- Alert: AlertCircle
- Success: CheckCircle
- Warning: AlertTriangle
- Error: XCircle
- Close: X
- Menu: Menu
- Back: ChevronLeft
- Forward: ChevronRight
- Edit: Edit2
- Delete: Trash2
- Add: Plus
- Search: Search
- Filter: Filter
- Download: Download
- Upload: Upload
- Share: Share2
- Lock: Lock
- Unlock: Unlock
- Eye: Eye
- EyeOff: EyeOff
- Heart: Heart
- Star: Star
- Zap: Zap (for emergency)
- Brain: Brain (for NeuroFlow logo)
