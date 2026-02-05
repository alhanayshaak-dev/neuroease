# Deployment Fixes - Quick Checklist for Mobile Version

**Use this checklist to quickly apply all fixes to your mobile codebase**

---

## STEP 1: Unused Parameters (26 Utility Files)

Prefix unused parameters with underscore `_`

### Advanced Features (11 files)
- [ ] `src/utils/advanced-analytics.ts` - `_userId`, `_timeRange`
- [ ] `src/utils/advanced-permissions.ts` - `_userId`
- [ ] `src/utils/backup-recovery.ts` - `_backupId`
- [ ] `src/utils/dashboard-customization.ts` - `_userId`
- [ ] `src/utils/data-security.ts` - `_encryptionKey`
- [ ] `src/utils/data-visualization.ts` - `_dataType`
- [ ] `src/utils/export-reports.ts` - `_reportId`
- [ ] `src/utils/external-integrations.ts` - `_integrationId`
- [ ] `src/utils/feedback-surveys.ts` - `_surveyId`
- [ ] `src/utils/gamification.ts` - `_userId`
- [ ] `src/utils/integration-hub.ts` - `_integrationId`

### Core Features (6 files)
- [ ] `src/utils/appointments.ts` - `_appointmentId`
- [ ] `src/utils/community.ts` - `_communityId`
- [ ] `src/utils/emergency.ts` - `_activationId`, `_patientId` (already done)
- [ ] `src/utils/medications.ts` - `_medicationId`
- [ ] `src/utils/permissions.ts` - `_userId`

### Mobile & Performance (9 files)
- [ ] `src/utils/mobile-features.ts` - `_featureId`
- [ ] `src/utils/offline-mode.ts` - `_syncId`
- [ ] `src/utils/performance-monitoring.ts` - `_metricId`
- [ ] `src/utils/performance-optimization.ts` - `_optimizationId`
- [ ] `src/utils/predictive-alerts.ts` - `_alertId`
- [ ] `src/utils/security-logs.ts` - `_logId`
- [ ] `src/utils/smart-notifications.ts` - `_notificationId`
- [ ] `src/utils/social-features.ts` - `_userId`
- [ ] `src/utils/therapist-collaboration.ts` - `_therapistId`

---

## STEP 2: Unused Imports (4 Utility Files)

Remove unused imports completely

- [ ] `src/utils/devices.ts` - Remove `import { createClient } from '@supabase/supabase-js'`
- [ ] `src/utils/gestures.ts` - Remove `import { createClient } from '@supabase/supabase-js'`
- [ ] `src/utils/modes.ts` - Remove `import { createClient } from '@supabase/supabase-js'`
- [ ] `src/utils/visualModes.ts` - Remove `import { createClient }` and `_getSupabase()` function

---

## STEP 3: Type Errors (1 Utility File)

Fix invalid type properties

- [ ] `src/utils/advanced-search.ts` - Line 50: Remove `result.priority` filter (property doesn't exist)

---

## STEP 4: Component Props (13 Component Files)

Prefix unused props with underscore `_`

- [ ] `src/components/GestureEditor.tsx` - `_onSave`
- [ ] `src/components/CareCircleMessages.tsx` - `_guardianId`
- [ ] `src/components/MedicationTracker.tsx` - `_medications`
- [ ] `src/components/MedicalFileManager.tsx` - `_patientId`
- [ ] `src/components/InviteGuardianForm.tsx` - `_onInviteSent`
- [ ] `src/components/PatientHealthOverview.tsx` - `_patientId`
- [ ] `src/components/SettingsDisplayTab.tsx` - `_settings`
- [ ] `src/components/SettingsIntegrationsTab.tsx` - `_integrations`
- [ ] `src/components/SettingsSecurityTab.tsx` - `_securitySettings`
- [ ] `src/components/TherapistDashboard.tsx` - `_therapistId`
- [ ] `src/components/TherapistMessaging.tsx` - `_patientId`
- [ ] `src/components/VioletStatusCard.tsx` - `_status`
- [ ] `src/components/WhatsNewFeed.tsx` - `_userId`

---

## STEP 5: Page Props (1 Page File)

Prefix unused props with underscore `_`

- [ ] `src/app/community/page.tsx` - `_searchParams`

---

## STEP 6: Verification

Run these commands to verify all fixes:

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Expected: 0 production errors (test files may have errors)
```

- [ ] `tsc --noEmit` returns 0 production errors
- [ ] Build succeeds: `npm run build`
- [ ] No runtime errors in development
- [ ] Ready for deployment

---

## QUICK REFERENCE: Fix Patterns

### Pattern A: Unused Parameter
```typescript
// Change this:
export function myFunc(userId: string) { return 'x'; }

// To this:
export function myFunc(_userId: string) { return 'x'; }
```

### Pattern B: Unused Import
```typescript
// Remove this:
import { createClient } from '@supabase/supabase-js';

// Keep only what's used:
import { Database } from '@/types/database';
```

### Pattern C: Unused React Prop
```typescript
// Change this:
export function MyComponent({ userId, name }: Props) {
  return <div>{name}</div>;
}

// To this:
export function MyComponent({ _userId, name }: Props) {
  return <div>{name}</div>;
}
```

### Pattern D: Invalid Type Property
```typescript
// Remove this:
if (result.priority !== filters.priority) return false;

// Use correct property:
if (result.type !== filters.type) return false;
```

---

## TOTAL FIXES NEEDED

| Category | Count |
|----------|-------|
| Unused Parameters | 26 files |
| Unused Imports | 4 files |
| Type Errors | 1 file |
| Component Props | 13 files |
| Page Props | 1 file |
| **TOTAL** | **45 files** |

---

## ESTIMATED TIME

- **Quick scan**: 15-30 minutes
- **Detailed fixes**: 1-2 hours
- **Testing & verification**: 30 minutes
- **Total**: 2-3 hours

---

## NOTES

✅ All fixes are simple and low-risk  
✅ No logic changes required  
✅ Only parameter naming and import cleanup  
✅ Test files don't need to be fixed (not in production build)  
✅ Same patterns apply to React Native, Flutter, etc.

---

## DEPLOYMENT READINESS

After completing all steps:

- [ ] All 45 files updated
- [ ] TypeScript compilation: 0 errors
- [ ] Build succeeds
- [ ] Ready to deploy

---

**Last Updated**: February 5, 2026  
**Source**: NeuroEase Web Deployment Fixes
