# NeuroFlow Supabase Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the NeuroFlow database in Supabase, including schema creation, Row Level Security (RLS) policies, and authentication configuration.

**Project Details**:
- Supabase URL: https://udgxrouygmqpblpjmfol.supabase.co
- Database: PostgreSQL
- Authentication: Supabase Auth (JWT-based)

---

## Prerequisites

1. Supabase account with project created
2. Access to Supabase SQL Editor
3. DATABASE_SCHEMA.sql file ready
4. Understanding of Row Level Security (RLS) concepts

---

## Step 1: Access Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your NeuroFlow project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

---

## Step 2: Execute Database Schema

### Option A: Execute Full Schema at Once

1. Open DATABASE_SCHEMA.sql
2. Copy entire content
3. Paste into Supabase SQL Editor
4. Click **Run** button
5. Verify all tables are created (check for success messages)

### Option B: Execute in Sections (Recommended for Debugging)

If you encounter errors, execute in sections:

#### Section 1: Extensions and Core Tables
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'guardian', 'therapist', 'teacher')),
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  pronouns VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE NOT NULL,
  diagnosis TEXT,
  support_level INTEGER CHECK (support_level IN (1, 2, 3)),
  baseline_hr INTEGER,
  baseline_hrv INTEGER,
  baseline_eda INTEGER,
  sensory_triggers JSONB DEFAULT '{}',
  calming_methods JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [Continue with other core tables...]
```

#### Section 2: Indexes
```sql
-- Create all indexes for performance
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_guardians_patient_id ON guardians(patient_id);
-- [Continue with other indexes...]
```

#### Section 3: Enable RLS
```sql
-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- [Continue with other tables...]
```

#### Section 4: Create RLS Policies
```sql
-- Create all RLS policies
-- [Execute all policy creation statements...]
```

---

## Step 3: Verify Schema Creation

### Check Tables Exist

Run this query in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables** (17 total):
- users
- patients
- guardians
- devices
- sensor_data
- coping_strategies
- gestures
- modes
- medical_files
- medication_tracker
- appointments
- care_circle_messages
- community_library
- store_products
- repair_store

### Check RLS is Enabled

Run this query:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Expected result**: All tables should show `rowsecurity = true`

### Check Indexes Exist

Run this query:

```sql
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY indexname;
```

**Expected indexes** (14 total):
- idx_patients_user_id
- idx_guardians_patient_id
- idx_guardians_guardian_user_id
- idx_devices_patient_id
- idx_sensor_data_patient_id
- idx_sensor_data_timestamp
- idx_coping_strategies_patient_id
- idx_gestures_patient_id
- idx_modes_patient_id
- idx_medical_files_patient_id
- idx_medication_tracker_patient_id
- idx_appointments_patient_id
- idx_care_circle_messages_patient_id
- idx_community_library_contributor_id

### Check RLS Policies Exist

Run this query:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

**Expected policies** (40+ total):
- Users table: 2 policies
- Patients table: 3 policies
- Guardians table: 3 policies
- Devices table: 3 policies
- Sensor data table: 3 policies
- Coping strategies table: 4 policies
- Gestures table: 2 policies
- Modes table: 2 policies
- Medical files table: 3 policies
- Medication tracker table: 3 policies
- Appointments table: 3 policies
- Care circle messages table: 4 policies
- Community library table: 3 policies
- Store products table: 1 policy
- Repair store table: 1 policy

---

## Step 4: Configure Supabase Auth

### Enable Email/Password Authentication

1. Go to **Authentication** in left sidebar
2. Click **Providers**
3. Ensure **Email** provider is enabled
4. Configure email settings:
   - Enable "Confirm email" (optional but recommended)
   - Set email confirmation window (default: 24 hours)

### Configure JWT Settings

1. Go to **Authentication** → **JWT Settings**
2. Verify JWT expiry (default: 3600 seconds = 1 hour)
3. Verify refresh token expiry (default: 604800 seconds = 7 days)

### Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

---

## Step 5: Set Up Environment Variables

Create `.env.local` file in project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Anthropic API (for AI features)
NEXT_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-api-key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Step 6: Test RLS Policies

### Test Patient Access

1. Create test user (patient role)
2. Create test patient record linked to user
3. Try to query patient data as that user
4. Verify only own data is accessible

### Test Guardian Access

1. Create test guardian user
2. Create guardian record with permissions
3. Try to query patient data as guardian
4. Verify access is based on permissions

### Test Permission Enforcement

1. Create guardian with `see_status = false`
2. Try to query sensor_data as that guardian
3. Verify access is denied
4. Update permission to `see_status = true`
5. Verify access is now allowed

---

## Step 7: Verify Database Connections

### Test from Next.js Application

Create a test endpoint to verify connection:

```typescript
// pages/api/test-db.ts
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
    
    if (error) throw error
    
    res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}
```

---

## RLS Policy Reference

### Patient Role Policies

**Patient can view own data**:
- Can SELECT from: patients, devices, sensor_data, coping_strategies, gestures, modes, medical_files, medication_tracker, appointments, care_circle_messages
- Can INSERT/UPDATE/DELETE: own records only

**Patient cannot access**:
- Other patients' data
- Guardian records (except own)
- Community library (read-only)

### Guardian Role Policies

**Guardian can view patient data** (based on permissions):
- `see_status`: Can view device status and current stress level
- `see_alerts`: Can view emergency alerts and "I need help" requests
- `see_trends`: Can view analytics and trends
- `see_medical`: Can view medical files and medication tracker
- `trigger_emergency`: Can trigger emergency mode
- `suggest_strategies`: Can suggest coping strategies
- `access_mic`: Can access microphone data
- `access_camera`: Can access camera data

**Guardian cannot**:
- View data without explicit permission
- Modify patient data (except suggesting strategies)
- Access other guardians' data

### Therapist Role Policies

**Therapist can** (if relationship = 'therapist'):
- View patient data (based on permissions)
- Suggest strategies
- Verify community strategies
- View analytics and trends

### Teacher Role Policies

**Teacher can** (if relationship = 'teacher'):
- View patient status (if see_status permission)
- View alerts (if see_alerts permission)
- Suggest gentle nudges (if suggest_strategies permission)

### Public Access Policies

**Everyone can**:
- View community library strategies
- View store products
- View repair options

---

## Troubleshooting

### Issue: "Permission denied" errors

**Solution**: 
1. Verify RLS policies are created
2. Check user is authenticated
3. Verify user has correct role
4. Check guardian permissions are set correctly

### Issue: "Relation does not exist" errors

**Solution**:
1. Verify all tables were created
2. Check table names match exactly (case-sensitive)
3. Run verification query to list all tables

### Issue: "Policy does not exist" errors

**Solution**:
1. Verify all RLS policies were created
2. Check policy names match exactly
3. Run verification query to list all policies

### Issue: Slow queries

**Solution**:
1. Verify all indexes were created
2. Check query execution plan
3. Consider adding additional indexes for frequently queried columns

---

## Maintenance

### Regular Backups

Supabase automatically backs up your database daily. To manually backup:

1. Go to **Settings** → **Backups**
2. Click **Request backup**
3. Download backup file when ready

### Monitor Database Usage

1. Go to **Settings** → **Database**
2. Check storage usage
3. Monitor connection count
4. Review slow query logs

### Update RLS Policies

If you need to modify permissions:

1. Go to **SQL Editor**
2. Drop existing policy: `DROP POLICY "policy_name" ON table_name;`
3. Create new policy with updated logic
4. Test thoroughly before deploying

---

## Security Best Practices

1. **Never expose service role key** in client-side code
2. **Always use RLS policies** to enforce data access
3. **Regularly audit** guardian permissions
4. **Monitor** access logs for suspicious activity
5. **Use strong passwords** for all accounts
6. **Enable 2FA** for admin accounts
7. **Rotate API keys** regularly
8. **Test RLS policies** thoroughly before production

---

## Next Steps

1. ✅ Database schema created
2. ✅ RLS enabled on all tables
3. ✅ RLS policies configured
4. ✅ Supabase Auth configured
5. ⏭️ Implement authentication endpoints (Task 3)
6. ⏭️ Create layout components (Task 4)
7. ⏭️ Set up real-time subscriptions (Task 5)

---

## Support

For issues or questions:
- Supabase Documentation: https://supabase.com/docs
- NeuroFlow Spec: See NEUROFLOW_BUILD_SPEC.md
- Database Schema: See DATABASE_SCHEMA.sql
