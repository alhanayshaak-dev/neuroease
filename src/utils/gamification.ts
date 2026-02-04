// Gamification utilities for streaks, badges, and achievements

export interface Streak {
  type: 'calm_days' | 'medication_adherence' | 'strategy_usage';
  current: number;
  best: number;
  lastDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate?: Date;
  progress: number; // 0-100
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  unlockedDate?: Date;
}

export const badges: Badge[] = [
  {
    id: 'calm-week',
    name: 'Calm Week',
    description: '7 consecutive calm days',
    icon: '🧘',
    progress: 0,
  },
  {
    id: 'medication-master',
    name: 'Medication Master',
    description: '30 days of 100% medication adherence',
    icon: '💊',
    progress: 0,
  },
  {
    id: 'strategy-expert',
    name: 'Strategy Expert',
    description: 'Use 10 different coping strategies',
    icon: '🎯',
    progress: 0,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Log triggers before 9 AM for 5 days',
    icon: '🌅',
    progress: 0,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Log strategies after 8 PM for 5 days',
    icon: '🌙',
    progress: 0,
  },
  {
    id: 'community-helper',
    name: 'Community Helper',
    description: 'Share 5 strategies with community',
    icon: '🤝',
    progress: 0,
  },
  {
    id: 'data-tracker',
    name: 'Data Tracker',
    description: 'Log 100 triggers and strategies',
    icon: '📊',
    progress: 0,
  },
  {
    id: 'wellness-warrior',
    name: 'Wellness Warrior',
    description: 'Maintain 30-day streak',
    icon: '⚔️',
    progress: 0,
  },
];

export const achievements: Achievement[] = [
  {
    id: 'first-log',
    title: 'First Step',
    description: 'Log your first trigger',
    points: 10,
    unlocked: false,
  },
  {
    id: 'first-strategy',
    title: 'First Strategy',
    description: 'Log your first coping strategy',
    points: 10,
    unlocked: false,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    points: 50,
    unlocked: false,
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Maintain a 30-day streak',
    points: 100,
    unlocked: false,
  },
  {
    id: 'community-contributor',
    title: 'Community Contributor',
    description: 'Share a strategy with the community',
    points: 25,
    unlocked: false,
  },
  {
    id: 'insight-seeker',
    title: 'Insight Seeker',
    description: 'View your trigger patterns',
    points: 15,
    unlocked: false,
  },
];

export function updateStreak(
  streak: Streak,
  isSuccessful: boolean
): Streak {
  const today = new Date();
  const lastDate = new Date(streak.lastDate);
  const daysDiff = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isSuccessful) {
    if (daysDiff === 1) {
      // Consecutive day
      streak.current++;
      if (streak.current > streak.best) {
        streak.best = streak.current;
      }
    } else if (daysDiff === 0) {
      // Same day, no change
    } else {
      // Streak broken, restart
      streak.current = 1;
    }
  } else {
    if (daysDiff <= 1) {
      // Streak broken
      streak.current = 0;
    }
  }

  streak.lastDate = today;
  return streak;
}

export function calculateBadgeProgress(
  badgeId: string,
  currentValue: number,
  targetValue: number
): number {
  return Math.min(Math.round((currentValue / targetValue) * 100), 100);
}

export function checkBadgeUnlock(badge: Badge): boolean {
  return badge.progress >= 100 && !badge.unlockedDate;
}

export function getTotalPoints(achievements: Achievement[]): number {
  return achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
}

export function getStreakMessage(streak: Streak): string {
  if (streak.current === 0) return 'Start a new streak!';
  if (streak.current === 1) return '🔥 1 day streak!';
  if (streak.current === 7) return '🔥🔥 1 week streak!';
  if (streak.current === 30) return '🔥🔥🔥 1 month streak!';
  return `🔥 ${streak.current} day streak!`;
}

export function getNextMilestone(current: number): number {
  const milestones = [1, 7, 14, 30, 60, 90, 365];
  return milestones.find((m) => m > current) || 365;
}

export function getMilestoneProgress(current: number, next: number): number {
  const prev = [1, 7, 14, 30, 60, 90].find((m) => m < next) || 0;
  return Math.round(((current - prev) / (next - prev)) * 100);
}
