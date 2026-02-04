// Social Features for Community
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  joinDate: string;
  achievements: string[];
  followers: number;
  following: number;
  isVerified: boolean;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface PeerSupportGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  topic: string;
  moderator: string;
  isActive: boolean;
  nextMeeting?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function getUserProfile(userId: string): UserProfile {
  return {
    id: userId,
    name: 'Violet Azer',
    avatar: 'https://api.example.com/avatars/violet.jpg',
    bio: 'Mental health advocate, stress management enthusiast',
    joinDate: '2023-06-15',
    achievements: ['First Steps', 'Week Warrior', 'Meditation Master'],
    followers: 234,
    following: 89,
    isVerified: false,
  };
}

export function getCommunityChallenge(): CommunityChallenge[] {
  return [
    {
      id: '1',
      title: '7-Day Meditation Challenge',
      description: 'Practice meditation for 7 consecutive days',
      startDate: '2024-02-05',
      endDate: '2024-02-12',
      participants: 1234,
      reward: '50 points + badge',
      difficulty: 'easy',
      category: 'mindfulness',
    },
    {
      id: '2',
      title: 'Stress-Free February',
      description: 'Keep stress levels below 50 for the entire month',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      participants: 567,
      reward: '200 points + trophy',
      difficulty: 'hard',
      category: 'wellness',
    },
  ];
}

export function getPeerSupportGroups(): PeerSupportGroup[] {
  return [
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'Safe space for discussing anxiety management',
      members: 342,
      topic: 'anxiety',
      moderator: 'Dr. Sarah Johnson',
      isActive: true,
      nextMeeting: '2024-02-10 19:00',
    },
    {
      id: '2',
      name: 'Stress Management Group',
      description: 'Weekly discussions on stress reduction techniques',
      members: 567,
      topic: 'stress',
      moderator: 'James Wilson',
      isActive: true,
      nextMeeting: '2024-02-08 18:00',
    },
  ];
}

export function getAchievements(): Achievement[] {
  return [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first meditation session',
      icon: '🎯',
      unlockedDate: '2023-06-20',
      rarity: 'common',
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Maintain 7-day streak',
      icon: '⚔️',
      unlockedDate: '2023-07-15',
      rarity: 'rare',
    },
    {
      id: '3',
      name: 'Meditation Master',
      description: 'Complete 100 meditation sessions',
      icon: '🧘',
      rarity: 'epic',
    },
  ];
}

export function shareAchievement(achievementId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Achievement ${achievementId} shared to community`);
      resolve(true);
    }, 500);
  });
}

export function joinChallenge(challengeId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Joined challenge ${challengeId}`);
      resolve(true);
    }, 500);
  });
}

export function joinSupportGroup(groupId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Joined support group ${groupId}`);
      resolve(true);
    }, 500);
  });
}

export function followUser(userId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Following user ${userId}`);
      resolve(true);
    }, 500);
  });
}
