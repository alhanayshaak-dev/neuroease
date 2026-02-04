# Medical Terminology & Critical Alert - Visual Guide

## Dashboard Layout (New Order)

```
┌─────────────────────────────────────────────────────────────────┐
│ Welcome back, Avery Gray                                         │
│ Monitoring Violet Azer, age 16  ← ENLARGED (text-2xl, teal)    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Dashboard Chatbot                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Carousel: Status | Weekly | Monthly | Trends                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Alerts & Notifications ← MOVED UP (Critical Visibility)        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Connected Devices                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Alert Thresholds                                                │
└─────────────────────────────────────────────────────────────────┘

[Rest of dashboard...]
```

## Vital Status Card - Normal State

```
┌─────────────────────────────────────────┐
│ Vital Status                            │
│ Vital parameters within normal range    │
├─────────────────────────────────────────┤
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ SNS Activity     │ Heart Rate (HR)  │ │
│ │ Index            │                  │ │
│ │ 45% →            │ 72 bpm →         │ │
│ │ Cortisol stable  │ HR normal range  │ │
│ │ No change        │ Stable           │ │
│ │ EEG based        │ HR & Pulse based │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Status: Stable                      │ │
│ │ All vital parameters within normal  │ │
│ │ range                               │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Detection Basis                     │ │
│ │ Status identified via EEG brainwave │ │
│ │ detection (SNS activity), heart     │ │
│ │ rate monitoring, and pulse analysis │ │
│ │ from connected wearables.           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Last updated: Just now                  │
└─────────────────────────────────────────┘
```

## Vital Status Card - CRITICAL STATE (Flashing Red)

```
┌─────────────────────────────────────────┐ ← RED BORDER
│ ⚠ CRITICAL ALERT - Immediate Attention │ ← FLASHING
│   Required                              │
├─────────────────────────────────────────┤
│ Vital Status                            │
│ Vital parameters critically elevated    │
├─────────────────────────────────────────┤
│                                         │
│ ┌──────────────────┬──────────────────┐ │
│ │ SNS Activity     │ Heart Rate (HR)  │ │
│ │ Index            │                  │ │
│ │ 82% ↑ 🔴FLASH    │ 115 bpm ↑ 🔴FLASH│ │
│ │ Cortisol elev.   │ Tachycardia      │ │
│ │ Monitor closely  │ Check vitals     │ │
│ │ EEG based        │ HR & Pulse based │ │
│ └──────────────────┴──────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Status: Critical                    │ │
│ │ Multiple vital parameters critically│ │
│ │ elevated                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Detection Basis                     │ │
│ │ Status identified via EEG brainwave │ │
│ │ detection (SNS activity), heart     │ │
│ │ rate monitoring, and pulse analysis │ │
│ │ from connected wearables.           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Last updated: Just now                  │
└─────────────────────────────────────────┘
```

## Medical Terminology Mapping

### Before → After

| Before | After | Medical Term |
|--------|-------|--------------|
| Stress Score | SNS Activity Index | Sympathetic Nervous System Activity |
| Stress rising | Cortisol elevation | Elevated cortisol levels |
| Heart rate elevated | Tachycardia | Elevated heart rate |
| Calm | Stable | Normal vital parameters |
| Rising | Elevated | Above baseline parameters |
| Overload | Critical | Critically elevated parameters |

## Critical Alert Thresholds

### SNS Activity Index
```
0%          50%          75%          100%
├───────────┼───────────┼───────────┤
Normal      Elevated    CRITICAL
            ↑           ↑ FLASHING RED
            Baseline    Alert Threshold
```

### Heart Rate (bpm)
```
60          100         110         180
├───────────┼───────────┼───────────┤
Normal      Elevated    CRITICAL
            ↑           ↑ FLASHING RED
            Baseline    Alert Threshold
```

## Color Coding System

### Normal State
- Background: Navy (`bg-navy-900`)
- Border: Teal (`border-teal-600/30`)
- Text: White/Gray
- Status: Green checkmark (✓)

### Elevated State
- Background: Yellow (`bg-yellow-900/20`)
- Border: Yellow (`border-yellow-600`)
- Text: Yellow/White
- Status: Yellow warning (⚠)

### Critical State
- Background: Red (`bg-red-900/30`)
- Border: Red (`border-red-500`)
- Text: Red (flashing)
- Status: Red alert (!)
- Animation: Pulse (flashing)

## Monitoring Header - Size Increase

### Before
```
Monitoring Violet Azer, age 16
(text-gray-400, regular size)
```

### After
```
Monitoring Violet Azer, age 16
(text-2xl, font-semibold, text-teal-400)
↑ Increased by 3 sizes
↑ Teal color for emphasis
↑ Semibold weight
```

## Alert Positioning

### Before
```
1. Carousel
2. Devices
3. Alerts ← Below devices
4. Notifications
```

### After
```
1. Carousel
2. Alerts ← MOVED UP (Critical visibility)
3. Devices
4. Notifications
```

## Directly Measurable Parameters

### SNS Activity Index
- ✅ Measured via EEG brainwave detection
- ✅ Objective, quantifiable (0-100%)
- ✅ No subjective interpretation
- ✅ Clear threshold definitions

### Heart Rate
- ✅ Measured via pulse sensors
- ✅ Objective, quantifiable (bpm)
- ✅ No subjective interpretation
- ✅ Clear threshold definitions

### Removed
- ❌ Subjective stress descriptions
- ❌ Ambiguous terminology
- ❌ Potential for misinterpretation

## Critical Alert Banner

```
┌─────────────────────────────────────────┐
│ ⚠ CRITICAL ALERT - Immediate Attention │
│   Required                              │
└─────────────────────────────────────────┘
   ↑ Flashing animation
   ↑ Red background
   ↑ AlertTriangle icon
   ↑ Bold text
```

## Detection Basis Information

```
Detection Basis
Status identified via EEG brainwave detection 
(SNS activity), heart rate monitoring, and 
pulse analysis from connected wearables.
```

## Medical Accuracy Features

✅ **Objective Measurements**
- EEG-based SNS activity
- Pulse-based heart rate
- No subjective interpretation

✅ **Clear Terminology**
- Cortisol elevation (not "stress rising")
- Tachycardia (not "heart rate elevated")
- SNS Activity Index (not "stress score")

✅ **Defined Thresholds**
- SNS > 75% = Critical
- HR > 110 bpm = Critical
- Clear alert triggers

✅ **Clinical Context**
- Medical terms for professionals
- Contextual descriptions
- Evidence-based parameters

## User Experience Flow

1. **Guardian opens dashboard**
   - Sees enlarged "Monitoring Violet Azer" header
   - Immediately focuses on patient

2. **Checks vital status**
   - Sees SNS Activity Index and Heart Rate
   - Medical terminology provides clarity
   - No ambiguity about measurements

3. **Critical alert appears**
   - Red flashing card immediately visible
   - "CRITICAL ALERT" banner at top
   - Demands immediate attention

4. **Checks alerts section**
   - Positioned right after carousel
   - No need to scroll far
   - Critical notifications visible

5. **Takes action**
   - Data-driven decision making
   - Medical terminology supports clinical judgment
   - Clear thresholds guide interventions
