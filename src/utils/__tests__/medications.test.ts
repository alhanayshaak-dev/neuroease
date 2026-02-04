import {
  parseFrequency,
  calculateAdherenceRate,
  getAdherenceStatus,
  getDosesTodayCount,
  getExpectedDosesToday,
  isMedicationActive,
  validateMedication,
  type Medication,
} from '../medications';

describe('Medications Utility', () => {
  const baseMedication: Medication = {
    id: 'med-1',
    patient_id: 'patient-1',
    medication_name: 'Aspirin',
    dosage: '500mg',
    frequency: 'twice daily',
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taken_today: false,
    taken_times: [],
    created_at: new Date().toISOString(),
  };

  describe('parseFrequency', () => {
    it('should parse "once daily"', () => {
      expect(parseFrequency('once daily')).toBe(1);
    });

    it('should parse "twice daily"', () => {
      expect(parseFrequency('twice daily')).toBe(2);
    });

    it('should parse "three times daily"', () => {
      expect(parseFrequency('three times daily')).toBe(3);
    });

    it('should parse "four times daily"', () => {
      expect(parseFrequency('four times daily')).toBe(4);
    });

    it('should parse "every 8 hours"', () => {
      expect(parseFrequency('every 8 hours')).toBe(3);
    });

    it('should parse "every 12 hours"', () => {
      expect(parseFrequency('every 12 hours')).toBe(2);
    });

    it('should parse "every 6 hours"', () => {
      expect(parseFrequency('every 6 hours')).toBe(4);
    });

    it('should default to 1 for unparseable frequency', () => {
      expect(parseFrequency('as needed')).toBe(1);
    });

    it('should be case insensitive', () => {
      expect(parseFrequency('TWICE DAILY')).toBe(2);
      expect(parseFrequency('EVERY 8 HOURS')).toBe(3);
    });
  });

  describe('calculateAdherenceRate', () => {
    it('should return 0 for medication with no start date', () => {
      const med = { ...baseMedication, start_date: '' };
      expect(calculateAdherenceRate(med)).toBe(0);
    });

    it('should calculate adherence rate correctly', () => {
      const med = {
        ...baseMedication,
        frequency: 'twice daily',
        taken_times: ['09:00:00', '21:00:00', '09:00:00', '21:00:00'], // 2 days of doses
      };
      const rate = calculateAdherenceRate(med, 2);
      expect(rate).toBe(100);
    });

    it('should handle partial adherence', () => {
      const med = {
        ...baseMedication,
        frequency: 'twice daily',
        taken_times: ['09:00:00', '21:00:00', '09:00:00'], // 1.5 days of doses
      };
      const rate = calculateAdherenceRate(med, 2);
      expect(rate).toBe(75);
    });

    it('should cap adherence at 100%', () => {
      const med = {
        ...baseMedication,
        frequency: 'once daily',
        taken_times: Array(100).fill('09:00:00'),
      };
      const rate = calculateAdherenceRate(med, 30);
      expect(rate).toBeLessThanOrEqual(100);
    });

    it('should respect daysToCheck parameter', () => {
      const med = {
        ...baseMedication,
        frequency: 'once daily',
        taken_times: Array(30).fill('09:00:00'),
      };
      const rate = calculateAdherenceRate(med, 10);
      expect(rate).toBeLessThanOrEqual(100);
    });
  });

  describe('getAdherenceStatus', () => {
    it('should return excellent for 90%+', () => {
      expect(getAdherenceStatus(100)).toBe('excellent');
      expect(getAdherenceStatus(90)).toBe('excellent');
    });

    it('should return good for 75-89%', () => {
      expect(getAdherenceStatus(89)).toBe('good');
      expect(getAdherenceStatus(75)).toBe('good');
    });

    it('should return fair for 50-74%', () => {
      expect(getAdherenceStatus(74)).toBe('fair');
      expect(getAdherenceStatus(50)).toBe('fair');
    });

    it('should return poor for <50%', () => {
      expect(getAdherenceStatus(49)).toBe('poor');
      expect(getAdherenceStatus(0)).toBe('poor');
    });
  });

  describe('getDosesTodayCount', () => {
    it('should return 0 for no doses', () => {
      expect(getDosesTodayCount(baseMedication)).toBe(0);
    });

    it('should count doses taken today', () => {
      const med = {
        ...baseMedication,
        taken_times: ['09:00:00', '21:00:00'],
      };
      expect(getDosesTodayCount(med)).toBe(2);
    });

    it('should handle undefined taken_times', () => {
      const med = { ...baseMedication, taken_times: undefined as any };
      expect(getDosesTodayCount(med)).toBe(0);
    });
  });

  describe('getExpectedDosesToday', () => {
    it('should return expected doses based on frequency', () => {
      expect(getExpectedDosesToday({ ...baseMedication, frequency: 'once daily' })).toBe(1);
      expect(getExpectedDosesToday({ ...baseMedication, frequency: 'twice daily' })).toBe(2);
      expect(getExpectedDosesToday({ ...baseMedication, frequency: 'three times daily' })).toBe(3);
    });
  });

  describe('isMedicationActive', () => {
    it('should return false for future start date', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const med = { ...baseMedication, start_date: tomorrow };
      expect(isMedicationActive(med)).toBe(false);
    });

    it('should return true for current date', () => {
      const today = new Date().toISOString().split('T')[0];
      const med = { ...baseMedication, start_date: today };
      expect(isMedicationActive(med)).toBe(true);
    });

    it('should return false for past end date', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const med = { ...baseMedication, end_date: yesterday };
      expect(isMedicationActive(med)).toBe(false);
    });

    it('should return true for active period', () => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const med = {
        ...baseMedication,
        start_date: today,
        end_date: tomorrow,
      };
      expect(isMedicationActive(med)).toBe(true);
    });
  });

  describe('validateMedication', () => {
    it('should validate correct medication', () => {
      expect(validateMedication(baseMedication)).toBe(true);
    });

    it('should reject missing medication_name', () => {
      const med = { ...baseMedication, medication_name: '' };
      expect(validateMedication(med)).toBe(false);
    });

    it('should reject missing dosage', () => {
      const med = { ...baseMedication, dosage: '' };
      expect(validateMedication(med)).toBe(false);
    });

    it('should reject missing frequency', () => {
      const med = { ...baseMedication, frequency: '' };
      expect(validateMedication(med)).toBe(false);
    });

    it('should reject missing start_date', () => {
      const med = { ...baseMedication, start_date: '' };
      expect(validateMedication(med)).toBe(false);
    });

    it('should reject non-string values', () => {
      expect(validateMedication({ ...baseMedication, medication_name: 123 as any })).toBe(false);
      expect(validateMedication({ ...baseMedication, dosage: null as any })).toBe(false);
    });
  });
});
