/**
 * EmptyArchiveState Component
 *
 * Displays when there are no opened capsules in Archive.
 * Shows an illustration, message, and optional CTA button.
 *
 * Features:
 * - Floating animation for illustration
 * - Entry animations (staggered fade-in)
 * - Clear messaging
 * - Optional call-to-action button to navigate Home
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface EmptyArchiveStateProps {
  onGoHome?: () => void;
}

export const EmptyArchiveState: React.FC<EmptyArchiveStateProps> = ({
  onGoHome,
}) => {
  // Float animation for the icon (legacy Animated for continuous loop)
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Entry animations (Reanimated for staggered fade-in)
  const illustrationOpacity = useSharedValue(0);
  const illustrationScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaScale = useSharedValue(0.9);

  useEffect(() => {
    // Float animation (continuous loop)
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    float.start();

    // Entry animations (staggered)
    illustrationOpacity.value = withTiming(1, { duration: 400 });
    illustrationScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    ctaOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
    ctaScale.value = withDelay(
      300,
      withSpring(1, {
        damping: 10,
        stiffness: 100,
      })
    );

    return () => float.stop();
  }, [floatAnim]);

  // Animated styles for entry animations
  const illustrationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: illustrationOpacity.value,
    transform: [{ scale: illustrationScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ scale: ctaScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Floating illustration with entry animation */}
      <Reanimated.View style={illustrationAnimatedStyle}>
        <Animated.View
          style={[
            styles.illustrationContainer,
            {
              transform: [{ translateY: floatAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <MaterialIcons
              name="inventory-2"
              size={80}
              color={UIColors.textTertiary}
            />
          </View>
        </Animated.View>
      </Reanimated.View>

      {/* Title with entry animation */}
      <Reanimated.Text style={[styles.title, titleAnimatedStyle]}>
        No opened capsules yet
      </Reanimated.Text>

      {/* Subtitle with entry animation */}
      <Reanimated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
        When you open a time capsule, it will appear here for you to revisit.
      </Reanimated.Text>

      {/* Optional CTA Button with entry animation */}
      {onGoHome && (
        <Reanimated.View style={ctaAnimatedStyle}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={onGoHome}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="home"
              size={20}
              color={UIColors.textSecondary}
            />
            <Text style={styles.ctaButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </Reanimated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustrationContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: UIColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: UIColors.border,
    borderStyle: 'dashed',
  },
  title: {
    ...Typography.h2,
    color: UIColors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: UIColors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    maxWidth: 280,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UIColors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: UIColors.border,
  },
  ctaButtonText: {
    ...Typography.button,
    color: UIColors.textSecondary,
    marginLeft: Spacing.sm,
  },
});

export default EmptyArchiveState;
