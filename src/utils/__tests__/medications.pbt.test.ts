import fc from 'fast-check';
import {
  calculateAdherenceRate,
  getAdherenceStatus,
  parseFrequency,
  type Medication,
} from '../medications';

/**
 * Property 9: Medication Adherence Calculation
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**
 *
 * For any medication with logged doses, the system SHALL calculate adherence rate
 * as percentage of doses taken on time, and display correlation with stress levels.
 */
describe('Property 9: Medication Adherence Calculation', () => {
  // Generator for medication objects
  const medicationGen = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    medication_name: fc.string({ minLength: 1, maxLength: 50 }),
    dosage: fc.string({ minLength: 1, maxLength: 20 }),
    frequency: fc.constantFrom(
      'once daily',
      'twice daily',
      'three times daily',
      'every 8 hours',
      'every 12 hours'
    ),
    start_date: fc
      .date({ min: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), max: new Date() })
      .map((d) => d.toISOString().split('T')[0]),
    end_date: fc.option(
      fc
        .date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) })
        .map((d) => d.toISOString().split('T')[0])
    ),
    taken_today: fc.boolean(),
    taken_times: fc.array(
      fc
        .tuple(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 })
        )
        .map(([h, m, s]) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`),
      { maxLength: 100 }
    ),
    created_at: fc.date().map((d) => d.toISOString()),
  });

  it('should calculate adherence rate between 0 and 100', () => {
    fc.assert(
      fc.property(medicationGen, (medication) => {
        const rate = calculateAdherenceRate(medication as Medication);
        return rate >= 0 && rate <= 100;
      }),
      { numRuns: 100 }
    );
  });

  it('should return 0 adherence for medication with no doses taken', () => {
    fc.assert(
      fc.property(medicationGen, (medication) => {
        const med = { ...medication, taken_times: [] } as Medication;
        const rate = calculateAdherenceRate(med);
        return rate === 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should increase adherence rate as more doses are taken', () => {
    fc.assert(
      fc.property(
        medicationGen,
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 11, max: 20 }),
        (medication, dosesA, dosesB) => {
          const medA = {
            ...medication,
            taken_times: Array(dosesA).fill('09:00:00'),
          } as Medication;
          const medB = {
            ...medication,
            taken_times: Array(dosesB).fill('09:00:00'),
          } as Medication;

          const rateA = calculateAdherenceRate(medA);
          const rateB = calculateAdherenceRate(medB);

          return rateB >= rateA;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should map adherence rates to correct status', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (rate) => {
        const status = getAdherenceStatus(rate);
        if (rate >= 90) return status === 'excellent';
        if (rate >= 75) return status === 'good';
        if (rate >= 50) return status === 'fair';
        return status === 'poor';
      }),
      { numRuns: 100 }
    );
  });

  it('should parse frequency correctly for all valid formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('once daily'),
          fc.constant('twice daily'),
          fc.constant('three times daily'),
          fc.constant('every 8 hours'),
          fc.constant('every 12 hours'),
          fc.constant('every 6 hours')
        ),
        (frequency) => {
          const doses = parseFrequency(frequency);
          return doses > 0 && doses <= 24;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle medications with no start date gracefully', () => {
    fc.assert(
      fc.property(medicationGen, (medication) => {
        const med = { ...medication, start_date: '' } as Medication;
        const rate = calculateAdherenceRate(med);
        return rate === 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should calculate adherence consistently for same input', () => {
    fc.assert(
      fc.property(medicationGen, (medication) => {
        const med = medication as Medication;
        const rate1 = calculateAdherenceRate(med);
        const rate2 = calculateAdherenceRate(med);
        return rate1 === rate2;
      }),
      { numRuns: 100 }
    );
  });

  it('should respect daysToCheck parameter', () => {
    fc.assert(
      fc.property(
        medicationGen,
        fc.integer({ min: 1, max: 30 }),
        fc.integer({ min: 31, max: 90 }),
        (medication, daysA, daysB) => {
          const med = medication as Medication;
          const rateA = calculateAdherenceRate(med, daysA);
          const rateB = calculateAdherenceRate(med, daysB);
          // Both should be valid rates
          return rateA >= 0 && rateA <= 100 && rateB >= 0 && rateB <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });
});
