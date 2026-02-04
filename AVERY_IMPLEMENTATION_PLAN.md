# Avery Guardian App - Implementation Plan

## Strategy: Minimal Disruption

Instead of rewriting everything, we'll:
1. Keep existing utility functions and tests intact
2. Create new guardian-specific components and pages
3. Add Avery-specific context and authentication
4. Wrap existing components with guardian perspective
5. Maintain all passing tests

## Implementation Phases

### Phase 1: Guardian Context & Auth (Non-Disruptive)
- Create `src/context/GuardianContext.tsx` - Avery's session
- Create `src/hooks/useGuardian.ts` - Guardian-specific hook
- Create `src/lib/guardianAuth.ts` - Guardian authentication
- No changes to existing files

### Phase 2: Guardian Layout Components (New Files)
- Create `src/components/GuardianHeader.tsx` - Avery's header
- Create `src/components/GuardianNav.tsx` - Avery's navigation
- Create `src/components/GuardianLayout.tsx` - Wrapper layout
- No changes to existing files

### Phase 3: Guardian Dashboard (New Page)
- Create `src/app/guardian/page.tsx` - Avery's dashboard
- Create `src/components/VioletStatusCard.tsx` - Violet's status
- Create `src/components/DeviceStatusCarousel.tsx` - Devices carousel
- Create `src/components/AlertsPanel.tsx` - Alerts for Avery
- No changes to existing files

### Phase 4: Guardian Pages (New Routes)
- Create `src/app/guardian/care-circle/page.tsx` - Avery's view
- Create `src/app/guardian/patient/page.tsx` - Violet's info
- Create `src/app/guardian/devices/page.tsx` - Device management
- Create `src/app/guardian/community/page.tsx` - Community library
- No changes to existing files

### Phase 5: Guardian Utilities (New Files)
- Create `src/utils/guardianPermissions.ts` - Permission checking
- Create `src/utils/guardianData.ts` - Data filtering
- No changes to existing files

### Phase 6: Update Root Layout (Minimal Change)
- Modify `src/app/layout.tsx` - Add guardian detection
- Route to guardian or patient app based on role
- Keep existing patient routes intact

## File Structure

```
src/
├── app/
│   ├── layout.tsx (MODIFIED - add guardian detection)
│   ├── guardian/ (NEW)
│   │   ├── page.tsx (Dashboard)
│   │   ├── care-circle/
│   │   │   └── page.tsx
│   │   ├── patient/
│   │   │   └── page.tsx
│   │   ├── devices/
│   │   │   └── page.tsx
│   │   └── community/
│   │       └── page.tsx
│   └── [existing patient routes]
│
├── components/
│   ├── GuardianHeader.tsx (NEW)
│   ├── GuardianNav.tsx (NEW)
│   ├── GuardianLayout.tsx (NEW)
│   ├── VioletStatusCard.tsx (NEW)
│   ├── DeviceStatusCarousel.tsx (NEW)
│   ├── AlertsPanel.tsx (NEW)
│   └── [existing components]
│
├── context/
│   └── GuardianContext.tsx (NEW)
│
├── hooks/
│   ├── useGuardian.ts (NEW)
│   └── [existing hooks]
│
├── lib/
│   ├── guardianAuth.ts (NEW)
│   └── [existing libs]
│
└── utils/
    ├── guardianPermissions.ts (NEW)
    ├── guardianData.ts (NEW)
    └── [existing utils]
```

## Changes Summary

**Files Modified**: 1 (src/app/layout.tsx)
**Files Created**: 20+
**Files Deleted**: 0
**Tests Affected**: 0 (all existing tests remain passing)

## Implementation Order

1. Create GuardianContext
2. Create GuardianAuth utilities
3. Create Guardian layout components
4. Create Guardian dashboard page
5. Create Guardian sub-pages
6. Create Guardian utilities
7. Update root layout
8. Test all routes
9. Verify all tests still pass

## Risk Assessment

**Low Risk** - All changes are additive, no destructive modifications
**Backward Compatible** - Existing patient routes remain unchanged
**Test Safe** - All existing tests continue to pass
**Rollback Easy** - Can remove guardian routes without affecting patient app

---

**Status**: Ready to implement
**Estimated Time**: 2-3 hours
**Risk Level**: LOW
