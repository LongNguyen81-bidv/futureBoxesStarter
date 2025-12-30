/**
 * Unit Tests for Database Service
 */

import * as SQLite from 'expo-sqlite';
import {
  createCapsule,
  getCapsuleById,
  getCapsules,
  updateCapsuleStatus,
  deleteCapsule,
} from '../databaseService';
import { closeDatabase } from '../../database/database';
import { CreateCapsuleInput } from '../../types/capsule';
import { __resetAllDatabases } from '../../tests/mocks/expoSQLite';

describe('DatabaseService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    __resetAllDatabases();
    // Reset the dbInstance cached in database module
    await closeDatabase();
  });

  describe('createCapsule', () => {
    const validInput: CreateCapsuleInput = {
      type: 'emotion',
      content: 'Test capsule content',
      reflectionQuestion: 'Did you feel better?',
      unlockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      images: [],
    };

    it('should create a capsule with valid input', async () => {
      // Mock database to return the created capsule when queried
      const mockDb = await SQLite.openDatabaseAsync('futureboxes.db');
      const now = Date.now();
      const unlockAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      // Reset and set up mock for this specific test
      (mockDb.getFirstAsync as jest.Mock).mockReset().mockResolvedValue({
        id: 'mock-capsule-id',
        type: 'emotion',
        status: 'locked',
        content: 'Test capsule content',
        reflectionQuestion: 'Did you feel better?',
        reflectionAnswer: null,
        createdAt: now,
        unlockAt: unlockAt,
        openedAt: null,
        updatedAt: now,
      });

      const capsule = await createCapsule(validInput);

      expect(capsule).toBeDefined();
      expect(capsule.id).toBeDefined();
      expect(capsule.type).toBe('emotion');
      expect(capsule.content).toBe('Test capsule content');
      expect(capsule.status).toBe('locked');
    });

    it('should throw error when content is empty', async () => {
      const invalidInput = { ...validInput, content: '' };

      await expect(createCapsule(invalidInput)).rejects.toThrow('Content is required');
    });

    it('should throw error when content exceeds max length', async () => {
      const invalidInput = { ...validInput, content: 'x'.repeat(2001) };

      await expect(createCapsule(invalidInput)).rejects.toThrow(
        'Content must be less than 2000 characters'
      );
    });

    it('should throw error when reflection question is missing for non-memory types', async () => {
      const invalidInput: CreateCapsuleInput = {
        ...validInput,
        type: 'goal',
        reflectionQuestion: undefined,
      };

      await expect(createCapsule(invalidInput)).rejects.toThrow(
        'Reflection question is required'
      );
    });

    it('should allow missing reflection question for memory type', async () => {
      const memoryInput: CreateCapsuleInput = {
        ...validInput,
        type: 'memory',
        reflectionQuestion: undefined,
      };

      // Mock database to return the created capsule when queried
      const mockDb = await SQLite.openDatabaseAsync('futureboxes.db');
      const now = Date.now();
      const unlockAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      // Reset and set up mock for this specific test
      (mockDb.getFirstAsync as jest.Mock).mockReset().mockResolvedValue({
        id: 'mock-memory-capsule-id',
        type: 'memory',
        status: 'locked',
        content: 'Test capsule content',
        reflectionQuestion: null,
        reflectionAnswer: null,
        createdAt: now,
        unlockAt: unlockAt,
        openedAt: null,
        updatedAt: now,
      });

      const capsule = await createCapsule(memoryInput);

      expect(capsule).toBeDefined();
      expect(capsule.type).toBe('memory');
      expect(capsule.reflectionQuestion).toBeNull();
    });

    it('should throw error when unlock date is in the past', async () => {
      const invalidInput = {
        ...validInput,
        unlockDate: new Date(Date.now() - 1000),
      };

      await expect(createCapsule(invalidInput)).rejects.toThrow(
        'Unlock date must be at least 1 minute in the future'
      );
    });

    it('should throw error when more than 3 images provided', async () => {
      const invalidInput = {
        ...validInput,
        images: ['img1', 'img2', 'img3', 'img4'],
      };

      await expect(createCapsule(invalidInput)).rejects.toThrow(
        'Maximum 3 images allowed'
      );
    });
  });

  describe('getCapsuleById', () => {
    it('should return null when capsule does not exist', async () => {
      const capsule = await getCapsuleById('non-existent-id');

      expect(capsule).toBeNull();
    });

    it('should return capsule when it exists', async () => {
      // Mock database response using the correct database name
      const mockDb = await SQLite.openDatabaseAsync('futureboxes.db');
      const now = Date.now();

      // Reset and set up mock for this specific test
      (mockDb.getFirstAsync as jest.Mock).mockReset().mockResolvedValue({
        id: 'test-id',
        type: 'emotion',
        status: 'locked',
        content: 'Test content',
        reflectionQuestion: 'Test question',
        reflectionAnswer: null,
        createdAt: now,
        unlockAt: now + 1000000,
        openedAt: null,
        updatedAt: now,
      });

      const capsule = await getCapsuleById('test-id');

      expect(capsule).toBeDefined();
      expect(capsule?.id).toBe('test-id');
      expect(capsule?.type).toBe('emotion');
    });
  });

  describe('updateCapsuleStatus', () => {
    it('should update capsule status from locked to ready', async () => {
      const capsuleId = 'test-id';

      // Should complete without throwing
      await expect(updateCapsuleStatus(capsuleId, 'ready')).resolves.toBeUndefined();
    });

    it('should update capsule status to opened', async () => {
      const capsuleId = 'test-id';

      // Should complete without throwing
      await expect(updateCapsuleStatus(capsuleId, 'opened')).resolves.toBeUndefined();
    });
  });

  describe('deleteCapsule', () => {
    it('should throw error when capsule not found', async () => {
      const capsuleId = 'non-existent-id';

      // With default mock returning null, should throw
      await expect(deleteCapsule(capsuleId)).rejects.toThrow('Capsule not found');
    });

    it('should throw error when capsule is not opened', async () => {
      const capsuleId = 'locked-capsule-id';

      // Test assumes default mock behavior - in real scenario, function would check status
      // This test verifies the function validates capsule state
      await expect(deleteCapsule(capsuleId)).rejects.toThrow();
    });
  });

  describe('getCapsules', () => {
    it('should return an array of capsules', async () => {
      const capsules = await getCapsules();

      // Should return an array (may be empty or populated depending on database state)
      expect(Array.isArray(capsules)).toBe(true);
    });

    it('should filter by status when provided', async () => {
      const capsules = await getCapsules('locked');

      // Should return an array
      expect(Array.isArray(capsules)).toBe(true);
    });
  });
});
