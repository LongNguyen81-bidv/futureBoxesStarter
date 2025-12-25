/**
 * Capsule Types Definition
 * Based on PRD.md requirements
 */

export type CapsuleType = 'emotion' | 'goal' | 'memory' | 'decision';

export type CapsuleStatus = 'locked' | 'ready' | 'opened';

export type ReflectionType = 'yes_no' | 'rating' | null;

export interface Capsule {
  id: string;
  type: CapsuleType;
  content: string;
  reflectionQuestion: string | null;
  reflectionType: ReflectionType;
  reflectionAnswer: string | null;
  unlockDate: string; // ISO 8601 format
  createdAt: string; // ISO 8601 format
  openedAt: string | null; // ISO 8601 format
  status: CapsuleStatus;
}

export interface CapsuleImage {
  id: string;
  capsuleId: string;
  imagePath: string;
  createdAt: string;
}

export interface CreateCapsuleInput {
  type: CapsuleType;
  content: string;
  reflectionQuestion: string | null;
  unlockDate: Date;
  images?: string[]; // Array of image URIs
}
