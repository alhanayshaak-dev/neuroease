# NeuroFlow Implementation Plan

## Overview

This implementation plan breaks down the NeuroFlow design into discrete coding tasks that build incrementally. Each task focuses on writing, modifying, or testing code. Tasks are organized by feature area with property-based tests integrated alongside implementation to catch correctness issues early.

**Implementation Language**: TypeScript (Next.js)

---

## Tasks

### Phase 1: Project Setup and Core Infrastructure

- [x] 1. Set up Next.js project structure and dependencies
  - Initialize Next.js 14+ with TypeScript
  - Install dependencies: Supabase, Tailwind CSS, Recharts, Lucide React, fast-check
  - Configure TypeScript, ESLint, Prettier
  - Set up environment variables (.env.local)
  - _Requirements: 22.1, 22.2_

- [x] 2. Create database schema and Supabase setup
  - Run DATABASE_SCHEMA.sql in Supabase
  - Enable Row Level Security (RLS) on all tables
  - Create RLS policies for patient, guardian, therapist, teacher roles
  - Set up Supabase Auth configuration
  - _Requirements: 22.1, 22.3, 22.4_

- [x] 3. Implement authentication system
  - Create Supabase Auth client (lib/supabase.ts)
  - Implement signup endpoint (POST /api/auth/signup)
  - Implement signin endpoint (POST /api/auth/signin)
  - Implement logout endpoint (POST /api/auth/logout)
  - Implement token refresh logic
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6_

- [x] 3.1 Write property test for authentication token management
  - **Property 20: Authentication Token Management**
  - **Validates: Requirements 22.1, 22.2, 22.3, 22.4, 22.5, 22.6**

- [x] 4. Create core layout components
  - Implement Header component (fixed top bar with user info, logo, settings)
  - Implement Navigation component (fixed bottom nav with 5 sections)
  - Implement MainContent wrapper
  - Apply dark mode styling (Tailwind CSS)
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

- [x] 5. Set up real-time data subscription system
  - Create useRealtimeSubscription hook
  - Implement Supabase Realtime WebSocket subscriptions
  - Create sensor data subscription
  - Create device status subscription
  - Create care circle message subscription
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6_

- [x] 5.1 Write property test for real-time update latency
  - **Property 19: Real-Time Update Latency**
  - **Validates: Requirements 21.1, 21.2, 21.3, 21.4, 21.5, 21.6**

---

### Phase 2: Stress Monitoring and Prediction

- [x] 6. Implement stress score calculation engine
  - Create calculateStressScore function (HR, HRV, EDA → 0-100)
  - Implement baseline comparison logic
  - Create stress level categorization (Calm/Rising/Overload)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 6.1 Write property test for stress score calculation
  - **Property 1: Stress Score Calculation and Display**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 7. Implement overload prediction AI integration
  - Create Anthropic Claude client (lib/anthropic.ts)
  - Implement predictOverload function (sensor data + context → prediction)
  - Implement confidence filtering (only show if confidence > 60%)
  - Create strategy suggestion function
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 7.1 Write property test for overload prediction
  - **Property 2: Overload Prediction with Confidence Filtering**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

- [x] 8. Create sensor data API endpoint
  - Implement POST /api/sensor-data endpoint
  - Validate incoming sensor data
  - Calculate stress score
  - Predict overload
  - Store in database
  - Publish via Supabase Realtime
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 9. Implement trigger tracking system
  - Create recordTrigger function (stress event + context → trigger record)
  - Implement trigger type detection (auditory, visual, social, unknown)
  - Store trigger data with location, activity, time
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 9.1 Write property test for trigger recording
  - **Property 3: Trigger Recording and Analysis**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

- [x] 10. Create Dashboard page with stress monitoring
  - Implement Dashboard layout
  - Create StatusBadge component (Calm/Rising/Overload)
  - Create StressChart component (real-time line chart)
  - Implement real-time stress graph updates
  - Display current stress score and status
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

- [x] 10.1 Write property test for dashboard display
  - **Property 21: Dashboard Display Completeness**
  - **Validates: Requirements 23.1, 23.2, 23.3, 23.4, 23.5, 23.6**

---

### Phase 3: Device Management

- [x] 11. Implement device registration and management
  - Create POST /api/devices/register endpoint
  - Implement device pairing logic
  - Create device model and database operations
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 12. Create device status display system
  - Implement DeviceTile component
  - Display battery level, connection status, last sync
  - Show damage state if applicable
  - Create device status indicators (connected/disconnected)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 12.1 Write property test for device status display
  - **Property 5: Device Status Display and Management**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

- [x] 13. Create Devices page with live charts
  - Implement Devices page layout
  - Create live sensor data charts (HR, HRV, EDA)
  - Display device usage statistics
  - Show coping methods used
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 14. Implement gesture customization system
  - Create Gesture model and database operations
  - Implement GestureEditor component
  - Create gesture-to-action mapping
  - Support gesture types (long-press, swipe, double-tap, triple-tap, custom)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 14.1 Write property test for gesture execution
  - **Property 6: Gesture-to-Action Execution**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

- [x] 15. Create mode preset system
  - Implement Mode model and database operations
  - Create preset modes (School, Work, Home, Transit)
  - Implement mode switching logic
  - Apply device settings per mode
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6_

- [x] 15.1 Write property test for mode switching
  - **Property 22: Mode Switching Speed**
  - **Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5, 24.6**

---

### Phase 4: Care Circle and Permissions

- [x] 16. Implement guardian management system
  - Create Guardian model and database operations
  - Implement POST /api/care-circle/invite endpoint
  - Implement PUT /api/care-circle/guardians/{id}/permissions endpoint
  - Create permission validation logic
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 16.1 Write property test for guardian permission management
  - **Property 7: Guardian Permission Management and Display**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

- [x] 17. Create Care Circle page
  - Implement Care Circle layout
  - Create guardian list display
  - Implement PermissionMatrix component
  - Create invite guardian form
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 18. Implement care circle messaging
  - Create POST /api/care-circle/messages endpoint
  - Implement GET /api/care-circle/messages endpoint
  - Create message display component
  - Implement real-time message updates
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6_

- [x] 19. Create caregiver dashboard view
  - Implement caregiver-specific dashboard
  - Display patient status (Calm/Rising/Overload)
  - Show timeline of events
  - Display weekly summary
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

---

### Phase 5: Medical and Appointment Management

- [x] 20. Implement patient profile system
  - Create Patient model and database operations
  - Implement patient profile page
  - Display diagnosis, support level, baseline vitals
  - Create medical file upload/view system
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 20.1 Write property test for medical file round-trip

  - **Property 8: Medical File Round-Trip**
  - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

- [x] 21. Implement medication tracking system
  - Create Medication model and database operations
  - Implement medication logging (POST /api/medications/{id}/log)
  - Create MedicationTracker component
  - Calculate adherence rate
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 21.1 Write property test for medication adherence calculation

  - **Property 9: Medication Adherence Calculation**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**

- [x] 22. Implement appointment scheduling system
  - Create Appointment model and database operations
  - Implement appointment creation (POST /api/appointments)
  - Create AppointmentCard component
  - Implement sensory prep checklist
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 22.1 Write property test for appointment sensory prep

  - **Property 10: Appointment Sensory Prep Display**
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6**

- [x] 23. Create AI access controls
  - Implement AI access permission toggles
  - Create privacy dashboard
  - Display data retention settings
  - Implement data export functionality
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

---

### Phase 6: Communication and Accessibility

- [x] 24. Implement coping strategy library
  - Create CopingStrategy model and database operations
  - Implement strategy creation and management
  - Create strategy success rate calculation
  - Implement strategy suggestion logic
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 24.1 Write property test for coping strategy success rate


  - **Property 4: Coping Strategy Success Rate Calculation**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

- [x] 25. Implement social cues and conversation simplification
  - Create Anthropic integration for conversation simplification
  - Implement tone detection
  - Create phrase library system
  - Implement gesture-to-speech mapping
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [x] 25.1 Write property test for social cue detection

  - **Property 12: Social Cue Detection and Simplification**
  - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6**

- [x] 26. Implement visual modes (NeuroLens)
  - Create Mode visual adjustment system
  - Implement 5 visual modes (Reading, Outdoor, Crowd, Task, Meeting)
  - Create custom mode editor
  - Implement visual cue toggles
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 26.1 Write property test for visual mode application

  - **Property 13: Visual Mode Application**
  - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6**

- [x] 27. Implement emergency feature
  - Create emergency mode activation logic
  - Implement max noise reduction trigger
  - Create escape mode navigation
  - Implement alert sending to guardians
  - Create post-crisis reflection
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 27.1 Write property test for emergency mode activation

  - **Property 11: Emergency Mode Activation**
  - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**

- [x] 28. Implement accessibility features
  - Create dark mode toggle (default ON)
  - Implement font size adjustment
  - Create reduce motion support
  - Implement high contrast mode
  - Add keyboard navigation support
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_

- [x] 28.1 Write property test for feature control and accessibility

  - **Property 17: Feature Control and Accessibility Settings**
  - **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6**

---

### Phase 7: Community and Store

- [x] 29. Implement community library system
  - Create CommunityStrategy model and database operations
  - Implement strategy search and filtering
  - Create StrategyCard component
  - Implement therapist verification system
  - Create rating and contribution system
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [x] 29.1 Write property test for community strategy filtering

  - **Property 14: Community Strategy Age-Appropriate Filtering**
  - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5, 15.6**

- [x] 30. Implement store system
  - Create StoreProduct model and database operations
  - Implement product listing (GET /api/store/products)
  - Create purchase endpoint (POST /api/store/purchase)
  - Implement repair store system
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_



- [x] 30.1 Write property test for store product display


  - **Property 15: Store Product Display and Purchase**
  - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6**

---

### Phase 8: Analytics and Trends

- [x] 31. Implement analytics and trends system
  - Create analytics endpoints (GET /api/analytics/trends)
  - Implement stress by location analysis
  - Implement hardest times analysis
  - Create trend calculation logic
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

- [x] 31.1 Write property test for analytics trend calculation

  - **Property 16: Analytics Trend Calculation**
  - **Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5, 17.6**

- [x] 32. Create analytics visualization pages
  - Implement trends page with graphs
  - Create stress by location chart
  - Create hardest times chart
  - Implement data export (PDF, CSV)
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

- [x] 33. Implement medication-stress correlation
  - Create correlation analysis logic
  - Display correlation graph
  - Show adherence impact on stress
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

---

### Phase 9: Privacy and Data Control

- [x] 34. Implement data privacy dashboard
  - Create privacy control page
  - Implement data retention settings
  - Create data export functionality
  - Implement data deletion functionality
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

- [x] 34.1 Write property test for data privacy and access control


  - **Property 18: Data Privacy and Access Control**
  - **Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6**

- [x] 35. Implement feature opt-in system
  - Create feature toggle system
  - Implement feature explanations
  - Create feature status display
  - Implement feature-specific data collection
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_

---

### Phase 10: Therapist Collaboration

- [x] 36. Implement therapist dashboard
  - Create therapist-specific dashboard
  - Display patient trends and analytics
  - Implement goal setting system
  - Create strategy suggestion interface
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6_

- [x] 36.1 Write property test for therapist collaboration


  - **Property 23: Therapist Collaboration Data Access**
  - **Validates: Requirements 25.1, 25.2, 25.3, 25.4, 25.5, 25.6**

- [x] 37. Implement multi-patient management for therapists
  - Create therapist patient list
  - Implement aggregated insights
  - Create therapist messaging system
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6_

---

### Phase 11: Integration and Polish

- [x] 38. Create load screen
  - Implement NeuroFlow logo display
  - Create loading progress bar
  - Display "NeuroFlow by NeuroEase" text
  - Implement smooth fade-out transition
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

- [x] 39. Implement What's New feed
  - Create feature update system
  - Implement carousel display
  - Create update notification logic
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

- [x] 40. Create quick-action shortcuts
  - Implement customizable shortcuts
  - Create shortcut execution logic
  - Display shortcuts on dashboard
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

- [x] 41. Implement patient health overview
  - Display triggers this week
  - Display stress by location
  - Display hardest times
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

- [x] 42. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Verify 80% code coverage
  - Fix any failing tests
  - _Requirements: All_

- [x] 43. Implement error handling and logging
  - Create error boundary components
  - Implement error logging system
  - Create user-friendly error messages
  - _Requirements: All_

- [x] 44. Optimize performance
  - Implement code splitting
  - Optimize database queries
  - Implement caching strategy
  - Optimize image loading
  - _Requirements: All_

- [x] 45. Final checkpoint - Full system integration
  - Test all features end-to-end
  - Verify real-time updates
  - Test permission enforcement
  - Verify accessibility compliance
  - _Requirements: All_

---

## Notes

- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation
- All code must follow TypeScript best practices and accessibility guidelines
- Dark mode is default throughout the application
- All features start disabled (user must opt-in)
- All tasks are required for comprehensive implementation

