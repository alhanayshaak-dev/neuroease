# NeuroFlow App - Complete Build Specification

**Build for any agent to create exactly what's needed. Every feature, UI, UX, tech stack integrated.**

---

## PROJECT OVERVIEW

**App Name**: NeuroFlow  
**Tagline**: Calm. Control. Independence.  
**Purpose**: Autism independence wearable ecosystem app for real-time sensory overload detection, prediction, and management.  
**Target User**: Violet Azer (16F, autistic)  
**Primary Guardian**: Avery Gray (Mother)  
**Other Guardians**: Kai Azer (Father), Sophie Falcone (Therapist managing 8 patients), Scarlet White (Teacher)  
**Permissions**: Avery has all permissions EXCEPT mic/camera (user discretion)

---

## TECH STACK

- **Frontend**: Next.js (React)
- **Backend**: Supabase (PostgreSQL)
- **AI/ML**: Anthropic API (Claude)
- **Hosting**: Vercel
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Charts**: Recharts or Chart.js
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React (no emojis/text symbols)
- **Mobile**: Mobile-first responsive design

---

## DESIGN SYSTEM

**Colors**:
- Background: Black (#000000)
- Primary: Teal (#14B8A6)
- Secondary: Navy (#001F3F)
- Text: White/Light Gray (#F3F4F6)
- Accent: Teal neon glow

**Logo**: Teal neon brain with electricity coming out of it

**Typography**:
- No emojis or text symbols
- Icons only for visual indicators
- Clear, direct language (no metaphors/idioms)
- Large touch targets (minimum 48x48px)

**Layout**:
- Mobile-first design
- No status bar
- Consistent header bar across all pages
- Fixed navigation bar at bottom
- Horizontal and vertical carousels on dashboard
- Dark mode by default

---

## DATABASE SCHEMA (Supabase)

### Users Table
```
id (UUID, PK)
email (VARCHAR)
password_hash (VARCHAR)
role (ENUM: patient, guardian, therapist, teacher)
name (VARCHAR)
avatar_url (VARCHAR)
pronouns (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Patients Table
```
id (UUID, PK)
user_id (UUID, FK → Users)
date_of_birth (DATE)
diagnosis (TEXT)
support_level (ENUM: 1, 2, 3)
baseline_hr (INT)
baseline_hrv (INT)
baseline_eda (INT)
sensory_triggers (JSONB)
calming_methods (JSONB)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Guardians Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
guardian_user_id (UUID, FK → Users)
relationship (ENUM: parent, therapist, teacher, other)
permissions (JSONB) {
  see_status: BOOLEAN,
  see_alerts: BOOLEAN,
  see_trends: BOOLEAN,
  see_medical: BOOLEAN,
  trigger_emergency: BOOLEAN,
  suggest_strategies: BOOLEAN,
  access_mic: BOOLEAN,
  access_camera: BOOLEAN
}
created_at (TIMESTAMP)
```

### Devices Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
device_type (ENUM: neuroband, neurobud, neurolens)
device_name (VARCHAR)
mac_address (VARCHAR)
battery_level (INT)
is_connected (BOOLEAN)
firmware_version (VARCHAR)
last_sync (TIMESTAMP)
damage_state (JSONB) { part: STRING, severity: ENUM }
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Sensor Data Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
device_id (UUID, FK → Devices)
timestamp (TIMESTAMP)
heart_rate (INT)
hrv (INT)
eda (INT)
accelerometer_x (FLOAT)
accelerometer_y (FLOAT)
accelerometer_z (FLOAT)
location (VARCHAR)
activity (VARCHAR)
stress_score (INT 0-100)
overload_predicted (BOOLEAN)
overload_predicted_in_minutes (INT)
created_at (TIMESTAMP)
```

### Coping Strategies Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
name (VARCHAR)
category (ENUM: breathwork, grounding, body_awareness, sensory, other)
description (TEXT)
duration_minutes (INT)
success_rate (FLOAT 0-1)
last_used (TIMESTAMP)
times_used (INT)
created_by (ENUM: user, system, therapist)
created_at (TIMESTAMP)
```

### Gestures Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
gesture_type (VARCHAR) [long-press, swipe-up, swipe-down, double-tap, triple-tap, custom]
action (VARCHAR)
action_params (JSONB)
applies_to_modes (ARRAY)
user_only (BOOLEAN)
can_be_overridden_by_carer (BOOLEAN)
created_at (TIMESTAMP)
```

### Modes Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
mode_name (VARCHAR) [School, Work, Home, Transit, Custom]
neuroband_sensitivity (ENUM: low, normal, high)
neuroband_haptics_intensity (INT 0-100)
neurobud_noise_reduction (ENUM: off, low, high)
neurobud_social_cues (BOOLEAN)
neurolens_vision_mode (ENUM: reading, outdoor, crowd, task, meeting)
neurolens_cues (BOOLEAN)
created_at (TIMESTAMP)
```

### Medical Files Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
file_type (ENUM: consultation_notes, medication_tracker, upcoming_consultation, diagnosis, other)
title (VARCHAR)
content (TEXT)
file_url (VARCHAR)
uploaded_by (UUID, FK → Users)
created_at (TIMESTAMP)
```

### Medication Tracker Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
medication_name (VARCHAR)
dosage (VARCHAR)
frequency (VARCHAR)
start_date (DATE)
end_date (DATE)
taken_today (BOOLEAN)
taken_times (ARRAY)
created_at (TIMESTAMP)
```

### Appointments Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
appointment_type (VARCHAR) [therapy, dentist, doctor, school_meeting, other]
title (VARCHAR)
scheduled_time (TIMESTAMP)
duration_minutes (INT)
location (VARCHAR)
sensory_prep (JSONB)
notes (TEXT)
created_at (TIMESTAMP)
```

### Care Circle Messages Table
```
id (UUID, PK)
patient_id (UUID, FK → Patients)
sender_id (UUID, FK → Users)
message (TEXT)
message_type (ENUM: update, alert, suggestion, general)
created_at (TIMESTAMP)
```

### Community Library Table
```
id (UUID, PK)
contributor_id (UUID, FK → Users)
strategy_name (VARCHAR)
category (ENUM: breathwork, grounding, sensory, social, other)
description (TEXT)
tags (ARRAY)
is_verified_by_therapist (BOOLEAN)
therapist_count (INT)
user_rating (FLOAT 0-5)
helped_count (INT)
age_group (ENUM: child, teen, adult)
created_at (TIMESTAMP)
```

### Store Products Table
```
id (UUID, PK)
product_type (ENUM: hardware, feature, part, subscription)
name (VARCHAR)
description (TEXT)
price (DECIMAL)
category (VARCHAR)
image_url (VARCHAR)
in_stock (BOOLEAN)
created_at (TIMESTAMP)
```

### Repair Store Table
```
id (UUID, PK)
repair_type (VARCHAR)
part_name (VARCHAR)
cost (DECIMAL)
estimated_days (INT)
partner_location (VARCHAR)
partner_contact (VARCHAR)
created_at (TIMESTAMP)
```

---

## PAGE STRUCTURE & NAVIGATION

### Fixed Header Bar (All Pages)
- **Left**: User info (name, avatar, pronouns, support level)
- **Center**: App logo + "NeuroFlow"
- **Right**: Settings icon, Updates/Notifications bell, Connected devices status

### Fixed Navigation Bar (Bottom)
- Dashboard
- CareCircle
- Patient
- Devices
- Community Library

---

## PAGE SPECIFICATIONS

### 1. DASHBOARD

**Header Section**:
- User zone: Name, avatar, pronouns, support level (Level 1-3)
- Status indicator: "Calm" (green) / "Rising" (amber) / "Overload predicted" (red)
- Current mode: "School → Class 3B" / "Work → Meeting" / "Home → Quiet" / "Transit"

**Real-Time Monitoring**:
- Live stress graph (HRV, EDA, HR) over last 5-10 minutes
- Overload prediction warning: "Overload predicted in 6 minutes"
- Reason: "HRV + EDA rising, noisy environment, 1.5 h in classroom"

**Device Tiles** (Horizontal Carousel):
- Neuroband: Sensitivity (Normal/Low/High), Haptics intensity slider, "Learn new baseline" button
- Neurobud: Noise reduction (OFF/Low/High), "Update firmware" button
- Neurolens: Vision mode selector (Reading, Outdoor, Crowd, Task, Meeting), "Update firmware / AR mapping" button
- Disconnected Neurolens: Grayed out, "Reconnect" button
- Battery icons for all devices

**What's New Feed** (Vertical Carousel):
- "New feature: Advanced tone detection in social cues" → "Try now"
- "Upgrade: VivaLens AR Meeting mode" → "Upgrade hardware"
- "New coping strategy: 5-4-3-2-1 grounding" → "Try now"
- "System update: Overload prediction now 10% more accurate" → "Learn more"
- Controls: "Mark all as read", "Show only major updates", "Hide until next big update"

**Quick-Action Shortcuts** (Customizable):
- "Start calming routine"
- "Hide social cues"
- "Hide visual cues"
- "Send help to carer" (if enabled)
- "Emergency: I need help NOW"

**Patient Health Dashboard** (Mental Health Only):
- Current stress score (0-100%) with color band
- Triggers this week: Loud noise, bright lights, crowds, transitions, social demand
- Stress by location: School, home, shops, public transport, therapy
- Hardest time of day: Lunch break, School hallway, Assembly

---

### 2. SENSORY & OVERLOAD SYSTEM

**Sensory Dashboard**:
- Current stress score (0-100%) + color band
- Triggers this week (pie chart)
- Stress by location (bar chart)
- Hardest time of day (timeline)

**Overload Prediction & Response**:
- "Overload predicted in 5-10 minutes" → "Because: HRV + EDA rising, in noisy environment"
- Your top strategies: Noise reduction, Breathing, Break
- "Start coping now" button → triggers:
  - Earbuds to noise reduction
  - VivaLens to "Crowd" mode
  - Vibration pattern

**Coping Strategies Library**:
- Breathwork: Box breathing (4-4-4-4), 4-7-8 breath, Paced breathing, "Calm in 1 min"
- Grounding: 5-4-3-2-1, "Find 3 blue things", "Name 5 sounds"
- Body awareness: "Squeeze palms", "Press feet into floor", "Shoulder relaxation"
- User can: "Set as default in [mode]", "Suggest to therapist", "Remove from this mode"

**Mode Presets** (User-Created Scenes):
- School Mode: Wristband (Normal sensitivity, gentle haptics), Earbuds (Low noise reduction, social cues ON), VivaLens (Classroom mode, cues ON)
- Crowd Mode: Wristband (High sensitivity, strong haptics), Earbuds (High noise reduction, social cues ON), VivaLens (Crowd mode, navigation arrows ON)
- Home Mode: Wristband (Low sensitivity, haptics OFF), Earbuds (Noise reduction OFF, social cues OFF), VivaLens (Reading mode, cues OFF)
- "Quick switch" from home and menu

---

### 3. COMMUNICATION & SOCIAL CUES (Earbuds)

**Social Cues Settings**:
- Global: "Social cues ON / OFF"
- Per-type: Tone (friendly, impatient, sarcastic), Waiting for answer, Conversation ending/new topic, Who is waiting to speak, Body language (avoiding eye contact, facing away)
- Sensitivity: Show all / Only major cues

**Conversation Mode**:
- Live speech → simplified text: "They're asking: Do you want lunch?"
- Suggestions: "I want lunch" / "No, I'm not hungry"

**Phrase Library** (User-Editable):
- "I don't understand"
- "Can you repeat slowly?"
- "I need to think"
- "I need to step away"
- "I can't speak"

**Voice Output**:
- "Say this now" (through earbuds)
- "Save for gesture: double-tap"

**Gesture-to-Speech**:
- Gestures: long-press, swipe up/down, double-tap, triple-tap, custom
- Assign to phrases: "I need a break", "Too loud", "Too overwhelming", "Help NOW"
- Feedback: "Gesture complete → said 'I need a break'"

---

### 4. VIVALEN VISUAL SYSTEM (AR / Smart Lenses)

**Visual Mode Selector**:
- Reading: higher contrast, reduced glare
- Outdoor: tinted, reduced brightness
- Crowd: background blur, "escape mode"
- Task: focus arrow, "next item"
- Meeting: "speaker highlight", "who is waiting"

**Custom Mode Editor**:
- Brightness, contrast, color temperature
- "Blur background / reduce clutter"
- "Enhance text / borders"

**Visual Cues** (User-Toggled):
- Conversation cues: topic change, person waiting, finished speaking
- Navigation: arrows to exit, quiet room, meeting point
- "Show who is looking at me"
- "Show time passing: 15 min in this room"
- "Show timer for task / meeting"

**AR Overlay Controls**:
- Position: Top-center, Corner, Following eye/gaze
- Size: Small, Medium, Large
- "Minimize when not in social situation"
- "Hide all cues with long-press"

---

### 5. GESTURE & CUSTOMIZATION HUB

**Gesture Editor**:
- Gestures: Long-press, Swipe up/down, Double-tap, Triple-tap, Custom pinches
- For each: Assign action from list, "Apply only in [mode]", "User only" / "Can be overridden by carer"

**Action Library**:
- Sensory: Turn noise reduction ON/OFF, Switch VivaLens to [mode]
- Communication: Simplify next conversation, Hide social cues, Voice output
- Safety & help: Send alert to primary carer, Send alert to secondary carer, Send location + emergency phrase, Initiate emergency call
- Comfort & environment: Start breathing routine, Play calming sound, Remind me to drink water/move
- Device control: Open VivaLens overlay, Open earbud menu, Check battery levels
- Profile & export: Save gesture set as "School"/"Work"/"Home", Export (QR code, link), Import, Reset

**Motor Ability Profiles**:
- Profile 1 (Fine Motor): Double-tap, triple-tap, swipes
- Profile 2 (Limited Motor): Long-press only, large tap zones
- Profile 3 (Tremor/Involuntary Movement): Require 2-second hold to confirm

---

### 6. TRENDS & ANALYTICS (User-Controlled)

**Daily/Weekly/Monthly Views**:
- Stress graph over time
- Overload events (number, duration)
- Triggers pie chart (auditory, visual, social, unknown)

**Place-Based Analysis**:
- Stress by location (school, home, shops, transit)
- "Hardest time of day" (school, after school, evening)

**Behavior & Coping**:
- Most used coping strategies
- Success rate (how often a strategy reduced stress)
- Phrase usage (without recording speech)

**Medication-Stress Correlation**:
- Visual graph: "Stress 20% lower on days you take meds at 8 AM"
- Helps Violet see direct impact of adherence

**Export & Privacy**:
- "Export trends as PDF" (for doctor, therapist, IEP)
- "Anonymize all data" before export
- "Delete data from [date range]"
- "Stop sharing with therapist/school"

---

### 7. CARE CIRCLE

**Care Circle Management**:
- Invite: caregiver, teacher, therapist
- Role: Caregiver (see status, emergency alerts, trends), Teacher (see status + gentle nudge, classroom mode), Therapist (see trends, suggest coping, set goals)
- Permissions per person: "See status", "See emergency alerts", "See trends only", "Suggest new coping strategy"

**Guardian Infos**:
- Avery Gray (Mother) - All permissions except mic/camera
- Kai Azer (Father) - Status, alerts, trends
- Sophie Falcone (Therapist) - Trends, suggestions
- Scarlet White (Teacher) - Status, gentle nudge

**Caregiver View** (Avery's Dashboard):
- Status now (green/amber/red)
- Timeline: overload events, "I need help" requests, emergencies
- Weekly summary
- "Send a calming message"
- "Ask: Are you OK?"
- "Gentle reminder": "Water break?", "Quiet time?"

**Therapist View** (Sophie's Dashboard):
- Individual profile: Triggers, coping strategies, communication style
- Progress: "Reduced overload events by 40% in 4 weeks"
- Goals: "Reduce overload to <2 events/week", "Use 'I need a break' correctly in 80% of overload situations"
- Suggestion log for new strategies, cues, modes

**Group Chats with Updates**:
- Avery can send: "Violet had 3 overload events today. Triggers: transitions + loud noise."
- Sophie can respond: "Try extra prep time before lunch."
- Scarlet can add: "I'll give her a 5-min warning before transitions."

**Disclaimer for Avery**:
- "You have access to Violet's sensor data (HR, HRV, EDA, location) because she has allowed it. This access can be revoked at any time by Violet in Settings."

---

### 8. PATIENT PROFILE

**Patient Diagnosis Info**:
- Diagnosis: Autism Spectrum Disorder (Level 1)
- Support level: 1-3
- Date of diagnosis
- Relevant medical history

**Methods of Calming & Triggers**:
- Calming methods: Quiet spaces, fidget toys, specific music, alone time
- Triggers: Loud voices, fluorescent lights, crowded spaces, unexpected touches
- Can be updated by user as well as NeuroEase system

**Patient Medical Files**:
- Upcoming Consultations
- Medication Trackers
- Previous Consultation Notes
- Diagnosis documents
- IEP (Individualized Education Plan)
- Therapy notes (if shared by therapist)

**Suggested Additional Medical Tracking**:
- Medication adherence correlation with stress
- Side-effect tracking linked to mood/overload
- Seasonal stress patterns
- Sleep quality impact on overload
- Menstrual cycle correlation (if applicable)

**Patient Charts**:
- Charts of info from NeuroEase environment
- Show that cam and audio were disabled by user (privacy indicator)
- Stress trends over time
- Trigger frequency analysis
- Coping strategy effectiveness

**AI Access Controls**:
- "Allow AI to see raw sensor data" (with disclaimer: "Only Avery can enable this")
- "Allow AI to suggest coping strategies"
- "Allow AI to predict overload"
- Data retention: "Auto-delete data older than 90 days"

---

### 9. DEVICES

**All Linked Devices**:
- Neuroband: Battery %, connection status, last sync time
- Neurobud: Battery %, connection status, firmware version
- Neurolens: Battery %, connection status, AR mapping status
- Disconnected Neurolens: Grayed out, "Reconnect" button

**When Clicked - Live Charts**:
- Real-time sensor data (HR, HRV, EDA)
- Tracking of calming methods used
- Device activity timeline
- Gesture usage log

**Device Info**:
- Charge level
- Battery health
- Firmware version
- Last sync time
- Connection strength

**Device State**:
- If any part is damaged: "Neuroband shell: Minor wear. Repair cost: $5"
- Damage severity: Minor, Moderate, Severe
- Repair recommendations

**Gesture Customization for Neuroband**:
- 1 tap: Activate Neurobud
- 2 swipes: Deactivate Neurolens
- Long-press: Emergency mode
- Double-tap: Start breathing routine
- Custom gestures per person (adjustable)

**Store** (Comprehensive):
- Hardware add-ons: In-Ear EEG Buds ($25-40), VivaLens AR Glasses ($15-25), Solar Charging Band, Comfort Band Shells
- Subscriptions: Free (Basic sensing), Basic ($3/month), Premium ($8/month)
- Features: Advanced social cues, Custom AR overlays, Therapist collaboration
- Parts: Band shells ($5), Replacement bands ($10)

**Repair Store** (Comprehensive):
- Access to NeuroEase repair store
- Reduce repurchase costs
- Repair history timeline
- Eco impact tracking: "Your repairs prevented 2.3 kg of e-waste"
- Repair reminders: "Your Neuroband shell is showing wear. Repair now for $5?"
- Recycling tracker: "You've recycled 5 old shells. Great for the planet!"

---

### 10. COMMUNITY LIBRARY

**Social Media Platform**:
- Methods that worked for the community
- User-contributed coping strategies
- Peer support and validation

**Moderation & Trust**:
- Both peer-reviewed and therapist-verified
- Use tags: #breathwork #grounding #sensory #social #emergency
- Therapist-verified badge: "Verified by 5+ therapists"
- User rating system: "Helped 87% of people with similar triggers"
- Age-appropriate tagging: Filter by age group (Violet sees teen-focused strategies)

**Viewing from Avery's POV**:
- Can see Violet's contributions (if shared)
- Can see strategies Violet has tried
- Can suggest strategies to Violet
- Cannot see other users' private data

**Contribution Incentives**:
- "Your grounding technique helped 23 people this month!"
- Contribution badges: "Shared 5 strategies" → Badge
- Impact tracking: "Your breathing technique helped 47 people"
- Peer recognition: "23 people rated your strategy 5 stars"
- Therapist endorsement: Sophie can endorse Violet's strategies

---

### 11. EMERGENCY FEATURE

**User-Controlled Emergency**:
- "Emergency: I need help NOW" gesture
- Max noise reduction
- VivaLens "Escape" mode (bright arrows to exit/quiet room)
- Strong haptic alert (distinct pulse, not alarming, grounding)
- Send alert + location to carer(s)

**Emergency De-escalation Sequence**:
1. Immediate: Max noise reduction + VivaLens escape mode
2. Haptic pattern: Distinct pulse (grounding)
3. Visual countdown: "Help arriving in 3 min"
4. Post-crisis reflection (after 30 min): "What triggered it? What helped? What's different next time?"

**Caregiver Override** (Opt-In Only):
- "Allow primary carer to trigger emergency mode" (user must enable)
- "Emergency: Going to exit mode. Help is coming."

**Crisis Plan & Reflection**:
- Pre-set: "Person to call", "Place to go", "Phrases to use"
- Post-crisis: "What triggered it?", "What helped most?", "What can be different next time?"

---

### 12. APPOINTMENT & ROUTINE SUPPORT

**Appointment Integration**:
- "Therapy, 3:00 PM – with noise reduction ON"
- "Dentist, 5:00 PM – prepare for bright lights & loud sounds"

**Visual Schedule**:
- Tabs: Home, School, Therapy, Leisure
- Simple icons + text (for Level 1-2)
- "Current step: Work 10 min" / "Next: Break 3 min"

**Appointment Prep System**:
- Pre-appointment checklist: "Therapy in 2 hours. Prepare: quiet space, water, fidget toy"
- Sensory prep: "Dentist appointment. Prepare for: bright lights, loud sounds, unfamiliar smells"
- Post-appointment reflection: "How did it go? What helped? What was hard?"

**Therapist Notes Integration**:
- Sophie can add notes post-session visible to Violet
- Violet can see progress notes
- Appointment history tracking

**Transition Support**:
- Pre-transition alerts: 10 min before schedule change
- Transition checklist: Custom per-mode (e.g., "Leaving school" = pack bag, turn off social cues, activate noise reduction)
- Buffer time tracking: Shows Violet how much buffer time she needs between activities

**Tele-Care & Remote Support**:
- "Call therapist with one tap"
- "Share current stress level"
- "Therapist guided session" with breathing, grounding, social rehearsal

---

### 13. SETTINGS & ACCESSIBILITY

**App Settings**:
- Font size, color contrast, high-/low-stimulus themes
- Reduce motion, reduce animations
- "Symbols only", "Symbols + text", "Text only"
- Dark mode toggle (default ON)
- Disable animations toggle

**User Control Over All Care**:
- "Allow caregiver to see my status"
- "Allow teacher to see gentle nudge"
- "Allow therapist to see trends"
- "Allow caregiver to trigger emergency mode"
- "Stop all sharing with school"

**Every Feature Opt-In**:
- Sensory alerts: ON/OFF
- Social cues: ON/OFF
- Visual cues: ON/OFF
- Caregiver alerts: ON/OFF
- Real-time monitoring: ON/OFF
- "What's New" notifications: ON/OFF

**Privacy & Data Control Dashboard**:
- Visual permission matrix showing all guardians and their access levels
- Data retention settings: "Auto-delete data older than 90 days"
- AI access toggle: "Allow AI to see raw sensor data"

**Accessibility for Neurodivergent Users**:
- No time pressure: Forms don't auto-submit, no countdown timers
- Clear language: No metaphors, idioms, or sarcasm in UI copy
- Consistent layout: Same button positions across all screens
- Large touch targets: Minimum 48x48px buttons
- No forced features: Everything is optional

---

## FEATURE INTEGRATION MATRIX

| Feature | Dashboard | CareCircle | Patient | Devices | Community |
|---------|-----------|-----------|---------|---------|-----------|
| Real-time monitoring | ✓ | ✓ (Avery only) | ✓ | ✓ | - |
| Stress prediction | ✓ | ✓ (Avery) | ✓ | ✓ | - |
| Coping strategies | ✓ | - | ✓ | - | ✓ |
| Gesture control | ✓ | - | ✓ | ✓ | - |
| Social cues | ✓ | - | ✓ | - | - |
| Visual modes | ✓ | - | ✓ | - | - |
| Medical tracking | - | - | ✓ | - | - |
| Medication correlation | - | ✓ (Sophie) | ✓ | - | - |
| Therapist collaboration | - | ✓ | ✓ | - | ✓ |
| Emergency response | ✓ | ✓ | ✓ | - | - |
| Appointment prep | - | - | ✓ | - | - |
| Device management | ✓ | - | - | ✓ | - |
| Store/Repair | - | - | - | ✓ | - |
| Community sharing | - | - | - | - | ✓ |

---

## IMPLEMENTATION PRIORITY

**Phase 1 (MVP)**:
1. Authentication (Supabase Auth)
2. Dashboard with real-time monitoring
3. Patient profile
4. Gesture customization
5. Emergency feature

**Phase 2**:
1. CareCircle management
2. Coping strategies library
3. Trends & analytics
4. Appointment scheduling

**Phase 3**:
1. Community library
2. Store & repair
3. Therapist collaboration
4. Advanced AI features

**Phase 4**:
1. Device integration (real sensor data)
2. Advanced analytics
3. Medication correlation
4. Accessibility enhancements

---

## DEPLOYMENT

- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Environment**: .env.local (see .env.local file)
- **Build**: `npm run build`
- **Deploy**: `vercel deploy`

---

## NOTES FOR BUILDERS

1. **Every feature is OFF by default** - User must explicitly enable
2. **Anti-infantilization** - No "baby mode", only "personalized mode"
3. **User control first** - Violet controls her own data and permissions
4. **Privacy by design** - Avery has access disclaimer, data can be revoked
5. **Accessibility** - No time pressure, clear language, large touch targets
6. **Mobile-first** - Design for phone first, then scale up
7. **Icons only** - No emojis or text symbols
8. **Dark mode default** - Reduces visual overwhelm
9. **Consistent layout** - Header and nav bar stay fixed
10. **Real-time updates** - Use Supabase Realtime for live data

---

**Build this exactly as specified. Every feature, every UI element, every permission, every interaction is documented above.**
