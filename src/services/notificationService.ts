/**
 * Notification Service
 * Handle scheduling and canceling notifications for capsules
 *
 * Features:
 * - Request notification permissions
 * - Schedule local notifications for capsule unlock times
 * - Cancel scheduled notifications
 * - Handle notification responses (tap to open capsule)
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Capsule, CapsuleType } from '../types/capsule';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 * Required before scheduling notifications
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[NotificationService] Notification permission not granted');
      return false;
    }

    console.log('[NotificationService] Notification permission granted');
    return true;
  } catch (error) {
    console.error('[NotificationService] Failed to request permissions:', error);
    return false;
  }
};

/**
 * Get notification title based on capsule type
 */
const getNotificationTitle = (type: CapsuleType): string => {
  const titles = {
    emotion: 'Your Emotion capsule is ready!',
    goal: 'Your Goal capsule is ready!',
    memory: 'Your Memory capsule is ready!',
    decision: 'Your Decision capsule is ready!',
  };
  return titles[type];
};

/**
 * Get notification body based on capsule type
 */
const getNotificationBody = (type: CapsuleType): string => {
  const bodies = {
    emotion: 'Tap to see how you felt and reflect on your emotions.',
    goal: 'Tap to check your progress and see if you achieved your goal.',
    memory: 'Tap to relive this special moment from the past.',
    decision: 'Tap to reflect on the decision you made.',
  };
  return bodies[type];
};

/**
 * Schedule notification for capsule unlock
 * Returns notification ID or null if failed
 */
export const scheduleNotification = async (
  capsule: Capsule
): Promise<string | null> => {
  try {
    // Request permission first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('[NotificationService] Cannot schedule without permission');
      return null;
    }

    // Parse unlock date
    const unlockDate = new Date(capsule.unlockDate);
    const now = new Date();

    // Validate unlock date is in the future
    if (unlockDate <= now) {
      console.warn('[NotificationService] Unlock date is in the past');
      return null;
    }

    // Schedule notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: getNotificationTitle(capsule.type),
        body: getNotificationBody(capsule.type),
        sound: true,
        data: {
          capsuleId: capsule.id,
          type: capsule.type,
        },
      },
      trigger: {
        date: unlockDate,
      },
    });

    console.log('[NotificationService] Notification scheduled:', notificationId, 'for', unlockDate);
    return notificationId;
  } catch (error) {
    // Don't throw - notification scheduling failure shouldn't block capsule creation
    console.error('[NotificationService] Failed to schedule notification:', error);
    return null;
  }
};

/**
 * Cancel scheduled notification
 * Used when deleting capsules (for opened capsules only)
 */
export const cancelNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('[NotificationService] Notification cancelled:', notificationId);
  } catch (error) {
    // Best effort - log warning but don't throw
    console.warn('[NotificationService] Failed to cancel notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 * Useful for debugging or reset
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[NotificationService] All notifications cancelled');
  } catch (error) {
    console.error('[NotificationService] Failed to cancel all notifications:', error);
  }
};

/**
 * Get all scheduled notifications
 * Useful for debugging
 */
export const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('[NotificationService] Scheduled notifications:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('[NotificationService] Failed to get scheduled notifications:', error);
    return [];
  }
};

/**
 * Add notification received listener
 * Called when notification is received while app is in foreground
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener
 * Called when user taps on notification
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Check if notification permissions are granted
 */
export const hasNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('[NotificationService] Failed to check permissions:', error);
    return false;
  }
};
