/**
 * Unit tests for store utility functions
 * Tests validation, calculation, and formatting functions
 */

import {
  validateStoreProduct,
  validatePurchase,
  calculatePurchaseTotal,
  validateRepairOption,
  formatProductForDisplay,
  formatRepairOptionForDisplay,
} from '../store';
import { Database } from '@/types/database';

type StoreProduct = Database['public']['Tables']['store_products']['Row'];
type RepairOption = Database['public']['Tables']['repair_store']['Row'];

describe('Store Utilities', () => {
  describe('validateStoreProduct', () => {
    it('should validate a complete store product', () => {
      const product: Partial<StoreProduct> = {
        product_name: 'Neuroband',
        product_type: 'neuroband',
        price: 299.99,
        stock_quantity: 10,
      };
      expect(validateStoreProduct(product)).toBe(true);
    });

    it('should reject product with missing name', () => {
      const product: Partial<StoreProduct> = {
        product_type: 'neuroband',
        price: 299.99,
        stock_quantity: 10,
      };
      expect(validateStoreProduct(product)).toBe(false);
    });

    it('should reject product with missing type', () => {
      const product: Partial<StoreProduct> = {
        product_name: 'Neuroband',
        price: 299.99,
        stock_quantity: 10,
      };
      expect(validateStoreProduct(product)).toBe(false);
    });

    it('should reject product with missing price', () => {
      const product: Partial<StoreProduct> = {
        product_name: 'Neuroband',
        product_type: 'neuroband',
        stock_quantity: 10,
      };
      expect(validateStoreProduct(product)).toBe(false);
    });

    it('should reject product with negative price', () => {
      const product: Partial<StoreProduct> = {
        product_name: 'Neuroband',
        product_type: 'neuroband',
        price: -10,
        stock_quantity: 10,
      };
      expect(validateStoreProduct(product)).toBe(false);
    });

    it('should reject product with negative stock', () => {
      const product: Partial<StoreProduct> = {
        product_name: 'Neuroband',
        product_type: 'neuroband',
        price: 299.99,
        stock_quantity: -5,
      };
      expect(validateStoreProduct(product)).toBe(false);
    });
  });

  describe('validatePurchase', () => {
    it('should validate a valid purchase', () => {
      expect(validatePurchase(2, 299.99, 10)).toBe(true);
    });

    it('should reject purchase with zero quantity', () => {
      expect(validatePurchase(0, 299.99, 10)).toBe(false);
    });

    it('should reject purchase with negative quantity', () => {
      expect(validatePurchase(-1, 299.99, 10)).toBe(false);
    });

    it('should reject purchase exceeding stock', () => {
      expect(validatePurchase(15, 299.99, 10)).toBe(false);
    });

    it('should reject purchase with negative price', () => {
      expect(validatePurchase(2, -10, 10)).toBe(false);
    });

    it('should accept purchase with quantity equal to stock', () => {
      expect(validatePurchase(10, 299.99, 10)).toBe(true);
    });
  });

  describe('calculatePurchaseTotal', () => {
    it('should calculate correct total for single item', () => {
      expect(calculatePurchaseTotal(1, 299.99)).toBe(299.99);
    });

    it('should calculate correct total for multiple items', () => {
      expect(calculatePurchaseTotal(3, 100)).toBe(300);
    });

    it('should handle decimal prices', () => {
      expect(calculatePurchaseTotal(2, 49.99)).toBeCloseTo(99.98, 2);
    });

    it('should return zero for zero quantity', () => {
      expect(calculatePurchaseTotal(0, 299.99)).toBe(0);
    });
  });

  describe('validateRepairOption', () => {
    it('should validate a complete repair option', () => {
      const option: Partial<RepairOption> = {
        device_type: 'neuroband',
        repair_type: 'battery_replacement',
        price: 49.99,
        estimated_days: 5,
      };
      expect(validateRepairOption(option)).toBe(true);
    });

    it('should reject repair option with missing device type', () => {
      const option: Partial<RepairOption> = {
        repair_type: 'battery_replacement',
        price: 49.99,
        estimated_days: 5,
      };
      expect(validateRepairOption(option)).toBe(false);
    });

    it('should reject repair option with missing repair type', () => {
      const option: Partial<RepairOption> = {
        device_type: 'neuroband',
        price: 49.99,
        estimated_days: 5,
      };
      expect(validateRepairOption(option)).toBe(false);
    });

    it('should reject repair option with missing price', () => {
      const option: Partial<RepairOption> = {
        device_type: 'neuroband',
        repair_type: 'battery_replacement',
        estimated_days: 5,
      };
      expect(validateRepairOption(option)).toBe(false);
    });

    it('should reject repair option with negative price', () => {
      const option: Partial<RepairOption> = {
        device_type: 'neuroband',
        repair_type: 'battery_replacement',
        price: -10,
        estimated_days: 5,
      };
      expect(validateRepairOption(option)).toBe(false);
    });

    it('should reject repair option with zero estimated days', () => {
      const option: Partial<RepairOption> = {
        device_type: 'neuroband',
        repair_type: 'battery_replacement',
        price: 49.99,
        estimated_days: 0,
      };
      expect(validateRepairOption(option)).toBe(false);
    });

    it('should reject repair option with negative estimated days', () => {
      const option: Partial<RepairOption> = {
        device_type: 'neuroband',
        repair_type: 'battery_replacement',
        price: 49.99,
        estimated_days: -3,
      };
      expect(validateRepairOption(option)).toBe(false);
    });
  });

  describe('formatProductForDisplay', () => {
    it('should format product correctly', () => {
      const product: StoreProduct = {
        id: '1',
        product_name: 'Neuroband',
        product_type: 'neuroband',
        description: 'Wearable stress monitor',
        price: 299.99,
        stock_quantity: 10,
        image_url: 'https://example.com/neuroband.jpg',
        setup_instructions: 'Charge for 2 hours before use',
        specifications: { battery_life: '7 days', weight: '50g' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const formatted = formatProductForDisplay(product);

      expect(formatted.id).toBe('1');
      expect(formatted.name).toBe('Neuroband');
      expect(formatted.type).toBe('neuroband');
      expect(formatted.price).toBe(299.99);
      expect(formatted.inStock).toBe(true);
      expect(formatted.image).toBe('https://example.com/neuroband.jpg');
      expect(formatted.setupInstructions).toBe('Charge for 2 hours before use');
    });

    it('should mark product as out of stock when quantity is zero', () => {
      const product: StoreProduct = {
        id: '1',
        product_name: 'Neuroband',
        product_type: 'neuroband',
        description: 'Wearable stress monitor',
        price: 299.99,
        stock_quantity: 0,
        image_url: null,
        setup_instructions: null,
        specifications: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const formatted = formatProductForDisplay(product);
      expect(formatted.inStock).toBe(false);
    });
  });

  describe('formatRepairOptionForDisplay', () => {
    it('should format repair option correctly', () => {
      const option: RepairOption = {
        id: '1',
        device_type: 'neuroband',
        repair_type: 'battery_replacement',
        description: 'Replace worn battery',
        price: 49.99,
        estimated_days: 5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const formatted = formatRepairOptionForDisplay(option);

      expect(formatted.id).toBe('1');
      expect(formatted.deviceType).toBe('neuroband');
      expect(formatted.repairType).toBe('battery_replacement');
      expect(formatted.price).toBe(49.99);
      expect(formatted.estimatedDays).toBe(5);
    });
  });
});
