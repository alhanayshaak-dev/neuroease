// Advanced AI Chatbot Features
export type Language = 'en' | 'es' | 'fr' | 'de';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface ChatMessage {
  id: string;
  text: string;
  sentiment: Sentiment;
  language: Language;
  timestamp: string;
  isLearned: boolean;
}

export interface ChatbotResponse {
  message: string;
  suggestions: string[];
  sentiment: Sentiment;
  confidence: number;
  contextAware: boolean;
}

export const LANGUAGE_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    greeting: 'Hello! How can I help you today?',
    stress: 'I notice your stress levels are rising. Would you like some calming suggestions?',
    medication: 'Time for your medication reminder.',
  },
  es: {
    greeting: '¡Hola! ¿Cómo puedo ayudarte hoy?',
    stress: 'Noto que tus niveles de estrés están aumentando. ¿Quieres algunas sugerencias calmantes?',
    medication: 'Recordatorio de medicamento.',
  },
  fr: {
    greeting: 'Bonjour! Comment puis-je vous aider?',
    stress: 'Je remarque que vos niveaux de stress augmentent. Voulez-vous des suggestions apaisantes?',
    medication: 'Rappel de médicament.',
  },
  de: {
    greeting: 'Hallo! Wie kann ich dir heute helfen?',
    stress: 'Ich bemerke, dass dein Stressniveau steigt. Möchtest du beruhigende Vorschläge?',
    medication: 'Medikamentenerinnerung.',
  },
};

export function analyzeSentiment(text: string): Sentiment {
  const positiveWords = ['good', 'great', 'excellent', 'happy', 'better', 'improving'];
  const negativeWords = ['bad', 'terrible', 'sad', 'worse', 'declining', 'stressed'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

export function generateContextAwareResponse(
  _userMessage: string,
  sentiment: Sentiment,
  language: Language = 'en'
): ChatbotResponse {
  const suggestions: string[] = [];
  let message = LANGUAGE_TRANSLATIONS[language].greeting;
  let contextAware = false;

  if (sentiment === 'negative') {
    message = LANGUAGE_TRANSLATIONS[language].stress;
    suggestions.push('Try deep breathing', 'Take a break', 'Listen to calming music');
    contextAware = true;
  } else if (sentiment === 'positive') {
    message = 'That\'s great to hear! Keep up the good work.';
    suggestions.push('Continue current activities', 'Share your progress', 'Set new goals');
    contextAware = true;
  }

  return {
    message,
    suggestions,
    sentiment,
    confidence: 0.85,
    contextAware,
  };
}

export function learnFromInteraction(message: ChatMessage): void {
  const learned = localStorage.getItem('chatbot-learned-patterns') || '[]';
  const patterns = JSON.parse(learned);
  patterns.push({
    text: message.text,
    sentiment: message.sentiment,
    timestamp: message.timestamp,
  });
  localStorage.setItem('chatbot-learned-patterns', JSON.stringify(patterns.slice(-100)));
}

export function getProactiveSuggestions(stressLevel: number, _language: Language = 'en'): string[] {
  if (stressLevel > 75) {
    return [
      'Emergency breathing exercise',
      'Contact support',
      'Activate calm mode',
    ];
  }
  if (stressLevel > 50) {
    return [
      'Take a 5-minute break',
      'Practice mindfulness',
      'Go for a walk',
    ];
  }
  return [
    'Continue current activity',
    'Stay hydrated',
    'Take regular breaks',
  ];
}

export function detectLanguage(text: string): Language {
  // Simple language detection based on common words
  const spanish = ['hola', 'cómo', 'qué', 'dónde'];
  const french = ['bonjour', 'comment', 'quoi', 'où'];
  const german = ['hallo', 'wie', 'was', 'wo'];

  const lowerText = text.toLowerCase();
  const spanishCount = spanish.filter(word => lowerText.includes(word)).length;
  const frenchCount = french.filter(word => lowerText.includes(word)).length;
  const germanCount = german.filter(word => lowerText.includes(word)).length;

  if (spanishCount > 0) return 'es';
  if (frenchCount > 0) return 'fr';
  if (germanCount > 0) return 'de';
  return 'en';
}
