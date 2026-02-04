// Community data generation utilities

export interface TrendingStrategy {
  title: string;
  author: string;
  rating: number;
  views: number;
}

export interface SuccessStory {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  date: string;
  likes: number;
}

export interface SupportGroup {
  id: string;
  name: string;
  topic: string;
  meetingTime: string;
  facilitator: string;
  members: number;
}

export interface PeerMatch {
  id: string;
  name: string;
  similarity: number;
  status: string;
  commonInterests: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  category: string;
  type: string;
  duration: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  bio?: string;
  followers: number;
  strategiesShared: number;
  joinDate: string;
}

export function generateTrendingStrategies(): TrendingStrategy[] {
  return [
    {
      title: 'Box Breathing for Anxiety',
      author: 'Sarah M.',
      rating: 4.8,
      views: 2341,
    },
    {
      title: 'Weighted Blanket Routine',
      author: 'James T.',
      rating: 4.6,
      views: 1892,
    },
    {
      title: 'Noise-Canceling Protocol',
      author: 'Dr. Emily R.',
      rating: 4.9,
      views: 3124,
    },
    {
      title: 'Fidget Tool Guide',
      author: 'Marcus L.',
      rating: 4.7,
      views: 1654,
    },
    {
      title: 'Sensory Diet Planning',
      author: 'Lisa K.',
      rating: 4.5,
      views: 1423,
    },
  ];
}

export function generateSuccessStories(): SuccessStory[] {
  return [
    {
      id: 'story-1',
      title: 'How I Managed My Anxiety at School',
      author: 'Alex P.',
      excerpt:
        'After implementing the breathing techniques from this community, I was able to manage my anxiety during exams...',
      date: '2 weeks ago',
      likes: 234,
    },
    {
      id: 'story-2',
      title: 'Finding My Calm Space',
      author: 'Jordan M.',
      excerpt:
        'Creating a sensory-friendly space at home changed everything for me. Here\'s how I did it...',
      date: '1 month ago',
      likes: 189,
    },
    {
      id: 'story-3',
      title: 'My Journey with Coping Strategies',
      author: 'Casey R.',
      excerpt:
        'I tried many strategies before finding what works for me. This is my story of discovery...',
      date: '6 weeks ago',
      likes: 312,
    },
  ];
}

export function generateSupportGroups(): SupportGroup[] {
  return [
    {
      id: 'group-1',
      name: 'Autism Spectrum Support',
      topic: 'General support and discussion',
      meetingTime: 'Thursdays 7:00 PM',
      facilitator: 'Dr. Sarah Chen',
      members: 45,
    },
    {
      id: 'group-2',
      name: 'Sensory Processing Group',
      topic: 'Managing sensory sensitivities',
      meetingTime: 'Tuesdays 6:00 PM',
      facilitator: 'James Wilson',
      members: 32,
    },
    {
      id: 'group-3',
      name: 'Parents & Guardians Circle',
      topic: 'Support for caregivers',
      meetingTime: 'Wednesdays 8:00 PM',
      facilitator: 'Maria Garcia',
      members: 58,
    },
    {
      id: 'group-4',
      name: 'School Accommodations',
      topic: 'Navigating school support',
      meetingTime: 'Saturdays 2:00 PM',
      facilitator: 'Robert Lee',
      members: 28,
    },
  ];
}

export function generatePeerSupportMatches(): PeerMatch[] {
  return [
    {
      id: 'match-1',
      name: 'Taylor K.',
      similarity: 0.92,
      status: 'Available',
      commonInterests: ['Breathing techniques', 'Music therapy', 'Sensory management'],
    },
    {
      id: 'match-2',
      name: 'Morgan J.',
      similarity: 0.88,
      status: 'Available',
      commonInterests: ['School accommodations', 'Anxiety management', 'Social strategies'],
    },
    {
      id: 'match-3',
      name: 'Riley P.',
      similarity: 0.85,
      status: 'Available',
      commonInterests: ['Coping strategies', 'Medication tracking', 'Therapy support'],
    },
  ];
}

export function generateLearningResources(): LearningResource[] {
  return [
    {
      id: 'res-1',
      title: 'Understanding Autism Spectrum Disorder',
      category: 'Education',
      type: 'Article',
      duration: '10 min read',
    },
    {
      id: 'res-2',
      title: 'Sensory Processing Guide',
      category: 'Sensory',
      type: 'Guide',
      duration: '15 min read',
    },
    {
      id: 'res-3',
      title: 'Coping Strategies for Anxiety',
      category: 'Mental Health',
      type: 'Video',
      duration: '8 min video',
    },
    {
      id: 'res-4',
      title: 'Therapist Resources',
      category: 'Professional',
      type: 'Resource',
      duration: 'Reference',
    },
    {
      id: 'res-5',
      title: 'Parent Support Guide',
      category: 'Family',
      type: 'Guide',
      duration: '20 min read',
    },
    {
      id: 'res-6',
      title: 'School Accommodations',
      category: 'Education',
      type: 'Guide',
      duration: '12 min read',
    },
  ];
}

export function generateUserProfiles(): UserProfile[] {
  return [
    {
      id: 'user-1',
      name: 'Sarah M.',
      role: 'community_member',
      bio: 'Passionate about sharing breathing techniques and mindfulness strategies.',
      followers: 234,
      strategiesShared: 12,
      joinDate: '6 months ago',
    },
    {
      id: 'user-2',
      name: 'Dr. Emily R.',
      role: 'therapist',
      bio: 'Licensed therapist specializing in autism spectrum support.',
      followers: 567,
      strategiesShared: 28,
      joinDate: '1 year ago',
    },
    {
      id: 'user-3',
      name: 'James T.',
      role: 'community_member',
      bio: 'Sharing my journey with sensory processing and coping strategies.',
      followers: 189,
      strategiesShared: 8,
      joinDate: '3 months ago',
    },
  ];
}
