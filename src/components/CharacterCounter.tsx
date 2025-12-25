/**
 * CharacterCounter Component
 *
 * Displays character count with visual feedback when approaching limit
 * Changes color to warning when nearing max characters
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { UIColors } from '../constants/colors';
import { Typography } from '../constants/theme';

interface CharacterCounterProps {
  currentLength: number;
  maxLength: number;
  warningThreshold?: number; // Show warning color at this threshold
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  currentLength,
  maxLength,
  warningThreshold = 0.95, // Default 95% of max
}) => {
  const isWarning = currentLength >= maxLength * warningThreshold;
  const isExceeded = currentLength > maxLength;

  const getTextColor = () => {
    if (isExceeded) return UIColors.danger;
    if (isWarning) return UIColors.warning;
    return UIColors.textSecondary;
  };

  return (
    <Text style={[styles.counter, { color: getTextColor() }]}>
      {currentLength}/{maxLength}
    </Text>
  );
};

const styles = StyleSheet.create({
  counter: {
    ...Typography.caption,
    textAlign: 'right',
  },
});

export default CharacterCounter;
