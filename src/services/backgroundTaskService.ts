/**
 * Background Task Service
 *
 * Manages background task for checking and updating expired capsules.
 * Uses expo-background-fetch to run periodic checks every 15 minutes.
 *
 * Features:
 * - Register/unregister background task
 * - Check expired capsules in background
 * - Update capsule statuses from locked to ready
 * - Trigger notifications for newly ready capsules
 * - Battery-efficient (15 min minimum interval)
 */

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { updatePendingCapsules, getCapsulesToNotify } from './databaseService';
import { scheduleNotificationForCapsule } from './notificationService';

// Task name constant
const BACKGROUND_FETCH_TASK = 'capsule-timer-background-task';

/**
 * Define the background task
 * This task checks for expired capsules and updates their status
 */
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('[BackgroundTask] Running capsule timer check...');
    const now = Date.now();

    // Update all expired capsules from locked to ready
    const updatedCount = await updatePendingCapsules();

    if (updatedCount > 0) {
      console.log(`[BackgroundTask] Updated ${updatedCount} capsule(s) to ready`);

      // Get newly ready capsules to send notifications
      const capsulesReadyNow = await getCapsulesToNotify();

      // Schedule notifications for newly ready capsules
      for (const capsule of capsulesReadyNow) {
        try {
          await scheduleNotificationForCapsule(capsule);
          console.log(`[BackgroundTask] Notification scheduled for capsule: ${capsule.id}`);
        } catch (err) {
          console.error(`[BackgroundTask] Failed to schedule notification for ${capsule.id}:`, err);
        }
      }
    } else {
      console.log('[BackgroundTask] No capsules to update');
    }

    // Return success with new data status
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[BackgroundTask] Failed to update capsules:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Register background fetch task
 * Should be called on app startup
 */
export const registerBackgroundTask = async (): Promise<void> => {
  try {
    // Check if task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

    if (isRegistered) {
      console.log('[BackgroundTask] Task already registered');
      return;
    }

    // Register the task with 15 minute minimum interval
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15 * 60, // 15 minutes in seconds
      stopOnTerminate: false, // Continue after app termination
      startOnBoot: true, // Start task after device reboot
    });

    console.log('[BackgroundTask] Task registered successfully');
  } catch (error) {
    console.error('[BackgroundTask] Failed to register task:', error);
    // Don't throw - background task failure should not crash app
  }
};

/**
 * Unregister background fetch task
 * Useful for debugging or cleanup
 */
export const unregisterBackgroundTask = async (): Promise<void> => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    console.log('[BackgroundTask] Task unregistered successfully');
  } catch (error) {
    console.error('[BackgroundTask] Failed to unregister task:', error);
  }
};

/**
 * Check background task status
 * Returns task registration status
 */
export const getBackgroundTaskStatus = async (): Promise<{
  isRegistered: boolean;
  status?: BackgroundFetch.BackgroundFetchStatus;
}> => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    const status = await BackgroundFetch.getStatusAsync();

    console.log('[BackgroundTask] Status:', {
      isRegistered,
      status: status !== null ? getStatusName(status) : 'unknown',
    });

    return { isRegistered, status: status ?? undefined };
  } catch (error) {
    console.error('[BackgroundTask] Failed to get status:', error);
    return { isRegistered: false };
  }
};

/**
 * Get human-readable status name
 */
const getStatusName = (status: BackgroundFetch.BackgroundFetchStatus): string => {
  switch (status) {
    case BackgroundFetch.BackgroundFetchStatus.Available:
      return 'Available';
    case BackgroundFetch.BackgroundFetchStatus.Denied:
      return 'Denied';
    case BackgroundFetch.BackgroundFetchStatus.Restricted:
      return 'Restricted';
    default:
      return 'Unknown';
  }
};
