/**
 * Unit Tests for File Service
 */

import * as FileSystem from 'expo-file-system';
import {
  copyImagesToAppDirectory,
  deleteCapsuleImages,
  imageFileExists,
} from '../fileService';
import { __reset, __setMockFile } from '../../tests/mocks/expoFileSystem';

describe('FileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __reset();
  });

  describe('copyImagesToAppDirectory', () => {
    it('should copy images to app directory', async () => {
      const sourceUris = [
        'file:///source/image1.jpg',
        'file:///source/image2.jpg',
      ];
      const capsuleId = 'test-capsule-id';

      // Set up mock files so they "exist"
      __setMockFile(sourceUris[0], 'mock-image-1');
      __setMockFile(sourceUris[1], 'mock-image-2');

      const destinationPaths = await copyImagesToAppDirectory(
        sourceUris,
        capsuleId
      );

      expect(destinationPaths).toHaveLength(2);
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalled();
      expect(FileSystem.copyAsync).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no images provided', async () => {
      const destinationPaths = await copyImagesToAppDirectory([], 'capsule-id');

      expect(destinationPaths).toEqual([]);
      expect(FileSystem.copyAsync).not.toHaveBeenCalled();
    });

    it('should handle copy errors gracefully', async () => {
      const sourceUris = ['file:///source/image1.jpg'];
      const capsuleId = 'test-capsule-id';

      // Set up mock file first
      __setMockFile(sourceUris[0], 'mock-image');

      (FileSystem.copyAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Copy failed')
      );

      await expect(
        copyImagesToAppDirectory(sourceUris, capsuleId)
      ).rejects.toThrow('Failed to copy image');
    });

    it('should preserve image order with correct indices', async () => {
      const sourceUris = [
        'file:///source/image1.jpg',
        'file:///source/image2.jpg',
        'file:///source/image3.jpg',
      ];
      const capsuleId = 'test-capsule-id';

      // Set up mock files
      __setMockFile(sourceUris[0], 'mock-image-1');
      __setMockFile(sourceUris[1], 'mock-image-2');
      __setMockFile(sourceUris[2], 'mock-image-3');

      const destinationPaths = await copyImagesToAppDirectory(
        sourceUris,
        capsuleId
      );

      expect(destinationPaths).toHaveLength(3);
      expect(destinationPaths[0].filePath).toContain('_0.jpg');
      expect(destinationPaths[1].filePath).toContain('_1.jpg');
      expect(destinationPaths[2].filePath).toContain('_2.jpg');
      expect(destinationPaths[0].orderIndex).toBe(0);
      expect(destinationPaths[1].orderIndex).toBe(1);
      expect(destinationPaths[2].orderIndex).toBe(2);
    });
  });

  describe('deleteCapsuleImages', () => {
    it('should delete all images for a capsule', async () => {
      const capsuleId = 'test-capsule-id';
      const capsuleDir = `${FileSystem.documentDirectory}capsule_images/${capsuleId}`;

      // Mock that directory exists
      __setMockFile(capsuleDir, 'directory');

      await deleteCapsuleImages(capsuleId);

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        expect.stringContaining(capsuleId),
        expect.objectContaining({ idempotent: true })
      );
    });

    it('should handle deletion of non-existent directory gracefully', async () => {
      const capsuleId = 'non-existent-capsule';

      // Directory doesn't exist - should not call deleteAsync
      await deleteCapsuleImages(capsuleId);

      // Function handles non-existent gracefully, no throw expected
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });

    it('should delete empty capsule directory', async () => {
      const capsuleId = 'test-capsule-id';
      const capsuleDir = `${FileSystem.documentDirectory}capsule_images/${capsuleId}`;

      // Mock that directory exists
      __setMockFile(capsuleDir, 'directory');

      await deleteCapsuleImages(capsuleId);

      expect(FileSystem.deleteAsync).toHaveBeenCalled();
    });
  });

  describe('imageFileExists', () => {
    it('should return true when image file exists', async () => {
      const imagePath = 'file:///app/capsule_images/test.jpg';
      __setMockFile(imagePath, 'image-content');

      const exists = await imageFileExists(imagePath);

      expect(exists).toBe(true);
      expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(imagePath);
    });

    it('should return false when image file does not exist', async () => {
      const imagePath = 'file:///app/capsule_images/non-existent.jpg';

      const exists = await imageFileExists(imagePath);

      expect(exists).toBe(false);
    });

    it('should handle file system errors', async () => {
      const imagePath = 'file:///app/capsule_images/test.jpg';

      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(
        new Error('File system error')
      );

      const exists = await imageFileExists(imagePath);

      expect(exists).toBe(false);
    });
  });
});
