# NeuroFlow - Autism Independence Wearable Ecosystem App

**Calm. Control. Independence.**

A comprehensive mobile app for real-time sensory overload detection, prediction, and management for autistic individuals. Built with Next.js, Supabase, and Anthropic AI.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

```bash
# Clone repository
git clone <repo-url>
cd neuroflow

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Setup

See `.env.local` for required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ANTHROPIC_API_KEY`

---

## Project Structure

```
neuroflow/
├── README.md                          # This file
├── NEUROFLOW_BUILD_SPEC.md           # Complete feature specification
├── DATABASE_SCHEMA.sql               # Supabase schema
├── UI_COMPONENTS.md                  # Component specifications
├── API_INTEGRATION.md                # API endpoints & integration
├── .env.local                        # Environment variables
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (header + nav)
│   │   ├── page.tsx                 # Dashboard
│   │   ├── dashboard/
│   │   ├── care-circle/
│   │   ├── patient/
│   │   ├── devices/
│   │   ├── community/
│   │   └── auth/
│   │
│   ├── components/
│   │   ├── Header.tsx               # Fixed header bar
│   │   ├── Navigation.tsx            # Fixed bottom nav
│   │   ├── StatusBadge.tsx
│   │   ├── DeviceTile.tsx
│   │   ├── StressChart.tsx
│   │   ├── Carousel.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── PermissionMatrix.tsx
│   │   ├── GestureEditor.tsx
│   │   ├── Timeline.tsx
│   │   ├── MedicationTracker.tsx
│   │   ├── AppointmentCard.tsx
│   │   ├── StrategyCard.tsx
│   │   └── EmergencyButton.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   ├── anthropic.ts             # Anthropic API client
│   │   ├── auth.ts                  # Authentication helpers
│   │   ├── api.ts                   # API request helpers
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useSensorData.ts         # Real-time sensor data
│   │   ├── useGuardians.ts          # Care circle management
│   │   ├── useStrategies.ts         # Coping strategies
│   │   └── useDevices.ts            # Device management
│   │
│   ├── types/
│   │   ├── index.ts                 # TypeScript types
│   │   ├── patient.ts
│   │   ├── guardian.ts
│   │   ├── device.ts
│   │   ├── sensor.ts
│   │   └── strategy.ts
│   │
│   ├── styles/
│   │   ├── globals.css              # Global styles
│   │   └── tailwind.css             # Tailwind config
│   │
│   └── api/
│       ├── auth/
│       ├── sensor-data/
│       ├── devices/
│       ├── gestures/
│       ├── care-circle/
│       ├── strategies/
│       ├── medical-files/
│       ├── medications/
│       ├── appointments/
│       ├── community/
│       ├── store/
│       ├── repair/
│       ├── analytics/
│       └── ai/
│
├── public/
│   ├── logo.svg                     # NeuroFlow logo
│   └── icons/                       # Lucide icons
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## Key Features

### 1. Dashboard
- Real-time stress monitoring (HRV, EDA, HR)
- Overload prediction (5-10 min warning)
- Device status & battery
- What's New feed
- Quick-action shortcuts
- Patient health overview

### 2. Sensory & Overload System
- Stress scoring (0-100%)
- Trigger tracking by type & location
- Coping strategy library
- Mode presets (School, Work, Home, Transit)
- Overload prediction with AI

### 3. Communication & Social Cues
- Live conversation simplification
- Social cue detection (tone, body language, waiting)
- Gesture-to-speech
- Phrase library (user-editable)
- Voice output through earbuds

### 4. VivaLens Visual System
- 5 visual modes (Reading, Outdoor, Crowd, Task, Meeting)
- Custom mode editor
- Visual cues (conversation, navigation, time)
- AR overlay controls

### 5. Gesture Customization
- 100% customizable gestures
- Motor ability profiles
- Per-mode gesture assignment
- Caregiver override (optional)

### 6. Care Circle Management
- Guardian roles (parent, therapist, teacher)
- Granular permissions per guardian
- Group chats with updates
- Caregiver dashboard
- Therapist collaboration

### 7. Patient Profile
- Diagnosis & support level
- Medical files & consultation notes
- Medication tracking
- Appointment scheduling
- AI access controls

### 8. Device Management
- Live device charts
- Battery & connection status
- Damage state tracking
- Gesture customization per device
- Comprehensive store & repair

### 9. Community Library
- Peer-shared coping strategies
- Therapist-verified badges
- Age-appropriate filtering
- Rating & impact tracking
- Contribution incentives

### 10. Emergency Feature
- User-controlled emergency mode
- Max noise reduction + escape navigation
- Haptic alerts
- Post-crisis reflection
- Optional caregiver override

### 11. Trends & Analytics
- Stress graphs over time
- Triggers by location & time
- Coping strategy success rates
- Medication-stress correlation
- PDF export for IEP/therapy

### 12. Accessibility
- Dark mode by default
- No time pressure
- Clear, direct language
- Large touch targets (48x48px)
- Reduced motion support
- High contrast mode

---

## Tech Stack

**Frontend**
- Next.js 14+ (React)
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)

**Backend**
- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Realtime
- Row Level Security (RLS)

**AI/ML**
- Anthropic Claude API
- Overload prediction
- Strategy suggestions
- Conversation simplification
- Therapist insights

**Hosting**
- Vercel (frontend)
- Supabase (backend)

**Development**
- ESLint
- Prettier
- Jest (testing)
- Cypress (E2E testing)

---

## Database Schema

Complete schema in `DATABASE_SCHEMA.sql`:

**Core Tables**
- `users` - Authentication & user info
- `patients` - Patient profiles
- `guardians` - Care circle members
- `devices` - Wearable devices
- `sensor_data` - Real-time sensor readings

**Features**
- `coping_strategies` - User & system strategies
- `gestures` - Custom gesture mappings
- `modes` - Device mode presets
- `medical_files` - Consultation notes, diagnosis
- `medication_tracker` - Medication adherence
- `appointments` - Scheduled appointments
- `care_circle_messages` - Group chat
- `community_library` - Shared strategies
- `store_products` - Hardware & features
- `repair_store` - Repair options

---

## API Endpoints

Complete API spec in `API_INTEGRATION.md`:

**Authentication**
- `POST /auth/v1/signup` - Register
- `POST /auth/v1/signin` - Login
- `POST /auth/v1/logout` - Logout

**Sensor Data**
- `POST /api/sensor-data` - Receive sensor data
- `GET /api/sensor-data` - Get sensor history

**AI Features**
- `POST /api/ai/predict-overload` - Predict overload
- `POST /api/ai/suggest-strategies` - Suggest coping strategies
- `POST /api/ai/simplify-conversation` - Simplify speech
- `POST /api/ai/therapist-insights` - Therapist analytics

**Devices**
- `POST /api/devices/register` - Register device
- `PUT /api/devices/{id}` - Update device status
- `GET /api/devices/{id}/data` - Get device data

**Gestures**
- `GET /api/gestures` - Get all gestures
- `POST /api/gestures` - Create gesture
- `PUT /api/gestures/{id}` - Update gesture
- `DELETE /api/gestures/{id}` - Delete gesture

**Care Circle**
- `GET /api/care-circle/guardians` - Get guardians
- `POST /api/care-circle/invite` - Invite guardian
- `PUT /api/care-circle/guardians/{id}/permissions` - Update permissions
- `POST /api/care-circle/messages` - Send message

**Strategies**
- `GET /api/strategies` - Get strategies
- `POST /api/strategies` - Create strategy
- `POST /api/strategies/{id}/use` - Log strategy use

**Medical**
- `POST /api/medical-files/upload` - Upload file
- `GET /api/medical-files` - Get files
- `GET /api/medications` - Get medications
- `POST /api/medications/{id}/log` - Log medication

**Appointments**
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/{id}/prep` - Get prep info

**Community**
- `GET /api/community/strategies` - Get strategies
- `POST /api/community/strategies` - Contribute strategy
- `POST /api/community/strategies/{id}/rate` - Rate strategy

**Store**
- `GET /api/store/products` - Get products
- `POST /api/store/purchase` - Purchase product

**Repair**
- `GET /api/repair/options` - Get repair options
- `POST /api/repair/request` - Request repair

**Analytics**
- `GET /api/analytics/trends` - Get trends
- `GET /api/analytics/stress-by-location` - Stress by location
- `GET /api/analytics/hardest-times` - Hardest times
- `GET /api/analytics/export` - Export data

---

## UI Components

Complete component specs in `UI_COMPONENTS.md`:

**Layout**
- `Header` - Fixed header bar
- `Navigation` - Fixed bottom nav

**Data Display**
- `StatusBadge` - Calm/Rising/Overload
- `DeviceTile` - Device status
- `StressChart` - Line chart
- `LocationChart` - Bar chart
- `Timeline` - Event timeline
- `PermissionMatrix` - Guardian permissions

**Input**
- `Button` - Primary/secondary/danger
- `Input` - Text input
- `Slider` - Range slider
- `Toggle` - On/off switch

**Containers**
- `Card` - Content card
- `Modal` - Dialog modal
- `Carousel` - Horizontal/vertical scroll

**Specialized**
- `GestureEditor` - Gesture customization
- `MedicationTracker` - Medication logging
- `AppointmentCard` - Appointment display
- `StrategyCard` - Community strategy
- `EmergencyButton` - Emergency trigger

---

## User Roles & Permissions

### Patient (Violet, 16F)
- View own dashboard
- Manage own settings
- Control all permissions
- Use all features
- Contribute to community

### Guardian - Parent (Avery, Mother)
- View patient status (Calm/Rising/Overload)
- View emergency alerts
- View trends & analytics
- Send messages
- Suggest strategies
- **Cannot access**: Mic/camera (user discretion)

### Guardian - Therapist (Sophie)
- View trends & analytics
- Suggest strategies
- Set goals
- Track progress
- Manage 8 other patients

### Guardian - Teacher (Scarlet)
- View patient status
- Receive gentle nudges
- See classroom mode
- **Cannot access**: Personal data, trends

---

## Development Workflow

### Setup Database
```bash
# Run schema in Supabase SQL editor
# See DATABASE_SCHEMA.sql

# Enable RLS policies
# Configure auth settings
```

### Create Components
```bash
# Create component file
touch src/components/MyComponent.tsx

# Follow UI_COMPONENTS.md specs
# Use Tailwind CSS
# Use Lucide icons
```

### Add API Endpoints
```bash
# Create route handler
touch src/app/api/my-endpoint/route.ts

# Follow API_INTEGRATION.md specs
# Add authentication
# Add error handling
```

### Test Features
```bash
# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Check types
npm run type-check
```

### Deploy
```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy

# Set environment variables in Vercel dashboard
```

---

## Key Implementation Notes

### 1. Real-Time Updates
- Use Supabase Realtime for sensor data
- Subscribe to device status changes
- Live care circle messages
- Automatic UI updates

### 2. AI Integration
- Anthropic Claude for predictions
- Edge processing (no constant cloud connection)
- Personalized recommendations
- Therapist insights

### 3. Privacy & Security
- Row Level Security (RLS) on all tables
- JWT authentication
- HTTPS only
- Data encryption at rest
- GDPR compliant
- User-controlled data sharing

### 4. Accessibility
- Dark mode by default
- No time pressure
- Clear language
- Large touch targets
- Keyboard navigation
- Screen reader support

### 5. Mobile-First
- Design for mobile first
- Responsive breakpoints
- Touch-friendly UI
- Minimal data usage

---

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Type Checking
```bash
npm run type-check
```

---

## Deployment

### Vercel
```bash
# Connect GitHub repo
# Set environment variables
# Deploy on push to main

vercel deploy --prod
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ANTHROPIC_API_KEY=...
```

---

## Documentation

- **NEUROFLOW_BUILD_SPEC.md** - Complete feature specification
- **DATABASE_SCHEMA.sql** - Database schema
- **UI_COMPONENTS.md** - Component specifications
- **API_INTEGRATION.md** - API endpoints & integration

---

## Support

For questions or issues:
1. Check documentation files
2. Review API_INTEGRATION.md for endpoint details
3. Check UI_COMPONENTS.md for component specs
4. Review NEUROFLOW_BUILD_SPEC.md for feature details

---

## License

Proprietary - NeuroEase Autism Independence Wearable Ecosystem

---

## Build Notes

**Every feature is OFF by default** - User must explicitly enable.

**Anti-infantilization** - No "baby mode", only "personalized mode".

**User control first** - Violet controls her own data and permissions.

**Privacy by design** - Avery has access disclaimer, data can be revoked.

**Mobile-first** - Design for phone first, then scale up.

**Icons only** - No emojis or text symbols.

**Dark mode default** - Reduces visual overwhelm.

**Consistent layout** - Header and nav bar stay fixed.

**Real-time updates** - Use Supabase Realtime for live data.

**Accessibility** - No time pressure, clear language, large touch targets.

---

**Build this exactly as specified. Every feature, every UI element, every permission, every interaction is documented in the specification files.**
