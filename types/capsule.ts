/**
 * Capsule Data Types
 * FutureBoxes Time Capsule App
 */

export type CapsuleType = 'emotion' | 'goal' | 'memory' | 'decision';
export type CapsuleStatus = 'locked' | 'ready' | 'opened';

export interface Capsule {
  id: string;
  type: CapsuleType;
  status: CapsuleStatus;
  content: string;
  images: string[]; // File URIs
  reflectionQuestion: string | null;
  reflectionAnswer?: string | number | null; // 'yes'/'no' or rating 1-5
  createdAt: Date;
  unlockAt: Date;
  openedAt?: Date;
}

export interface OpenCapsuleData extends Capsule {
  timeLocked: string; // Human readable duration "1 year, 3 months"
}
