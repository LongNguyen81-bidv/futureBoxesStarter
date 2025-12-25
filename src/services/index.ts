/**
 * Services module exports
 */

// Database Service
export {
  createCapsule,
  getCapsuleById,
  getCapsules,
  getUpcomingCapsules,
  getOpenedCapsules,
  updateCapsuleStatus,
  updateReflectionAnswer,
  markCapsuleAsOpened,
  deleteCapsule,
  getImages,
  updatePendingCapsules,
  getCapsulesToNotify,
} from './databaseService';

// File Service
export {
  initializeImagesDirectory,
  validateImage,
  copyImageToAppDirectory,
  copyImagesToAppDirectory,
  deleteCapsuleImages,
  deleteImageFile,
  imageFileExists,
  getStorageInfo,
  hasEnoughStorage,
  getFileSize,
} from './fileService';

// Notification Service
export {
  requestNotificationPermissions,
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  hasNotificationPermissions,
} from './notificationService';
