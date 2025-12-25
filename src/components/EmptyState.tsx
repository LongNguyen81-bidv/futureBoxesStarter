/**
 * EmptyState Component
 *
 * Displays when there are no capsules on Home screen.
 * Shows an illustration, message, and CTA button.
 *
 * Features:
 * - Floating animation for illustration
 * - Clear messaging
 * - Call-to-action button
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
import { MaterialIcons } from '@expo/vector-icons';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface EmptyStateProps {
  onCreatePress: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreatePress }) => {
  // Float animation for the icon
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    return () => float.stop();
  }, [floatAnim]);

  return (
    <View style={styles.container}>
      {/* Floating illustration */}
      <Animated.View
        style={[
          styles.illustrationContainer,
          {
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <MaterialIcons name="inbox" size={80} color={UIColors.primary} />
        </View>
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>No capsules yet</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Create your first time capsule to send a message to your future self
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={onCreatePress}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={20} color={UIColors.textWhite} />
        <Text style={styles.ctaButtonText}>Create a Capsule</Text>
      </TouchableOpacity>
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
    ...Shadows.sm,
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
    backgroundColor: UIColors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  ctaButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
    marginLeft: Spacing.sm,
  },
});

export default EmptyState;
