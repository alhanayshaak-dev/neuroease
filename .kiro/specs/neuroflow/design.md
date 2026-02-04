# NeuroFlow Design Document

## Overview

NeuroFlow is a comprehensive autism independence wearable ecosystem app built with Next.js, Supabase, and Anthropic AI. The system provides real-time sensory overload detection, prediction, and management through an integrated suite of wearable devices (Neuroband, Neurobud, NeuroLens), AI-powered analytics, and a privacy-first care circle management system.

**Key Design Principles**:
- Every feature OFF by default (user-controlled)
- Anti-infantilization (no "baby mode")
- Privacy by design (user controls all permissions)
- Accessibility first (no time pressure, clear language)
- Real-time updates (Supabase Realtime)
- AI-powered (Anthropic Claude)
- Mobile-first responsive design
- Dark mode by default
- Icons only (no emojis)

---

## Architecture

### System Components

**Frontend Layer**:
- Next.js 14+ with React
- TypeScript for type safety
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- Supabase client for real-time subscriptions

**Backend Layer**:
- Supabase PostgreSQL database
- Supabase Auth (JWT-based)
- Supabase Realtime (WebSocket subscriptions)
- Row Level Security (RLS) for data access control

**AI/ML Layer**:
- Anthropic Claude API for predictions
- Overload prediction engine
- Strategy suggestions
- Conversation simplification
- Therapist insights

**Hosting**:
- Vercel for frontend deployment
- Supabase for backend/database
- Environment variables for secrets

### Data Flow

```
Wearable Devices
    ↓
Sensor Data API
    ↓
Supabase (Real-time)
    ↓
Frontend (Dashboard)
    ↓
AI Prediction Engine
    ↓
Alerts & Suggestions
    ↓
Care Circle Notifications
```

---

## Components and Interfaces

### Core Components

**Layout Components**:
- `Header`: Fixed header bar with user info, logo, settings
- `Navigation`: Fixed bottom navigation with 5 main sections
- `MainContent`: Scrollable content area between header and nav

**Data Display Components**:
- `StatusBadge`: Calm/Rising/Overload indicator with color coding
- `DeviceTile`: Device status with battery, connection, actions
- `StressChart`: Line chart showing HR, HRV, EDA trends
- `LocationChart`: Bar chart showing stress by location
- `Timeline`: Event timeline with icons and timestamps
- `PermissionMatrix`: Guardian permissions grid

**Input Components**:
- `Button`: Primary/secondary/danger variants
- `Input`: Text input with validation
- `Slider`: Range slider for numeric values
- `Toggle`: On/off switch
- `Select`: Dropdown selector

**Container Components**:
- `Card`: Content card with shadow/border options
- `Modal`: Dialog modal with overlay
- `Carousel`: Horizontal/vertical scrollable list

**Specialized Components**:
- `GestureEditor`: Gesture customization interface
- `MedicationTracker`: Medication logging and tracking
- `AppointmentCard`: Appointment display with prep info
- `StrategyCard`: Community strategy card with rating
- `EmergencyButton`: Fixed emergency trigger button

### Load Screen

**Initial Load Screen**:
- NeuroFlow logo (teal neon brain with electricity)
- Loading progress bar (teal color)
- Text: "NeuroFlow by NeuroEase"
- Displayed while app initializes and loads user data
- Smooth fade-out when ready

### Page Structure

**Dashboard Page**:
- Header with user status
- Status indicator (Calm/Rising/Overload)
- Real-time stress graph
- Device tiles carousel
- What's New feed carousel
- Quick-action shortcuts
- Patient health overview

**Care Circle Page**:
- Guardian list with roles and permissions
- Invite guardian form
- Permission matrix
- Group chat messages
- Caregiver dashboard (for guardians)

**Patient Profile Page**:
- Diagnosis and support level
- Medical files upload/view
- Medication tracker
- Appointment scheduling
- AI access controls

**Devices Page**:
- All linked devices with status
- Live sensor data charts
- Device settings and customization
- Gesture editor
- Store and repair options

**Community Library Page**:
- Strategy search and filter
- Strategy cards with ratings
- Contribution form
- Therapist verification badges

---

## Data Models

### User Model
```typescript
interface User {
  id: UUID
  email: string
  role: 'patient' | 'guardian' | 'therapist' | 'teacher'
  name: string
  avatar_url?: string
  pronouns?: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Patient Model
```typescript
interface Patient {
  id: UUID
  user_id: UUID (FK)
  date_of_birth: date
  diagnosis: string
  support_level: 1 | 2 | 3
  baseline_hr: number
  baseline_hrv: number
  baseline_eda: number
  sensory_triggers: Record<string, any>
  calming_methods: Record<string, any>
  created_at: timestamp
  updated_at: timestamp
}
```

### Guardian Model
```typescript
interface Guardian {
  id: UUID
  patient_id: UUID (FK)
  guardian_user_id: UUID (FK)
  relationship: 'parent' | 'therapist' | 'teacher' | 'other'
  permissions: {
    see_status: boolean
    see_alerts: boolean
    see_trends: boolean
    see_medical: boolean
    trigger_emergency: boolean
    suggest_strategies: boolean
    access_mic: boolean
    access_camera: boolean
  }
  created_at: timestamp
}
```

### Device Model
```typescript
interface Device {
  id: UUID
  patient_id: UUID (FK)
  device_type: 'neuroband' | 'neurobud' | 'neurolens'
  device_name: string
  mac_address: string
  battery_level: number (0-100)
  is_connected: boolean
  firmware_version: string
  last_sync: timestamp
  damage_state: Record<string, any>
  created_at: timestamp
  updated_at: timestamp
}
```

### Sensor Data Model
```typescript
interface SensorData {
  id: UUID
  patient_id: UUID (FK)
  device_id: UUID (FK)
  timestamp: timestamp
  heart_rate: number
  hrv: number
  eda: number
  accelerometer_x: number
  accelerometer_y: number
  accelerometer_z: number
  location: string
  activity: string
  stress_score: number (0-100)
  overload_predicted: boolean
  overload_predicted_in_minutes: number
  created_at: timestamp
}
```

### Coping Strategy Model
```typescript
interface CopingStrategy {
  id: UUID
  patient_id: UUID (FK)
  name: string
  category: 'breathwork' | 'grounding' | 'body_awareness' | 'sensory' | 'other'
  description: string
  duration_minutes: number
  success_rate: number (0-1)
  last_used: timestamp
  times_used: number
  created_by: 'user' | 'system' | 'therapist'
  created_at: timestamp
}
```

### Gesture Model
```typescript
interface Gesture {
  id: UUID
  patient_id: UUID (FK)
  gesture_type: string
  action: string
  action_params: Record<string, any>
  applies_to_modes: string[]
  user_only: boolean
  can_be_overridden_by_carer: boolean
  created_at: timestamp
}
```

### Mode Model
```typescript
interface Mode {
  id: UUID
  patient_id: UUID (FK)
  mode_name: string
  neuroband_sensitivity: 'low' | 'normal' | 'high'
  neuroband_haptics_intensity: number (0-100)
  neurobud_noise_reduction: 'off' | 'low' | 'high'
  neurobud_social_cues: boolean
  neurolens_vision_mode: 'reading' | 'outdoor' | 'crowd' | 'task' | 'meeting'
  neurolens_cues: boolean
  created_at: timestamp
}
```

---

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Acceptance Criteria Testing Prework

**1.1 Stress Score Calculation**
- Thoughts: This is a universal rule that should apply to all sensor data. We can generate random sensor readings, calculate stress score, and verify it's within 0-100 range and calculated within 2 seconds.
- Testable: yes - property

**1.2 Stress Indicator Display**
- Thoughts: This is a rule about how stress scores map to UI indicators. We can generate stress scores and verify the correct indicator is displayed.
- Testable: yes - property

**2.1 Overload Prediction**
- Thoughts: This is a universal rule about prediction accuracy. We can generate sensor patterns and verify predictions are made 5-10 minutes before actual overload.
- Testable: yes - property

**2.2 Prediction Confidence**
- Thoughts: This is a rule about when to display warnings. We can verify warnings are only shown when confidence > 60%.
- Testable: yes - property

**3.1 Trigger Recording**
- Thoughts: This is a universal rule that all stress events should record triggers. We can generate stress events and verify triggers are recorded.
- Testable: yes - property

**4.1 Strategy Success Rate**
- Thoughts: This is a rule about how success rates are calculated. We can generate strategy uses and verify success rate updates correctly.
- Testable: yes - property

**5.1 Device Status Display**
- Thoughts: This is a rule about device tile rendering. We can generate device states and verify correct status indicators are displayed.
- Testable: yes - property

**6.1 Gesture Execution**
- Thoughts: This is a rule about gesture-to-action mapping. We can generate gestures and verify correct actions are executed within 500ms.
- Testable: yes - property

**7.1 Guardian Permission Application**
- Thoughts: This is a rule about permission enforcement. We can verify that when permissions are updated, data access changes immediately.
- Testable: yes - property

**8.1 Permission Matrix Accuracy**
- Thoughts: This is a rule about permission display. We can verify the matrix accurately reflects current permissions.
- Testable: yes - property

**9.1 Medical File Storage**
- Thoughts: This is a round-trip property. We can upload a file and verify it can be retrieved with same content.
- Testable: yes - property

**10.1 Medication Adherence Calculation**
- Thoughts: This is a rule about adherence rate calculation. We can generate medication logs and verify adherence percentage is correct.
- Testable: yes - property

**11.1 Appointment Prep Display**
- Thoughts: This is a rule about sensory prep checklist generation. We can create appointments and verify prep checklists are displayed.
- Testable: yes - property

**12.1 Emergency Mode Activation**
- Thoughts: This is a rule about emergency response. We can trigger emergency and verify all systems activate (noise reduction, escape mode, alert).
- Testable: yes - property

**13.1 Social Cue Detection**
- Thoughts: This is a rule about tone detection. We can generate speech samples and verify tone is correctly identified.
- Testable: yes - property

**14.1 Visual Mode Application**
- Thoughts: This is a rule about visual adjustments. We can select modes and verify correct visual parameters are applied.
- Testable: yes - property

**15.1 Community Strategy Filtering**
- Thoughts: This is a rule about age-appropriate filtering. We can verify strategies are filtered by age group.
- Testable: yes - property

**16.1 Store Product Display**
- Thoughts: This is a rule about product listing. We can verify products are displayed with correct information.
- Testable: yes - property

**17.1 Analytics Data Accuracy**
- Thoughts: This is a rule about trend calculation. We can generate stress data and verify trends are calculated correctly.
- Testable: yes - property

**18.1 Accessibility Settings Application**
- Thoughts: This is a rule about accessibility feature application. We can enable settings and verify they're applied to UI.
- Testable: yes - property

**19.1 Feature Opt-In Control**
- Thoughts: This is a rule that all features start disabled. We can verify all features are OFF on first load.
- Testable: yes - property

**20.1 Data Privacy Control**
- Thoughts: This is a rule about data access revocation. We can revoke access and verify data is no longer accessible.
- Testable: yes - property

**21.1 Real-Time Update Latency**
- Thoughts: This is a rule about update speed. We can send sensor data and verify Dashboard updates within 2 seconds.
- Testable: yes - property

**22.1 Authentication Token Validity**
- Thoughts: This is a rule about token expiry. We can verify tokens expire after 1 hour and refresh tokens work.
- Testable: yes - property

**23.1 Dashboard Display Completeness**
- Thoughts: This is a rule about dashboard content. We can verify all required sections are displayed.
- Testable: yes - property

**24.1 Mode Switching Speed**
- Thoughts: This is a rule about mode application speed. We can switch modes and verify changes apply within 1 second.
- Testable: yes - property

**25.1 Therapist Collaboration Data**
- Thoughts: This is a rule about therapist access. We can verify therapists see correct data and can suggest strategies.
- Testable: yes - property

### Property Reflection

After analyzing all 25 acceptance criteria, I've identified the following redundancies and consolidations:

- Properties 1.1 and 1.2 can be combined: "Stress score calculation and display" (both about stress scoring)
- Properties 2.1 and 2.2 can be combined: "Overload prediction with confidence filtering"
- Properties 5.1 and 6.1 are independent (device display vs gesture execution)
- Properties 7.1 and 8.1 can be combined: "Guardian permission management and display"
- Properties 18.1 and 19.1 can be combined: "Feature control and accessibility settings"
- Properties 21.1 and 22.1 are independent (real-time updates vs authentication)

### Correctness Properties

**Property 1: Stress Score Calculation and Display**
*For any* sensor data from wearable devices, the system SHALL calculate stress score (0-100%) within 2 seconds and display appropriate status indicator (Calm/Rising/Overload) based on patient baseline.
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

**Property 2: Overload Prediction with Confidence Filtering**
*For any* sensor data with environmental context, the system SHALL predict overload 5-10 minutes in advance only when confidence exceeds 60%, and display warning with reason and suggested strategies.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

**Property 3: Trigger Recording and Analysis**
*For any* stress event, the system SHALL record trigger type (auditory, visual, social, unknown) and context (location, activity, time), and make this data available for analytics and correlation.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

**Property 4: Coping Strategy Success Rate Calculation**
*For any* coping strategy use, the system SHALL update success rate based on user effectiveness rating, and prioritize high-success strategies in future suggestions.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

**Property 5: Device Status Display and Management**
*For any* connected or disconnected device, the system SHALL display accurate battery level, connection status, last sync time, and damage state, with appropriate visual indicators.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

**Property 6: Gesture-to-Action Execution**
*For any* custom gesture, the system SHALL execute assigned action within 500ms, provide haptic feedback, and respect mode-specific and user-only restrictions.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

**Property 7: Guardian Permission Management and Display**
*For any* guardian, the system SHALL enforce granular permissions immediately upon update, display accurate permission matrix, and prevent unauthorized data access.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

**Property 8: Medical File Round-Trip**
*For any* uploaded medical file, serializing then deserializing SHALL produce equivalent file content and metadata.
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

**Property 9: Medication Adherence Calculation**
*For any* medication with logged doses, the system SHALL calculate adherence rate as percentage of doses taken on time, and display correlation with stress levels.
**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**

**Property 10: Appointment Sensory Prep Display**
*For any* appointment, the system SHALL display sensory prep checklist, transition support, and post-appointment reflection prompts at appropriate times.
**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6**

**Property 11: Emergency Mode Activation**
*For any* emergency trigger, the system SHALL immediately activate max noise reduction, escape mode, send alert to guardians, and display post-crisis reflection after 30 minutes.
**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**

**Property 12: Social Cue Detection and Simplification**
*For any* conversation with social cues enabled, the system SHALL detect tone, simplify speech, and suggest appropriate phrases from user's library.
**Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6**

**Property 13: Visual Mode Application**
*For any* selected visual mode, the system SHALL apply correct visual adjustments (brightness, contrast, blur, cues) and allow custom mode creation.
**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6**

**Property 14: Community Strategy Age-Appropriate Filtering**
*For any* community strategy search, the system SHALL filter results by age group and display therapist verification badges, ratings, and contribution attribution.
**Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5, 15.6**

**Property 15: Store Product Display and Purchase**
*For any* store product, the system SHALL display accurate information, process purchases, and provide setup instructions for hardware.
**Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6**

**Property 16: Analytics Trend Calculation**
*For any* time range, the system SHALL calculate accurate stress trends, trigger frequency, coping strategy effectiveness, and medication correlation.
**Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5, 17.6**

**Property 17: Feature Control and Accessibility Settings**
*For any* feature or accessibility setting, the system SHALL start disabled by default, apply changes immediately upon user toggle, and respect user preferences across all pages.
**Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6**

**Property 18: Data Privacy and Access Control**
*For any* data access revocation, the system SHALL immediately remove guardian access, allow data export and deletion, and maintain audit log of all access changes.
**Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6**

**Property 19: Real-Time Update Latency**
*For any* sensor data or status change, the system SHALL update Dashboard within 2 seconds using Supabase Realtime, and queue updates when offline.
**Validates: Requirements 21.1, 21.2, 21.3, 21.4, 21.5, 21.6**

**Property 20: Authentication Token Management**
*For any* user session, the system SHALL issue JWT tokens with 1-hour expiry, use refresh tokens for renewal, and invalidate tokens on logout.
**Validates: Requirements 22.1, 22.2, 22.3, 22.4, 22.5, 22.6**

**Property 21: Dashboard Display Completeness**
*For any* Dashboard load, the system SHALL display all required sections (status, graph, devices, What's New, shortcuts, health overview) with current data.
**Validates: Requirements 23.1, 23.2, 23.3, 23.4, 23.5, 23.6**

**Property 22: Mode Switching Speed**
*For any* mode selection, the system SHALL apply configuration to all devices within 1 second and allow quick-switch from home screen.
**Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5, 24.6**

**Property 23: Therapist Collaboration Data Access**
*For any* therapist, the system SHALL display patient trends, allow strategy suggestions, goal setting, and aggregated insights across multiple patients.
**Validates: Requirements 25.1, 25.2, 25.3, 25.4, 25.5, 25.6**

---

## Error Handling

### Authentication Errors
- Invalid credentials: Display "Email or password incorrect"
- Account not found: Display "No account with this email"
- Token expired: Automatically refresh using refresh token
- Unauthorized access: Display "You don't have permission to view this"

### Data Validation Errors
- Invalid sensor data: Log error, skip data point, continue processing
- Missing required fields: Display validation message, prevent submission
- File upload too large: Display "File must be under 10MB"
- Invalid email format: Display "Please enter a valid email"

### Device Connection Errors
- Device disconnected: Display "Device disconnected" status, queue data for sync
- Bluetooth pairing failed: Display "Pairing failed. Try again"
- Firmware update failed: Display "Update failed. Try again"
- Low battery: Display warning, suggest charging

### API Errors
- Rate limit exceeded: Display "Too many requests. Try again later"
- Server error: Display "Something went wrong. Try again"
- Network timeout: Display "Connection lost. Retrying..."
- Invalid API response: Log error, display generic error message

### AI/ML Errors
- Prediction failed: Log error, skip prediction, continue monitoring
- Strategy suggestion failed: Display "Unable to suggest strategies right now"
- Conversation simplification failed: Display original text, log error

---

## Testing Strategy

### Unit Testing

Unit tests verify specific examples, edge cases, and error conditions:

- **Stress Score Calculation**: Test with various HR/HRV/EDA combinations, verify 0-100 range
- **Permission Enforcement**: Test each permission type, verify access control
- **Gesture Mapping**: Test gesture-to-action mapping, verify correct actions execute
- **Data Validation**: Test invalid inputs, verify error messages
- **Medication Adherence**: Test adherence calculation with various dose patterns
- **Trigger Recording**: Test trigger recording with different trigger types
- **Strategy Success Rate**: Test success rate calculation with various ratings
- **Device Status**: Test device status display with various battery/connection states
- **Appointment Prep**: Test sensory prep checklist generation
- **Emergency Mode**: Test emergency activation and alert sending

### Property-Based Testing

Property-based tests verify universal properties across all inputs using randomization:

- **Property 1**: Generate random sensor data, verify stress score is 0-100 and indicator matches baseline
- **Property 2**: Generate sensor patterns, verify predictions are 5-10 min ahead with confidence > 60%
- **Property 3**: Generate stress events, verify triggers are recorded with context
- **Property 4**: Generate strategy uses, verify success rate updates correctly
- **Property 5**: Generate device states, verify status display is accurate
- **Property 6**: Generate gestures, verify actions execute within 500ms
- **Property 7**: Generate permission changes, verify access control updates immediately
- **Property 8**: Generate medical files, verify round-trip serialization
- **Property 9**: Generate medication logs, verify adherence calculation
- **Property 10**: Generate appointments, verify prep display at correct times
- **Property 11**: Generate emergency triggers, verify all systems activate
- **Property 12**: Generate conversations, verify tone detection and simplification
- **Property 13**: Generate visual mode selections, verify adjustments apply
- **Property 14**: Generate strategy searches, verify age-appropriate filtering
- **Property 15**: Generate store purchases, verify product display and processing
- **Property 16**: Generate stress data, verify trend calculations
- **Property 17**: Generate feature toggles, verify settings apply immediately
- **Property 18**: Generate access revocations, verify data access removed
- **Property 19**: Generate sensor updates, verify Dashboard updates within 2 seconds
- **Property 20**: Generate sessions, verify token management
- **Property 21**: Generate Dashboard loads, verify all sections display
- **Property 22**: Generate mode switches, verify configuration applies within 1 second
- **Property 23**: Generate therapist queries, verify data access and collaboration features

### Testing Configuration

- **Minimum iterations**: 100 per property test
- **Test framework**: Jest (unit tests), fast-check (property tests)
- **Coverage target**: 80% code coverage
- **CI/CD**: Run tests on every commit
- **Tag format**: `Feature: neuroflow, Property N: [property_text]`



---

## Implementation Notes

### Technology Stack Rationale

**Next.js**: Provides server-side rendering, API routes, and excellent TypeScript support for a healthcare app requiring security and performance.

**Supabase**: PostgreSQL database with built-in authentication, real-time subscriptions, and Row Level Security for HIPAA-compliant data access control.

**Anthropic Claude**: State-of-the-art LLM for understanding context, predicting overload, simplifying conversations, and providing therapist insights.

**Tailwind CSS**: Utility-first CSS framework enabling rapid development of accessible, dark-mode-first UI.

**Recharts**: React charting library for real-time stress graphs and analytics visualization.

**Lucide React**: Comprehensive icon library with no emojis, perfect for accessible UI.

### Real-Time Architecture

- Supabase Realtime WebSocket subscriptions for sensor data, device status, and messages
- Frontend subscribes to patient's sensor_data table
- Backend publishes updates via Supabase Realtime
- Dashboard updates within 2 seconds of new data
- Offline queue for updates when connection is lost

### AI Integration Points

1. **Overload Prediction**: Analyze sensor patterns + context → predict overload 5-10 min ahead
2. **Strategy Suggestions**: Analyze patient history + current state → suggest top 3 strategies
3. **Conversation Simplification**: Analyze speech → simplify + identify tone + suggest responses
4. **Therapist Insights**: Analyze trends across patients → identify patterns + recommendations

### Security Considerations

- All API endpoints require JWT authentication
- Row Level Security (RLS) policies enforce data access based on user role and permissions
- Sensor data encrypted in transit (TLS) and at rest
- Passwords hashed with bcrypt
- API keys stored in environment variables
- CORS restricted to Vercel domains
- GDPR-compliant data retention and deletion

### Accessibility Implementation

- Dark mode by default (reduces visual overwhelm)
- No time pressure (no auto-submit, no countdown timers)
- Clear language (no metaphors, idioms, sarcasm)
- Large touch targets (minimum 48x48px)
- Keyboard navigation support
- Screen reader support (semantic HTML, ARIA labels)
- Reduced motion support (respects prefers-reduced-motion)
- Font size adjustment (up to 24px)
- High contrast mode support

### Performance Optimization

- Code splitting for faster initial load
- Image optimization with Next.js Image component
- Lazy loading for charts and heavy components
- Caching strategy for sensor data
- Database query optimization with indexes
- Real-time updates via WebSocket (not polling)

---

## Deployment Architecture

### Frontend (Vercel)
```
GitHub → Vercel → CDN → User Browser
- Automatic deployments on push to main
- Environment variables configured in Vercel dashboard
- Preview deployments for pull requests
```

### Backend (Supabase)
```
PostgreSQL Database → Supabase API → Frontend
- Automatic backups
- Row Level Security policies
- Real-time subscriptions via WebSocket
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
NEXT_PUBLIC_ANTHROPIC_API_KEY=[api-key]
```

---

## Future Enhancements

1. **Wearable Device Integration**: Direct integration with Neuroband, Neurobud, NeuroLens hardware
2. **Advanced Analytics**: Machine learning models for personalized predictions
3. **Therapist Portal**: Dedicated interface for managing multiple patients
4. **Mobile App**: Native iOS/Android apps with offline support
5. **Voice Commands**: Voice control for hands-free operation
6. **Integration with IEP Systems**: Direct export to school IEP platforms
7. **Medication Reminders**: Push notifications for medication adherence
8. **Caregiver Alerts**: Customizable alert thresholds and notification channels
9. **Community Moderation**: Peer review system for community strategies
10. **Advanced AR Features**: Custom AR overlays and gesture recognition

