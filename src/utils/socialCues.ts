/**
 * Social cues and conversation simplification utilities
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6
 */

export interface ToneAnalysis {
  tone: 'positive' | 'neutral' | 'negative' | 'sarcastic' | 'uncertain';
  confidence: number;
  explanation: string;
}

export interface SimplifiedConversation {
  original: string;
  simplified: string;
  tone: ToneAnalysis;
  suggestedResponses: string[];
}

export interface PhraseLibraryItem {
  id: string;
  phrase: string;
  category: 'greeting' | 'response' | 'question' | 'statement' | 'closing' | 'other';
  context: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

/**
 * Detect tone from text
 */
export function detectTone(text: string): ToneAnalysis {
  const lowerText = text.toLowerCase();

  // Positive indicators
  const positiveWords = ['great', 'good', 'excellent', 'wonderful', 'amazing', 'love', 'happy', 'thanks', 'thank you'];
  const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length;

  // Negative indicators
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'sad', 'sorry', 'wrong', 'problem'];
  const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length;

  // Sarcasm indicators
  const sarcasmIndicators = ['yeah right', 'sure', 'obviously', 'clearly'];
  const sarcasmCount = sarcasmIndicators.filter((indicator) => lowerText.includes(indicator)).length;

  // Question marks indicate uncertainty
  const questionMarks = (text.match(/\?/g) || []).length;

  // Determine tone
  let tone: ToneAnalysis['tone'] = 'neutral';
  let confidence = 0.5;

  if (sarcasmCount > 0) {
    tone = 'sarcastic';
    confidence = 0.7 + sarcasmCount * 0.1;
  } else if (positiveCount > negativeCount && positiveCount > 0) {
    tone = 'positive';
    confidence = 0.6 + positiveCount * 0.1;
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    tone = 'negative';
    confidence = 0.6 + negativeCount * 0.1;
  } else if (questionMarks > 0) {
    tone = 'uncertain';
    confidence = 0.5 + questionMarks * 0.1;
  }

  // Cap confidence at 1.0
  confidence = Math.min(confidence, 1.0);

  return {
    tone,
    confidence,
    explanation: getToneExplanation(tone),
  };
}

/**
 * Get explanation for tone
 */
function getToneExplanation(tone: ToneAnalysis['tone']): string {
  const explanations: Record<ToneAnalysis['tone'], string> = {
    positive: 'This message has a positive tone. The person seems happy or satisfied.',
    neutral: 'This message has a neutral tone. The person is being factual or objective.',
    negative: 'This message has a negative tone. The person seems upset or dissatisfied.',
    sarcastic: 'This message might be sarcastic. The person might mean the opposite of what they said.',
    uncertain: 'This message seems uncertain. The person might be asking for clarification or expressing doubt.',
  };

  return explanations[tone];
}

/**
 * Simplify text for easier understanding
 */
export function simplifyText(text: string): string {
  let simplified = text;

  // Replace complex words with simpler ones
  const replacements: Record<string, string> = {
    'unfortunately': 'sadly',
    'consequently': 'so',
    'furthermore': 'also',
    'nevertheless': 'but',
    'therefore': 'so',
    'however': 'but',
    'although': 'even though',
    'regarding': 'about',
    'utilize': 'use',
    'facilitate': 'help',
    'implement': 'do',
    'demonstrate': 'show',
    'approximately': 'about',
    'subsequently': 'then',
    'initially': 'at first',
  };

  Object.entries(replacements).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simplified = simplified.replace(regex, simple);
  });

  // Break long sentences into shorter ones
  simplified = simplified.replace(/\. /g, '.\n');

  // Remove unnecessary punctuation
  simplified = simplified.replace(/[;:]/g, ',');

  return simplified.trim();
}

/**
 * Generate suggested responses based on tone
 */
export function generateSuggestedResponses(tone: ToneAnalysis['tone']): string[] {
  const responses: Record<ToneAnalysis['tone'], string[]> = {
    positive: [
      'Thank you! I appreciate that.',
      'That makes me happy too.',
      'I agree with you.',
      'That sounds great!',
    ],
    neutral: [
      'I understand.',
      'Thank you for letting me know.',
      'Got it.',
      'I see what you mean.',
    ],
    negative: [
      'I\'m sorry you feel that way.',
      'How can I help?',
      'I understand your concern.',
      'Let\'s talk about this.',
    ],
    sarcastic: [
      'I think you might be joking.',
      'Did you mean something else?',
      'I\'m not sure I understand.',
      'Can you explain that?',
    ],
    uncertain: [
      'I\'m not sure either.',
      'Can you tell me more?',
      'What do you mean?',
      'I need more information.',
    ],
  };

  return responses[tone] || responses.neutral;
}

/**
 * Validate phrase library item
 */
export function validatePhraseLibraryItem(item: Partial<PhraseLibraryItem>): boolean {
  if (!item.phrase || typeof item.phrase !== 'string' || item.phrase.trim() === '') {
    return false;
  }

  if (!item.category || typeof item.category !== 'string') {
    return false;
  }

  const validCategories = ['greeting', 'response', 'question', 'statement', 'closing', 'other'];
  if (!validCategories.includes(item.category)) {
    return false;
  }

  if (item.difficulty && !['easy', 'medium', 'hard'].includes(item.difficulty)) {
    return false;
  }

  return true;
}

/**
 * Get phrases by category
 */
export function getPhrasesByCategory(
  phrases: PhraseLibraryItem[],
  category: PhraseLibraryItem['category']
): PhraseLibraryItem[] {
  return phrases.filter((p) => p.category === category);
}

/**
 * Get phrases by difficulty
 */
export function getPhrasesByDifficulty(
  phrases: PhraseLibraryItem[],
  difficulty: PhraseLibraryItem['difficulty']
): PhraseLibraryItem[] {
  return phrases.filter((p) => p.difficulty === difficulty);
}

/**
 * Search phrases
 */
export function searchPhrases(phrases: PhraseLibraryItem[], query: string): PhraseLibraryItem[] {
  const lowerQuery = query.toLowerCase();
  return phrases.filter(
    (p) =>
      p.phrase.toLowerCase().includes(lowerQuery) ||
      p.context.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get gesture-to-speech mapping
 */
export interface GestureToSpeechMapping {
  gesture: string;
  speech: string;
  description: string;
}

export const defaultGestureToSpeechMappings: GestureToSpeechMapping[] = [
  {
    gesture: 'thumbs_up',
    speech: 'I agree',
    description: 'Express agreement or approval',
  },
  {
    gesture: 'thumbs_down',
    speech: 'I disagree',
    description: 'Express disagreement',
  },
  {
    gesture: 'wave',
    speech: 'Hello',
    description: 'Greet someone',
  },
  {
    gesture: 'nod',
    speech: 'Yes',
    description: 'Confirm or agree',
  },
  {
    gesture: 'shake_head',
    speech: 'No',
    description: 'Deny or disagree',
  },
  {
    gesture: 'shrug',
    speech: 'I don\'t know',
    description: 'Express uncertainty',
  },
  {
    gesture: 'point',
    speech: 'Look at that',
    description: 'Direct attention to something',
  },
  {
    gesture: 'clap',
    speech: 'Great job',
    description: 'Express approval or congratulations',
  },
];

/**
 * Get speech from gesture
 */
export function getSpeechFromGesture(gesture: string): string | null {
  const mapping = defaultGestureToSpeechMappings.find((m) => m.gesture === gesture);
  return mapping?.speech || null;
}

/**
 * Get gesture from speech
 */
export function getGestureFromSpeech(speech: string): string | null {
  const mapping = defaultGestureToSpeechMappings.find((m) =>
    m.speech.toLowerCase() === speech.toLowerCase()
  );
  return mapping?.gesture || null;
}
