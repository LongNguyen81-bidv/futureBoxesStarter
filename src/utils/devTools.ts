/**
 * Development Tools
 *
 * Utilities for testing and debugging in development mode.
 * ⚠️ These functions only work when __DEV__ is true.
 *
 * Usage in Expo console or dev menu:
 * 1. Import the function you need
 * 2. Call it from the console
 * 3. Reload the app to see changes
 */

import { resetOnboarding, getOnboardingStatus } from '../services/onboardingService';

/**
 * Reset onboarding completion flag
 *
 * After calling this, restart the app to see onboarding again.
 *
 * Usage:
 * ```
 * import { DEV_resetOnboarding } from './src/utils/devTools';
 * await DEV_resetOnboarding();
 * ```
 */
export const DEV_resetOnboarding = async (): Promise<void> => {
  if (!__DEV__) {
    console.warn('[DevTools] This function only works in development mode');
    return;
  }

  try {
    await resetOnboarding();
    console.log('✅ [DevTools] Onboarding reset successfully');
    console.log('📱 Restart the app to see onboarding screen again');
  } catch (error) {
    console.error('❌ [DevTools] Failed to reset onboarding:', error);
  }
};

/**
 * Check onboarding completion status
 *
 * Logs current onboarding state to console.
 *
 * Usage:
 * ```
 * import { DEV_checkOnboardingStatus } from './src/utils/devTools';
 * await DEV_checkOnboardingStatus();
 * ```
 */
export const DEV_checkOnboardingStatus = async (): Promise<void> => {
  if (!__DEV__) {
    console.warn('[DevTools] This function only works in development mode');
    return;
  }

  try {
    const isCompleted = await getOnboardingStatus();
    console.log('📊 [DevTools] Onboarding Status:', {
      completed: isCompleted,
      nextLaunch: isCompleted ? 'Skip onboarding' : 'Show onboarding',
    });
  } catch (error) {
    console.error('❌ [DevTools] Failed to check status:', error);
  }
};

/**
 * Global dev tools object (attach to window in development)
 *
 * Makes dev tools accessible from browser console when running on web,
 * or from React DevTools when on mobile.
 *
 * Usage:
 * ```
 * // In browser console (web) or React DevTools (mobile)
 * window.devTools.resetOnboarding()
 * window.devTools.checkOnboardingStatus()
 * ```
 */
if (__DEV__) {
  // @ts-ignore - Intentionally adding to global scope for dev tools
  global.devTools = {
    resetOnboarding: DEV_resetOnboarding,
    checkOnboardingStatus: DEV_checkOnboardingStatus,
  };

  console.log('🛠️ [DevTools] Development tools loaded. Available commands:');
  console.log('  - global.devTools.resetOnboarding()');
  console.log('  - global.devTools.checkOnboardingStatus()');
}
