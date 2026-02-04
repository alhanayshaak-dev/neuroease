# Medical Parameters Visual Guide

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Welcome back, Avery Gray                                                    │
│ Monitoring Violet Azer, age 16  ← INCREASED SIZE (text-2xl)               │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 CRITICAL VITALS MONITORING (Pulsing Red Border)                     │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Heart Rate: 92 bpm          Cortisol: 18.5 μg/dL    GSR: 2.4 μS       │ │
│ │ Normal: 60-100 bpm          Normal: 10-20 μg/dL     Baseline: 1.0-2.0 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [Chatbot Section]                                                           │
│                                                                             │
│ [Carousel with Status Cards]                                               │
│                                                                             │
│ [Alerts & Notifications Below]                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Physiological Status Card

### Normal Status (Green)
```
┌─────────────────────────────────────────┐
│ Physiological Status                    │
│ All physiological parameters within     │
│ normal range                            │
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ Heart Rate (HR)  │ Cortisol (μg/dL) │ │
│ │ 72 bpm →         │ 12.5 →           │ │
│ │ Normal range     │ Normal - 10-20   │ │
│ │ 60-100 bpm       │ μg/dL range      │ │
│ │ Cardiac sensor   │ EEG biomarkers   │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ GSR (μS)         │ Respiratory Rate  │ │
│ │ 1.2 →            │ 14 bpm →          │ │
│ │ Baseline         │ Normal - 12-20    │ │
│ │ 1.0-2.0 μS       │ breaths/min       │ │
│ │ Dermal conduct.  │ Respiratory sens. │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ Status: Stable ✓                        │
│ All parameters within normal range      │
└─────────────────────────────────────────┘
```

### Elevated Status (Yellow)
```
┌─────────────────────────────────────────┐
│ Physiological Status                    │
│ Physiological parameters showing        │
│ elevation (cortisol elevation,          │
│ tachycardia)                            │
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ Heart Rate (HR)  │ Cortisol (μg/dL) │ │
│ │ 92 bpm ↑         │ 18.5 ↑           │ │
│ │ Tachycardia      │ Elevated - Stress│ │
│ │ Elevated HR      │ hormone increase │ │
│ │ Cardiac sensor   │ EEG biomarkers   │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ GSR (μS)         │ Respiratory Rate  │ │
│ │ 2.4 ↑            │ 18 bpm ↑          │ │
│ │ Elevated         │ Elevated - Stress │
│ │ Sympathetic act. │ response          │ │
│ │ Dermal conduct.  │ Respiratory sens. │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ Status: Elevated ⚠                      │
│ One or more parameters elevated -       │
│ Monitor closely                         │
└─────────────────────────────────────────┘
```

### Critical Status (Red - Flashing)
```
┌─────────────────────────────────────────┐
│ 🔴 CRITICAL: Stress parameters exceed   │
│    safe threshold (Pulsing)             │
│                                         │
│ Physiological Status                    │
│ Physiological parameters critically     │
│ elevated                                │
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ Heart Rate (HR)  │ Cortisol (μg/dL) │ │
│ │ 110 bpm ↑        │ 25.0 ↑           │ │
│ │ Tachycardia      │ Elevated - Stress│ │
│ │ Check vitals     │ hormone increase │ │
│ │ Cardiac sensor   │ EEG biomarkers   │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ GSR (μS)         │ Respiratory Rate  │ │
│ │ 3.2 ↑            │ 24 bpm ↑          │ │
│ │ Elevated         │ Tachypnea - Rapid│ │
│ │ Sympathetic act. │ breathing        │ │
│ │ Dermal conduct.  │ Respiratory sens. │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ Status: Critical !                      │
│ Multiple parameters critically elevated │
│ - Immediate intervention required       │
└─────────────────────────────────────────┘
```

## Medical Parameters Reference

### Heart Rate (HR)
```
Parameter: Heart Rate
Unit: Beats per minute (bpm)
Normal Range: 60-100 bpm
Elevated (Tachycardia): > 100 bpm
Measurement: Cardiac sensor
Clinical Significance: Sympathetic nervous system activation
```

### Cortisol Level
```
Parameter: Cortisol
Unit: Micrograms per deciliter (μg/dL)
Normal Range: 10-20 μg/dL
Elevated: > 20 μg/dL
Measurement: EEG biomarkers
Clinical Significance: Primary stress hormone; HPA axis activation
```

### Galvanic Skin Response (GSR)
```
Parameter: Galvanic Skin Response
Unit: Microsiemens (μS)
Normal Range: 1.0-2.0 μS
Elevated: > 2.0 μS
Measurement: Dermal conductance sensor
Clinical Significance: Sympathetic nervous system activity; emotional arousal
```

### Respiratory Rate (RR)
```
Parameter: Respiratory Rate
Unit: Breaths per minute (bpm)
Normal Range: 12-20 breaths/min
Elevated (Tachypnea): > 20 breaths/min
Measurement: Respiratory sensor
Clinical Significance: Stress response and anxiety levels
```

## Critical Vitals Section

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔴 CRITICAL VITALS MONITORING (Pulsing Red)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ │ Heart Rate       │  │ Cortisol Level   │  │ Galvanic Skin    │
│ │ 92 bpm           │  │ 18.5 μg/dL       │  │ Response         │
│ │ Normal: 60-100   │  │ Normal: 10-20    │  │ 2.4 μS           │
│ │ bpm              │  │ μg/dL            │  │ Baseline: 1.0-2.0│
│ └──────────────────┘  └──────────────────┘  └──────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Trend Indicators

### Rising (↑)
- Color: Red
- Meaning: Parameter increasing
- Action: Monitor closely

### Stable (→)
- Color: Gray
- Meaning: Parameter unchanged
- Action: Continue monitoring

### Falling (↓)
- Color: Green
- Meaning: Parameter decreasing
- Action: Positive trend

## Color Scheme

### Status Colors
- **Green**: Stable/Normal (✓)
- **Yellow**: Elevated (⚠)
- **Red**: Critical (!) with pulsing animation

### Parameter Colors
- **Teal**: Normal values
- **Red**: Elevated/Critical values
- **Gray**: Stable/Unchanged

## Animation States

### Pulsing Red (Critical)
- Border: `border-red-500 animate-pulse`
- Alert icon: Animated AlertCircle
- Background: `bg-red-900/30`
- Effect: Draws immediate attention

### Normal State
- Border: Color-coded by status
- No animation
- Steady display

## Accessibility Features

✅ Color contrast meets WCAG AA
✅ Medical abbreviations explained
✅ Units clearly displayed
✅ Normal ranges provided
✅ Semantic HTML structure
✅ Screen reader friendly
✅ Keyboard navigable
