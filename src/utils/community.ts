// Community features utilities

export interface UserProfile {
  id: string;
  name: string;
  role: 'guardian' | 'therapist' | 'community_member';
  bio?: string;
  avatar?: string;
  joinDate: Date;
  strategiesShared: number;
  followers: number;
  following: number;
  verified: boolean;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  reward?: string;
  category: string;
}

export interface SuccessStory {
  id: string;
  title: string;
  author: string;
  content: string;
  date: Date;
  likes: number;
  shares: number;
  featured: boolean;
}

export interface Accommodation {
  id: string;
  type: 'school' | 'work' | 'general';
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'moderate' | 'complex';
  template?: string;
}

export interface SensoryFriendlySpace {
  id: string;
  name: string;
  type: 'school' | 'work' | 'public' | 'healthcare';
  location: string;
  features: string[];
  rating: number;
  reviews: number;
  hours?: string;
  contact?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location?: string;
  type: 'webinar' | 'support_group' | 'workshop' | 'meetup';
  attendees: number;
  maxAttendees?: number;
}

export const mockAccommodations: Accommodation[] = [
  {
    id: 'acc-1',
    type: 'school',
    title: 'Quiet Testing Environment',
    description: 'Request for separate, quiet room for exams',
    category: 'Academic',
    difficulty: 'easy',
    template: 'I request a quiet, separate testing environment for exams due to sensory sensitivities.',
  },
  {
    id: 'acc-2',
    type: 'school',
    title: 'Extended Test Time',
    description: 'Request for additional time on tests',
    category: 'Academic',
    difficulty: 'easy',
    template: 'I request 50% extended time on all timed assessments.',
  },
  {
    id: 'acc-3',
    type: 'work',
    title: 'Flexible Schedule',
    description: 'Request for flexible work hours',
    category: 'Work Environment',
    difficulty: 'moderate',
    template: 'I request flexible work hours to accommodate my sensory needs and mental health.',
  },
  {
    id: 'acc-4',
    type: 'work',
    title: 'Remote Work Option',
    description: 'Request for remote work capability',
    category: 'Work Environment',
    difficulty: 'moderate',
    template: 'I request the option to work remotely to reduce sensory overload.',
  },
];

export const mockSensorySpaces: SensoryFriendlySpace[] = [
  {
    id: 'space-1',
    name: 'Quiet Study Room',
    type: 'school',
    location: 'Central Library, 3rd Floor',
    features: ['Soundproof', 'Dim lighting', 'Comfortable seating', 'No distractions'],
    rating: 4.8,
    reviews: 24,
    hours: '8 AM - 10 PM',
  },
  {
    id: 'space-2',
    name: 'Sensory-Friendly Clinic',
    type: 'healthcare',
    location: 'Downtown Medical Center',
    features: ['Low lighting', 'Quiet waiting area', 'Flexible scheduling', 'Calm environment'],
    rating: 4.9,
    reviews: 18,
    contact: '555-0123',
  },
];

export function createUserProfile(
  name: string,
  role: UserProfile['role'],
  bio?: string
): UserProfile {
  return {
    id: `user-${Date.now()}`,
    name,
    role,
    bio,
    joinDate: new Date(),
    strategiesShared: 0,
    followers: 0,
    following: 0,
    verified: role === 'therapist',
  };
}

export function createChallenge(
  title: string,
  description: string,
  category: string,
  durationDays: number
): CommunityChallenge {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

  return {
    id: `challenge-${Date.now()}`,
    title,
    description,
    startDate,
    endDate,
    participants: 0,
    category,
  };
}

export function createSuccessStory(
  title: string,
  author: string,
  content: string
): SuccessStory {
  return {
    id: `story-${Date.now()}`,
    title,
    author,
    content,
    date: new Date(),
    likes: 0,
    shares: 0,
    featured: false,
  };
}

export function generateAccommodationLetter(
  accommodation: Accommodation,
  studentName: string,
  _schoolName: string
): string {
  const date = new Date().toLocaleDateString();

  return `
TO WHOM IT MAY CONCERN:

Date: ${date}

This letter is to confirm that ${studentName} has been identified as requiring academic accommodations due to documented sensory processing differences.

REQUESTED ACCOMMODATION:
${accommodation.title}

DESCRIPTION:
${accommodation.description}

IMPLEMENTATION:
${accommodation.template}

This accommodation is necessary to ensure equal access to educational opportunities and to support the student's academic success.

If you have any questions regarding this accommodation request, please do not hesitate to contact us.

Sincerely,
NeuroFlow Support Team
  `;
}

export function getTrendingStrategies(strategies: any[], limit: number = 5): any[] {
  return strategies
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, limit);
}

export function getFeaturedStories(stories: SuccessStory[], limit: number = 3): SuccessStory[] {
  return stories
    .filter((s) => s.featured)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}

export function getUpcomingEvents(events: CommunityEvent[]): CommunityEvent[] {
  const now = new Date();
  return events
    .filter((e) => e.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function calculateChallengeProgress(
  startDate: Date,
  endDate: Date
): number {
  const now = new Date();
  const total = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  return Math.min(Math.round((elapsed / total) * 100), 100);
}

export function findNearestSensorySpace(
  spaces: SensoryFriendlySpace[],
  type: SensoryFriendlySpace['type']
): SensoryFriendlySpace | undefined {
  return spaces.find((s) => s.type === type);
}
