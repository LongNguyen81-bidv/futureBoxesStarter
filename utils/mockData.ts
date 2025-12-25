/**
 * Mock Data for UI Testing
 * FutureBoxes Time Capsule App
 */

import { differenceInYears, differenceInMonths, differenceInDays, subYears, subMonths } from 'date-fns';
import type { OpenCapsuleData, CapsuleType } from '../types/capsule';

/**
 * Calculate human-readable time duration
 */
export const calculateTimeLocked = (createdAt: Date, unlockAt: Date): string => {
  const years = differenceInYears(unlockAt, createdAt);
  const months = differenceInMonths(unlockAt, createdAt) % 12;
  const days = differenceInDays(unlockAt, subMonths(unlockAt, months + years * 12));

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days > 0 && years === 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

  return parts.join(', ') || '1 day';
};

/**
 * Mock Capsule Data
 */
export const mockCapsules: Record<CapsuleType, OpenCapsuleData> = {
  emotion: {
    id: '1',
    type: 'emotion',
    status: 'ready',
    content:
      "I'm feeling really anxious about my job interview tomorrow. I hope I can stay calm and present my best self. I've prepared so much, but I still feel this knot in my stomach. Future me, I hope you're reading this with good news!",
    images: [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
    ],
    reflectionQuestion: 'Did the interview go well?',
    createdAt: subYears(new Date(), 1),
    unlockAt: new Date(),
    openedAt: new Date(),
    timeLocked: '1 year',
  },

  goal: {
    id: '2',
    type: 'goal',
    status: 'ready',
    content:
      "Today I'm setting a goal to run a 5K marathon by the end of this year. I've never been a runner, but I want to challenge myself. I'm starting with just 1km runs, three times a week. Let's see if I can do this!",
    images: [
      'https://picsum.photos/400/400?random=3',
    ],
    reflectionQuestion: 'Did you achieve your 5K goal?',
    createdAt: subMonths(new Date(), 6),
    unlockAt: new Date(),
    openedAt: new Date(),
    timeLocked: '6 months',
  },

  memory: {
    id: '3',
    type: 'memory',
    status: 'ready',
    content:
      "Today was the best day ever! We had our first family vacation to the beach in 5 years. The kids built the biggest sandcastle and we all laughed so much. I want to remember this feeling forever - the warmth of the sun, the sound of waves, and the joy on everyone's faces.",
    images: [
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=5',
      'https://picsum.photos/400/400?random=6',
    ],
    reflectionQuestion: null,
    createdAt: subMonths(new Date(), 3),
    unlockAt: new Date(),
    openedAt: new Date(),
    timeLocked: '3 months',
  },

  decision: {
    id: '4',
    type: 'decision',
    status: 'ready',
    content:
      "I've decided to quit my corporate job and start my own business. It's terrifying and exciting at the same time. Everyone thinks I'm crazy, but I believe in this idea. I'm giving myself one year to make it work. Future me, I hope you're proud of this decision!",
    images: [],
    reflectionQuestion: 'Was this decision the right one?',
    createdAt: subYears(new Date(), 1),
    unlockAt: new Date(),
    openedAt: new Date(),
    timeLocked: '1 year, 2 months',
  },
};

/**
 * Get mock capsule by type
 */
export const getMockCapsule = (type: CapsuleType): OpenCapsuleData => {
  return mockCapsules[type];
};
