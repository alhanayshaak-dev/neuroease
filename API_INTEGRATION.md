# NeuroFlow API & Integration Specification

**Supabase backend, Anthropic AI, real-time updates, authentication.**

---

## AUTHENTICATION

### Supabase Auth Setup
```
Provider: Email/Password
MFA: Optional (recommended for guardians)
Session: JWT token, 1 hour expiry
Refresh token: 7 days expiry

Endpoints:
- POST /auth/v1/signup
- POST /auth/v1/signin
- POST /auth/v1/logout
- POST /auth/v1/refresh
- POST /auth/v1/user
```

### Login Flow
```
1. User enters email + password
2. Supabase validates credentials
3. Returns JWT token + refresh token
4. Store in localStorage (secure)
5. Set Authorization header for all requests
6. On token expiry, use refresh token to get new token
```

### Role-Based Access Control (RBAC)
```
Roles:
- patient: Can view own data, manage own settings
- guardian: Can view assigned patient data based on permissions
- therapist: Can view trends, suggest strategies, manage goals
- teacher: Can view status + gentle nudge

Implemented via:
- Supabase RLS (Row Level Security)
- JWT claims (role in token)
- Frontend permission checks
```

---

## REAL-TIME UPDATES (Supabase Realtime)

### Subscriptions
```
Subscribe to sensor data updates:
const subscription = supabase
  .from('sensor_data')
  .on('INSERT', payload => {
    // Update stress graph in real-time
  })
  .subscribe()

Subscribe to device status:
const subscription = supabase
  .from('devices')
  .on('UPDATE', payload => {
    // Update device tiles
  })
  .subscribe()

Subscribe to care circle messages:
const subscription = supabase
  .from('care_circle_messages')
  .on('INSERT', payload => {
    // Show new message notification
  })
  .subscribe()
```

### Unsubscribe
```
supabase.removeSubscription(subscription)
```

---

## SENSOR DATA API

### Receive Sensor Data from Devices
```
Endpoint: POST /api/sensor-data
Headers: Authorization: Bearer {token}
Body: {
  device_id: UUID,
  timestamp: ISO8601,
  heart_rate: INT,
  hrv: INT,
  eda: INT,
  accelerometer_x: FLOAT,
  accelerometer_y: FLOAT,
  accelerometer_z: FLOAT,
  location: STRING,
  activity: STRING
}

Response: {
  success: BOOLEAN,
  stress_score: INT (0-100),
  overload_predicted: BOOLEAN,
  overload_predicted_in_minutes: INT,
  suggested_strategies: ARRAY
}
```

### Get Sensor Data
```
Endpoint: GET /api/sensor-data?timeRange=5min|1hour|1day|1week
Headers: Authorization: Bearer {token}
Response: {
  data: ARRAY of sensor readings,
  stress_score: INT,
  overload_predicted: BOOLEAN,
  triggers: ARRAY
}
```

---

## ANTHROPIC AI INTEGRATION

### Overload Prediction
```
Endpoint: POST /api/ai/predict-overload
Headers: Authorization: Bearer {token}
Body: {
  patient_id: UUID,
  sensor_data: OBJECT,
  historical_data: ARRAY,
  context: STRING (location, activity, time)
}

Response: {
  overload_predicted: BOOLEAN,
  confidence: FLOAT (0-1),
  predicted_in_minutes: INT,
  reason: STRING,
  suggested_strategies: ARRAY
}

Implementation:
- Use Claude API to analyze sensor patterns
- Compare against patient's baseline
- Consider context (location, time, activity)
- Return confidence score
- Suggest top 3 strategies based on past success
```

### Strategy Suggestion
```
Endpoint: POST /api/ai/suggest-strategies
Headers: Authorization: Bearer {token}
Body: {
  patient_id: UUID,
  current_stress_level: INT,
  triggers: ARRAY,
  past_successful_strategies: ARRAY,
  context: STRING
}

Response: {
  strategies: ARRAY of {
    name: STRING,
    description: STRING,
    duration_minutes: INT,
    success_probability: FLOAT,
    reason: STRING
  }
}

Implementation:
- Use Claude to analyze patient's history
- Rank strategies by success rate
- Consider current context
- Personalize recommendations
```

### Conversation Simplification
```
Endpoint: POST /api/ai/simplify-conversation
Headers: Authorization: Bearer {token}
Body: {
  patient_id: UUID,
  speech_text: STRING,
  context: STRING (who is speaking, where, what about)
}

Response: {
  simplified_text: STRING,
  tone: STRING (friendly, impatient, sarcastic, neutral),
  social_cues: ARRAY of {
    cue: STRING,
    explanation: STRING
  },
  suggested_responses: ARRAY
}

Implementation:
- Use Claude to simplify complex speech
- Identify tone and social cues
- Provide context-aware suggestions
- Keep language clear and direct
```

### Therapist Insights
```
Endpoint: POST /api/ai/therapist-insights
Headers: Authorization: Bearer {token}
Body: {
  therapist_id: UUID,
  patient_ids: ARRAY,
  time_period: STRING (week, month, quarter)
}

Response: {
  insights: ARRAY of {
    patient_id: UUID,
    progress: STRING,
    trends: ARRAY,
    recommendations: ARRAY,
    goals_progress: OBJECT
  },
  aggregated_insights: OBJECT
}

Implementation:
- Analyze trends across multiple patients
- Identify common triggers
- Suggest interventions
- Track goal progress
- Provide therapist-friendly summaries
```

---

## DEVICE MANAGEMENT API

### Register Device
```
Endpoint: POST /api/devices/register
Headers: Authorization: Bearer {token}
Body: {
  device_type: STRING (neuroband, neurobud, neurolens),
  mac_address: STRING,
  device_name: STRING
}

Response: {
  device_id: UUID,
  pairing_code: STRING,
  instructions: STRING
}
```

### Update Device Status
```
Endpoint: PUT /api/devices/{device_id}
Headers: Authorization: Bearer {token}
Body: {
  battery_level: INT,
  is_connected: BOOLEAN,
  firmware_version: STRING,
  damage_state: OBJECT
}

Response: {
  success: BOOLEAN,
  device: OBJECT
}
```

### Get Device Data
```
Endpoint: GET /api/devices/{device_id}/data?timeRange=5min|1hour|1day|1week
Headers: Authorization: Bearer {token}
Response: {
  device: OBJECT,
  sensor_data: ARRAY,
  usage_stats: OBJECT,
  coping_methods_used: ARRAY
}
```

---

## GESTURE API

### Get Gestures
```
Endpoint: GET /api/gestures
Headers: Authorization: Bearer {token}
Response: {
  gestures: ARRAY of {
    id: UUID,
    gesture_type: STRING,
    action: STRING,
    applies_to_modes: ARRAY,
    user_only: BOOLEAN
  }
}
```

### Create Gesture
```
Endpoint: POST /api/gestures
Headers: Authorization: Bearer {token}
Body: {
  gesture_type: STRING,
  action: STRING,
  action_params: OBJECT,
  applies_to_modes: ARRAY,
  user_only: BOOLEAN,
  can_be_overridden_by_carer: BOOLEAN
}

Response: {
  id: UUID,
  gesture: OBJECT
}
```

### Update Gesture
```
Endpoint: PUT /api/gestures/{gesture_id}
Headers: Authorization: Bearer {token}
Body: {
  gesture_type: STRING,
  action: STRING,
  applies_to_modes: ARRAY
}

Response: {
  success: BOOLEAN,
  gesture: OBJECT
}
```

### Delete Gesture
```
Endpoint: DELETE /api/gestures/{gesture_id}
Headers: Authorization: Bearer {token}
Response: {
  success: BOOLEAN
}
```

---

## CARE CIRCLE API

### Get Guardians
```
Endpoint: GET /api/care-circle/guardians
Headers: Authorization: Bearer {token}
Response: {
  guardians: ARRAY of {
    id: UUID,
    name: STRING,
    relationship: STRING,
    permissions: OBJECT,
    last_active: TIMESTAMP
  }
}
```

### Invite Guardian
```
Endpoint: POST /api/care-circle/invite
Headers: Authorization: Bearer {token}
Body: {
  email: STRING,
  relationship: STRING,
  permissions: OBJECT
}

Response: {
  success: BOOLEAN,
  invitation_sent: BOOLEAN,
  invitation_code: STRING
}
```

### Update Guardian Permissions
```
Endpoint: PUT /api/care-circle/guardians/{guardian_id}/permissions
Headers: Authorization: Bearer {token}
Body: {
  permissions: OBJECT {
    see_status: BOOLEAN,
    see_alerts: BOOLEAN,
    see_trends: BOOLEAN,
    see_medical: BOOLEAN,
    trigger_emergency: BOOLEAN,
    suggest_strategies: BOOLEAN,
    access_mic: BOOLEAN,
    access_camera: BOOLEAN
  }
}

Response: {
  success: BOOLEAN,
  permissions: OBJECT
}
```

### Send Care Circle Message
```
Endpoint: POST /api/care-circle/messages
Headers: Authorization: Bearer {token}
Body: {
  message: STRING,
  message_type: STRING (update, alert, suggestion, general),
  recipient_ids: ARRAY (optional, if null send to all)
}

Response: {
  success: BOOLEAN,
  message_id: UUID
}
```

### Get Care Circle Messages
```
Endpoint: GET /api/care-circle/messages?limit=50&offset=0
Headers: Authorization: Bearer {token}
Response: {
  messages: ARRAY,
  total_count: INT,
  has_more: BOOLEAN
}
```

---

## COPING STRATEGIES API

### Get Strategies
```
Endpoint: GET /api/strategies
Headers: Authorization: Bearer {token}
Response: {
  strategies: ARRAY of {
    id: UUID,
    name: STRING,
    category: STRING,
    description: STRING,
    duration_minutes: INT,
    success_rate: FLOAT,
    times_used: INT,
    last_used: TIMESTAMP
  }
}
```

### Create Strategy
```
Endpoint: POST /api/strategies
Headers: Authorization: Bearer {token}
Body: {
  name: STRING,
  category: STRING,
  description: STRING,
  duration_minutes: INT
}

Response: {
  id: UUID,
  strategy: OBJECT
}
```

### Log Strategy Use
```
Endpoint: POST /api/strategies/{strategy_id}/use
Headers: Authorization: Bearer {token}
Body: {
  duration_minutes: INT,
  effectiveness: INT (1-5),
  notes: STRING
}

Response: {
  success: BOOLEAN,
  success_rate: FLOAT
}
```

---

## MEDICAL FILES API

### Upload Medical File
```
Endpoint: POST /api/medical-files/upload
Headers: Authorization: Bearer {token}, Content-Type: multipart/form-data
Body: {
  file: FILE,
  file_type: STRING,
  title: STRING
}

Response: {
  id: UUID,
  file_url: STRING,
  uploaded_at: TIMESTAMP
}
```

### Get Medical Files
```
Endpoint: GET /api/medical-files?file_type=consultation_notes|medication_tracker|diagnosis
Headers: Authorization: Bearer {token}
Response: {
  files: ARRAY of {
    id: UUID,
    file_type: STRING,
    title: STRING,
    file_url: STRING,
    uploaded_by: STRING,
    created_at: TIMESTAMP
  }
}
```

### Delete Medical File
```
Endpoint: DELETE /api/medical-files/{file_id}
Headers: Authorization: Bearer {token}
Response: {
  success: BOOLEAN
}
```

---

## MEDICATION TRACKER API

### Get Medications
```
Endpoint: GET /api/medications
Headers: Authorization: Bearer {token}
Response: {
  medications: ARRAY of {
    id: UUID,
    medication_name: STRING,
    dosage: STRING,
    frequency: STRING,
    start_date: DATE,
    end_date: DATE,
    taken_today: BOOLEAN,
    taken_times: ARRAY
  }
}
```

### Log Medication
```
Endpoint: POST /api/medications/{medication_id}/log
Headers: Authorization: Bearer {token}
Body: {
  taken: BOOLEAN,
  time: TIME
}

Response: {
  success: BOOLEAN,
  medication: OBJECT
}
```

### Get Medication-Stress Correlation
```
Endpoint: GET /api/medications/correlation
Headers: Authorization: Bearer {token}
Response: {
  correlation: OBJECT {
    medication_name: STRING,
    adherence_rate: FLOAT,
    average_stress_on_adherence: INT,
    average_stress_on_non_adherence: INT,
    stress_reduction_percentage: FLOAT
  }
}
```

---

## APPOINTMENTS API

### Get Appointments
```
Endpoint: GET /api/appointments?timeRange=upcoming|past|all
Headers: Authorization: Bearer {token}
Response: {
  appointments: ARRAY of {
    id: UUID,
    appointment_type: STRING,
    title: STRING,
    scheduled_time: TIMESTAMP,
    duration_minutes: INT,
    location: STRING,
    sensory_prep: OBJECT,
    notes: STRING
  }
}
```

### Create Appointment
```
Endpoint: POST /api/appointments
Headers: Authorization: Bearer {token}
Body: {
  appointment_type: STRING,
  title: STRING,
  scheduled_time: TIMESTAMP,
  duration_minutes: INT,
  location: STRING,
  sensory_prep: OBJECT,
  notes: STRING
}

Response: {
  id: UUID,
  appointment: OBJECT
}
```

### Get Appointment Prep
```
Endpoint: GET /api/appointments/{appointment_id}/prep
Headers: Authorization: Bearer {token}
Response: {
  sensory_prep: OBJECT,
  checklist: ARRAY,
  suggested_strategies: ARRAY,
  transition_support: OBJECT
}
```

---

## COMMUNITY LIBRARY API

### Get Community Strategies
```
Endpoint: GET /api/community/strategies?category=breathwork|grounding|sensory|social&ageGroup=child|teen|adult&tags=ARRAY&search=STRING
Headers: Authorization: Bearer {token}
Response: {
  strategies: ARRAY of {
    id: UUID,
    strategy_name: STRING,
    category: STRING,
    description: STRING,
    tags: ARRAY,
    is_verified_by_therapist: BOOLEAN,
    therapist_count: INT,
    user_rating: FLOAT,
    helped_count: INT,
    age_group: STRING,
    contributor_name: STRING
  },
  total_count: INT
}
```

### Contribute Strategy
```
Endpoint: POST /api/community/strategies
Headers: Authorization: Bearer {token}
Body: {
  strategy_name: STRING,
  category: STRING,
  description: STRING,
  tags: ARRAY,
  age_group: STRING
}

Response: {
  id: UUID,
  strategy: OBJECT
}
```

### Rate Strategy
```
Endpoint: POST /api/community/strategies/{strategy_id}/rate
Headers: Authorization: Bearer {token}
Body: {
  rating: INT (1-5),
  helped: BOOLEAN
}

Response: {
  success: BOOLEAN,
  new_rating: FLOAT,
  helped_count: INT
}
```

### Verify Strategy (Therapist Only)
```
Endpoint: POST /api/community/strategies/{strategy_id}/verify
Headers: Authorization: Bearer {token}
Body: {
  verified: BOOLEAN
}

Response: {
  success: BOOLEAN,
  therapist_count: INT
}
```

---

## STORE API

### Get Products
```
Endpoint: GET /api/store/products?category=hardware|feature|part|subscription
Headers: Authorization: Bearer {token}
Response: {
  products: ARRAY of {
    id: UUID,
    product_type: STRING,
    name: STRING,
    description: STRING,
    price: DECIMAL,
    category: STRING,
    image_url: STRING,
    in_stock: BOOLEAN
  }
}
```

### Purchase Product
```
Endpoint: POST /api/store/purchase
Headers: Authorization: Bearer {token}
Body: {
  product_id: UUID,
  quantity: INT
}

Response: {
  success: BOOLEAN,
  order_id: UUID,
  total_price: DECIMAL,
  estimated_delivery: DATE
}
```

---

## REPAIR STORE API

### Get Repair Options
```
Endpoint: GET /api/repair/options?part_name=STRING
Headers: Authorization: Bearer {token}
Response: {
  repairs: ARRAY of {
    id: UUID,
    repair_type: STRING,
    part_name: STRING,
    cost: DECIMAL,
    estimated_days: INT,
    partner_location: STRING,
    partner_contact: STRING
  }
}
```

### Request Repair
```
Endpoint: POST /api/repair/request
Headers: Authorization: Bearer {token}
Body: {
  repair_id: UUID,
  device_id: UUID,
  notes: STRING
}

Response: {
  success: BOOLEAN,
  repair_request_id: UUID,
  estimated_completion: DATE
}
```

---

## ANALYTICS API

### Get Trends
```
Endpoint: GET /api/analytics/trends?timeRange=1week|1month|3months&metric=stress|overload|triggers|strategies
Headers: Authorization: Bearer {token}
Response: {
  data: ARRAY,
  summary: OBJECT,
  insights: ARRAY
}
```

### Get Stress by Location
```
Endpoint: GET /api/analytics/stress-by-location
Headers: Authorization: Bearer {token}
Response: {
  locations: ARRAY of {
    location: STRING,
    average_stress: INT,
    overload_events: INT,
    top_triggers: ARRAY
  }
}
```

### Get Hardest Times
```
Endpoint: GET /api/analytics/hardest-times
Headers: Authorization: Bearer {token}
Response: {
  times: ARRAY of {
    time_period: STRING,
    average_stress: INT,
    overload_events: INT,
    top_triggers: ARRAY
  }
}
```

### Export Data
```
Endpoint: GET /api/analytics/export?format=pdf|csv&anonymize=true|false
Headers: Authorization: Bearer {token}
Response: File download
```

---

## ERROR HANDLING

### Standard Error Response
```
{
  success: false,
  error: {
    code: STRING,
    message: STRING,
    details: OBJECT
  }
}

Error codes:
- UNAUTHORIZED: User not authenticated
- FORBIDDEN: User doesn't have permission
- NOT_FOUND: Resource not found
- VALIDATION_ERROR: Invalid input
- RATE_LIMIT: Too many requests
- SERVER_ERROR: Internal server error
```

---

## RATE LIMITING

```
Limits:
- Sensor data: 100 requests/minute
- AI predictions: 10 requests/minute
- General API: 60 requests/minute
- File uploads: 5 requests/minute

Response headers:
- X-RateLimit-Limit: INT
- X-RateLimit-Remaining: INT
- X-RateLimit-Reset: TIMESTAMP
```

---

## SECURITY

### CORS
```
Allowed origins:
- http://localhost:3000 (development)
- https://neuroflow.vercel.app (production)
- https://*.vercel.app (preview deployments)
```

### HTTPS
```
All endpoints require HTTPS
Redirect HTTP to HTTPS
```

### Data Encryption
```
- Sensor data: Encrypted in transit (TLS)
- Medical files: Encrypted at rest
- Passwords: Hashed with bcrypt
- API keys: Stored securely in environment variables
```

### Privacy
```
- GDPR compliant
- Data retention: User-configurable
- Data deletion: Permanent within 30 days
- Data export: Available on demand
- Consent: Explicit for all data sharing
```
