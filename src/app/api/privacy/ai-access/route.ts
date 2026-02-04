import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AIAccessSettings {
  ai_predictions_enabled: boolean;
  ai_strategy_suggestions_enabled: boolean;
  ai_conversation_simplification_enabled: boolean;
  ai_therapist_insights_enabled: boolean;
  data_retention_days: number;
  allow_data_export: boolean;
  allow_data_deletion: boolean;
}

export async function GET() {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the patient record for the current user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Get AI access settings from patient metadata or return defaults
    const defaultSettings: AIAccessSettings = {
      ai_predictions_enabled: false,
      ai_strategy_suggestions_enabled: false,
      ai_conversation_simplification_enabled: false,
      ai_therapist_insights_enabled: false,
      data_retention_days: 90,
      allow_data_export: true,
      allow_data_deletion: true,
    };

    // In a real implementation, these would be stored in a separate table
    // For now, return defaults
    return NextResponse.json(defaultSettings, { status: 200 });
  } catch (error) {
    console.error('Error fetching AI access settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings: Partial<AIAccessSettings> = await request.json();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the patient record for the current user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Validate settings
    if (settings.data_retention_days !== undefined) {
      if (settings.data_retention_days < 0 || settings.data_retention_days > 365) {
        return NextResponse.json(
          { error: 'Data retention days must be between 0 and 365' },
          { status: 400 }
        );
      }
    }

    // In a real implementation, these would be stored in a separate table
    // For now, just return the updated settings
    const updatedSettings: AIAccessSettings = {
      ai_predictions_enabled: settings.ai_predictions_enabled ?? false,
      ai_strategy_suggestions_enabled: settings.ai_strategy_suggestions_enabled ?? false,
      ai_conversation_simplification_enabled:
        settings.ai_conversation_simplification_enabled ?? false,
      ai_therapist_insights_enabled: settings.ai_therapist_insights_enabled ?? false,
      data_retention_days: settings.data_retention_days ?? 90,
      allow_data_export: settings.allow_data_export ?? true,
      allow_data_deletion: settings.allow_data_deletion ?? true,
    };

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    console.error('Error updating AI access settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
