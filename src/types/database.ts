// Database types for NeuroFlow
// These types correspond to the Supabase database schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'patient' | 'guardian' | 'therapist' | 'teacher';
          name: string;
          avatar_url: string | null;
          pronouns: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          date_of_birth: string;
          diagnosis: string;
          support_level: 1 | 2 | 3;
          baseline_hr: number;
          baseline_hrv: number;
          baseline_eda: number;
          sensory_triggers: Record<string, unknown>;
          calming_methods: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['patients']['Row']>;
      };
      guardians: {
        Row: {
          id: string;
          patient_id: string;
          guardian_user_id: string;
          relationship: 'parent' | 'therapist' | 'teacher' | 'other';
          permissions: {
            see_status: boolean;
            see_alerts: boolean;
            see_trends: boolean;
            see_medical: boolean;
            trigger_emergency: boolean;
            suggest_strategies: boolean;
            access_mic: boolean;
            access_camera: boolean;
          };
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['guardians']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['guardians']['Row']>;
      };
      devices: {
        Row: {
          id: string;
          patient_id: string;
          device_type: 'neuroband' | 'neurobud' | 'neurolens';
          device_name: string;
          mac_address: string;
          battery_level: number;
          is_connected: boolean;
          firmware_version: string;
          last_sync: string;
          damage_state: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['devices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['devices']['Row']>;
      };
      sensor_data: {
        Row: {
          id: string;
          patient_id: string;
          device_id: string;
          timestamp: string;
          heart_rate: number;
          hrv: number;
          eda: number;
          accelerometer_x: number;
          accelerometer_y: number;
          accelerometer_z: number;
          location: string;
          activity: string;
          stress_score: number;
          overload_predicted: boolean;
          overload_predicted_in_minutes: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sensor_data']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sensor_data']['Row']>;
      };
      coping_strategies: {
        Row: {
          id: string;
          patient_id: string;
          name: string;
          category: 'breathwork' | 'grounding' | 'body_awareness' | 'sensory' | 'other';
          description: string;
          duration_minutes: number;
          success_rate: number;
          last_used: string | null;
          times_used: number;
          created_by: 'user' | 'system' | 'therapist';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['coping_strategies']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['coping_strategies']['Row']>;
      };
      gestures: {
        Row: {
          id: string;
          patient_id: string;
          gesture_type: string;
          action: string;
          action_params: Record<string, unknown>;
          applies_to_modes: string[];
          user_only: boolean;
          can_be_overridden_by_carer: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gestures']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['gestures']['Row']>;
      };
      modes: {
        Row: {
          id: string;
          patient_id: string;
          mode_name: string;
          neuroband_sensitivity: 'low' | 'normal' | 'high';
          neuroband_haptics_intensity: number;
          neurobud_noise_reduction: 'off' | 'low' | 'high';
          neurobud_social_cues: boolean;
          neurolens_vision_mode: 'reading' | 'outdoor' | 'crowd' | 'task' | 'meeting';
          neurolens_cues: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['modes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['modes']['Row']>;
      };
      care_circle_messages: {
        Row: {
          id: string;
          patient_id: string;
          sender_id: string;
          message: string;
          message_type: 'update' | 'alert' | 'suggestion' | 'general';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['care_circle_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['care_circle_messages']['Row']>;
      };
      community_strategies: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: 'breathwork' | 'grounding' | 'body_awareness' | 'sensory' | 'other';
          duration_minutes: number;
          age_group: 'child' | 'teen' | 'adult' | 'all';
          contributed_by: string;
          is_therapist_verified: boolean;
          therapist_id: string | null;
          rating: number;
          rating_count: number;
          times_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community_strategies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['community_strategies']['Row']>;
      };
      community_strategy_ratings: {
        Row: {
          id: string;
          strategy_id: string;
          patient_id: string;
          rating: number;
          feedback: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community_strategy_ratings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['community_strategy_ratings']['Row']>;
      };
      store_products: {
        Row: {
          id: string;
          product_name: string;
          product_type: 'neuroband' | 'neurobud' | 'neurolens' | 'accessory';
          description: string;
          price: number;
          stock_quantity: number;
          image_url: string | null;
          setup_instructions: string | null;
          specifications: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['store_products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['store_products']['Row']>;
      };
      store_purchases: {
        Row: {
          id: string;
          patient_id: string;
          product_id: string;
          quantity: number;
          total_price: number;
          purchase_date: string;
          delivery_status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['store_purchases']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['store_purchases']['Row']>;
      };
      repair_store: {
        Row: {
          id: string;
          device_type: 'neuroband' | 'neurobud' | 'neurolens';
          repair_type: string;
          description: string;
          price: number;
          estimated_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['repair_store']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['repair_store']['Row']>;
      };
      repair_requests: {
        Row: {
          id: string;
          patient_id: string;
          device_id: string;
          repair_type_id: string;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['repair_requests']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['repair_requests']['Row']>;
      };
    };
  };
}
