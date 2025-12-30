/**
 * Color Palette - FutureBoxes Design System
 *
 * Defines all colors used throughout the app including:
 * - Capsule type colors (Emotion, Goal, Memory, Decision)
 * - UI colors (primary, success, warning, danger)
 * - Text colors
 * - Background colors
 */

// Capsule Type Colors
export const CapsuleTypeColors = {
  emotion: {
    primary: '#E91E63', // Pink
    light: '#FCE4EC',
    gradient: ['#E91E63', '#F06292'], // Pink gradient
  },
  goal: {
    primary: '#4CAF50', // Green
    light: '#E8F5E9',
    gradient: ['#4CAF50', '#66BB6A'], // Green gradient
  },
  memory: {
    primary: '#FF9800', // Orange
    light: '#FFF3E0',
    gradient: ['#FF9800', '#FFB74D'], // Orange gradient
  },
  decision: {
    primary: '#2196F3', // Blue
    light: '#E3F2FD',
    gradient: ['#2196F3', '#42A5F5'], // Blue gradient
  },
} as const;

// UI Colors
export const UIColors = {
  // Primary brand color
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Status colors
  success: '#10B981', // Green
  successLight: '#D1FAE5',
  warning: '#F59E0B', // Orange
  warningLight: '#FEF3C7',
  danger: '#EF4444', // Red
  dangerLight: '#FEE2E2',
  error: '#EF4444', // Alias for danger
  errorLight: '#FEE2E2',

  // Text colors
  textPrimary: '#1F2937', // Dark gray
  textSecondary: '#6B7280', // Medium gray
  textTertiary: '#9CA3AF', // Light gray
  textWhite: '#FFFFFF',
  textDisabled: '#D1D5DB',

  // Background colors
  background: '#FFFFFF', // White
  surface: '#F9FAFB', // Very light gray
  surfaceElevated: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  overlayLight: 'rgba(0, 0, 0, 0.2)',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Status-specific backgrounds
  lockedBackground: '#F3F4F6',
  readyBackground: '#ECFDF5',

  // Transparency variants
  transparent: 'transparent',
} as const;

// Shadow colors (for Android elevation simulation)
export const ShadowColors = {
  light: 'rgba(0, 0, 0, 0.1)',
  medium: 'rgba(0, 0, 0, 0.15)',
  heavy: 'rgba(0, 0, 0, 0.25)',
} as const;

// Helper function to get capsule type color
export const getCapsuleColor = (type: 'emotion' | 'goal' | 'memory' | 'decision') => {
  return CapsuleTypeColors[type];
};

// Helper function to get reflection answer color
export const getReflectionColor = (answer: string | null) => {
  if (!answer) return UIColors.textSecondary;

  if (answer === 'yes') return UIColors.success;
  if (answer === 'no') return UIColors.danger;

  // For rating 1-5
  const rating = parseInt(answer, 10);
  if (rating >= 4) return UIColors.success;
  if (rating === 3) return UIColors.warning;
  if (rating <= 2) return UIColors.danger;

  return UIColors.textSecondary;
};

// Export all colors
export default {
  CapsuleTypeColors,
  UIColors,
  ShadowColors,
  getCapsuleColor,
  getReflectionColor,
};
