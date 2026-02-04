# Carousel Visual Reference

## Carousel Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Horizontal Scrollable Carousel (364px boxes)                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ Violet's Status      │  │ Weekly Status        │  │ Monthly Improvement  │  │ Trend Analysis       │
│                      │  │                      │  │                      │  │                      │
│ Status: Rising       │  │ Avg Stress: 52%      │  │ Stress ↓ 18%         │  │ Peak Time: 2-4 PM    │
│ Stress: 62% ↑        │  │ ████████████░░░░░░░░ │  │ (vs. prev month)     │  │ Best Strategy: Music │
│ Heart Rate: 92 ↑     │  │                      │  │                      │  │ Trigger: Loud Noise  │
│                      │  │ Calm Days: 5/7       │  │ Adherence ↑ 12%      │  │ Recovery: 12 min     │
│ Detection Basis:     │  │ █████████░░░░░░░░░░░ │  │ (Now at 92%)         │  │                      │
│ EEG, HR, Pulse       │  │                      │  │                      │  │                      │
│                      │  │ Overload: 2          │  │ Coping ↑ 25%         │  │                      │
│                      │  │ ██░░░░░░░░░░░░░░░░░░ │  │ (Strategies better)  │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

## Box 1: Violet's Status (Current)

```
┌─────────────────────────────────────────┐
│ Violet's Status                         │
├─────────────────────────────────────────┤
│ Status: Rising ⚠                        │
│ Stress rising, heart rate elevated      │
│                                         │
│ ┌──────────────┬──────────────┐        │
│ │ Stress Score │ Heart Rate   │        │
│ │ 62% ↑        │ 92 bpm ↑     │        │
│ │ Increasing   │ Elevated     │        │
│ │ Monitor      │ Check vitals │        │
│ │ EEG based    │ HR & Pulse   │        │
│ └──────────────┴──────────────┘        │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Status: Rising                      │ │
│ │ One or more parameters elevated     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Detection Basis                     │ │
│ │ Status identified via EEG brainwave │ │
│ │ detection, heart rate monitoring,   │ │
│ │ and pulse analysis from connected   │ │
│ │ wearables.                          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Last updated: Just now                  │
└─────────────────────────────────────────┘
```

## Box 2: Weekly Status

```
┌─────────────────────────────────────────┐
│ Weekly Status                           │
├─────────────────────────────────────────┤
│                                         │
│ Avg Stress Level              52%       │
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                         │
│ Calm Days                     5/7       │
│ █████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                         │
│ Overload Events               2         │
│ ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                         │
└─────────────────────────────────────────┘
```

## Box 3: Monthly Improvement

```
┌─────────────────────────────────────────┐
│ Monthly Improvement                     │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Stress Reduction          ↓ 18%     │ │
│ │ vs. previous month                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Medication Adherence      ↑ 12%     │ │
│ │ Now at 92%                          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Coping Success Rate       ↑ 25%     │ │
│ │ Strategies working better           │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Box 4: Trend Analysis

```
┌─────────────────────────────────────────┐
│ Trend Analysis                          │
├─────────────────────────────────────────┤
│                                         │
│ Peak Stress Time          2-4 PM        │
│                                         │
│ Best Coping Strategy      Music         │
│                                         │
│ Most Common Trigger       Loud Noise    │
│                                         │
│ Recovery Time (Avg)       12 min        │
│                                         │
└─────────────────────────────────────────┘
```

## Color Scheme

### Status Colors
- **Green** (#10b981): Positive trends, calm status
- **Yellow** (#eab308): Neutral, average stress
- **Red** (#ef4444): Negative trends, overload events
- **Teal** (#14b8a6): Primary accent, highlights
- **Blue** (#3b82f6): Secondary accent, improvements
- **Purple** (#a855f7): Tertiary accent, coping metrics

### Background
- **Navy** (#001f3f): Card background
- **Black** (#000000): Overlay, dark sections
- **Gray** (#6b7280): Text, secondary information

## Responsive Behavior

### Desktop (1024px+)
- All 4 boxes visible in carousel
- Horizontal scroll for additional content
- Full width utilization

### Tablet (768px - 1023px)
- 2-3 boxes visible
- Horizontal scroll enabled
- Touch-friendly spacing

### Mobile (< 768px)
- 1 box visible at a time
- Full-width carousel
- Swipe navigation

## Accessibility Features

- ✅ Color contrast meets WCAG AA standards
- ✅ Text labels for all metrics
- ✅ Progress bars with percentage values
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

## Interaction States

### Hover
- Border color changes to teal
- Slight opacity increase
- Cursor changes to pointer

### Active
- Border highlighted in teal
- Background slightly brightened
- Shadow effect applied

### Focus
- Keyboard focus ring visible
- High contrast outline
- Clear focus indicator
