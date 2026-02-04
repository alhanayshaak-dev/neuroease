/**
 * Property-Based Tests for Store Product Display and Purchase
 * **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6**
 *
 * Property 15: Store Product Display and Purchase
 * For any store product, the system SHALL display accurate information, process purchases,
 * and provide setup instructions for hardware.
 */

import fc from 'fast-check';
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

describe('Store Product Display and Purchase - Property-Based Tests', () => {
  // Generators for realistic store data
  const productTypeGenerator = () =>
    fc.oneof(
      fc.constant('neuroband' as const),
      fc.constant('neurobud' as const),
      fc.constant('neurolens' as const),
      fc.constant('accessory' as const)
    );

  const storeProductGenerator = () =>
    fc.record({
      id: fc.uuid(),
      product_name: fc.string({ minLength: 1, maxLength: 100 }),
      product_type: productTypeGenerator(),
      description: fc.string({ minLength: 1, maxLength: 500 }),
      price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
      stock_quantity: fc.integer({ min: 0, max: 1000 }),
      image_url: fc.option(fc.webUrl(), { frequency: 0.7 }),
      setup_instructions: fc.option(fc.string({ maxLength: 1000 }), { frequency: 0.6 }),
      specifications: fc.record({
        battery_life: fc.option(fc.string()),
        weight: fc.option(fc.string()),
        color: fc.option(fc.string()),
      }),
      created_at: fc.date().map((d) => d.toISOString()),
      updated_at: fc.date().map((d) => d.toISOString()),
    });

  const deviceTypeGenerator = () =>
    fc.oneof(
      fc.constant('neuroband' as const),
      fc.constant('neurobud' as const),
      fc.constant('neurolens' as const)
    );

  const repairOptionGenerator = () =>
    fc.record({
      id: fc.uuid(),
      device_type: deviceTypeGenerator(),
      repair_type: fc.string({ minLength: 1, maxLength: 100 }),
      description: fc.string({ minLength: 1, maxLength: 500 }),
      price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000), noNaN: true }),
      estimated_days: fc.integer({ min: 1, max: 30 }),
      created_at: fc.date().map((d) => d.toISOString()),
      updated_at: fc.date().map((d) => d.toISOString()),
    });

  describe('Property 15.1: Product Information Accuracy', () => {
    it('should display all required product information correctly', () => {
      fc.assert(
        fc.property(storeProductGenerator(), (product) => {
          const formatted = formatProductForDisplay(product);

          // Verify all required fields are present and match source
          return (
            formatted.id === product.id &&
            formatted.name === product.product_name &&
            formatted.type === product.product_type &&
            formatted.description === product.description &&
            formatted.price === product.price &&
            formatted.image === product.image_url &&
            formatted.setupInstructions === product.setup_instructions &&
            typeof formatted.inStock === 'boolean'
          );
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 15.2: Stock Status Display', () => {
    it('should correctly indicate in-stock status based on quantity', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          (quantity) => {
            const product: StoreProduct = {
              id: 'test-1',
              product_name: 'Test Product',
              product_type: 'neuroband',
              description: 'Test',
              price: 100,
              stock_quantity: quantity,
              image_url: null,
              setup_instructions: null,
              specifications: {},
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            };

            const formatted = formatProductForDisplay(product);
            return formatted.inStock === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly indicate out-of-stock status when quantity is zero', () => {
      const product: StoreProduct = {
        id: 'test-1',
        product_name: 'Test Product',
        product_type: 'neuroband',
        description: 'Test',
        price: 100,
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

  describe('Property 15.3: Purchase Validation', () => {
    it('should validate purchases with valid quantity and available stock', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000), noNaN: true }),
          (quantity, price) => {
            const stock = quantity + 10; // Ensure stock is available
            return validatePurchase(quantity, price, stock) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject purchases with quantity exceeding stock', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000), noNaN: true }),
          (quantity, price) => {
            const stock = Math.max(0, quantity - 1); // Stock is less than quantity
            return validatePurchase(quantity, price, stock) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject purchases with zero or negative quantity', () => {
      fc.assert(
        fc.property(
          fc.integer({ max: 0 }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000), noNaN: true }),
          (quantity, price) => {
            return validatePurchase(quantity, price, 100) === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 15.4: Purchase Total Calculation', () => {
    it('should calculate correct total for any valid quantity and price', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
          (quantity, price) => {
            const total = calculatePurchaseTotal(quantity, price);
            const expected = quantity * price;
            // Allow small floating point tolerance
            return Math.abs(total - expected) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return zero for zero quantity', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
          (price) => {
            return calculatePurchaseTotal(0, price) === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle large quantities correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 10000 }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000), noNaN: true }),
          (quantity, price) => {
            const total = calculatePurchaseTotal(quantity, price);
            const expected = quantity * price;
            return Math.abs(total - expected) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 15.5: Product Validation', () => {
    it('should validate products with all required fields', () => {
      fc.assert(
        fc.property(storeProductGenerator(), (product) => {
          return validateStoreProduct(product) === true;
        }),
        { numRuns: 100 }
      );
    });

    it('should reject products with missing required fields', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.record({
              product_type: productTypeGenerator(),
              price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
              stock_quantity: fc.integer({ min: 0, max: 1000 }),
            }),
            fc.record({
              product_name: fc.string({ minLength: 1 }),
              price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
              stock_quantity: fc.integer({ min: 0, max: 1000 }),
            }),
            fc.record({
              product_name: fc.string({ minLength: 1 }),
              product_type: productTypeGenerator(),
              stock_quantity: fc.integer({ min: 0, max: 1000 }),
            })
          ),
          (product) => {
            return validateStoreProduct(product) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject products with negative price', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(-1000), max: Math.fround(-0.01), noNaN: true }),
          (negativePrice) => {
            const product: Partial<StoreProduct> = {
              product_name: 'Test',
              product_type: 'neuroband',
              price: negativePrice,
              stock_quantity: 10,
            };
            return validateStoreProduct(product) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject products with negative stock', () => {
      fc.assert(
        fc.property(
          fc.integer({ max: -1 }),
          (negativeStock) => {
            const product: Partial<StoreProduct> = {
              product_name: 'Test',
              product_type: 'neuroband',
              price: 100,
              stock_quantity: negativeStock,
            };
            return validateStoreProduct(product) === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 15.6: Repair Option Validation and Display', () => {
    it('should validate repair options with all required fields', () => {
      fc.assert(
        fc.property(repairOptionGenerator(), (option) => {
          return validateRepairOption(option) === true;
        }),
        { numRuns: 100 }
      );
    });

    it('should display repair option information correctly', () => {
      fc.assert(
        fc.property(repairOptionGenerator(), (option) => {
          const formatted = formatRepairOptionForDisplay(option);

          return (
            formatted.id === option.id &&
            formatted.deviceType === option.device_type &&
            formatted.repairType === option.repair_type &&
            formatted.description === option.description &&
            formatted.price === option.price &&
            formatted.estimatedDays === option.estimated_days
          );
        }),
        { numRuns: 100 }
      );
    });

    it('should reject repair options with invalid estimated days', () => {
      fc.assert(
        fc.property(
          fc.integer({ max: 0 }),
          (invalidDays) => {
            const option: Partial<RepairOption> = {
              device_type: 'neuroband',
              repair_type: 'battery_replacement',
              price: 50,
              estimated_days: invalidDays,
            };
            return validateRepairOption(option) === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 15.7: Setup Instructions Availability', () => {
    it('should preserve setup instructions when present', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 1000 }),
          (instructions) => {
            const product: StoreProduct = {
              id: 'test-1',
              product_name: 'Test Product',
              product_type: 'neuroband',
              description: 'Test',
              price: 100,
              stock_quantity: 10,
              image_url: null,
              setup_instructions: instructions,
              specifications: {},
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            };

            const formatted = formatProductForDisplay(product);
            return formatted.setupInstructions === instructions;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle null setup instructions', () => {
      const product: StoreProduct = {
        id: 'test-1',
        product_name: 'Test Product',
        product_type: 'neuroband',
        description: 'Test',
        price: 100,
        stock_quantity: 10,
        image_url: null,
        setup_instructions: null,
        specifications: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const formatted = formatProductForDisplay(product);
      expect(formatted.setupInstructions).toBeNull();
    });
  });

  describe('Property 15.8: Price Consistency', () => {
    it('should maintain price consistency across operations', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
          (price) => {
            const product: StoreProduct = {
              id: 'test-1',
              product_name: 'Test Product',
              product_type: 'neuroband',
              description: 'Test',
              price,
              stock_quantity: 10,
              image_url: null,
              setup_instructions: null,
              specifications: {},
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            };

            const formatted = formatProductForDisplay(product);
            return formatted.price === price;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
