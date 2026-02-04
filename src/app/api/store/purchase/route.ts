/**
 * POST /api/store/purchase
 * Processes a store product purchase
 * Validates: Requirements 16.3, 16.4, 16.5, 16.6
 */

import { NextRequest, NextResponse } from 'next/server';

interface PurchaseRequest {
  productId: string;
  quantity: number;
}

const mockProducts: { [key: string]: any } = {
  prod_1: { name: 'Neurobud Pro', price: 299.99 },
  prod_2: { name: 'NeuroLens', price: 499.99 },
  prod_3: { name: 'Neuroband', price: 199.99 },
  prod_4: { name: 'NeuroHub', price: 149.99 },
  prod_5: { name: 'Replacement Ear Tips', price: 29.99 },
  prod_6: { name: 'Charging Case', price: 79.99 },
};

export async function POST(request: NextRequest) {
  try {
    const body: PurchaseRequest = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, quantity' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json({ error: 'Quantity must be greater than 0' }, { status: 400 });
    }

    const product = mockProducts[productId];
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const totalPrice = product.price * quantity;

    const purchase = {
      id: `purchase_${Date.now()}`,
      product_id: productId,
      product_name: product.name,
      quantity,
      total_price: totalPrice,
      purchase_date: new Date().toISOString(),
      delivery_status: 'pending',
      estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json({
      success: true,
      purchase,
      message: `Purchase successful! Order ID: ${purchase.id}. Estimated delivery: 5 business days.`,
    });
  } catch (error) {
    console.error('Error in POST /api/store/purchase:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
