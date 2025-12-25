/**
 * StarRating Component
 *
 * Interactive 1-5 star rating for Decision reflection type.
 * Features:
 * - 5 star buttons
 * - Fill animation from left to right
 * - Tap star to select rating (fills all stars up to selected)
 * - Haptic feedback
 * - Labels: Bad - Neutral - Great
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/theme';

interface StarRatingProps {
  selectedRating: number | null; // 1-5 or null
  onSelectRating: (rating: number) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const StarRating: React.FC<StarRatingProps> = ({
  selectedRating,
  onSelectRating,
}) => {
  const scales = [
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
  ];

  const handleStarPress = (rating: number) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Bounce animation for selected star
    scales[rating - 1].value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    onSelectRating(rating);
  };

  const getStarColor = (starIndex: number) => {
    if (selectedRating === null) return UIColors.borderDark;
    if (starIndex < selectedRating) {
      // Color based on rating
      if (selectedRating >= 4) return '#FFD700'; // Gold
      if (selectedRating === 3) return UIColors.warning; // Orange
      return UIColors.danger; // Red
    }
    return UIColors.borderDark; // Unfilled
  };

  const getStarIcon = (starIndex: number) => {
    if (selectedRating !== null && starIndex < selectedRating) {
      return 'star'; // Filled
    }
    return 'star-outline'; // Outline
  };

  return (
    <View style={styles.container}>
      {/* Stars Row */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((rating, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scales[index].value }],
          }));

          return (
            <AnimatedTouchable
              key={rating}
              activeOpacity={0.7}
              onPress={() => handleStarPress(rating)}
              style={[animatedStyle, styles.starButton]}
            >
              <MaterialCommunityIcons
                name={getStarIcon(index)}
                size={48}
                color={getStarColor(index)}
              />
              <Text style={styles.ratingNumber}>{rating}</Text>
            </AnimatedTouchable>
          );
        })}
      </View>

      {/* Labels Row */}
      <View style={styles.labelsRow}>
        <Text style={[styles.label, { color: UIColors.danger }]}>Bad</Text>
        <Text style={[styles.label, { color: UIColors.warning }]}>Neutral</Text>
        <Text style={[styles.label, { color: UIColors.success }]}>Great</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.sm,
  },
  starButton: {
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.xs,
  },
  ratingNumber: {
    ...Typography.caption,
    color: UIColors.textSecondary,
    fontWeight: '600',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  label: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
});

export default StarRating;
