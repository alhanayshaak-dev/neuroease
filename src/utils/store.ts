/**
 * Store utility functions for product listing and purchase operations
 * Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6
 */

import { Database } from '@/types/database';

export type StoreProduct = Database['public']['Tables']['store_products']['Row'];
export type StorePurchase = Database['public']['Tables']['store_purchases']['Row'];
export type RepairOption = Database['public']['Tables']['repair_store']['Row'];
export type RepairRequest = Database['public']['Tables']['repair_requests']['Row'];

/**
 * Validates store product data
 * Ensures all required fields are present and valid
 */
export function validateStoreProduct(product: Partial<StoreProduct>): boolean {
  if (!product.product_name || !product.product_type || !product.price) {
    return false;
  }
  if (product.price < 0 || product.stock_quantity === undefined || product.stock_quantity < 0) {
    return false;
  }
  return true;
}

/**
 * Validates purchase data
 * Ensures quantity and pricing are valid
 */
export function validatePurchase(
  quantity: number,
  productPrice: number,
  stockAvailable: number
): boolean {
  if (quantity <= 0 || quantity > stockAvailable) {
    return false;
  }
  if (productPrice < 0) {
    return false;
  }
  return true;
}

/**
 * Calculates total purchase price
 * Multiplies quantity by product price
 */
export function calculatePurchaseTotal(quantity: number, productPrice: number): number {
  return quantity * productPrice;
}

/**
 * Validates repair option data
 */
export function validateRepairOption(option: Partial<RepairOption>): boolean {
  if (!option.device_type || !option.repair_type || !option.price) {
    return false;
  }
  if (option.price < 0 || !option.estimated_days || option.estimated_days <= 0) {
    return false;
  }
  return true;
}

/**
 * Formats product information for display
 * Ensures all required fields are present
 */
export function formatProductForDisplay(product: any): {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  inStock: boolean;
  image: string | null;
  setupInstructions: string | null;
  specifications: Record<string, unknown>;
} {
  return {
    id: product.id,
    name: product.product_name,
    type: product.product_type,
    description: product.description,
    price: product.price,
    inStock: (product.stock_quantity || 0) > 0,
    image: product.image_url || product.image || null,
    setupInstructions: product.setup_instructions,
    specifications: product.specifications || {},
  };
}

/**
 * Formats repair option for display
 */
export function formatRepairOptionForDisplay(option: any): {
  id: string;
  deviceType: string;
  repairType: string;
  description: string;
  price: number;
  estimatedDays: number;
} {
  return {
    id: option.id,
    deviceType: option.device_type,
    repairType: option.repair_type,
    description: option.description || '',
    price: option.price,
    estimatedDays: option.estimated_days,
  };
}
