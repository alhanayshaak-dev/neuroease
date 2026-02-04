/**
 * GET /api/store/products
 * Retrieves all available store products
 * Validates: Requirements 16.1, 16.2
 */

import { NextResponse } from 'next/server';

const mockProducts = [
  {
    id: 'prod_1',
    product_name: 'Neurobud Pro',
    product_type: 'Earbuds',
    description: 'Advanced neural monitoring earbuds with real-time stress detection',
    price: 299.99,
    stock_quantity: 15,
    image: 'https://via.placeholder.com/300x300?text=Neurobud+Pro',
    setup_instructions: '1. Charge for 2 hours. 2. Download NeuroFlow app. 3. Pair via Bluetooth. 4. Complete calibration.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod_2',
    product_name: 'NeuroLens',
    product_type: 'Smart Glasses',
    description: 'Eye-tracking glasses for visual mode and sensory filtering',
    price: 499.99,
    stock_quantity: 8,
    image: 'https://via.placeholder.com/300x300?text=NeuroLens',
    setup_instructions: '1. Adjust fit. 2. Calibrate eye tracking. 3. Pair with app. 4. Configure visual modes.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod_3',
    product_name: 'Neuroband',
    product_type: 'Wristband',
    description: 'Wearable band for heart rate, HRV, and EDA monitoring',
    price: 199.99,
    stock_quantity: 22,
    image: 'https://via.placeholder.com/300x300?text=Neuroband',
    setup_instructions: '1. Charge fully. 2. Sync with app. 3. Wear on wrist. 4. Calibrate sensors.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod_4',
    product_name: 'NeuroHub',
    product_type: 'Hub Device',
    description: 'Central hub for syncing all NeuroFlow devices',
    price: 149.99,
    stock_quantity: 12,
    image: 'https://via.placeholder.com/300x300?text=NeuroHub',
    setup_instructions: '1. Connect to power. 2. Connect to WiFi. 3. Pair devices. 4. Enable cloud sync.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod_5',
    product_name: 'Replacement Ear Tips',
    product_type: 'Accessories',
    description: 'Set of 3 replacement ear tips for Neurobud (S, M, L)',
    price: 29.99,
    stock_quantity: 50,
    image: 'https://via.placeholder.com/300x300?text=Ear+Tips',
    setup_instructions: 'Remove old tips and snap on new ones. Ensure secure fit.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod_6',
    product_name: 'Charging Case',
    product_type: 'Accessories',
    description: 'Portable charging case for Neurobud with 3x battery capacity',
    price: 79.99,
    stock_quantity: 18,
    image: 'https://via.placeholder.com/300x300?text=Charging+Case',
    setup_instructions: 'Place Neurobud in case. Charging begins automatically.',
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      products: mockProducts,
      count: mockProducts.length,
    });
  } catch (error) {
    console.error('Error in GET /api/store/products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
