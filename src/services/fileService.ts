/**
 * File Service
 * Handle image file operations for capsules
 *
 * Features:
 * - Copy images from gallery to app directory
 * - Delete images when capsule is deleted
 * - Generate unique filenames
 * - Validate image files
 * - Storage management
 */

import * as FileSystem from 'expo-file-system';

// Constants
const IMAGES_DIR = 'capsule_images';
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

/**
 * Initialize images directory
 */
export const initializeImagesDirectory = async (): Promise<void> => {
  try {
    const dirPath = getImagesDirectory();
    const dirInfo = await FileSystem.getInfoAsync(dirPath);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
      console.log('[FileService] Images directory created:', dirPath);
    }
  } catch (error) {
    console.error('[FileService] Failed to initialize directory:', error);
    throw new Error('Failed to initialize images directory');
  }
};

/**
 * Get images directory path
 */
const getImagesDirectory = (): string => {
  return `${FileSystem.documentDirectory}${IMAGES_DIR}`;
};

/**
 * Get capsule-specific directory path
 */
const getCapsuleDirectory = (capsuleId: string): string => {
  return `${getImagesDirectory()}/${capsuleId}`;
};

/**
 * Validate image file
 */
export const validateImage = async (imageUri: string): Promise<{
  valid: boolean;
  error?: string;
}> => {
  try {
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      return { valid: false, error: 'File does not exist' };
    }

    // Check file format
    const hasValidFormat = ALLOWED_FORMATS.some((format) =>
      imageUri.toLowerCase().endsWith(format)
    );
    if (!hasValidFormat) {
      return {
        valid: false,
        error: 'Invalid format. Supported: JPG, PNG',
      };
    }

    // Check file size
    if (fileInfo.size && fileInfo.size > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: `File too large. Max size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('[FileService] Validation error:', error);
    return { valid: false, error: 'Failed to validate image' };
  }
};

/**
 * Copy image to app directory
 * Returns the new file path
 */
export const copyImageToAppDirectory = async (
  imageUri: string,
  capsuleId: string,
  imageId: string,
  orderIndex: number
): Promise<string> => {
  try {
    // Validate image first
    const validation = await validateImage(imageUri);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Create capsule directory if needed
    const capsuleDir = getCapsuleDirectory(capsuleId);
    const dirInfo = await FileSystem.getInfoAsync(capsuleDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(capsuleDir, { intermediates: true });
    }

    // Generate filename with extension
    const extension = imageUri.substring(imageUri.lastIndexOf('.'));
    const filename = `${imageId}_${orderIndex}${extension}`;
    const destinationPath = `${capsuleDir}/${filename}`;

    // Copy file
    await FileSystem.copyAsync({
      from: imageUri,
      to: destinationPath,
    });

    console.log('[FileService] Image copied:', destinationPath);
    return destinationPath;
  } catch (error) {
    console.error('[FileService] Failed to copy image:', error);
    throw new Error(`Failed to copy image: ${error}`);
  }
};

/**
 * Copy multiple images for a capsule
 * Returns array of file paths
 */
export const copyImagesToAppDirectory = async (
  imageUris: string[],
  capsuleId: string
): Promise<Array<{ imageId: string; filePath: string; orderIndex: number }>> => {
  const results: Array<{ imageId: string; filePath: string; orderIndex: number }> = [];

  try {
    for (let i = 0; i < imageUris.length; i++) {
      const imageId = generateImageId();
      const filePath = await copyImageToAppDirectory(
        imageUris[i],
        capsuleId,
        imageId,
        i
      );

      results.push({
        imageId,
        filePath,
        orderIndex: i,
      });
    }

    return results;
  } catch (error) {
    // Rollback: delete already copied images
    console.error('[FileService] Failed to copy images, rolling back...');
    await deleteCapsuleImages(capsuleId);
    throw error;
  }
};

/**
 * Delete all images for a capsule
 */
export const deleteCapsuleImages = async (capsuleId: string): Promise<void> => {
  try {
    const capsuleDir = getCapsuleDirectory(capsuleId);
    const dirInfo = await FileSystem.getInfoAsync(capsuleDir);

    if (dirInfo.exists) {
      await FileSystem.deleteAsync(capsuleDir, { idempotent: true });
      console.log('[FileService] Deleted capsule images:', capsuleId);
    }
  } catch (error) {
    // Best effort - log warning but don't throw
    // DB record should still be deleted even if file deletion fails
    console.warn('[FileService] Failed to delete images:', error);
  }
};

/**
 * Delete specific image file
 */
export const deleteImageFile = async (filePath: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      console.log('[FileService] Deleted image file:', filePath);
    }
  } catch (error) {
    console.warn('[FileService] Failed to delete image file:', error);
  }
};

/**
 * Check if image file exists
 */
export const imageFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists;
  } catch (error) {
    console.error('[FileService] Failed to check file existence:', error);
    return false;
  }
};

/**
 * Get storage info
 */
export const getStorageInfo = async (): Promise<{
  freeSpace: number;
  totalSpace: number;
}> => {
  try {
    const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
    const totalDiskCapacity = await FileSystem.getTotalDiskCapacityAsync();

    return {
      freeSpace: freeDiskStorage,
      totalSpace: totalDiskCapacity,
    };
  } catch (error) {
    console.error('[FileService] Failed to get storage info:', error);
    return { freeSpace: 0, totalSpace: 0 };
  }
};

/**
 * Check if there's enough storage space
 */
export const hasEnoughStorage = async (requiredBytes: number): Promise<boolean> => {
  try {
    const { freeSpace } = await getStorageInfo();
    const safetyBuffer = 50 * 1024 * 1024; // 50MB safety buffer
    return freeSpace > requiredBytes + safetyBuffer;
  } catch (error) {
    console.error('[FileService] Failed to check storage:', error);
    return false;
  }
};

/**
 * Generate unique image ID
 */
const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get file size
 */
export const getFileSize = async (filePath: string): Promise<number> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists && 'size' in fileInfo) {
      return fileInfo.size ?? 0;
    }
    return 0;
  } catch (error) {
    console.error('[FileService] Failed to get file size:', error);
    return 0;
  }
};
