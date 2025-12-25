/**
 * Theme Configuration - FutureBoxes Design System
 *
 * Defines:
 * - Typography scale (font sizes, weights, line heights)
 * - Spacing system (8pt grid)
 * - Border radius values
 * - Shadow/elevation styles
 * - Animation durations
 */

import { Platform } from 'react-native';

// Typography Scale
export const Typography = {
  // Display styles
  h1: {
    fontSize: 32,
    fontWeight: '700' as const, // Bold
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const, // Semibold
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const, // Semibold
    lineHeight: 28,
  },

  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const, // Regular
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const, // Regular
    lineHeight: 20,
  },

  // Caption and labels
  caption: {
    fontSize: 12,
    fontWeight: '400' as const, // Regular
    lineHeight: 16,
  },

  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600' as const, // Semibold
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const, // Semibold
    lineHeight: 20,
  },
} as const;

// Spacing System (8pt grid)
export const Spacing = {
  xs: 4,   // 4px - Tight spacing
  sm: 8,   // 8px - Component padding
  md: 16,  // 16px - Default padding
  lg: 24,  // 24px - Section spacing
  xl: 32,  // 32px - Screen padding
  '2xl': 48, // 48px - Large gaps
  '3xl': 64, // 64px - Extra large gaps
} as const;

// Border Radius
export const BorderRadius = {
  none: 0,
  sm: 4,   // Small elements
  md: 8,   // Default cards
  lg: 12,  // Large cards
  xl: 16,  // Modals
  '2xl': 24, // Special cases
  full: 9999, // Circular (pills, FAB)
} as const;

// Shadows (iOS style elevation)
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// Animation Durations (in milliseconds)
export const AnimationDuration = {
  micro: 100,      // Quick taps, micro-interactions
  short: 200,      // Transitions, fades
  medium: 300,     // Modals, screens
  long: 500,       // Complex animations
  celebration: 2500, // Celebration effects
} as const;

// Animation Easing
export const AnimationEasing = {
  easeOut: 'ease-out' as const,
  easeIn: 'ease-in' as const,
  easeInOut: 'ease-in-out' as const,
  linear: 'linear' as const,
} as const;

// Touch Target Sizes
export const TouchTarget = {
  min: 44,        // Minimum touch target (iOS HIG)
  default: 48,    // Default button height
  large: 56,      // Large buttons
} as const;

// Grid System
export const Grid = {
  columns: 3,     // Home screen grid columns
  gutter: Spacing.md,  // Space between grid items
} as const;

// Platform-specific adjustments
export const Platform = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
} as const;

// Export all theme values
export default {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  AnimationDuration,
  AnimationEasing,
  TouchTarget,
  Grid,
  Platform,
};
