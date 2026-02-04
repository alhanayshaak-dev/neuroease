import {
  detectTone,
  simplifyText,
  generateSuggestedResponses,
  validatePhraseLibraryItem,
  getPhrasesByCategory,
  getPhrasesByDifficulty,
  searchPhrases,
  getSpeechFromGesture,
  getGestureFromSpeech,
  defaultGestureToSpeechMappings,
  type PhraseLibraryItem,
} from '../socialCues';

describe('Social Cues Utility', () => {
  const basePhraseItem: PhraseLibraryItem = {
    id: 'phrase-1',
    phrase: 'Hello, how are you?',
    category: 'greeting',
    context: 'Meeting someone for the first time',
    difficulty: 'easy',
    created_at: new Date().toISOString(),
  };

  describe('detectTone', () => {
    it('should detect positive tone', () => {
      const analysis = detectTone('I love this! It\'s amazing!');
      expect(analysis.tone).toBe('positive');
      expect(analysis.confidence).toBeGreaterThan(0.5);
    });

    it('should detect negative tone', () => {
      const analysis = detectTone('This is terrible and awful');
      expect(analysis.tone).toBe('negative');
      expect(analysis.confidence).toBeGreaterThan(0.5);
    });

    it('should detect neutral tone', () => {
      const analysis = detectTone('The weather is cloudy today');
      expect(analysis.tone).toBe('neutral');
    });

    it('should detect sarcastic tone', () => {
      const analysis = detectTone('Yeah right, sure');
      expect(analysis.tone).toBe('sarcastic');
    });

    it('should detect uncertain tone', () => {
      const analysis = detectTone('What do you think? Is this right?');
      expect(analysis.tone).toBe('uncertain');
    });

    it('should have confidence between 0 and 1', () => {
      const analysis = detectTone('Hello world');
      expect(analysis.confidence).toBeGreaterThanOrEqual(0);
      expect(analysis.confidence).toBeLessThanOrEqual(1);
    });

    it('should provide explanation', () => {
      const analysis = detectTone('I love this!');
      expect(analysis.explanation).toBeTruthy();
      expect(analysis.explanation.length).toBeGreaterThan(0);
    });
  });

  describe('simplifyText', () => {
    it('should replace complex words', () => {
      const simplified = simplifyText('Unfortunately, we cannot utilize this facility');
      expect(simplified).toContain('sadly');
      expect(simplified).toContain('use');
    });

    it('should break long sentences', () => {
      const simplified = simplifyText('First sentence. Second sentence.');
      expect(simplified).toContain('\n');
    });

    it('should remove unnecessary punctuation', () => {
      const simplified = simplifyText('Hello; world: test');
      expect(simplified).not.toContain(';');
      expect(simplified).not.toContain(':');
    });

    it('should handle empty text', () => {
      const simplified = simplifyText('');
      expect(simplified).toBe('');
    });
  });

  describe('generateSuggestedResponses', () => {
    it('should generate positive responses', () => {
      const responses = generateSuggestedResponses('positive');
      expect(responses.length).toBeGreaterThan(0);
      expect(responses[0]).toBeTruthy();
    });

    it('should generate negative responses', () => {
      const responses = generateSuggestedResponses('negative');
      expect(responses.length).toBeGreaterThan(0);
      expect(responses.some((r) => r.toLowerCase().includes('sorry'))).toBe(true);
    });

    it('should generate sarcastic responses', () => {
      const responses = generateSuggestedResponses('sarcastic');
      expect(responses.length).toBeGreaterThan(0);
    });

    it('should generate uncertain responses', () => {
      const responses = generateSuggestedResponses('uncertain');
      expect(responses.length).toBeGreaterThan(0);
    });

    it('should generate neutral responses', () => {
      const responses = generateSuggestedResponses('neutral');
      expect(responses.length).toBeGreaterThan(0);
    });
  });

  describe('validatePhraseLibraryItem', () => {
    it('should validate correct phrase item', () => {
      expect(validatePhraseLibraryItem(basePhraseItem)).toBe(true);
    });

    it('should reject missing phrase', () => {
      const item = { ...basePhraseItem, phrase: '' };
      expect(validatePhraseLibraryItem(item)).toBe(false);
    });

    it('should reject invalid category', () => {
      const item = { ...basePhraseItem, category: 'invalid' as any };
      expect(validatePhraseLibraryItem(item)).toBe(false);
    });

    it('should reject invalid difficulty', () => {
      const item = { ...basePhraseItem, difficulty: 'impossible' as any };
      expect(validatePhraseLibraryItem(item)).toBe(false);
    });

    it('should accept valid difficulties', () => {
      expect(validatePhraseLibraryItem({ ...basePhraseItem, difficulty: 'easy' })).toBe(true);
      expect(validatePhraseLibraryItem({ ...basePhraseItem, difficulty: 'medium' })).toBe(true);
      expect(validatePhraseLibraryItem({ ...basePhraseItem, difficulty: 'hard' })).toBe(true);
    });
  });

  describe('getPhrasesByCategory', () => {
    it('should filter phrases by category', () => {
      const phrases = [
        { ...basePhraseItem, id: '1', category: 'greeting' as const },
        { ...basePhraseItem, id: '2', category: 'response' as const },
        { ...basePhraseItem, id: '3', category: 'greeting' as const },
      ];

      const greetings = getPhrasesByCategory(phrases, 'greeting');
      expect(greetings.length).toBe(2);
      expect(greetings.every((p) => p.category === 'greeting')).toBe(true);
    });
  });

  describe('getPhrasesByDifficulty', () => {
    it('should filter phrases by difficulty', () => {
      const phrases = [
        { ...basePhraseItem, id: '1', difficulty: 'easy' as const },
        { ...basePhraseItem, id: '2', difficulty: 'hard' as const },
        { ...basePhraseItem, id: '3', difficulty: 'easy' as const },
      ];

      const easy = getPhrasesByDifficulty(phrases, 'easy');
      expect(easy.length).toBe(2);
      expect(easy.every((p) => p.difficulty === 'easy')).toBe(true);
    });
  });

  describe('searchPhrases', () => {
    it('should search by phrase text', () => {
      const phrases = [
        { ...basePhraseItem, id: '1', phrase: 'Hello' },
        { ...basePhraseItem, id: '2', phrase: 'Goodbye' },
        { ...basePhraseItem, id: '3', phrase: 'Hello again' },
      ];

      const results = searchPhrases(phrases, 'Hello');
      expect(results.length).toBe(2);
    });

    it('should search by context', () => {
      const phrases = [
        { ...basePhraseItem, id: '1', context: 'Meeting someone' },
        { ...basePhraseItem, id: '2', context: 'Leaving' },
      ];

      const results = searchPhrases(phrases, 'Meeting');
      expect(results.length).toBe(1);
    });

    it('should be case insensitive', () => {
      const phrases = [{ ...basePhraseItem, phrase: 'Hello' }];

      const results = searchPhrases(phrases, 'hello');
      expect(results.length).toBe(1);
    });
  });

  describe('getSpeechFromGesture', () => {
    it('should return speech for valid gesture', () => {
      const speech = getSpeechFromGesture('thumbs_up');
      expect(speech).toBe('I agree');
    });

    it('should return null for invalid gesture', () => {
      const speech = getSpeechFromGesture('invalid_gesture');
      expect(speech).toBeNull();
    });

    it('should have mappings for all default gestures', () => {
      defaultGestureToSpeechMappings.forEach((mapping) => {
        const speech = getSpeechFromGesture(mapping.gesture);
        expect(speech).toBe(mapping.speech);
      });
    });
  });

  describe('getGestureFromSpeech', () => {
    it('should return gesture for valid speech', () => {
      const gesture = getGestureFromSpeech('I agree');
      expect(gesture).toBe('thumbs_up');
    });

    it('should return null for invalid speech', () => {
      const gesture = getGestureFromSpeech('invalid speech');
      expect(gesture).toBeNull();
    });

    it('should be case insensitive', () => {
      const gesture = getGestureFromSpeech('i agree');
      expect(gesture).toBe('thumbs_up');
    });
  });

  describe('defaultGestureToSpeechMappings', () => {
    it('should have valid mappings', () => {
      expect(defaultGestureToSpeechMappings.length).toBeGreaterThan(0);
      expect(defaultGestureToSpeechMappings.every((m) => m.gesture && m.speech)).toBe(true);
    });
  });
});
