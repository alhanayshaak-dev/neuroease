/**
 * GET /api/store/repair - Get available repair options
 * POST /api/store/repair - Create a repair request
 * Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6
 */

import { NextRequest, NextResponse } from 'next/server';

const mockRepairOptions = [
  {
    id: 'repair_1',
    device_type: 'Neurobud',
    repair_type: 'Battery Replacement',
    description: 'Replace worn battery for full performance restoration',
    price: 49.99,
    estimated_days: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_2',
    device_type: 'Neurobud',
    repair_type: 'Speaker Repair',
    description: 'Fix audio issues or speaker damage',
    price: 79.99,
    estimated_days: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_3',
    device_type: 'Neurobud',
    repair_type: 'Sensor Calibration',
    description: 'Recalibrate stress and heart rate sensors',
    price: 29.99,
    estimated_days: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_4',
    device_type: 'NeuroLens',
    repair_type: 'Screen Replacement',
    description: 'Replace cracked or damaged display',
    price: 199.99,
    estimated_days: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_5',
    device_type: 'NeuroLens',
    repair_type: 'Eye Tracking Calibration',
    description: 'Recalibrate eye tracking sensors',
    price: 39.99,
    estimated_days: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_6',
    device_type: 'NeuroLens',
    repair_type: 'Frame Adjustment',
    description: 'Adjust fit and comfort of frame',
    price: 19.99,
    estimated_days: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_7',
    device_type: 'Neuroband',
    repair_type: 'Battery Replacement',
    description: 'Replace worn battery for extended use',
    price: 39.99,
    estimated_days: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_8',
    device_type: 'Neuroband',
    repair_type: 'Strap Replacement',
    description: 'Replace worn or damaged wrist strap',
    price: 24.99,
    estimated_days: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'repair_9',
    device_type: 'Neuroband',
    repair_type: 'Sensor Recalibration',
    description: 'Recalibrate all health sensors',
    price: 34.99,
    estimated_days: 2,
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      repairOptions: mockRepairOptions,
      count: mockRepairOptions.length,
    });
  } catch (error) {
    console.error('Error in GET /api/store/repair:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, repairTypeId, notes } = body;

    if (!deviceId || !repairTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, repairTypeId' },
        { status: 400 }
      );
    }

    // Find the repair option
    const repairOption = mockRepairOptions.find((r) => r.id === repairTypeId);
    if (!repairOption) {
      return NextResponse.json({ error: 'Repair type not found' }, { status: 404 });
    }

    // Create mock repair request
    const repairRequest = {
      id: `repair_req_${Date.now()}`,
      device_id: deviceId,
      repair_type_id: repairTypeId,
      status: 'pending',
      notes: notes || null,
      created_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + repairOption.estimated_days * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json({
      success: true,
      repairRequest,
      message: `Repair request created. Estimated completion: ${repairOption.estimated_days} days`,
    });
  } catch (error) {
    console.error('Error in POST /api/store/repair:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
