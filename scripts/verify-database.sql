-- ============================================================================
-- NeuroFlow Database Verification Script
-- Run this script to verify all tables, indexes, and RLS policies are set up
-- ============================================================================

-- ============================================================================
-- 1. VERIFY ALL TABLES EXIST
-- ============================================================================

SELECT 
  'TABLE VERIFICATION' as check_type,
  COUNT(*) as total_tables,
  ARRAY_AGG(table_name ORDER BY table_name) as tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Expected: 15 tables
-- Tables: appointments, care_circle_messages, community_library, coping_strategies, 
--         devices, gestures, medical_files, medication_tracker, modes, patients, 
--         repair_store, sensor_data, store_products, users, guardians

-- ============================================================================
-- 2. VERIFY ROW LEVEL SECURITY IS ENABLED
-- ============================================================================

SELECT 
  'RLS VERIFICATION' as check_type,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Expected: All tables should have rowsecurity = true

-- ============================================================================
-- 3. VERIFY ALL INDEXES EXIST
-- ============================================================================

SELECT 
  'INDEX VERIFICATION' as check_type,
  COUNT(*) as total_indexes,
  ARRAY_AGG(indexname ORDER BY indexname) as indexes
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname NOT LIKE 'pg_%';

-- Expected: 14 indexes
-- Indexes: idx_appointments_patient_id, idx_care_circle_messages_patient_id,
--          idx_community_library_contributor_id, idx_coping_strategies_patient_id,
--          idx_devices_patient_id, idx_gestures_patient_id, idx_medical_files_patient_id,
--          idx_medication_tracker_patient_id, idx_modes_patient_id, idx_patients_user_id,
--          idx_sensor_data_patient_id, idx_sensor_data_timestamp

-- ============================================================================
-- 4. VERIFY RLS POLICIES EXIST
-- ============================================================================

SELECT 
  'RLS POLICY VERIFICATION' as check_type,
  tablename,
  COUNT(*) as policy_count,
  ARRAY_AGG(policyname ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename
ORDER BY tablename;

-- Expected: 40+ policies across all tables

-- ============================================================================
-- 5. VERIFY TABLE STRUCTURE - USERS TABLE
-- ============================================================================

SELECT 
  'USERS TABLE STRUCTURE' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Expected columns: id, email, password_hash, role, name, avatar_url, pronouns, created_at, updated_at

-- ============================================================================
-- 6. VERIFY TABLE STRUCTURE - PATIENTS TABLE
-- ============================================================================

SELECT 
  'PATIENTS TABLE STRUCTURE' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'patients' 
ORDER BY ordinal_position;

-- Expected columns: id, user_id, date_of_birth, diagnosis, support_level, baseline_hr, 
--                   baseline_hrv, baseline_eda, sensory_triggers, calming_methods, created_at, updated_at

-- ============================================================================
-- 7. VERIFY TABLE STRUCTURE - GUARDIANS TABLE
-- ============================================================================

SELECT 
  'GUARDIANS TABLE STRUCTURE' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'guardians' 
ORDER BY ordinal_position;

-- Expected columns: id, patient_id, guardian_user_id, relationship, permissions, created_at

-- ============================================================================
-- 8. VERIFY FOREIGN KEY CONSTRAINTS
-- ============================================================================

SELECT 
  'FOREIGN KEY VERIFICATION' as check_type,
  constraint_name,
  table_name,
  column_name,
  referenced_table_name,
  referenced_column_name
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu 
  ON rc.constraint_name = kcu.constraint_name
WHERE constraint_schema = 'public'
ORDER BY table_name, constraint_name;

-- Expected: Foreign keys linking all tables to users/patients

-- ============================================================================
-- 9. VERIFY CHECK CONSTRAINTS
-- ============================================================================

SELECT 
  'CHECK CONSTRAINT VERIFICATION' as check_type,
  table_name,
  constraint_name,
  check_clause
FROM information_schema.check_constraints 
WHERE constraint_schema = 'public'
ORDER BY table_name, constraint_name;

-- Expected: Check constraints on role, support_level, battery_level, stress_score, etc.

-- ============================================================================
-- 10. VERIFY UNIQUE CONSTRAINTS
-- ============================================================================

SELECT 
  'UNIQUE CONSTRAINT VERIFICATION' as check_type,
  table_name,
  constraint_name,
  ARRAY_AGG(column_name) as columns
FROM information_schema.constraint_column_usage ccu
JOIN information_schema.table_constraints tc 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'UNIQUE' 
AND tc.table_schema = 'public'
GROUP BY table_name, constraint_name
ORDER BY table_name, constraint_name;

-- Expected: Unique constraints on users.email, patients.user_id, guardians (patient_id, guardian_user_id)

-- ============================================================================
-- 11. VERIFY EXTENSIONS
-- ============================================================================

SELECT 
  'EXTENSION VERIFICATION' as check_type,
  extname,
  extversion
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'plpgsql')
ORDER BY extname;

-- Expected: uuid-ossp and plpgsql extensions

-- ============================================================================
-- 12. SUMMARY REPORT
-- ============================================================================

WITH table_count AS (
  SELECT COUNT(*) as total FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
),
rls_count AS (
  SELECT COUNT(*) as total FROM pg_tables 
  WHERE schemaname = 'public' AND rowsecurity = true
),
index_count AS (
  SELECT COUNT(*) as total FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname NOT LIKE 'pg_%'
),
policy_count AS (
  SELECT COUNT(*) as total FROM pg_policies 
  WHERE schemaname = 'public'
)
SELECT 
  'SETUP SUMMARY' as check_type,
  (SELECT total FROM table_count) as tables_created,
  (SELECT total FROM rls_count) as tables_with_rls,
  (SELECT total FROM index_count) as indexes_created,
  (SELECT total FROM policy_count) as rls_policies_created;

-- ============================================================================
-- EXPECTED RESULTS:
-- - 15 tables created
-- - 15 tables with RLS enabled
-- - 14 indexes created
-- - 40+ RLS policies created
-- ============================================================================
