/**
 * Design System - Color Palette
 * FutureBoxes Time Capsule App
 */

export const Colors = {
  // Capsule Type Colors
  capsuleTypes: {
    emotion: {
      primary: '#E91E63',
      light: '#FCE4EC',
      glow: 'rgba(233, 30, 99, 0.3)',
    },
    goal: {
      primary: '#4CAF50',
      light: '#E8F5E9',
      glow: 'rgba(76, 175, 80, 0.3)',
    },
    memory: {
      primary: '#FF9800',
      light: '#FFF3E0',
      glow: 'rgba(255, 152, 0, 0.3)',
    },
    decision: {
      primary: '#2196F3',
      light: '#E3F2FD',
      glow: 'rgba(33, 150, 243, 0.3)',
    },
  },

  // UI Colors
  ui: {
    primary: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    border: '#E5E7EB',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },

  // Animation Colors
  celebration: {
    confetti: ['#FFD700', '#2196F3', '#E91E63', '#4CAF50', '#FF9800', '#9C27B0'],
    warm: ['#FFA726', '#FFCA28', '#FFE082'],
    cool: ['#64B5F6', '#81C784', '#BA68C8'],
  },
} as const;

export type CapsuleType = keyof typeof Colors.capsuleTypes;
