/**
 * Database Service
 * CRUD operations for capsules and images
 *
 * Features:
 * - Create, read, update, delete capsules
 * - Image management
 * - Transaction support
 * - Error handling and validation
 * - Type-safe operations
 */

import * as FileSystem from 'expo-file-system';
import { getDatabase } from '../database/database';
import {
  Capsule,
  CapsuleImage,
  CapsuleStatus,
  CapsuleType,
  CreateCapsuleInput,
} from '../types/capsule';
import {
  copyImagesToAppDirectory,
  deleteCapsuleImages,
  imageFileExists,
} from './fileService';

// Validation constants
const MAX_CONTENT_LENGTH = 2000;
const MAX_REFLECTION_QUESTION_LENGTH = 500;
const MAX_IMAGES = 3;
const MIN_UNLOCK_DELAY_MS = 60 * 1000; // 1 minute

/**
 * Database row types (matching SQLite schema)
 */
interface CapsuleRow {
  id: string;
  type: CapsuleType;
  status: CapsuleStatus;
  content: string;
  reflectionQuestion: string | null;
  reflectionAnswer: string | null;
  createdAt: number;
  unlockAt: number;
  openedAt: number | null;
  updatedAt: number;
}

interface CapsuleImageRow {
  id: string;
  capsuleId: string;
  filePath: string;
  orderIndex: number;
  createdAt: number;
}

/**
 * Validation helper
 */
const validateCapsuleInput = (input: CreateCapsuleInput): void => {
  // Content validation
  if (!input.content || input.content.trim().length === 0) {
    throw new Error('Content is required');
  }
  if (input.content.length > MAX_CONTENT_LENGTH) {
    throw new Error(`Content must be less than ${MAX_CONTENT_LENGTH} characters`);
  }

  // Reflection question validation
  const requiresReflection = input.type !== 'memory';
  if (requiresReflection && !input.reflectionQuestion) {
    throw new Error(`Reflection question is required for ${input.type} capsules`);
  }
  if (
    input.reflectionQuestion &&
    input.reflectionQuestion.length > MAX_REFLECTION_QUESTION_LENGTH
  ) {
    throw new Error(
      `Reflection question must be less than ${MAX_REFLECTION_QUESTION_LENGTH} characters`
    );
  }

  // Unlock date validation
  const now = new Date();
  const minUnlockDate = new Date(now.getTime() + MIN_UNLOCK_DELAY_MS);
  if (input.unlockDate <= minUnlockDate) {
    throw new Error('Unlock date must be at least 1 minute in the future');
  }

  // Images validation
  if (input.images && input.images.length > MAX_IMAGES) {
    throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
  }
};

/**
 * Generate UUID v4
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Convert database row to Capsule object
 */
const rowToCapsule = (row: CapsuleRow): Capsule => {
  return {
    id: row.id,
    type: row.type,
    content: row.content,
    reflectionQuestion: row.reflectionQuestion,
    reflectionType:
      row.type === 'memory' ? null : row.type === 'decision' ? 'rating' : 'yes_no',
    reflectionAnswer: row.reflectionAnswer,
    unlockDate: new Date(row.unlockAt).toISOString(),
    createdAt: new Date(row.createdAt).toISOString(),
    openedAt: row.openedAt ? new Date(row.openedAt).toISOString() : null,
    status: row.status,
  };
};

/**
 * Convert database row to CapsuleImage object
 */
const rowToCapsuleImage = (row: CapsuleImageRow): CapsuleImage => {
  return {
    id: row.id,
    capsuleId: row.capsuleId,
    imagePath: row.filePath,
    createdAt: new Date(row.createdAt).toISOString(),
  };
};

/**
 * Create a new capsule
 */
export const createCapsule = async (input: CreateCapsuleInput): Promise<Capsule> => {
  // Validate input
  validateCapsuleInput(input);

  const db = await getDatabase();
  const capsuleId = generateUUID();
  const now = Date.now();

  try {
    // Start transaction
    await db.execAsync('BEGIN TRANSACTION');

    // Insert capsule
    await db.runAsync(
      `INSERT INTO capsule (
        id, type, status, content, reflectionQuestion,
        createdAt, unlockAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        capsuleId,
        input.type,
        'locked',
        input.content.trim(),
        input.reflectionQuestion?.trim() || null,
        now,
        input.unlockDate.getTime(),
        now,
      ]
    );

    // Handle images if provided
    if (input.images && input.images.length > 0) {
      const imageResults = await copyImagesToAppDirectory(input.images, capsuleId);

      for (const { imageId, filePath, orderIndex } of imageResults) {
        await db.runAsync(
          `INSERT INTO capsule_image (
            id, capsuleId, filePath, orderIndex, createdAt
          ) VALUES (?, ?, ?, ?, ?)`,
          [imageId, capsuleId, filePath, orderIndex, now]
        );
      }
    }

    // Commit transaction
    await db.execAsync('COMMIT');

    console.log('[DatabaseService] Capsule created:', capsuleId);

    // Fetch and return the created capsule
    const capsule = await getCapsuleById(capsuleId);
    if (!capsule) {
      throw new Error('Failed to retrieve created capsule');
    }

    return capsule;
  } catch (error) {
    // Rollback transaction
    await db.execAsync('ROLLBACK');

    // Delete any copied images
    await deleteCapsuleImages(capsuleId);

    console.error('[DatabaseService] Failed to create capsule:', error);
    throw error;
  }
};

/**
 * Get capsule by ID
 */
export const getCapsuleById = async (id: string): Promise<Capsule | null> => {
  try {
    const db = await getDatabase();

    const row = await db.getFirstAsync<CapsuleRow>(
      'SELECT * FROM capsule WHERE id = ?',
      [id]
    );

    if (!row) {
      return null;
    }

    return rowToCapsule(row);
  } catch (error) {
    console.error('[DatabaseService] Failed to get capsule:', error);
    throw error;
  }
};

/**
 * Get capsules with optional status filter
 */
export const getCapsules = async (
  status?: CapsuleStatus
): Promise<Capsule[]> => {
  try {
    const db = await getDatabase();

    let query = 'SELECT * FROM capsule';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY unlockAt ASC';

    const rows = await db.getAllAsync<CapsuleRow>(query, params);

    return rows.map(rowToCapsule);
  } catch (error) {
    console.error('[DatabaseService] Failed to get capsules:', error);
    throw error;
  }
};

/**
 * Get upcoming capsules for Home Screen (max 6)
 */
export const getUpcomingCapsules = async (): Promise<Capsule[]> => {
  try {
    const db = await getDatabase();

    const rows = await db.getAllAsync<CapsuleRow>(
      `SELECT * FROM capsule
       WHERE status IN ('locked', 'ready')
       ORDER BY unlockAt ASC
       LIMIT 6`
    );

    return rows.map(rowToCapsule);
  } catch (error) {
    console.error('[DatabaseService] Failed to get upcoming capsules:', error);
    throw error;
  }
};

/**
 * Get opened capsules for Archive
 */
export const getOpenedCapsules = async (): Promise<Capsule[]> => {
  try {
    const db = await getDatabase();

    const rows = await db.getAllAsync<CapsuleRow>(
      `SELECT * FROM capsule
       WHERE status = 'opened'
       ORDER BY openedAt DESC`
    );

    return rows.map(rowToCapsule);
  } catch (error) {
    console.error('[DatabaseService] Failed to get opened capsules:', error);
    throw error;
  }
};

/**
 * Update capsule status
 */
export const updateCapsuleStatus = async (
  id: string,
  status: CapsuleStatus
): Promise<void> => {
  try {
    const db = await getDatabase();
    const now = Date.now();

    await db.runAsync(
      'UPDATE capsule SET status = ?, updatedAt = ? WHERE id = ?',
      [status, now, id]
    );

    console.log('[DatabaseService] Capsule status updated:', id, status);
  } catch (error) {
    console.error('[DatabaseService] Failed to update status:', error);
    throw error;
  }
};

/**
 * Validate reflection answer format
 */
const validateReflectionAnswer = (
  type: CapsuleType,
  answer: string
): boolean => {
  if (type === 'emotion' || type === 'goal') {
    return answer === 'yes' || answer === 'no';
  }
  if (type === 'decision') {
    return ['1', '2', '3', '4', '5'].includes(answer);
  }
  // Memory type should not have reflection
  if (type === 'memory') {
    return false;
  }
  return false;
};

/**
 * Update reflection answer and mark as opened
 */
export const updateReflectionAnswer = async (
  id: string,
  answer: string
): Promise<Capsule> => {
  try {
    const db = await getDatabase();
    const now = Date.now();

    // Start transaction for atomicity
    await db.execAsync('BEGIN TRANSACTION');

    try {
      // Verify capsule exists and is ready
      const capsule = await db.getFirstAsync<CapsuleRow>(
        'SELECT * FROM capsule WHERE id = ?',
        [id]
      );

      if (!capsule) {
        throw new Error('Capsule not found');
      }

      if (capsule.status !== 'ready' && capsule.status !== 'opened') {
        throw new Error(`Cannot update reflection for ${capsule.status} capsule`);
      }

      // Validate answer format
      if (!validateReflectionAnswer(capsule.type, answer)) {
        throw new Error(`Invalid answer "${answer}" for ${capsule.type} capsule`);
      }

      // Update reflection answer, status, and openedAt
      await db.runAsync(
        `UPDATE capsule
         SET reflectionAnswer = ?, status = 'opened', openedAt = ?, updatedAt = ?
         WHERE id = ?`,
        [answer, capsule.openedAt || now, now, id]
      );

      // Commit transaction
      await db.execAsync('COMMIT');

      console.log('[DatabaseService] Reflection answer updated:', id, answer);

      // Return updated capsule
      const updatedCapsule = await getCapsuleById(id);
      if (!updatedCapsule) {
        throw new Error('Failed to retrieve updated capsule');
      }

      return updatedCapsule;
    } catch (error) {
      // Rollback on error
      await db.execAsync('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('[DatabaseService] Failed to update reflection:', error);
    throw error;
  }
};

/**
 * Mark capsule as opened (for memory type with no reflection)
 */
export const markCapsuleAsOpened = async (id: string): Promise<void> => {
  try {
    const db = await getDatabase();
    const now = Date.now();

    await db.runAsync(
      `UPDATE capsule
       SET status = 'opened', openedAt = ?, updatedAt = ?
       WHERE id = ?`,
      [now, now, id]
    );

    console.log('[DatabaseService] Capsule marked as opened:', id);
  } catch (error) {
    console.error('[DatabaseService] Failed to mark as opened:', error);
    throw error;
  }
};

/**
 * Delete capsule with full cleanup
 * Atomic operation with transaction and rollback
 * Deletes: images from file system, image records, reflection answer, capsule record
 */
export const deleteCapsule = async (id: string): Promise<void> => {
  const db = await getDatabase();

  try {
    // 1. Verify capsule exists and is opened
    const capsule = await getCapsuleById(id);
    if (!capsule) {
      throw new Error('Capsule not found');
    }
    if (capsule.status !== 'opened') {
      throw new Error('Can only delete opened capsules');
    }

    // 2. Get all image records before deleting (for file cleanup)
    const images = await getImages(id);

    // 3. Start transaction for atomic operation
    await db.execAsync('BEGIN TRANSACTION');

    // 4. Delete database records
    // Note: reflectionAnswer is a column in capsule table, not separate table
    // Foreign key CASCADE will delete image records automatically
    await db.runAsync('DELETE FROM capsule WHERE id = ?', [id]);

    // 5. Commit transaction - DB operations successful
    await db.execAsync('COMMIT');

    // 6. Delete image files from file system (after DB commit)
    // Use best-effort approach - log warnings but don't fail
    for (const image of images) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(image.imagePath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(image.imagePath, { idempotent: true });
        }
      } catch (err) {
        console.warn('[DatabaseService] Failed to delete image file:', image.imagePath, err);
        // Continue with other images even if one fails
      }
    }

    // Also delete capsule directory
    await deleteCapsuleImages(id);

    console.log('[DatabaseService] Capsule deleted successfully:', id);
  } catch (error) {
    // Rollback transaction on error
    try {
      await db.execAsync('ROLLBACK');
      console.log('[DatabaseService] Transaction rolled back');
    } catch (rollbackError) {
      console.error('[DatabaseService] Rollback failed:', rollbackError);
    }

    console.error('[DatabaseService] Failed to delete capsule:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete capsule. Please try again.'
    );
  }
};

/**
 * Get images for a capsule
 */
export const getImages = async (capsuleId: string): Promise<CapsuleImage[]> => {
  try {
    const db = await getDatabase();

    const rows = await db.getAllAsync<CapsuleImageRow>(
      `SELECT * FROM capsule_image
       WHERE capsuleId = ?
       ORDER BY orderIndex ASC`,
      [capsuleId]
    );

    // Filter out images with missing files
    const validImages: CapsuleImage[] = [];

    for (const row of rows) {
      const exists = await imageFileExists(row.filePath);
      if (exists) {
        validImages.push(rowToCapsuleImage(row));
      } else {
        console.warn('[DatabaseService] Image file missing:', row.filePath);
      }
    }

    return validImages;
  } catch (error) {
    console.error('[DatabaseService] Failed to get images:', error);
    throw error;
  }
};

/**
 * Update capsule statuses based on unlock times
 * Called by background task or on app launch
 */
export const updatePendingCapsules = async (): Promise<number> => {
  try {
    const db = await getDatabase();
    const now = Date.now();

    const result = await db.runAsync(
      `UPDATE capsule
       SET status = 'ready', updatedAt = ?
       WHERE status = 'locked' AND unlockAt <= ?`,
      [now, now]
    );

    const updatedCount = result.changes;
    if (updatedCount > 0) {
      console.log('[DatabaseService] Updated pending capsules:', updatedCount);
    }

    return updatedCount;
  } catch (error) {
    console.error('[DatabaseService] Failed to update pending capsules:', error);
    throw error;
  }
};

/**
 * Get capsules ready to unlock (for notification scheduling)
 */
export const getCapsulesToNotify = async (): Promise<Capsule[]> => {
  try {
    const db = await getDatabase();
    const now = Date.now();

    const rows = await db.getAllAsync<CapsuleRow>(
      `SELECT * FROM capsule
       WHERE status = 'locked' AND unlockAt <= ?
       ORDER BY unlockAt ASC`,
      [now]
    );

    return rows.map(rowToCapsule);
  } catch (error) {
    console.error('[DatabaseService] Failed to get capsules to notify:', error);
    throw error;
  }
};
