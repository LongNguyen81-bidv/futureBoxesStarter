/**
 * Mock Data for Testing Home Screen UI
 *
 * Provides sample capsule data with various states:
 * - Different types (emotion, goal, memory, decision)
 * - Different statuses (locked, ready)
 * - Different unlock times (for countdown testing)
 */

import type { Capsule } from '../types/capsule';

// Helper to create date in future
const createFutureDate = (days: number, hours: number = 0, minutes: number = 0): number => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  return date.getTime();
};

// Helper to create past date
const createPastDate = (daysAgo: number): number => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.getTime();
};

// Mock capsules with different states
export const MOCK_CAPSULES: Capsule[] = [
  // Capsule 1: Ready to open (Emotion type)
  {
    id: 'mock-1',
    type: 'emotion',
    status: 'ready',
    content: 'Feeling excited about starting this new project! Hope future me has achieved the goals.',
    reflectionQuestion: 'Did I complete the project successfully?',
    reflectionAnswer: null,
    createdAt: createPastDate(7),
    unlockAt: Date.now() - 1000, // Already passed
    openedAt: null,
    updatedAt: Date.now(),
  },

  // Capsule 2: Locked, 3 days remaining (Goal type)
  {
    id: 'mock-2',
    type: 'goal',
    status: 'locked',
    content: 'I want to lose 5kg in the next 3 months. Let\'s see if I can do it!',
    reflectionQuestion: 'Did you achieve your weight loss goal?',
    reflectionAnswer: null,
    createdAt: createPastDate(2),
    unlockAt: createFutureDate(3, 5, 30),
    openedAt: null,
    updatedAt: Date.now(),
  },

  // Capsule 3: Locked, 1 week remaining (Memory type)
  {
    id: 'mock-3',
    type: 'memory',
    status: 'locked',
    content: 'First day at my new job! Everyone is so friendly. Can\'t wait to see how things turn out.',
    reflectionQuestion: null, // Memory type doesn't have reflection
    reflectionAnswer: null,
    createdAt: createPastDate(5),
    unlockAt: createFutureDate(7, 2, 0),
    openedAt: null,
    updatedAt: Date.now(),
  },

  // Capsule 4: Locked, less than 1 day (Decision type)
  {
    id: 'mock-4',
    type: 'decision',
    status: 'locked',
    content: 'Decided to invest in crypto. This could either be brilliant or terrible!',
    reflectionQuestion: 'Was this investment decision wise?',
    reflectionAnswer: null,
    createdAt: createPastDate(1),
    unlockAt: createFutureDate(0, 12, 30),
    openedAt: null,
    updatedAt: Date.now(),
  },

  // Capsule 5: Locked, 2 months remaining (Emotion type)
  {
    id: 'mock-5',
    type: 'emotion',
    status: 'locked',
    content: 'Feeling nervous about the presentation tomorrow. Hope I nail it!',
    reflectionQuestion: 'Did the presentation go well?',
    reflectionAnswer: null,
    createdAt: createPastDate(3),
    unlockAt: createFutureDate(60, 0, 0),
    openedAt: null,
    updatedAt: Date.now(),
  },

  // Capsule 6: Locked, 1 year remaining (Goal type)
  {
    id: 'mock-6',
    type: 'goal',
    status: 'locked',
    content: 'New Year resolution: Learn to play guitar. Let\'s see if I stick with it!',
    reflectionQuestion: 'Can you play guitar now?',
    reflectionAnswer: null,
    createdAt: createPastDate(10),
    unlockAt: createFutureDate(365, 0, 0),
    openedAt: null,
    updatedAt: Date.now(),
  },

  // Extra capsule (for testing "only 6 shown" behavior)
  {
    id: 'mock-7',
    type: 'decision',
    status: 'locked',
    content: 'Should not appear on Home screen (7th capsule)',
    reflectionQuestion: 'This should not be visible',
    reflectionAnswer: null,
    createdAt: createPastDate(1),
    unlockAt: createFutureDate(400, 0, 0),
    openedAt: null,
    updatedAt: Date.now(),
  },
];

// Get only 6 upcoming capsules (sorted by unlock time)
export const getUpcomingMockCapsules = (): Capsule[] => {
  return MOCK_CAPSULES
    .filter((c) => c.status === 'locked' || c.status === 'ready')
    .sort((a, b) => a.unlockAt - b.unlockAt)
    .slice(0, 6);
};

// Helper to format countdown
export const formatCountdown = (unlockAt: number): string => {
  const now = Date.now();
  const diff = unlockAt - now;

  // Already ready
  if (diff <= 0) {
    return 'Ready!';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Format based on time remaining
  if (years >= 1) {
    const remainingMonths = Math.floor((days % 365) / 30);
    return `${years}y ${remainingMonths}mo`;
  }

  if (months >= 1) {
    const remainingDays = days % 30;
    return `${months}mo ${remainingDays}d`;
  }

  if (weeks >= 1) {
    const remainingDays = days % 7;
    return `${weeks}w ${remainingDays}d`;
  }

  if (days >= 1) {
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    return `${days}d ${remainingHours}h ${remainingMinutes}m`;
  }

  // Less than 1 day: show HH:MM:SS
  const h = hours.toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};
