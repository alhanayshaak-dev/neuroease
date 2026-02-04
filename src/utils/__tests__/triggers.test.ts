import {
  recordTrigger,
  detectTriggerType,
  analyzeTriggers,
  TriggerRecord,
  StressEvent,
} from '../triggers';

describe('Trigger Tracking System', () => {
  describe('detectTriggerType', () => {
    it('should detect auditory triggers from activity', () => {
      const context = { activity: 'loud noise' };
      expect(detectTriggerType(context)).toBe('auditory');
    });

    it('should detect auditory triggers with various keywords', () => {
      const auditoryKeywords = ['noise', 'sound', 'music', 'alarm', 'bell', 'crowd'];
      for (const keyword of auditoryKeywords) {
        const context = { activity: keyword };
        expect(detectTriggerType(context)).toBe('auditory');
      }
    });

    it('should detect visual triggers from activity', () => {
      const context = { activity: 'bright lights' };
      expect(detectTriggerType(context)).toBe('visual');
    });

    it('should detect visual triggers with various keywords', () => {
      const visualKeywords = ['bright', 'light', 'flash', 'screen', 'visual'];
      for (const keyword of visualKeywords) {
        const context = { activity: keyword };
        expect(detectTriggerType(context)).toBe('visual');
      }
    });

    it('should detect social triggers from activity', () => {
      const context = { activity: 'social meeting' };
      expect(detectTriggerType(context)).toBe('social');
    });

    it('should detect social triggers with various keywords', () => {
      const socialKeywords = ['social', 'meeting', 'presentation', 'conversation', 'group', 'class'];
      for (const keyword of socialKeywords) {
        const context = { activity: keyword };
        expect(detectTriggerType(context)).toBe('social');
      }
    });

    it('should detect social triggers from location', () => {
      const context = { location: 'school' };
      expect(detectTriggerType(context)).toBe('social');
    });

    it('should detect social triggers from various locations', () => {
      const socialLocations = ['school', 'office', 'shop', 'mall', 'public', 'cafe'];
      for (const location of socialLocations) {
        const context = { location };
        expect(detectTriggerType(context)).toBe('social');
      }
    });

    it('should return unknown for unrecognized context', () => {
      const context = { activity: 'unknown activity' };
      expect(detectTriggerType(context)).toBe('unknown');
    });

    it('should handle empty context', () => {
      const context = {};
      expect(detectTriggerType(context)).toBe('unknown');
    });

    it('should be case-insensitive', () => {
      const context = { activity: 'LOUD NOISE' };
      expect(detectTriggerType(context)).toBe('auditory');
    });
  });

  describe('recordTrigger', () => {
    it('should create a trigger record with correct structure', () => {
      const stressEvent: StressEvent = {
        stress_score: 75,
        timestamp: Date.now(),
        context: { activity: 'loud noise', location: 'school' },
      };

      const trigger = recordTrigger(stressEvent);

      expect(trigger).toHaveProperty('id');
      expect(trigger).toHaveProperty('trigger_type');
      expect(trigger).toHaveProperty('stress_score');
      expect(trigger).toHaveProperty('context');
      expect(trigger).toHaveProperty('timestamp');
      expect(trigger).toHaveProperty('created_at');
    });

    it('should detect trigger type correctly', () => {
      const stressEvent: StressEvent = {
        stress_score: 75,
        timestamp: Date.now(),
        context: { activity: 'loud noise' },
      };

      const trigger = recordTrigger(stressEvent);
      expect(trigger.trigger_type).toBe('auditory');
    });

    it('should preserve stress score', () => {
      const stressEvent: StressEvent = {
        stress_score: 85,
        timestamp: Date.now(),
        context: { activity: 'loud noise' },
      };

      const trigger = recordTrigger(stressEvent);
      expect(trigger.stress_score).toBe(85);
    });

    it('should merge context from event and additional context', () => {
      const stressEvent: StressEvent = {
        stress_score: 75,
        timestamp: Date.now(),
        context: { activity: 'loud noise' },
      };

      const additionalContext = { location: 'school' };
      const trigger = recordTrigger(stressEvent, additionalContext);

      expect(trigger.context.activity).toBe('loud noise');
      expect(trigger.context.location).toBe('school');
    });

    it('should generate unique IDs', () => {
      const stressEvent: StressEvent = {
        stress_score: 75,
        timestamp: Date.now(),
        context: { activity: 'loud noise' },
      };

      const trigger1 = recordTrigger(stressEvent);
      const trigger2 = recordTrigger(stressEvent);

      expect(trigger1.id).not.toBe(trigger2.id);
    });

    it('should set created_at to current time', () => {
      const stressEvent: StressEvent = {
        stress_score: 75,
        timestamp: Date.now(),
        context: { activity: 'loud noise' },
      };

      const before = new Date();
      const trigger = recordTrigger(stressEvent);
      const after = new Date();

      const createdAt = new Date(trigger.created_at);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('analyzeTriggers', () => {
    it('should handle empty trigger array', () => {
      const analysis = analyzeTriggers([]);

      expect(analysis.total_triggers).toBe(0);
      expect(analysis.most_common_trigger).toBe('unknown');
      expect(analysis.highest_stress_trigger).toBe('unknown');
      expect(analysis.trigger_patterns.auditory.frequency).toBe(0);
    });

    it('should count trigger frequencies correctly', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 75,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          trigger_type: 'visual',
          stress_score: 65,
          context: { activity: 'bright lights' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.total_triggers).toBe(3);
      expect(analysis.trigger_patterns.auditory.frequency).toBe(2);
      expect(analysis.trigger_patterns.visual.frequency).toBe(1);
      expect(analysis.trigger_patterns.social.frequency).toBe(0);
    });

    it('should calculate average stress scores by trigger type', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 60,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 80,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.average_stress_by_trigger.auditory).toBe(70);
    });

    it('should identify most common trigger', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 75,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          trigger_type: 'visual',
          stress_score: 65,
          context: { activity: 'bright lights' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.most_common_trigger).toBe('auditory');
    });

    it('should identify highest stress trigger', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 50,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'visual',
          stress_score: 90,
          context: { activity: 'bright lights' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.highest_stress_trigger).toBe('visual');
    });

    it('should track stress by location', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: { activity: 'loud noise', location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 80,
          context: { activity: 'loud noise', location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          trigger_type: 'visual',
          stress_score: 60,
          context: { activity: 'bright lights', location: 'home' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.location_stress_map.school).toBe(75);
      expect(analysis.location_stress_map.home).toBe(60);
    });

    it('should track stress by time of day', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: { activity: 'loud noise', time: 'morning' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 80,
          context: { activity: 'loud noise', time: 'morning' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          trigger_type: 'visual',
          stress_score: 60,
          context: { activity: 'bright lights', time: 'evening' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.time_stress_map.morning).toBe(75);
      expect(analysis.time_stress_map.evening).toBe(60);
    });

    it('should track location frequency by trigger type', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: { activity: 'loud noise', location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 75,
          context: { activity: 'loud noise', location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.trigger_patterns.auditory.locations.school).toBe(2);
    });

    it('should track activity frequency by trigger type', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 75,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.trigger_patterns.auditory.activities['loud noise']).toBe(2);
    });

    it('should handle triggers with missing context fields', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: {},
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'visual',
          stress_score: 80,
          context: { location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.total_triggers).toBe(2);
      expect(analysis.trigger_patterns.auditory.frequency).toBe(1);
      expect(analysis.trigger_patterns.visual.frequency).toBe(1);
    });

    it('should calculate correct average stress for single trigger', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 75,
          context: { activity: 'loud noise' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.average_stress_by_trigger.auditory).toBe(75);
    });

    it('should handle multiple triggers of same type at same location', () => {
      const triggers: TriggerRecord[] = [
        {
          id: '1',
          trigger_type: 'auditory',
          stress_score: 70,
          context: { activity: 'loud noise', location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          trigger_type: 'auditory',
          stress_score: 80,
          context: { activity: 'loud noise', location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          trigger_type: 'auditory',
          stress_score: 90,
          context: { activity: 'loud noise', location: 'school' },
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        },
      ];

      const analysis = analyzeTriggers(triggers);

      expect(analysis.trigger_patterns.auditory.locations.school).toBe(3);
      expect(analysis.location_stress_map.school).toBeCloseTo(80, 0);
    });
  });
});
