-- NeuroFlow Database Schema (Supabase PostgreSQL)
-- Complete schema for all features

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

-- Guardians Table
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  guardian_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('parent', 'therapist', 'teacher', 'other')),
  permissions JSONB DEFAULT '{
    "see_status": false,
    "see_alerts": false,
    "see_trends": false,
    "see_medical": false,
    "trigger_emergency": false,
    "suggest_strategies": false,
    "access_mic": false,
    "access_camera": false
  }',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(patient_id, guardian_user_id)
);

-- Devices Table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  device_type VARCHAR(50) NOT NULL CHECK (device_type IN ('neuroband', 'neurobud', 'neurolens')),
  device_name VARCHAR(255),
  mac_address VARCHAR(17),
  battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
  is_connected BOOLEAN DEFAULT false,
  firmware_version VARCHAR(50),
  last_sync TIMESTAMP,
  damage_state JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor Data Table
CREATE TABLE sensor_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  heart_rate INTEGER,
  hrv INTEGER,
  eda INTEGER,
  accelerometer_x FLOAT,
  accelerometer_y FLOAT,
  accelerometer_z FLOAT,
  location VARCHAR(255),
  activity VARCHAR(255),
  stress_score INTEGER CHECK (stress_score >= 0 AND stress_score <= 100),
  overload_predicted BOOLEAN DEFAULT false,
  overload_predicted_in_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coping Strategies Table
CREATE TABLE coping_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('breathwork', 'grounding', 'body_awareness', 'sensory', 'other')),
  description TEXT,
  duration_minutes INTEGER,
  success_rate FLOAT DEFAULT 0.0 CHECK (success_rate >= 0 AND success_rate <= 1),
  last_used TIMESTAMP,
  times_used INTEGER DEFAULT 0,
  created_by VARCHAR(50) NOT NULL CHECK (created_by IN ('user', 'system', 'therapist')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gestures Table
CREATE TABLE gestures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  gesture_type VARCHAR(100) NOT NULL,
  action VARCHAR(255) NOT NULL,
  action_params JSONB DEFAULT '{}',
  applies_to_modes TEXT[] DEFAULT '{}',
  user_only BOOLEAN DEFAULT false,
  can_be_overridden_by_carer BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modes Table
CREATE TABLE modes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  mode_name VARCHAR(100) NOT NULL,
  neuroband_sensitivity VARCHAR(50) CHECK (neuroband_sensitivity IN ('low', 'normal', 'high')),
  neuroband_haptics_intensity INTEGER CHECK (neuroband_haptics_intensity >= 0 AND neuroband_haptics_intensity <= 100),
  neurobud_noise_reduction VARCHAR(50) CHECK (neurobud_noise_reduction IN ('off', 'low', 'high')),
  neurobud_social_cues BOOLEAN DEFAULT false,
  neurolens_vision_mode VARCHAR(50) CHECK (neurolens_vision_mode IN ('reading', 'outdoor', 'crowd', 'task', 'meeting')),
  neurolens_cues BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Files Table
CREATE TABLE medical_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_type VARCHAR(100) NOT NULL CHECK (file_type IN ('consultation_notes', 'medication_tracker', 'upcoming_consultation', 'diagnosis', 'other')),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  file_url VARCHAR(500),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication Tracker Table
CREATE TABLE medication_tracker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  start_date DATE,
  end_date DATE,
  taken_today BOOLEAN DEFAULT false,
  taken_times TIME[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  location VARCHAR(255),
  sensory_prep JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Care Circle Messages Table
CREATE TABLE care_circle_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  message_type VARCHAR(50) CHECK (message_type IN ('update', 'alert', 'suggestion', 'general')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Library Table
CREATE TABLE community_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contributor_id UUID NOT NULL REFERENCES users(id),
  strategy_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('breathwork', 'grounding', 'sensory', 'social', 'other')),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_verified_by_therapist BOOLEAN DEFAULT false,
  therapist_count INTEGER DEFAULT 0,
  user_rating FLOAT DEFAULT 0.0 CHECK (user_rating >= 0 AND user_rating <= 5),
  helped_count INTEGER DEFAULT 0,
  age_group VARCHAR(50) CHECK (age_group IN ('child', 'teen', 'adult')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store Products Table
CREATE TABLE store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('hardware', 'feature', 'part', 'subscription')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  image_url VARCHAR(500),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Repair Store Table
CREATE TABLE repair_store (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_type VARCHAR(100),
  part_name VARCHAR(255) NOT NULL,
  cost DECIMAL(10, 2),
  estimated_days INTEGER,
  partner_location VARCHAR(255),
  partner_contact VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_guardians_patient_id ON guardians(patient_id);
CREATE INDEX idx_guardians_guardian_user_id ON guardians(guardian_user_id);
CREATE INDEX idx_devices_patient_id ON devices(patient_id);
CREATE INDEX idx_sensor_data_patient_id ON sensor_data(patient_id);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX idx_coping_strategies_patient_id ON coping_strategies(patient_id);
CREATE INDEX idx_gestures_patient_id ON gestures(patient_id);
CREATE INDEX idx_modes_patient_id ON modes(patient_id);
CREATE INDEX idx_medical_files_patient_id ON medical_files(patient_id);
CREATE INDEX idx_medication_tracker_patient_id ON medication_tracker(patient_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_care_circle_messages_patient_id ON care_circle_messages(patient_id);
CREATE INDEX idx_community_library_contributor_id ON community_library(contributor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestures ENABLE ROW LEVEL SECURITY;
ALTER TABLE modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_circle_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_library ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- USERS TABLE POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Guardians can view patient profile
CREATE POLICY "Guardians can view patient profile" ON users
  FOR SELECT USING (
    id IN (
      SELECT user_id FROM patients WHERE id IN (
        SELECT patient_id FROM guardians WHERE guardian_user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- PATIENTS TABLE POLICIES
-- ============================================================================

-- Patients can view their own profile
CREATE POLICY "Patients can view own profile" ON patients
  FOR SELECT USING (auth.uid() = user_id);

-- Patients can update their own profile
CREATE POLICY "Patients can update own profile" ON patients
  FOR UPDATE USING (auth.uid() = user_id);

-- Guardians can view assigned patient data (based on permissions)
CREATE POLICY "Guardians can view assigned patient" ON patients
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians WHERE patient_id = patients.id
    )
  );

-- ============================================================================
-- GUARDIANS TABLE POLICIES
-- ============================================================================

-- Patients can view their guardians
CREATE POLICY "Patients can view their guardians" ON guardians
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Guardians can view their own guardian record
CREATE POLICY "Guardians can view own record" ON guardians
  FOR SELECT USING (auth.uid() = guardian_user_id);

-- Patients can manage their guardians
CREATE POLICY "Patients can manage guardians" ON guardians
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- ============================================================================
-- DEVICES TABLE POLICIES
-- ============================================================================

-- Patients can view their own devices
CREATE POLICY "Patients can view own devices" ON devices
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can manage their own devices
CREATE POLICY "Patients can manage own devices" ON devices
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Guardians can view patient devices (if they have see_status permission)
CREATE POLICY "Guardians can view patient devices" ON devices
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians 
      WHERE patient_id = devices.patient_id 
      AND (permissions->>'see_status')::boolean = true
    )
  );

-- ============================================================================
-- SENSOR DATA TABLE POLICIES
-- ============================================================================

-- Patients can view their own sensor data
CREATE POLICY "Patients can view own sensor data" ON sensor_data
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can insert their own sensor data
CREATE POLICY "Patients can insert own sensor data" ON sensor_data
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Guardians can view patient sensor data (if they have see_status or see_trends permission)
CREATE POLICY "Guardians can view patient sensor data" ON sensor_data
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians 
      WHERE patient_id = sensor_data.patient_id 
      AND (
        (permissions->>'see_status')::boolean = true 
        OR (permissions->>'see_trends')::boolean = true
      )
    )
  );

-- ============================================================================
-- COPING STRATEGIES TABLE POLICIES
-- ============================================================================

-- Patients can view their own strategies
CREATE POLICY "Patients can view own strategies" ON coping_strategies
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can manage their own strategies
CREATE POLICY "Patients can manage own strategies" ON coping_strategies
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Therapists can view patient strategies (if they have suggest_strategies permission)
CREATE POLICY "Therapists can view patient strategies" ON coping_strategies
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians 
      WHERE patient_id = coping_strategies.patient_id 
      AND relationship = 'therapist'
      AND (permissions->>'suggest_strategies')::boolean = true
    )
  );

-- Therapists can add strategies to patient library
CREATE POLICY "Therapists can add strategies" ON coping_strategies
  FOR INSERT WITH CHECK (
    created_by = 'therapist' AND
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians 
      WHERE patient_id = coping_strategies.patient_id 
      AND relationship = 'therapist'
      AND (permissions->>'suggest_strategies')::boolean = true
    )
  );

-- ============================================================================
-- GESTURES TABLE POLICIES
-- ============================================================================

-- Patients can view their own gestures
CREATE POLICY "Patients can view own gestures" ON gestures
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can manage their own gestures
CREATE POLICY "Patients can manage own gestures" ON gestures
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- ============================================================================
-- MODES TABLE POLICIES
-- ============================================================================

-- Patients can view their own modes
CREATE POLICY "Patients can view own modes" ON modes
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can manage their own modes
CREATE POLICY "Patients can manage own modes" ON modes
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- ============================================================================
-- MEDICAL FILES TABLE POLICIES
-- ============================================================================

-- Patients can view their own medical files
CREATE POLICY "Patients can view own medical files" ON medical_files
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can manage their own medical files
CREATE POLICY "Patients can manage own medical files" ON medical_files
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Guardians can view medical files (if they have see_medical permission)
CREATE POLICY "Guardians can view medical files" ON medical_files
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians 
      WHERE patient_id = medical_files.patient_id 
      AND (permissions->>'see_medical')::boolean = true
    )
  );

-- ============================================================================
-- MEDICATION TRACKER TABLE POLICIES
-- ============================================================================

-- Patients can view their own medication tracker
CREATE POLICY "Patients can view own medication" ON medication_tracker
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can manage their own medication tracker
CREATE POLICY "Patients can manage own medication" ON medication_tracker
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Guardians can view medication tracker (if they have see_medical permission)
CREATE POLICY "Guardians can view medication" ON medication_tracker
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians 
      WHERE patient_id = medication_tracker.patient_id 
      AND (permissions->>'see_medical')::boolean = true
    )
  );

-- ============================================================================
-- APPOINTMENTS TABLE POLICIES
-- ============================================================================

-- Patients can view their own appointments
CREATE POLICY "Patients can view own appointments" ON appointments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can manage their own appointments
CREATE POLICY "Patients can manage own appointments" ON appointments
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Guardians can view appointments (if they have see_status or see_trends permission)
CREATE POLICY "Guardians can view appointments" ON appointments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians 
      WHERE patient_id = appointments.patient_id 
      AND (
        (permissions->>'see_status')::boolean = true 
        OR (permissions->>'see_trends')::boolean = true
      )
    )
  );

-- ============================================================================
-- CARE CIRCLE MESSAGES TABLE POLICIES
-- ============================================================================

-- Patients can view messages in their care circle
CREATE POLICY "Patients can view care circle messages" ON care_circle_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Patients can send messages to their care circle
CREATE POLICY "Patients can send messages" ON care_circle_messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM patients WHERE id = patient_id
    )
  );

-- Guardians can view messages in patient's care circle
CREATE POLICY "Guardians can view care circle messages" ON care_circle_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians WHERE patient_id = care_circle_messages.patient_id
    )
  );

-- Guardians can send messages to patient's care circle
CREATE POLICY "Guardians can send messages" ON care_circle_messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT guardian_user_id FROM guardians WHERE patient_id = care_circle_messages.patient_id
    )
  );

-- ============================================================================
-- COMMUNITY LIBRARY TABLE POLICIES
-- ============================================================================

-- Everyone can view community library strategies
CREATE POLICY "Everyone can view community library" ON community_library
  FOR SELECT USING (true);

-- Users can contribute strategies to community library
CREATE POLICY "Users can contribute strategies" ON community_library
  FOR INSERT WITH CHECK (auth.uid() = contributor_id);

-- Contributors can update their own strategies
CREATE POLICY "Contributors can update own strategies" ON community_library
  FOR UPDATE USING (auth.uid() = contributor_id);

-- ============================================================================
-- STORE PRODUCTS TABLE POLICIES
-- ============================================================================

-- Everyone can view store products
CREATE POLICY "Everyone can view store products" ON store_products
  FOR SELECT USING (true);

-- ============================================================================
-- REPAIR STORE TABLE POLICIES
-- ============================================================================

-- Everyone can view repair options
CREATE POLICY "Everyone can view repair options" ON repair_store
  FOR SELECT USING (true);
