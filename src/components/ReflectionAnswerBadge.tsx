/**
 * ReflectionAnswerBadge Component
 *
 * Displays the reflection answer for a capsule in Archive.
 * Supports Yes/No answers and Rating 1-5 with visual indicators.
 *
 * Features:
 * - Color-coded answers (Green for Yes/high rating, Red for No/low rating)
 * - Star visualization for ratings
 * - Icon indicators for Yes/No
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UIColors, getReflectionColor } from '../constants/colors';
import { Typography, Spacing } from '../constants/theme';

interface ReflectionAnswerBadgeProps {
  answer: string | null;
  type?: 'emotion' | 'goal' | 'memory' | 'decision';
}

export const ReflectionAnswerBadge: React.FC<ReflectionAnswerBadgeProps> = ({
  answer,
  type,
}) => {
  if (!answer) {
    return null;
  }

  const renderAnswer = () => {
    // Yes/No answers (Emotion, Goal)
    if (answer.toLowerCase() === 'yes') {
      return (
        <View style={[styles.badge, styles.badgeYes]}>
          <MaterialIcons name="check-circle" size={16} color={UIColors.success} />
          <Text style={[styles.badgeText, { color: UIColors.success }]}>Yes</Text>
        </View>
      );
    }

    if (answer.toLowerCase() === 'no') {
      return (
        <View style={[styles.badge, styles.badgeNo]}>
          <MaterialIcons name="cancel" size={16} color={UIColors.danger} />
          <Text style={[styles.badgeText, { color: UIColors.danger }]}>No</Text>
        </View>
      );
    }

    // Rating 1-5 (Decision)
    const rating = parseInt(answer, 10);
    if (!isNaN(rating) && rating >= 1 && rating <= 5) {
      const color = getReflectionColor(answer);
      return (
        <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons
                key={star}
                name={star <= rating ? 'star' : 'star-border'}
                size={14}
                color={color}
                style={styles.starIcon}
              />
            ))}
          </View>
          <Text style={[styles.badgeText, { color }]}>
            {rating}/5
          </Text>
        </View>
      );
    }

    // Fallback for unknown format
    return (
      <View style={[styles.badge, styles.badgeNeutral]}>
        <Text style={[styles.badgeText, { color: UIColors.textSecondary }]}>
          {answer}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Reflection:</Text>
      {renderAnswer()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    marginRight: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  badgeYes: {
    backgroundColor: UIColors.successLight,
  },
  badgeNo: {
    backgroundColor: UIColors.dangerLight,
  },
  badgeNeutral: {
    backgroundColor: UIColors.surface,
  },
  badgeText: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
});

export default ReflectionAnswerBadge;
