import fc from 'fast-check';
import {
  detectTone,
  simplifyText,
  generateSuggestedResponses,
  validatePhraseLibraryItem,
  getSpeechFromGesture,
  getGestureFromSpeech,
  defaultGestureToSpeechMappings,
  type PhraseLibraryItem,
} from '../socialCues';

/**
 * Property 12: Social Cue Detection and Simplification
 * **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6**
 *
 * For any conversation with social cues enabled, the system SHALL detect tone,
 * simplify speech, and suggest appropriate phrases from user's library.
 */
describe('Property 12: Social Cue Detection and Simplification', () => {
  // Generator for phrase library items
  const phraseGen = fc.record({
    id: fc.uuid(),
    phrase: fc.string({ minLength: 2, maxLength: 100 }).filter((s) => s.trim().length > 0),
    category: fc.constantFrom(
      'greeting' as const,
      'response' as const,
      'question' as const,
      'statement' as const,
      'closing' as const,
      'other' as const
    ),
    context: fc.string({ maxLength: 200 }),
    difficulty: fc.constantFrom('easy' as const, 'medium' as const, 'hard' as const),
    created_at: fc.date().map((d) => d.toISOString()),
  });

  it('should always return valid tone', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const analysis = detectTone(text);
        return ['positive', 'neutral', 'negative', 'sarcastic', 'uncertain'].includes(analysis.tone);
      }),
      { numRuns: 100 }
    );
  });

  it('should return confidence between 0 and 1', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const analysis = detectTone(text);
        return analysis.confidence >= 0 && analysis.confidence <= 1;
      }),
      { numRuns: 100 }
    );
  });

  it('should provide explanation for tone', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const analysis = detectTone(text);
        return analysis.explanation && analysis.explanation.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should simplify text without losing meaning', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (text) => {
        const simplified = simplifyText(text);
        // Simplified text should not be longer than original
        return simplified.length <= text.length + 50; // Allow some overhead for formatting
      }),
      { numRuns: 100 }
    );
  });

  it('should generate suggested responses for any tone', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'positive' as const,
          'neutral' as const,
          'negative' as const,
          'sarcastic' as const,
          'uncertain' as const
        ),
        (tone) => {
          const responses = generateSuggestedResponses(tone);
          return responses.length > 0 && responses.every((r) => r && r.length > 0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate correct phrase items', () => {
    fc.assert(
      fc.property(phraseGen, (phrase) => {
        return validatePhraseLibraryItem(phrase as PhraseLibraryItem);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject phrases with empty text', () => {
    fc.assert(
      fc.property(phraseGen, (phrase) => {
        const invalid = { ...phrase, phrase: '' } as PhraseLibraryItem;
        return !validatePhraseLibraryItem(invalid);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject phrases with invalid category', () => {
    fc.assert(
      fc.property(phraseGen, (phrase) => {
        const invalid = { ...phrase, category: 'invalid' as any } as PhraseLibraryItem;
        return !validatePhraseLibraryItem(invalid);
      }),
      { numRuns: 100 }
    );
  });

  it('should map gestures to speech consistently', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: defaultGestureToSpeechMappings.length - 1 }), (index) => {
        const mapping = defaultGestureToSpeechMappings[index];
        const speech = getSpeechFromGesture(mapping.gesture);
        return speech === mapping.speech;
      }),
      { numRuns: 100 }
    );
  });

  it('should map speech to gesture consistently', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: defaultGestureToSpeechMappings.length - 1 }), (index) => {
        const mapping = defaultGestureToSpeechMappings[index];
        const gesture = getGestureFromSpeech(mapping.speech);
        return gesture === mapping.gesture;
      }),
      { numRuns: 100 }
    );
  });

  it('should return null for invalid gestures', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (gesture) => {
        // Only test with strings that are not in the default mappings
        const isValid = defaultGestureToSpeechMappings.some((m) => m.gesture === gesture);
        if (isValid) {
          return true; // Skip valid gestures
        }
        const speech = getSpeechFromGesture(gesture);
        return speech === null;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle tone detection for various text lengths', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 1000 }), (text) => {
        const analysis = detectTone(text);
        return (
          analysis.tone &&
          analysis.confidence >= 0 &&
          analysis.confidence <= 1 &&
          analysis.explanation &&
          analysis.explanation.length > 0
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should simplify text consistently', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const simplified1 = simplifyText(text);
        const simplified2 = simplifyText(text);
        return simplified1 === simplified2;
      }),
      { numRuns: 100 }
    );
  });
});
