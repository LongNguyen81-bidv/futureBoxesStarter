/**
 * Capsule Helper Functions
 * Bridge between database service and UI components
 */

import { getCapsuleById, getImages } from './databaseService';
import { differenceInYears, differenceInMonths, differenceInDays, subMonths } from 'date-fns';

/**
 * Capsule with images (extended from database Capsule type)
 */
export interface CapsuleWithImages {
  id: string;
  type: 'emotion' | 'goal' | 'memory' | 'decision';
  status: 'locked' | 'ready' | 'opened';
  content: string;
  images: string[]; // Array of image file URIs
  reflectionQuestion: string | null;
  reflectionAnswer: string | null;
  createdAt: string; // ISO format
  unlockDate: string; // ISO format
  openedAt: string | null; // ISO format
}

/**
 * OpenCapsuleData for UI components
 */
export interface OpenCapsuleData {
  id: string;
  type: 'emotion' | 'goal' | 'memory' | 'decision';
  status: 'locked' | 'ready' | 'opened';
  content: string;
  images: string[];
  reflectionQuestion: string | null;
  reflectionAnswer?: string | number | null;
  createdAt: Date;
  unlockAt: Date;
  openedAt: Date;
  timeLocked: string; // Human readable duration
}

/**
 * Calculate human-readable time duration
 */
export const calculateTimeLocked = (createdAt: Date, unlockAt: Date): string => {
  const years = differenceInYears(unlockAt, createdAt);
  const months = differenceInMonths(unlockAt, createdAt) % 12;
  const days = differenceInDays(unlockAt, subMonths(unlockAt, months + years * 12));

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (days > 0 && years === 0) parts.push(`${days} ngày`);

  return parts.join(', ') || '1 ngày';
};

/**
 * Get capsule with images by ID
 */
export const getCapsuleWithImages = async (
  capsuleId: string
): Promise<CapsuleWithImages | null> => {
  const capsule = await getCapsuleById(capsuleId);
  if (!capsule) {
    return null;
  }

  // Load images
  const imageRecords = await getImages(capsuleId);
  const imageUris = imageRecords.map((img) => img.imagePath);

  return {
    id: capsule.id,
    type: capsule.type,
    status: capsule.status,
    content: capsule.content,
    images: imageUris,
    reflectionQuestion: capsule.reflectionQuestion,
    reflectionAnswer: capsule.reflectionAnswer,
    createdAt: capsule.createdAt,
    unlockDate: capsule.unlockDate,
    openedAt: capsule.openedAt,
  };
};

/**
 * Convert CapsuleWithImages to OpenCapsuleData for UI
 */
export const toOpenCapsuleData = (capsule: CapsuleWithImages): OpenCapsuleData => {
  const createdAt = new Date(capsule.createdAt);
  const unlockAt = new Date(capsule.unlockDate);
  const openedAt = capsule.openedAt ? new Date(capsule.openedAt) : new Date();

  const timeLocked = calculateTimeLocked(createdAt, unlockAt);

  return {
    id: capsule.id,
    type: capsule.type,
    status: capsule.status,
    content: capsule.content,
    images: capsule.images,
    reflectionQuestion: capsule.reflectionQuestion,
    reflectionAnswer: capsule.reflectionAnswer,
    createdAt,
    unlockAt,
    openedAt,
    timeLocked,
  };
};
