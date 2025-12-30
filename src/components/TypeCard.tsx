/**
 * TypeCard Component
 *
 * Reusable card component for capsule type selection.
 * Displays icon, title, description and handles selection state.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CapsuleTypeColors, UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows, TouchTarget } from '../constants/theme';

export type CapsuleType = 'emotion' | 'goal' | 'memory' | 'decision';

interface TypeCardProps {
  type: CapsuleType;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TypeCard: React.FC<TypeCardProps> = ({
  type,
  title,
  description,
  icon,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const typeColor = CapsuleTypeColors[type];

  // Animation for card press
  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Animated style for scale
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animated style for selected state
  const selectedScale = useSharedValue(isSelected ? 1.02 : 1);

  React.useEffect(() => {
    selectedScale.value = withTiming(isSelected ? 1.02 : 1, { duration: 200 });
  }, [isSelected]);

  const selectedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectedScale.value }],
  }));

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedCardStyle, selectedAnimatedStyle]}
      testID="type-card"
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isSelected ? typeColor.light : UIColors.background,
            borderColor: isSelected ? typeColor.primary : UIColors.border,
            borderWidth: isSelected ? 3 : 1,
          },
        ]}
      >
        {/* Icon and Title Row */}
        <View style={styles.headerRow}>
          <View style={[styles.iconContainer, { backgroundColor: typeColor.light }]}>
            <MaterialCommunityIcons
              name={icon}
              size={32}
              color={typeColor.primary}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: typeColor.primary }]}>{title}</Text>
          </View>
          {/* Checkmark for selected state */}
          {isSelected && (
            <View style={[styles.checkmarkContainer, { backgroundColor: typeColor.primary }]}>
              <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description}>{description}</Text>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: TouchTarget.large + Spacing.md * 2,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    ...Typography.h3,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    marginLeft: 48 + Spacing.md, // Align with title
  },
});

export default TypeCard;
