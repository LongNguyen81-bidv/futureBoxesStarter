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
const createFutureDate = (days: number, hours: number = 0, minutes: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

// Helper to create past date
const createPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock capsules with different states
export const MOCK_CAPSULES: Capsule[] = [
  // Capsule 1: Ready to open (Emotion type)
  {
    id: 'mock-1',
    type: 'emotion',
    status: 'ready',
    content: 'Đang rất hào hứng với dự án mới này! Hy vọng bản thân tương lai đã đạt được mục tiêu.',
    reflectionQuestion: 'Bạn đã hoàn thành dự án thành công chưa?',
    reflectionType: 'yes_no',
    reflectionAnswer: null,
    createdAt: createPastDate(7),
    unlockDate: new Date(Date.now() - 1000).toISOString(), // Already passed
    openedAt: null,
  },

  // Capsule 2: Locked, 3 days remaining (Goal type)
  {
    id: 'mock-2',
    type: 'goal',
    status: 'locked',
    content: 'Mình muốn giảm 5kg trong 3 tháng tới. Xem mình có làm được không nhé!',
    reflectionQuestion: 'Bạn đã đạt được mục tiêu giảm cân chưa?',
    reflectionType: 'yes_no',
    reflectionAnswer: null,
    createdAt: createPastDate(2),
    unlockDate: createFutureDate(3, 5, 30),
    openedAt: null,
  },

  // Capsule 3: Locked, 1 week remaining (Memory type)
  {
    id: 'mock-3',
    type: 'memory',
    status: 'locked',
    content: 'Ngày đầu tiên đi làm ở công ty mới! Mọi người thân thiện quá. Rất mong chờ xem mọi thứ sẽ ra sao.',
    reflectionQuestion: null, // Memory type doesn't have reflection
    reflectionType: null,
    reflectionAnswer: null,
    createdAt: createPastDate(5),
    unlockDate: createFutureDate(7, 2, 0),
    openedAt: null,
  },

  // Capsule 4: Locked, less than 1 day (Decision type)
  {
    id: 'mock-4',
    type: 'decision',
    status: 'locked',
    content: 'Quyết định đầu tư vào crypto. Có thể là xuất sắc hoặc thảm họa!',
    reflectionQuestion: 'Quyết định đầu tư này có sáng suốt không?',
    reflectionType: 'rating',
    reflectionAnswer: null,
    createdAt: createPastDate(1),
    unlockDate: createFutureDate(0, 12, 30),
    openedAt: null,
  },

  // Capsule 5: Locked, 2 months remaining (Emotion type)
  {
    id: 'mock-5',
    type: 'emotion',
    status: 'locked',
    content: 'Hơi lo lắng về bài thuyết trình ngày mai. Hy vọng mình sẽ làm tốt!',
    reflectionQuestion: 'Bài thuyết trình có diễn ra tốt đẹp không?',
    reflectionType: 'yes_no',
    reflectionAnswer: null,
    createdAt: createPastDate(3),
    unlockDate: createFutureDate(60, 0, 0),
    openedAt: null,
  },

  // Capsule 6: Locked, 1 year remaining (Goal type)
  {
    id: 'mock-6',
    type: 'goal',
    status: 'locked',
    content: 'Mục tiêu năm mới: Học chơi guitar. Xem mình có kiên trì được không!',
    reflectionQuestion: 'Bây giờ bạn đã biết chơi guitar chưa?',
    reflectionType: 'yes_no',
    reflectionAnswer: null,
    createdAt: createPastDate(10),
    unlockDate: createFutureDate(365, 0, 0),
    openedAt: null,
  },

  // Extra capsule (for testing "only 6 shown" behavior)
  {
    id: 'mock-7',
    type: 'decision',
    status: 'locked',
    content: 'Không xuất hiện trên màn hình Home (capsule thứ 7)',
    reflectionQuestion: 'Đây không nên hiển thị',
    reflectionType: 'rating',
    reflectionAnswer: null,
    createdAt: createPastDate(1),
    unlockDate: createFutureDate(400, 0, 0),
    openedAt: null,
  },
];

// Get only 6 upcoming capsules (sorted by unlock time)
export const getUpcomingMockCapsules = (): Capsule[] => {
  return MOCK_CAPSULES
    .filter((c) => c.status === 'locked' || c.status === 'ready')
    .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())
    .slice(0, 6);
};

// Helper to format countdown
export const formatCountdown = (unlockAt: number): string => {
  const now = Date.now();
  const diff = unlockAt - now;

  // Already ready
  if (diff <= 0) {
    return 'Sẵn sàng!';
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
