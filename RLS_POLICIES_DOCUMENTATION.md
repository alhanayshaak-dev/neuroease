# NeuroFlow Row Level Security (RLS) Policies Documentation

## Overview

This document provides comprehensive documentation of all Row Level Security (RLS) policies implemented in the NeuroFlow database. RLS policies enforce data access control at the database level, ensuring users can only access data they're authorized to see.

**Key Principles**:
- Patient controls all access to their data
- Guardians access data based on explicit permissions
- Therapists and teachers have role-specific access
- Public data (community library, store) is accessible to all
- All access is logged and auditable

---

## RLS Policy Architecture

### Policy Types

1. **SELECT Policies**: Control who can read data
2. **INSERT Policies**: Control who can create data
3. **UPDATE Policies**: Control who can modify data
4. **DELETE Policies**: Control who can delete data
5. **ALL Policies**: Combined SELECT, INSERT, UPDATE, DELETE

### Permission Model

Permissions are stored as JSONB in the `guardians.permissions` field:

```json
{
  "see_status": false,
  "see_alerts": false,
  "see_trends": false,
  "see_medical": false,
  "trigger_emergency": false,
  "suggest_strategies": false,
  "access_mic": false,
  "access_camera": false
}
```

---

## Table-by-Table Policy Documentation

### 1. USERS TABLE

**Purpose**: Store user accounts and authentication data

**Policies**:

#### Policy: "Users can view own profile"
- **Type**: SELECT
- **Condition**: `auth.uid() = id`
- **Effect**: Users can only view their own user record
- **Use Case**: User profile page, account settings

#### Policy: "Guardians can view patient profile"
- **Type**: SELECT
- **Condition**: User ID is in the patient list of guardians
- **Effect**: Guardians can view the patient's user profile
- **Use Case**: Guardian viewing patient name, avatar, pronouns

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own only | No | Own only | No |
| Guardian | Patient only | No | No | No |
| Therapist | Patient only | No | No | No |
| Teacher | Patient only | No | No | No |

---

### 2. PATIENTS TABLE

**Purpose**: Store patient profile information and baseline vitals

**Policies**:

#### Policy: "Patients can view own profile"
- **Type**: SELECT
- **Condition**: `auth.uid() = user_id`
- **Effect**: Patients can view their own profile
- **Use Case**: Patient viewing their diagnosis, support level, baseline vitals

#### Policy: "Patients can update own profile"
- **Type**: UPDATE
- **Condition**: `auth.uid() = user_id`
- **Effect**: Patients can update their own profile
- **Use Case**: Patient updating baseline vitals, sensory triggers, calming methods

#### Policy: "Guardians can view assigned patient"
- **Type**: SELECT
- **Condition**: User is a guardian of this patient
- **Effect**: Guardians can view patient profile
- **Use Case**: Guardian viewing patient diagnosis, support level

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own only | No | Own only | No |
| Guardian | Assigned patient | No | No | No |
| Therapist | Assigned patient | No | No | No |
| Teacher | Assigned patient | No | No | No |

---

### 3. GUARDIANS TABLE

**Purpose**: Store guardian relationships and permissions

**Policies**:

#### Policy: "Patients can view their guardians"
- **Type**: SELECT
- **Condition**: User is the patient in this record
- **Effect**: Patients can see who their guardians are
- **Use Case**: Patient viewing care circle members

#### Policy: "Guardians can view own record"
- **Type**: SELECT
- **Condition**: `auth.uid() = guardian_user_id`
- **Effect**: Guardians can view their own guardian record
- **Use Case**: Guardian viewing their permissions

#### Policy: "Patients can manage guardians"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient in this record
- **Effect**: Patients can invite, update, and remove guardians
- **Use Case**: Patient managing care circle

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own guardians | Own guardians | Own guardians | Own guardians |
| Guardian | Own record | No | No | No |
| Therapist | Own record | No | No | No |
| Teacher | Own record | No | No | No |

**Permission Enforcement**:
- When a guardian's permissions are updated, access to patient data changes immediately
- Revoking `see_status` permission removes access to device and sensor data
- Revoking `see_medical` permission removes access to medical files and medication tracker

---

### 4. DEVICES TABLE

**Purpose**: Store wearable device information and status

**Policies**:

#### Policy: "Patients can view own devices"
- **Type**: SELECT
- **Condition**: User is the patient who owns this device
- **Effect**: Patients can view all their devices
- **Use Case**: Patient viewing device list, battery status, connection status

#### Policy: "Patients can manage own devices"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient who owns this device
- **Effect**: Patients can add, update, and remove devices
- **Use Case**: Patient pairing new device, updating device name, removing device

#### Policy: "Guardians can view patient devices"
- **Type**: SELECT
- **Condition**: User is a guardian with `see_status = true` permission
- **Effect**: Guardians can view patient's devices
- **Use Case**: Guardian checking if patient's devices are connected

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own devices | Own devices | Own devices | Own devices |
| Guardian | If see_status=true | No | No | No |
| Therapist | If see_status=true | No | No | No |
| Teacher | If see_status=true | No | No | No |

---

### 5. SENSOR DATA TABLE

**Purpose**: Store real-time sensor readings from wearable devices

**Policies**:

#### Policy: "Patients can view own sensor data"
- **Type**: SELECT
- **Condition**: User is the patient who generated this data
- **Effect**: Patients can view all their sensor readings
- **Use Case**: Patient viewing stress graph, heart rate trends

#### Policy: "Patients can insert own sensor data"
- **Type**: INSERT
- **Condition**: User is the patient who is inserting this data
- **Effect**: Patients can log sensor data from their devices
- **Use Case**: Device sending sensor readings to database

#### Policy: "Guardians can view patient sensor data"
- **Type**: SELECT
- **Condition**: User is a guardian with `see_status = true` OR `see_trends = true` permission
- **Effect**: Guardians can view patient's sensor data
- **Use Case**: Guardian viewing patient's current stress level, trends

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own data | Own data | No | No |
| Guardian | If see_status OR see_trends | No | No | No |
| Therapist | If see_status OR see_trends | No | No | No |
| Teacher | If see_status OR see_trends | No | No | No |

**Permission Enforcement**:
- `see_status`: Can view current stress level and device status
- `see_trends`: Can view historical trends and analytics

---

### 6. COPING STRATEGIES TABLE

**Purpose**: Store patient's personal coping strategies and their effectiveness

**Policies**:

#### Policy: "Patients can view own strategies"
- **Type**: SELECT
- **Condition**: User is the patient who owns this strategy
- **Effect**: Patients can view their strategy library
- **Use Case**: Patient browsing coping strategies

#### Policy: "Patients can manage own strategies"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient who owns this strategy
- **Effect**: Patients can create, update, and delete strategies
- **Use Case**: Patient adding new strategy, rating strategy effectiveness

#### Policy: "Therapists can view patient strategies"
- **Type**: SELECT
- **Condition**: User is a therapist with `suggest_strategies = true` permission
- **Effect**: Therapists can view patient's strategies
- **Use Case**: Therapist reviewing patient's coping methods

#### Policy: "Therapists can add strategies"
- **Type**: INSERT
- **Condition**: User is a therapist with `suggest_strategies = true` permission
- **Effect**: Therapists can suggest new strategies to patient
- **Use Case**: Therapist adding evidence-based strategy to patient's library

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own strategies | Own strategies | Own strategies | Own strategies |
| Guardian | If suggest_strategies | No | No | No |
| Therapist | If suggest_strategies | If suggest_strategies | No | No |
| Teacher | If suggest_strategies | If suggest_strategies | No | No |

---

### 7. GESTURES TABLE

**Purpose**: Store custom gesture mappings for device control

**Policies**:

#### Policy: "Patients can view own gestures"
- **Type**: SELECT
- **Condition**: User is the patient who owns this gesture
- **Effect**: Patients can view their custom gestures
- **Use Case**: Patient viewing gesture library

#### Policy: "Patients can manage own gestures"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient who owns this gesture
- **Effect**: Patients can create, update, and delete gestures
- **Use Case**: Patient creating custom gesture, updating gesture action

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own gestures | Own gestures | Own gestures | Own gestures |
| Guardian | No | No | No | No |
| Therapist | No | No | No | No |
| Teacher | No | No | No | No |

---

### 8. MODES TABLE

**Purpose**: Store device mode presets (School, Work, Home, Transit)

**Policies**:

#### Policy: "Patients can view own modes"
- **Type**: SELECT
- **Condition**: User is the patient who owns this mode
- **Effect**: Patients can view their mode presets
- **Use Case**: Patient viewing available modes

#### Policy: "Patients can manage own modes"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient who owns this mode
- **Effect**: Patients can create, update, and delete modes
- **Use Case**: Patient creating custom mode, updating mode settings

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own modes | Own modes | Own modes | Own modes |
| Guardian | No | No | No | No |
| Therapist | No | No | No | No |
| Teacher | No | No | No | No |

---

### 9. MEDICAL FILES TABLE

**Purpose**: Store patient's medical documents and consultation notes

**Policies**:

#### Policy: "Patients can view own medical files"
- **Type**: SELECT
- **Condition**: User is the patient who owns this file
- **Effect**: Patients can view their medical files
- **Use Case**: Patient viewing consultation notes, diagnosis documents

#### Policy: "Patients can manage own medical files"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient who owns this file
- **Effect**: Patients can upload, update, and delete medical files
- **Use Case**: Patient uploading consultation notes, deleting old files

#### Policy: "Guardians can view medical files"
- **Type**: SELECT
- **Condition**: User is a guardian with `see_medical = true` permission
- **Effect**: Guardians can view patient's medical files
- **Use Case**: Guardian reviewing patient's diagnosis, consultation notes

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own files | Own files | Own files | Own files |
| Guardian | If see_medical | No | No | No |
| Therapist | If see_medical | No | No | No |
| Teacher | If see_medical | No | No | No |

---

### 10. MEDICATION TRACKER TABLE

**Purpose**: Store medication adherence tracking

**Policies**:

#### Policy: "Patients can view own medication"
- **Type**: SELECT
- **Condition**: User is the patient who owns this medication
- **Effect**: Patients can view their medication list and adherence
- **Use Case**: Patient viewing medication schedule, logging doses

#### Policy: "Patients can manage own medication"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient who owns this medication
- **Effect**: Patients can add, update, and delete medications
- **Use Case**: Patient logging medication dose, updating medication schedule

#### Policy: "Guardians can view medication"
- **Type**: SELECT
- **Condition**: User is a guardian with `see_medical = true` permission
- **Effect**: Guardians can view patient's medication tracker
- **Use Case**: Guardian checking medication adherence

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own medications | Own medications | Own medications | Own medications |
| Guardian | If see_medical | No | No | No |
| Therapist | If see_medical | No | No | No |
| Teacher | If see_medical | No | No | No |

---

### 11. APPOINTMENTS TABLE

**Purpose**: Store appointment scheduling and sensory prep information

**Policies**:

#### Policy: "Patients can view own appointments"
- **Type**: SELECT
- **Condition**: User is the patient who owns this appointment
- **Effect**: Patients can view their appointments
- **Use Case**: Patient viewing appointment schedule, sensory prep checklist

#### Policy: "Patients can manage own appointments"
- **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condition**: User is the patient who owns this appointment
- **Effect**: Patients can create, update, and delete appointments
- **Use Case**: Patient scheduling appointment, updating appointment details

#### Policy: "Guardians can view appointments"
- **Type**: SELECT
- **Condition**: User is a guardian with `see_status = true` OR `see_trends = true` permission
- **Effect**: Guardians can view patient's appointments
- **Use Case**: Guardian checking patient's appointment schedule

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own appointments | Own appointments | Own appointments | Own appointments |
| Guardian | If see_status OR see_trends | No | No | No |
| Therapist | If see_status OR see_trends | No | No | No |
| Teacher | If see_status OR see_trends | No | No | No |

---

### 12. CARE CIRCLE MESSAGES TABLE

**Purpose**: Store messages between patient and guardians

**Policies**:

#### Policy: "Patients can view care circle messages"
- **Type**: SELECT
- **Condition**: User is the patient in this care circle
- **Effect**: Patients can view all messages in their care circle
- **Use Case**: Patient reading messages from guardians

#### Policy: "Patients can send messages"
- **Type**: INSERT
- **Condition**: User is the patient sending this message
- **Effect**: Patients can send messages to their care circle
- **Use Case**: Patient sending message to guardians

#### Policy: "Guardians can view care circle messages"
- **Type**: SELECT
- **Condition**: User is a guardian in this patient's care circle
- **Effect**: Guardians can view all messages in patient's care circle
- **Use Case**: Guardian reading messages from patient and other guardians

#### Policy: "Guardians can send messages"
- **Type**: INSERT
- **Condition**: User is a guardian in this patient's care circle
- **Effect**: Guardians can send messages to patient's care circle
- **Use Case**: Guardian sending message to patient and other guardians

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | Own care circle | Own care circle | No | No |
| Guardian | Patient's care circle | Patient's care circle | No | No |
| Therapist | Patient's care circle | Patient's care circle | No | No |
| Teacher | Patient's care circle | Patient's care circle | No | No |

---

### 13. COMMUNITY LIBRARY TABLE

**Purpose**: Store community-contributed coping strategies

**Policies**:

#### Policy: "Everyone can view community library"
- **Type**: SELECT
- **Condition**: `true` (no restriction)
- **Effect**: All users can view community strategies
- **Use Case**: Patient browsing community strategies, therapist reviewing strategies

#### Policy: "Users can contribute strategies"
- **Type**: INSERT
- **Condition**: `auth.uid() = contributor_id`
- **Effect**: Users can contribute strategies to community library
- **Use Case**: Patient sharing strategy with community

#### Policy: "Contributors can update own strategies"
- **Type**: UPDATE
- **Condition**: `auth.uid() = contributor_id`
- **Effect**: Contributors can update their own strategies
- **Use Case**: Contributor updating strategy description or tags

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | All strategies | Own contributions | Own contributions | No |
| Guardian | All strategies | Own contributions | Own contributions | No |
| Therapist | All strategies | Own contributions | Own contributions | No |
| Teacher | All strategies | Own contributions | Own contributions | No |

---

### 14. STORE PRODUCTS TABLE

**Purpose**: Store available products in the NeuroFlow store

**Policies**:

#### Policy: "Everyone can view store products"
- **Type**: SELECT
- **Condition**: `true` (no restriction)
- **Effect**: All users can view store products
- **Use Case**: Patient browsing store, guardian purchasing hardware

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | All products | No | No | No |
| Guardian | All products | No | No | No |
| Therapist | All products | No | No | No |
| Teacher | All products | No | No | No |

---

### 15. REPAIR STORE TABLE

**Purpose**: Store repair options and pricing

**Policies**:

#### Policy: "Everyone can view repair options"
- **Type**: SELECT
- **Condition**: `true` (no restriction)
- **Effect**: All users can view repair options
- **Use Case**: Patient viewing repair costs, guardian requesting repair

**Access Matrix**:
| Role | Can View | Can Insert | Can Update | Can Delete |
|------|----------|-----------|-----------|-----------|
| Patient | All options | No | No | No |
| Guardian | All options | No | No | No |
| Therapist | All options | No | No | No |
| Teacher | All options | No | No | No |

---

## Permission Matrix Summary

### Patient Role
- **Full access**: Own data in all tables
- **Read-only**: Community library, store products, repair options
- **Manage**: Guardians, devices, strategies, gestures, modes, medical files, medications, appointments, messages

### Guardian Role (Parent)
- **Permissions**: see_status, see_alerts, see_trends, see_medical, trigger_emergency, suggest_strategies
- **Access**: Patient data based on permissions
- **Manage**: Messages, suggested strategies
- **Read-only**: Community library, store products, repair options

### Guardian Role (Therapist)
- **Permissions**: see_status, see_trends, see_medical, suggest_strategies
- **Access**: Patient data based on permissions
- **Manage**: Suggested strategies, community strategy verification
- **Read-only**: Community library, store products, repair options

### Guardian Role (Teacher)
- **Permissions**: see_status, see_alerts, suggest_strategies
- **Access**: Patient data based on permissions
- **Manage**: Messages, suggested strategies
- **Read-only**: Community library, store products, repair options

---

## Testing RLS Policies

### Test Case 1: Patient Access

```sql
-- As patient user
SELECT * FROM patients WHERE user_id = auth.uid();
-- Expected: Returns own patient record

SELECT * FROM patients WHERE user_id != auth.uid();
-- Expected: Returns empty (access denied)
```

### Test Case 2: Guardian Access with Permissions

```sql
-- As guardian with see_status = true
SELECT * FROM sensor_data WHERE patient_id = <patient_id>;
-- Expected: Returns sensor data

-- As guardian with see_status = false
SELECT * FROM sensor_data WHERE patient_id = <patient_id>;
-- Expected: Returns empty (access denied)
```

### Test Case 3: Permission Revocation

```sql
-- Update guardian permissions
UPDATE guardians 
SET permissions = jsonb_set(permissions, '{see_status}', 'false')
WHERE id = <guardian_id>;

-- Try to access sensor data
SELECT * FROM sensor_data WHERE patient_id = <patient_id>;
-- Expected: Returns empty (access denied immediately)
```

### Test Case 4: Community Library Access

```sql
-- As any user
SELECT * FROM community_library;
-- Expected: Returns all community strategies (no restriction)
```

---

## Troubleshooting RLS Issues

### Issue: "Permission denied" error

**Cause**: User doesn't have permission to access data

**Solution**:
1. Verify user is authenticated
2. Check user role and permissions
3. Verify RLS policy conditions
4. Check guardian permissions in database

### Issue: Guardian can't see patient data

**Cause**: Guardian permissions not set correctly

**Solution**:
1. Verify guardian record exists
2. Check permissions JSON is correct
3. Verify permission is set to `true`
4. Test with specific permission query

### Issue: Patient can't see own data

**Cause**: User ID mismatch or RLS policy issue

**Solution**:
1. Verify user is authenticated
2. Check user ID matches in database
3. Verify RLS policy is enabled
4. Check for policy conflicts

---

## Performance Considerations

### Index Strategy

Indexes are created on frequently queried columns:
- `patient_id`: Used in most RLS policies
- `user_id`: Used for patient lookup
- `guardian_user_id`: Used for guardian lookup
- `timestamp`: Used for time-range queries

### Query Optimization

RLS policies use indexed columns to minimize performance impact:
- Subqueries on indexed columns
- Direct column comparisons
- JSONB operators on indexed data

### Monitoring

Monitor RLS policy performance:
1. Check slow query logs
2. Analyze query execution plans
3. Add indexes if needed
4. Consider caching for frequently accessed data

---

## Security Best Practices

1. **Never bypass RLS**: Always use RLS policies, never use service role for user queries
2. **Test policies thoroughly**: Test all permission combinations before production
3. **Audit access**: Log all data access for compliance
4. **Regular reviews**: Review permissions regularly for least privilege
5. **Principle of least privilege**: Grant minimum necessary permissions
6. **Revoke promptly**: Remove access immediately when no longer needed

---

## Maintenance

### Adding New Policies

When adding new tables:
1. Enable RLS on table
2. Create SELECT policy for data owner
3. Create INSERT/UPDATE/DELETE policies as needed
4. Create policies for guardians based on permissions
5. Test thoroughly before production

### Updating Policies

When modifying policies:
1. Test new policy in development
2. Verify no access regressions
3. Check performance impact
4. Deploy during maintenance window
5. Monitor for issues

### Removing Policies

When removing policies:
1. Verify no dependent code
2. Test access after removal
3. Check for security implications
4. Document reason for removal

---

## References

- Supabase RLS Documentation: https://supabase.com/docs/guides/auth/row-level-security
- PostgreSQL RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- NeuroFlow Requirements: See requirements.md
- NeuroFlow Design: See design.md
