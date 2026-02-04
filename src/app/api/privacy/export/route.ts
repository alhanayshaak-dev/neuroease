import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { format = 'json' } = await request.json();

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
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Collect all patient data
    const [
      { data: medications },
      { data: appointments },
      { data: copingStrategies },
      { data: sensorData },
      { data: medicalFiles },
    ] = await Promise.all([
      supabase.from('medication_tracker').select('*').eq('patient_id', patientData.id),
      supabase.from('appointments').select('*').eq('patient_id', patientData.id),
      supabase.from('coping_strategies').select('*').eq('patient_id', patientData.id),
      supabase
        .from('sensor_data')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('timestamp', { ascending: false })
        .limit(1000),
      supabase.from('medical_files').select('*').eq('patient_id', patientData.id),
    ]);

    // Compile export data
    const exportData = {
      patient: patientData,
      medications: medications || [],
      appointments: appointments || [],
      coping_strategies: copingStrategies || [],
      sensor_data: sensorData || [],
      medical_files: medicalFiles || [],
      export_date: new Date().toISOString(),
    };

    if (format === 'json') {
      return NextResponse.json(exportData, { status: 200 });
    } else if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(exportData);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="neuroflow-export.csv"',
        },
      });
    } else {
      return NextResponse.json({ error: 'Unsupported format. Use json or csv' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function convertToCSV(data: any): string {
  const lines: string[] = [];

  // Add patient info
  lines.push('Patient Data Export');
  lines.push(`Export Date: ${data.export_date}`);
  lines.push('');

  // Add medications
  if (data.medications.length > 0) {
    lines.push('Medications');
    lines.push('Name,Dosage,Frequency,Start Date,End Date,Taken Today');
    data.medications.forEach((med: any) => {
      lines.push(
        `"${med.medication_name}","${med.dosage}","${med.frequency}","${med.start_date}","${med.end_date || ''}","${med.taken_today}"`
      );
    });
    lines.push('');
  }

  // Add appointments
  if (data.appointments.length > 0) {
    lines.push('Appointments');
    lines.push('Title,Type,Scheduled Time,Duration,Location');
    data.appointments.forEach((apt: any) => {
      lines.push(
        `"${apt.title}","${apt.appointment_type || ''}","${apt.scheduled_time}","${apt.duration_minutes || ''}","${apt.location || ''}"`
      );
    });
    lines.push('');
  }

  // Add coping strategies
  if (data.coping_strategies.length > 0) {
    lines.push('Coping Strategies');
    lines.push('Name,Category,Duration,Success Rate,Times Used');
    data.coping_strategies.forEach((strategy: any) => {
      lines.push(
        `"${strategy.name}","${strategy.category}","${strategy.duration_minutes}","${strategy.success_rate}","${strategy.times_used}"`
      );
    });
    lines.push('');
  }

  return lines.join('\n');
}
