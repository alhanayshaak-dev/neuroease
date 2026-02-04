import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { message, messageType } = await request.json();

    // Validate input
    if (!message || !messageType) {
      return NextResponse.json(
        { error: 'Missing required fields: message, messageType' },
        { status: 400 }
      );
    }

    // Validate message type
    const validMessageTypes = ['update', 'alert', 'suggestion', 'general'];
    if (!validMessageTypes.includes(messageType)) {
      return NextResponse.json({ error: 'Invalid messageType' }, { status: 400 });
    }

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the patient record for the current user (could be patient or guardian)
    let patientId: string | null = null;

    // First, check if the user is a patient
    const { data: patientData } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientData) {
      patientId = patientData.id;
    } else {
      // If not a patient, check if they're a guardian and get the patient they're a guardian for
      const { data: guardianData } = await supabase
        .from('guardians')
        .select('patient_id')
        .eq('guardian_user_id', user.id)
        .single();

      if (guardianData) {
        patientId = guardianData.patient_id;
      }
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Create the message
    const { data: messageRecord, error: createError } = await supabase
      .from('care_circle_messages')
      .insert({
        patient_id: patientId,
        sender_id: user.id,
        message,
        message_type: messageType,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
    }

    return NextResponse.json(messageRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the patient record for the current user
    let patientId: string | null = null;

    // First, check if the user is a patient
    const { data: patientData } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientData) {
      patientId = patientData.id;
    } else {
      // If not a patient, check if they're a guardian
      const { data: guardianData } = await supabase
        .from('guardians')
        .select('patient_id')
        .eq('guardian_user_id', user.id)
        .single();

      if (guardianData) {
        patientId = guardianData.patient_id;
      }
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Get messages for this patient with sender info
    const { data: messages, error: messagesError } = await supabase
      .from('care_circle_messages')
      .select(
        `
        *,
        sender:sender_id(id, email, name, avatar_url)
      `
      )
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (messagesError) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    return NextResponse.json(messages || [], { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
