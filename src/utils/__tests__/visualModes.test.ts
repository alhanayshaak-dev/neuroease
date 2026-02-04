import {
  getVisualModeConfig,
  applyVisualMode,
  getVisualModeLabel,
  getVisualModeDescription,
  validateVisualModeConfig,
  DEFAULT_VISUAL_MODES,
  VisualModeType,
} from '../visualModes';

describe('Visual Modes', () => {
  describe('getVisualModeConfig', () => {
    it('should return default config for reading mode', () => {
      const config = getVisualModeConfig('reading');
      expect(config.mode).toBe('reading');
      expect(config.brightness).toBe(80);
      expect(config.contrast).toBe(100);
      expect(config.colorFilter).toBe('warm');
    });

    it('should return default config for outdoor mode', () => {
      const config = getVisualModeConfig('outdoor');
      expect(config.mode).toBe('outdoor');
      expect(config.brightness).toBe(120);
      expect(config.contrast).toBe(110);
      expect(config.colorFilter).toBe('cool');
    });

    it('should return default config for crowd mode', () => {
      const config = getVisualModeConfig('crowd');
      expect(config.mode).toBe('crowd');
      expect(config.blur).toBe(20);
      expect(config.highContrast).toBe(true);
    });

    it('should return default config for task mode', () => {
      const config = getVisualModeConfig('task');
      expect(config.mode).toBe('task');
      expect(config.brightness).toBe(100);
      expect(config.contrast).toBe(100);
      expect(config.blur).toBe(0);
    });

    it('should return default config for meeting mode', () => {
      const config = getVisualModeConfig('meeting');
      expect(config.mode).toBe('meeting');
      expect(config.blur).toBe(10);
      expect(config.colorFilter).toBe('warm');
    });
  });

  describe('applyVisualMode', () => {
    it('should generate CSS variables for visual mode', () => {
      const config = getVisualModeConfig('reading');
      const cssVars = applyVisualMode(config);

      expect(cssVars['--visual-filter']).toBeDefined();
      expect(cssVars['--color-filter']).toBeDefined();
      expect(cssVars['--font-scale']).toBeDefined();
      expect(cssVars['--high-contrast']).toBeDefined();
    });

    it('should apply brightness and contrast correctly', () => {
      const config = {
        mode: 'reading' as VisualModeType,
        brightness: 100,
        contrast: 100,
        blur: 0,
        colorFilter: 'none' as const,
        cuesEnabled: true,
        fontSize: 100,
        highContrast: false,
      };
      const cssVars = applyVisualMode(config);

      expect(cssVars['--visual-filter']).toContain('brightness(1)');
      expect(cssVars['--visual-filter']).toContain('contrast(1)');
    });

    it('should apply blur when specified', () => {
      const config = {
        mode: 'crowd' as VisualModeType,
        brightness: 100,
        contrast: 100,
        blur: 20,
        colorFilter: 'none' as const,
        cuesEnabled: true,
        fontSize: 100,
        highContrast: false,
      };
      const cssVars = applyVisualMode(config);

      expect(cssVars['--visual-filter']).toContain('blur(20px)');
    });

    it('should apply warm color filter', () => {
      const config = {
        mode: 'reading' as VisualModeType,
        brightness: 100,
        contrast: 100,
        blur: 0,
        colorFilter: 'warm' as const,
        cuesEnabled: true,
        fontSize: 100,
        highContrast: false,
      };
      const cssVars = applyVisualMode(config);

      expect(cssVars['--color-filter']).toContain('sepia');
    });

    it('should apply cool color filter', () => {
      const config = {
        mode: 'outdoor' as VisualModeType,
        brightness: 100,
        contrast: 100,
        blur: 0,
        colorFilter: 'cool' as const,
        cuesEnabled: true,
        fontSize: 100,
        highContrast: false,
      };
      const cssVars = applyVisualMode(config);

      expect(cssVars['--color-filter']).toContain('hue-rotate');
    });

    it('should set high contrast flag', () => {
      const config = {
        mode: 'crowd' as VisualModeType,
        brightness: 100,
        contrast: 100,
        blur: 0,
        colorFilter: 'none' as const,
        cuesEnabled: true,
        fontSize: 100,
        highContrast: true,
      };
      const cssVars = applyVisualMode(config);

      expect(cssVars['--high-contrast']).toBe('1');
    });

    it('should scale font size correctly', () => {
      const config = {
        mode: 'reading' as VisualModeType,
        brightness: 100,
        contrast: 100,
        blur: 0,
        colorFilter: 'none' as const,
        cuesEnabled: true,
        fontSize: 120,
        highContrast: false,
      };
      const cssVars = applyVisualMode(config);

      expect(cssVars['--font-scale']).toBe('1.2');
    });
  });

  describe('getVisualModeLabel', () => {
    it('should return correct labels for all modes', () => {
      expect(getVisualModeLabel('reading')).toBe('Reading');
      expect(getVisualModeLabel('outdoor')).toBe('Outdoor');
      expect(getVisualModeLabel('crowd')).toBe('Crowd');
      expect(getVisualModeLabel('task')).toBe('Task');
      expect(getVisualModeLabel('meeting')).toBe('Meeting');
    });
  });

  describe('getVisualModeDescription', () => {
    it('should return descriptions for all modes', () => {
      const modes: VisualModeType[] = ['reading', 'outdoor', 'crowd', 'task', 'meeting'];
      modes.forEach((mode) => {
        const description = getVisualModeDescription(mode);
        expect(description).toBeTruthy();
        expect(typeof description).toBe('string');
      });
    });
  });

  describe('validateVisualModeConfig', () => {
    it('should validate brightness range', () => {
      const result = validateVisualModeConfig({ brightness: 200 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Brightness'))).toBe(true);
    });

    it('should validate contrast range', () => {
      const result = validateVisualModeConfig({ contrast: -10 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Contrast'))).toBe(true);
    });

    it('should validate blur range', () => {
      const result = validateVisualModeConfig({ blur: 150 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Blur'))).toBe(true);
    });

    it('should validate font size range', () => {
      const result = validateVisualModeConfig({ fontSize: 30 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Font size'))).toBe(true);
    });

    it('should accept valid configuration', () => {
      const result = validateVisualModeConfig({
        brightness: 100,
        contrast: 100,
        blur: 10,
        fontSize: 100,
      });
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should accept partial configuration', () => {
      const result = validateVisualModeConfig({ brightness: 80 });
      expect(result.valid).toBe(true);
    });
  });

  describe('DEFAULT_VISUAL_MODES', () => {
    it('should have all 5 visual modes defined', () => {
      expect(DEFAULT_VISUAL_MODES.reading).toBeDefined();
      expect(DEFAULT_VISUAL_MODES.outdoor).toBeDefined();
      expect(DEFAULT_VISUAL_MODES.crowd).toBeDefined();
      expect(DEFAULT_VISUAL_MODES.task).toBeDefined();
      expect(DEFAULT_VISUAL_MODES.meeting).toBeDefined();
    });

    it('should have valid configurations for all modes', () => {
      Object.values(DEFAULT_VISUAL_MODES).forEach((config) => {
        const validation = validateVisualModeConfig(config);
        expect(validation.valid).toBe(true);
      });
    });

    it('should have different configurations for different modes', () => {
      const modes = Object.values(DEFAULT_VISUAL_MODES);
      const configs = modes.map((m) => JSON.stringify(m));
      const uniqueConfigs = new Set(configs);
      expect(uniqueConfigs.size).toBeGreaterThan(1);
    });
  });
});
