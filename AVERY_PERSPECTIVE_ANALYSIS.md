# NeuroFlow: Avery's Perspective Analysis

## Critical Finding

The current implementation is built as a **generic patient-centric app**, but according to the requirements, it should be built from **Avery's (the mother's) perspective** as a guardian.

---

## Who is Avery?

**Avery Gray** - Mother of Violet Azer (16F, autistic)

### Avery's Role
- **Primary Guardian** of Violet
- **Permissions**: All EXCEPT mic/camera (user discretion)
- **Access Level**: 
  - ✅ See Violet's status (Calm/Rising/Overload)
  - ✅ See emergency alerts
  - ✅ View trends & analytics
  - ✅ Send messages
  - ✅ Suggest strategies
  - ❌ Access mic/camera (Violet controls)

### Avery's Needs
1. **Real-time monitoring** - Know when Violet is stressed
2. **Quick alerts** - Get notified of overload predictions
3. **Trend analysis** - Understand patterns over time
4. **Communication** - Message Violet and care circle
5. **Strategy support** - Suggest coping strategies
6. **Privacy respect** - Cannot access mic/camera without permission

---

## Current Implementation Issues

### 1. Dashboard Perspective
**Current**: Generic patient dashboard showing Violet's data  
**Should Be**: Avery's guardian dashboard showing Violet's status

**Missing Elements**:
- Avery's view of Violet's current status
- Avery's alert preferences
- Avery's communication interface
- Avery's permission controls
- Avery's analytics view

### 2. Navigation Structure
**Current**: Patient-centric navigation  
**Should Be**: Guardian-centric navigation

**Current Navigation**:
- Dashboard
- Care Circle
- Patient Profile
- Devices
- Community
- Store
- Analytics
- Therapist

**Should Be (Avery's View)**:
- Violet's Status (primary)
- Alerts & Notifications
- Trends & Analytics
- Care Circle (messaging)
- Violet's Profile
- Devices
- Settings & Permissions

### 3. Authentication
**Current**: Generic user authentication  
**Should Be**: Avery-specific authentication

**Missing**:
- Avery's login (not Violet's)
- Avery's session management
- Avery's permission verification
- Avery's access logs

### 4. Data Access
**Current**: Shows all patient data  
**Should Be**: Shows only Avery's permitted data

**Avery Can See**:
- ✅ Violet's stress status
- ✅ Violet's emergency alerts
- ✅ Violet's trends
- ✅ Violet's strategies
- ✅ Violet's appointments
- ✅ Violet's medications
- ❌ Violet's mic/camera (unless explicitly shared)

### 5. Care Circle
**Current**: Generic care circle management  
**Should Be**: Avery's view of the care circle

**Missing**:
- Avery's role as primary guardian
- Avery's permission management
- Avery's communication with other guardians
- Avery's view of Kai (father), Sophie (therapist), Scarlet (teacher)

---

## Required Changes

### 1. Authentication Layer
```typescript
// Current: Generic patient auth
// Should be: Guardian-specific auth

interface AverySession {
  userId: string; // Avery's ID
  role: 'guardian';
  patientId: string; // Violet's ID
  permissions: {
    see_status: true;
    see_alerts: true;
    see_trends: true;
    see_medical: true;
    trigger_emergency: true;
    suggest_strategies: true;
    access_mic: false; // User discretion
    access_camera: false; // User discretion
  };
}
```

### 2. Dashboard Component
```typescript
// Current: Patient dashboard
// Should be: Avery's guardian dashboard

interface AveryDashboard {
  violetStatus: 'calm' | 'rising' | 'overload';
  recentAlerts: Alert[];
  weeklyTrends: Trend[];
  careCircleMessages: Message[];
  upcomingAppointments: Appointment[];
  medicationAdherence: number;
  deviceStatus: DeviceStatus[];
}
```

### 3. Navigation Structure
```typescript
// Current: Patient-centric
// Should be: Guardian-centric

const AveryNavigation = [
  { label: "Violet's Status", icon: "heart", path: "/status" },
  { label: "Alerts", icon: "bell", path: "/alerts" },
  { label: "Trends", icon: "chart", path: "/trends" },
  { label: "Messages", icon: "chat", path: "/messages" },
  { label: "Settings", icon: "settings", path: "/settings" },
];
```

### 4. Permission System
```typescript
// Current: Generic permissions
// Should be: Avery-specific permissions

interface AveryPermissions {
  patient_id: string; // Violet
  guardian_id: string; // Avery
  see_status: true;
  see_alerts: true;
  see_trends: true;
  see_medical: true;
  trigger_emergency: true;
  suggest_strategies: true;
  access_mic: false; // Violet controls
  access_camera: false; // Violet controls
}
```

### 5. Care Circle View
```typescript
// Current: Generic care circle
// Should be: Avery's view of care circle

interface AveryCareCircle {
  patient: Violet;
  guardians: [
    { name: "Avery", role: "parent", permissions: "all" },
    { name: "Kai", role: "parent", permissions: "limited" },
    { name: "Sophie", role: "therapist", permissions: "trends" },
    { name: "Scarlet", role: "teacher", permissions: "status" },
  ];
  messages: Message[];
}
```

---

## Implementation Roadmap

### Phase 1: Authentication & Authorization
- [ ] Create Avery-specific login
- [ ] Implement guardian role verification
- [ ] Set up permission checking middleware
- [ ] Create Avery session management

### Phase 2: Dashboard Redesign
- [ ] Create Avery's status dashboard
- [ ] Show Violet's current status prominently
- [ ] Display recent alerts
- [ ] Show weekly trends
- [ ] Display care circle messages

### Phase 3: Navigation Restructure
- [ ] Redesign navigation for guardian perspective
- [ ] Create status view
- [ ] Create alerts view
- [ ] Create trends view
- [ ] Create messages view

### Phase 4: Permission System
- [ ] Implement Avery's permission model
- [ ] Add permission verification to all endpoints
- [ ] Create permission management UI
- [ ] Add audit logging

### Phase 5: Care Circle Management
- [ ] Show Avery's view of care circle
- [ ] Implement messaging between guardians
- [ ] Create permission delegation
- [ ] Add guardian collaboration features

### Phase 6: Data Access Control
- [ ] Restrict data to Avery's permissions
- [ ] Hide mic/camera data (unless shared)
- [ ] Implement data filtering
- [ ] Add access logging

---

## Key Differences: Patient vs Guardian Perspective

| Feature | Patient (Violet) | Guardian (Avery) |
|---------|------------------|------------------|
| **Primary View** | My stress & health | Violet's status & alerts |
| **Dashboard** | Personal dashboard | Monitoring dashboard |
| **Navigation** | Personal features | Monitoring & communication |
| **Permissions** | Full control | Limited by Violet |
| **Alerts** | Personal notifications | Guardian notifications |
| **Data Access** | Own data | Violet's permitted data |
| **Communication** | With guardians | With Violet & care circle |
| **Settings** | Personal settings | Violet's settings (limited) |
| **Analytics** | Personal trends | Violet's trends |
| **Devices** | Own devices | Violet's devices |

---

## Critical Implementation Notes

### 1. Avery is NOT Violet
- Avery logs in as herself (not as Violet)
- Avery sees Violet's data through permission lens
- Avery cannot access Violet's private data (mic/camera)
- Avery's session is separate from Violet's

### 2. Permission-Based Access
- Every API endpoint must check Avery's permissions
- Avery can only see data she has permission for
- Avery cannot override Violet's privacy choices
- All access must be logged

### 3. Guardian-Centric UI
- Dashboard shows Violet's status, not Avery's
- Navigation focuses on monitoring & communication
- Alerts are for Avery's benefit
- Messages are between guardians and Violet

### 4. Care Circle Collaboration
- Avery is primary guardian
- Kai, Sophie, Scarlet have different permissions
- Avery can manage other guardians' access
- All guardians can communicate

### 5. Privacy & Control
- Violet controls mic/camera access
- Avery cannot override Violet's choices
- All data access is logged
- Avery can revoke her own access

---

## Testing Considerations

### Unit Tests
- [ ] Avery's authentication
- [ ] Avery's permission checking
- [ ] Avery's data filtering
- [ ] Avery's dashboard rendering

### Integration Tests
- [ ] Avery login flow
- [ ] Avery viewing Violet's data
- [ ] Avery sending messages
- [ ] Avery managing permissions

### E2E Tests
- [ ] Avery's complete workflow
- [ ] Avery receiving alerts
- [ ] Avery viewing trends
- [ ] Avery communicating with care circle

---

## Conclusion

The current implementation is built as a **patient app** (Violet's perspective), but it should be built as a **guardian app** (Avery's perspective). This requires:

1. **Authentication**: Avery logs in, not Violet
2. **Dashboard**: Shows Violet's status, not Avery's
3. **Navigation**: Guardian-centric, not patient-centric
4. **Permissions**: Avery's limited access, not full access
5. **Data Access**: Filtered by Avery's permissions
6. **Care Circle**: Avery's view of guardians
7. **Communication**: Avery messaging Violet & care circle

This is a **fundamental architectural change** that affects every layer of the application.

---

**Status**: ⚠️ **REQUIRES REDESIGN**  
**Priority**: CRITICAL  
**Impact**: Complete application perspective shift
