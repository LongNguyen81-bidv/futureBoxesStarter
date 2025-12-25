/**
 * CapsuleCard Component
 *
 * Displays a single capsule card in the Home screen grid.
 * Shows different styles for locked vs ready states.
 *
 * Features:
 * - Type-specific colors and icons
 * - Countdown timer display
 * - Locked/Ready state differentiation
 * - Tap animations (scale, pulse)
 * - Gradient backgrounds
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import type { Capsule } from '../types/capsule';
import { getCapsuleColor, UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

// Icon mapping for capsule types
const CAPSULE_TYPE_ICONS = {
  emotion: 'favorite' as const,
  goal: 'flag' as const,
  memory: 'photo-camera' as const,
  decision: 'balance' as const,
};

interface CapsuleCardProps {
  capsule: Capsule;
  onPress: (capsule: Capsule) => void;
  countdown?: string; // Formatted countdown string (e.g., "3d 5h 30m" or "Ready!")
}

export const CapsuleCard: React.FC<CapsuleCardProps> = ({
  capsule,
  onPress,
  countdown,
}) => {
  const isReady = capsule.status === 'ready';
  const typeColor = getCapsuleColor(capsule.type);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for ready capsules
  useEffect(() => {
    if (isReady) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    }
  }, [isReady, pulseAnim]);

  // Press animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress(capsule);
  };

  // Render lock icon for locked capsules
  const renderLockIcon = () => {
    if (isReady) return null;

    return (
      <View style={styles.lockIconContainer}>
        <MaterialIcons name="lock" size={16} color={UIColors.textSecondary} />
      </View>
    );
  };

  // Render ready badge
  const renderReadyBadge = () => {
    if (!isReady) return null;

    return (
      <View style={styles.readyBadge}>
        <Text style={styles.readyBadgeText}>Ready!</Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={isReady ? typeColor.gradient : [typeColor.light, typeColor.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            !isReady && styles.lockedGradient,
          ]}
        >
          {/* Type Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={CAPSULE_TYPE_ICONS[capsule.type]}
              size={32}
              color={isReady ? UIColors.textWhite : typeColor.primary}
              style={isReady && styles.iconGlow}
            />
          </View>

          {/* Lock Icon (locked state) */}
          {renderLockIcon()}

          {/* Ready Badge (ready state) */}
          {renderReadyBadge()}

          {/* Countdown Text */}
          <View style={styles.countdownContainer}>
            <Text
              style={[
                styles.countdownText,
                isReady ? styles.countdownTextReady : styles.countdownTextLocked,
              ]}
              numberOfLines={2}
            >
              {countdown || 'Loading...'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Spacing.xs,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    justifyContent: 'space-between',
    minHeight: 140,
    ...Shadows.md,
  },
  lockedGradient: {
    borderWidth: 1,
    borderColor: UIColors.border,
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  iconGlow: {
    // Glow effect for ready capsules (shadow)
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  lockIconContainer: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
  },
  readyBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: UIColors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  readyBadgeText: {
    ...Typography.caption,
    color: UIColors.textWhite,
    fontWeight: '600',
  },
  countdownContainer: {
    marginTop: Spacing.sm,
  },
  countdownText: {
    ...Typography.h3,
    fontWeight: '700',
  },
  countdownTextLocked: {
    color: UIColors.textPrimary,
  },
  countdownTextReady: {
    color: UIColors.textWhite,
  },
});

export default CapsuleCard;
