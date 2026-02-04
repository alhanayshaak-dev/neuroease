// Feedback & Surveys
export interface Feedback {
  id: string;
  type: 'bug' | 'feature' | 'general';
  title: string;
  description: string;
  rating: number;
  timestamp: string;
  userId: string;
}

export interface Survey {
  id: string;
  title: string;
  questions: SurveyQuestion[];
  responses: number;
  status: 'active' | 'closed';
  createdAt: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'multiple-choice' | 'text';
  options?: string[];
  required: boolean;
}

export interface NPSData {
  promoters: number;
  passives: number;
  detractors: number;
  score: number;
}

export function submitFeedback(type: 'bug' | 'feature' | 'general', title: string, description: string, rating: number): Promise<Feedback> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const feedback: Feedback = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title,
        description,
        rating,
        timestamp: new Date().toISOString(),
        userId: 'user-123',
      };
      resolve(feedback);
    }, 500);
  });
}

export function getSurveys(): Survey[] {
  return [
    {
      id: '1',
      title: 'App Experience Survey',
      questions: [
        {
          id: '1',
          text: 'How satisfied are you with the app?',
          type: 'rating',
          required: true,
        },
        {
          id: '2',
          text: 'What features would you like to see?',
          type: 'text',
          required: false,
        },
      ],
      responses: 234,
      status: 'active',
      createdAt: '2024-02-01',
    },
  ];
}

export function submitSurveyResponse(surveyId: string, answers: Record<string, any>): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Survey ${surveyId} response submitted`);
      resolve(true);
    }, 500);
  });
}

export function calculateNPS(ratings: number[]): NPSData {
  const promoters = ratings.filter(r => r >= 9).length;
  const passives = ratings.filter(r => r >= 7 && r < 9).length;
  const detractors = ratings.filter(r => r < 7).length;
  const total = ratings.length;

  const score = ((promoters - detractors) / total) * 100;

  return {
    promoters,
    passives,
    detractors,
    score: Math.round(score),
  };
}

export function voteOnFeature(featureId: string, vote: 'up' | 'down'): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Voted ${vote} on feature ${featureId}`);
      resolve(true);
    }, 500);
  });
}

export function reportBug(title: string, description: string, screenshot?: string): Promise<Feedback> {
  return submitFeedback('bug', title, description, 1);
}

export function requestFeature(title: string, description: string): Promise<Feedback> {
  return submitFeedback('feature', title, description, 5);
}

export function getFeedbackHistory(): Feedback[] {
  return [
    {
      id: '1',
      type: 'bug',
      title: 'Login issue',
      description: 'Cannot login with email',
      rating: 1,
      timestamp: '2024-02-01',
      userId: 'user-123',
    },
  ];
}
