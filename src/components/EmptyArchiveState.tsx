/**
 * EmptyArchiveState Component
 *
 * Displays when there are no opened capsules in Archive.
 * Shows an illustration, message, and optional CTA button.
 *
 * Features:
 * - Floating animation for illustration
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
import { MaterialIcons } from '@expo/vector-icons';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface EmptyArchiveStateProps {
  onGoHome?: () => void;
}

export const EmptyArchiveState: React.FC<EmptyArchiveStateProps> = ({
  onGoHome,
}) => {
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
          <MaterialIcons
            name="inventory-2"
            size={80}
            color={UIColors.textTertiary}
          />
        </View>
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>No opened capsules yet</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        When you open a time capsule, it will appear here.
      </Text>

      {/* Optional CTA Button */}
      {onGoHome && (
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
