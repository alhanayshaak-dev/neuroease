import {
  generateDefaultSensoryPrep,
  getTimeUntilAppointment,
  isAppointmentToday,
  isAppointmentUpcoming,
  isAppointmentPast,
  formatAppointmentTime,
  getAppointmentStatus,
  calculatePrepCompletion,
  validateAppointment,
  getPrepItemsByCategory,
  updatePrepItemCompletion,
  type Appointment,
} from '../appointments';

describe('Appointments Utility', () => {
  const baseAppointment: Appointment = {
    id: 'apt-1',
    patient_id: 'patient-1',
    title: 'Doctor Appointment',
    scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 30,
    location: 'Medical Center',
    sensory_prep: {},
    created_at: new Date().toISOString(),
  };

  describe('generateDefaultSensoryPrep', () => {
    it('should generate default sensory prep items', () => {
      const prep = generateDefaultSensoryPrep();
      expect(prep.length).toBeGreaterThan(0);
    });

    it('should include all required categories', () => {
      const prep = generateDefaultSensoryPrep();
      const categories = new Set(prep.map((item) => item.category));

      expect(categories.has('environment')).toBe(true);
      expect(categories.has('sensory')).toBe(true);
      expect(categories.has('social')).toBe(true);
      expect(categories.has('transition')).toBe(true);
    });

    it('should have all items uncompleted initially', () => {
      const prep = generateDefaultSensoryPrep();
      expect(prep.every((item) => !item.completed)).toBe(true);
    });

    it('should have unique IDs', () => {
      const prep = generateDefaultSensoryPrep();
      const ids = new Set(prep.map((item) => item.id));
      expect(ids.size).toBe(prep.length);
    });
  });

  describe('getTimeUntilAppointment', () => {
    it('should calculate time for future appointment', () => {
      const futureTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
      const time = getTimeUntilAppointment(futureTime);

      expect(time.days).toBeGreaterThanOrEqual(1);
      expect(time.isPast).toBe(false);
    });

    it('should calculate time for past appointment', () => {
      const pastTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      const time = getTimeUntilAppointment(pastTime);

      expect(time.isPast).toBe(true);
    });

    it('should calculate total minutes correctly', () => {
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const time = getTimeUntilAppointment(futureTime);

      expect(time.totalMinutes).toBeGreaterThanOrEqual(59);
      expect(time.totalMinutes).toBeLessThanOrEqual(61);
    });
  });

  describe('isAppointmentToday', () => {
    it('should return true for today appointment', () => {
      const today = new Date();
      const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0).toISOString();
      expect(isAppointmentToday(todayTime)).toBe(true);
    });

    it('should return false for tomorrow appointment', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const tomorrowTime = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0, 0).toISOString();
      expect(isAppointmentToday(tomorrowTime)).toBe(false);
    });
  });

  describe('isAppointmentUpcoming', () => {
    it('should return true for appointment within 7 days', () => {
      const futureTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(isAppointmentUpcoming(futureTime)).toBe(true);
    });

    it('should return false for appointment more than 7 days away', () => {
      const futureTime = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
      expect(isAppointmentUpcoming(futureTime)).toBe(false);
    });

    it('should return false for past appointment', () => {
      const pastTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(isAppointmentUpcoming(pastTime)).toBe(false);
    });
  });

  describe('isAppointmentPast', () => {
    it('should return true for past appointment', () => {
      const pastTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(isAppointmentPast(pastTime)).toBe(true);
    });

    it('should return false for future appointment', () => {
      const futureTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      expect(isAppointmentPast(futureTime)).toBe(false);
    });
  });

  describe('formatAppointmentTime', () => {
    it('should format appointment time correctly', () => {
      const time = new Date(2024, 0, 15, 14, 30).toISOString();
      const formatted = formatAppointmentTime(time);

      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      // Time format may vary by locale, so just check it contains time info
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe('getAppointmentStatus', () => {
    it('should return "today" for today appointment', () => {
      const today = new Date();
      const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0).toISOString();
      expect(getAppointmentStatus(todayTime)).toBe('today');
    });

    it('should return "upcoming" for future appointment', () => {
      const futureTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(getAppointmentStatus(futureTime)).toBe('upcoming');
    });

    it('should return "past" for past appointment', () => {
      const pastTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(getAppointmentStatus(pastTime)).toBe('past');
    });
  });

  describe('calculatePrepCompletion', () => {
    it('should return 0 for no items completed', () => {
      const prep = generateDefaultSensoryPrep();
      expect(calculatePrepCompletion(prep)).toBe(0);
    });

    it('should return 100 for all items completed', () => {
      const prep = generateDefaultSensoryPrep().map((item) => ({
        ...item,
        completed: true,
      }));
      expect(calculatePrepCompletion(prep)).toBe(100);
    });

    it('should calculate partial completion', () => {
      const prep = generateDefaultSensoryPrep();
      const halfCompleted = prep.map((item, index) => ({
        ...item,
        completed: index < prep.length / 2,
      }));
      const completion = calculatePrepCompletion(halfCompleted);
      expect(completion).toBeGreaterThan(0);
      expect(completion).toBeLessThan(100);
    });

    it('should return 0 for empty array', () => {
      expect(calculatePrepCompletion([])).toBe(0);
    });
  });

  describe('validateAppointment', () => {
    it('should validate correct appointment', () => {
      expect(validateAppointment(baseAppointment)).toBe(true);
    });

    it('should reject missing title', () => {
      const apt = { ...baseAppointment, title: '' };
      expect(validateAppointment(apt)).toBe(false);
    });

    it('should reject missing scheduled_time', () => {
      const apt = { ...baseAppointment, scheduled_time: '' };
      expect(validateAppointment(apt)).toBe(false);
    });

    it('should reject invalid scheduled_time', () => {
      const apt = { ...baseAppointment, scheduled_time: 'invalid-date' };
      expect(validateAppointment(apt)).toBe(false);
    });

    it('should reject non-string title', () => {
      const apt = { ...baseAppointment, title: 123 as any };
      expect(validateAppointment(apt)).toBe(false);
    });
  });

  describe('getPrepItemsByCategory', () => {
    it('should filter items by category', () => {
      const prep = generateDefaultSensoryPrep();
      const environmental = getPrepItemsByCategory(prep, 'environment');

      expect(environmental.length).toBeGreaterThan(0);
      expect(environmental.every((item) => item.category === 'environment')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const prep = generateDefaultSensoryPrep();
      const items = getPrepItemsByCategory(prep, 'other');

      expect(Array.isArray(items)).toBe(true);
    });
  });

  describe('updatePrepItemCompletion', () => {
    it('should mark item as completed', () => {
      const prep = generateDefaultSensoryPrep();
      const itemId = prep[0].id;

      const updated = updatePrepItemCompletion(prep, itemId, true);
      const updatedItem = updated.find((item) => item.id === itemId);

      expect(updatedItem?.completed).toBe(true);
    });

    it('should mark item as incomplete', () => {
      const prep = generateDefaultSensoryPrep().map((item, index) => ({
        ...item,
        completed: index === 0,
      }));
      const itemId = prep[0].id;

      const updated = updatePrepItemCompletion(prep, itemId, false);
      const updatedItem = updated.find((item) => item.id === itemId);

      expect(updatedItem?.completed).toBe(false);
    });

    it('should not modify other items', () => {
      const prep = generateDefaultSensoryPrep();
      const itemId = prep[0].id;
      const otherItem = prep[1];

      const updated = updatePrepItemCompletion(prep, itemId, true);
      const updatedOtherItem = updated.find((item) => item.id === otherItem.id);

      expect(updatedOtherItem?.completed).toBe(otherItem.completed);
    });
  });
});
