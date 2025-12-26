/**
 * Onboarding Service
 *
 * Manages onboarding completion state using AsyncStorage.
 * Controls whether onboarding screen should be shown on app launch.
 *
 * Storage key: @futureboxes:onboarding_completed
 * Storage value: 'true' (string) when completed
 *
 * Business Rules:
 * - First launch: onboarding_completed key doesn't exist → Show onboarding
 * - After completion: onboarding_completed = 'true' → Skip onboarding
 * - On storage error: Assume first launch (safe default, show onboarding)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@futureboxes:onboarding_completed';

/**
 * Check if this is the first app launch (onboarding not completed)
 *
 * @returns Promise<boolean> - true if first launch, false if completed before
 *
 * Edge cases:
 * - Storage read fails → Return true (show onboarding as safe default)
 * - Key doesn't exist → Return true (first launch)
 * - Key exists with value 'true' → Return false (skip onboarding)
 */
export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    const isFirst = value !== 'true';

    if (__DEV__) {
      console.log('[OnboardingService] isFirstLaunch check:', {
        storageValue: value,
        isFirst,
      });
    }

    return isFirst;
  } catch (error) {
    console.error('[OnboardingService] Failed to check first launch:', error);
    // On error, assume first launch to show onboarding (safe default)
    return true;
  }
};

/**
 * Mark onboarding as completed
 *
 * Saves completion flag to AsyncStorage.
 * After this, app will skip onboarding on subsequent launches.
 *
 * @throws Error if AsyncStorage write fails (caller should handle)
 *
 * Edge cases:
 * - Storage write fails → Throws error, caller should catch and handle
 * - Multiple calls → Idempotent, just overwrites with same value
 */
export const completeOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');

    if (__DEV__) {
      console.log('[OnboardingService] Onboarding marked as completed');
    }
  } catch (error) {
    console.error('[OnboardingService] Failed to save completion:', error);
    throw error; // Re-throw so caller can handle
  }
};

/**
 * Reset onboarding completion (for testing purposes only)
 *
 * Removes the completion flag from AsyncStorage.
 * Next app launch will show onboarding again.
 *
 * ⚠️ Should only be used in development for testing!
 *
 * @throws Error if AsyncStorage delete fails
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);

    if (__DEV__) {
      console.log('[OnboardingService] Onboarding reset - will show on next launch');
    }
  } catch (error) {
    console.error('[OnboardingService] Failed to reset onboarding:', error);
    throw error;
  }
};

/**
 * Get onboarding completion status (for debugging)
 *
 * @returns Promise<boolean> - true if completed, false otherwise
 */
export const getOnboardingStatus = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('[OnboardingService] Failed to get status:', error);
    return false;
  }
};
