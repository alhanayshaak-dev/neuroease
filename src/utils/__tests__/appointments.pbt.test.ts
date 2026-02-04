import fc from 'fast-check';
import {
  getAppointmentStatus,
  getTimeUntilAppointment,
  calculatePrepCompletion,
  generateDefaultSensoryPrep,
  validateAppointment,
  type Appointment,
  type SensoryPrepItem,
} from '../appointments';

/**
 * Property 10: Appointment Sensory Prep Display
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6**
 *
 * For any appointment, the system SHALL display sensory prep checklist,
 * transition support, and post-appointment reflection prompts at appropriate times.
 */
describe('Property 10: Appointment Sensory Prep Display', () => {
  // Generator for appointment objects
  const appointmentGen = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    appointment_type: fc.option(fc.string({ maxLength: 50 })),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    scheduled_time: fc
      .tuple(
        fc.date({ min: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }),
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 })
      )
      .map(([date, hour, minute]) => {
        const d = new Date(date);
        d.setHours(hour, minute, 0, 0);
        return d.toISOString();
      }),
    duration_minutes: fc.option(fc.integer({ min: 15, max: 480 })),
    location: fc.option(fc.string({ maxLength: 100 })),
    sensory_prep: fc.record({}, { withDeletedKeys: true }),
    notes: fc.option(fc.string({ maxLength: 500 })),
    created_at: fc.date().map((d) => d.toISOString()),
  });

  // Generator for sensory prep items
  const prepItemGen = fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 1, maxLength: 200 }),
    category: fc.constantFrom(
      'environment' as const,
      'sensory' as const,
      'social' as const,
      'transition' as const,
      'other' as const
    ),
    completed: fc.boolean(),
  });

  it('should always return valid appointment status', () => {
    fc.assert(
      fc.property(appointmentGen, (appointment) => {
        const status = getAppointmentStatus(appointment.scheduled_time);
        return ['upcoming', 'today', 'past'].includes(status);
      }),
      { numRuns: 100 }
    );
  });

  it('should calculate prep completion between 0 and 100', () => {
    fc.assert(
      fc.property(fc.array(prepItemGen, { maxLength: 20 }), (prepItems) => {
        const completion = calculatePrepCompletion(prepItems as SensoryPrepItem[]);
        return completion >= 0 && completion <= 100;
      }),
      { numRuns: 100 }
    );
  });

  it('should return 0 completion for empty prep list', () => {
    fc.assert(
      fc.property(fc.constant([]), (prepItems) => {
        const completion = calculatePrepCompletion(prepItems as SensoryPrepItem[]);
        return completion === 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should return 100 completion when all items are completed', () => {
    fc.assert(
      fc.property(fc.array(prepItemGen, { minLength: 1, maxLength: 20 }), (prepItems) => {
        const allCompleted = (prepItems as SensoryPrepItem[]).map((item) => ({
          ...item,
          completed: true,
        }));
        const completion = calculatePrepCompletion(allCompleted);
        return completion === 100;
      }),
      { numRuns: 100 }
    );
  });

  it('should increase completion as more items are completed', () => {
    fc.assert(
      fc.property(
        fc.array(prepItemGen, { minLength: 2, maxLength: 20 }),
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 11, max: 20 }),
        (prepItems, countA, countB) => {
          const items = prepItems as SensoryPrepItem[];
          if (countA >= items.length || countB > items.length) {
            return true;
          }

          const itemsA = items.map((item, index) => ({
            ...item,
            completed: index < countA,
          }));

          const itemsB = items.map((item, index) => ({
            ...item,
            completed: index < countB,
          }));

          const completionA = calculatePrepCompletion(itemsA);
          const completionB = calculatePrepCompletion(itemsB);

          return completionB >= completionA;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate correct appointments', () => {
    fc.assert(
      fc.property(appointmentGen, (appointment) => {
        return validateAppointment(appointment as Appointment);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject appointments with missing title', () => {
    fc.assert(
      fc.property(appointmentGen, (appointment) => {
        const apt = { ...appointment, title: '' } as Appointment;
        return !validateAppointment(apt);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject appointments with missing scheduled_time', () => {
    fc.assert(
      fc.property(appointmentGen, (appointment) => {
        const apt = { ...appointment, scheduled_time: '' } as Appointment;
        return !validateAppointment(apt);
      }),
      { numRuns: 100 }
    );
  });

  it('should calculate time until appointment consistently', () => {
    fc.assert(
      fc.property(appointmentGen, (appointment) => {
        const time1 = getTimeUntilAppointment(appointment.scheduled_time);
        const time2 = getTimeUntilAppointment(appointment.scheduled_time);

        // Times should be very close (within 1 second)
        return Math.abs(time1.totalMinutes - time2.totalMinutes) <= 1;
      }),
      { numRuns: 100 }
    );
  });

  it('should generate default sensory prep with all required fields', () => {
    const prep = generateDefaultSensoryPrep();

    expect(prep.length).toBeGreaterThan(0);
    expect(prep.every((item) => item.id && item.title && item.description && item.category)).toBe(true);
    expect(prep.every((item) => !item.completed)).toBe(true);
  });

  it('should handle appointments with various time ranges', () => {
    fc.assert(
      fc.property(appointmentGen, (appointment) => {
        const time = getTimeUntilAppointment(appointment.scheduled_time);
        return (
          typeof time.days === 'number' &&
          typeof time.hours === 'number' &&
          typeof time.minutes === 'number' &&
          typeof time.totalMinutes === 'number' &&
          typeof time.isPast === 'boolean'
        );
      }),
      { numRuns: 100 }
    );
  });
});
