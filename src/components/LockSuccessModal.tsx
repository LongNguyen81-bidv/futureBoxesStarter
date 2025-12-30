/**
 * Lock Success Modal
 *
 * Animated modal shown after capsule lock confirmation
 * Features:
 * - Box closing animation
 * - Lock icon appear with rotation
 * - Type-specific color accents
 * - Success message with unlock date
 * - Auto-dismiss or tap to skip
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { getCapsuleColor, UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, AnimationDuration } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface LockSuccessModalProps {
  visible: boolean;
  capsuleType: 'emotion' | 'goal' | 'memory' | 'decision';
  unlockDate: Date;
  onDismiss: () => void;
}

export const LockSuccessModal: React.FC<LockSuccessModalProps> = ({
  visible,
  capsuleType,
  unlockDate,
  onDismiss,
}) => {
  // Animation shared values
  const boxScale = useSharedValue(1);
  const boxOpacity = useSharedValue(1);
  const lockScale = useSharedValue(0);
  const lockRotation = useSharedValue(0);
  const lockOpacity = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const messageTranslateY = useSharedValue(20);

  const typeColor = getCapsuleColor(capsuleType);

  useEffect(() => {
    if (visible) {
      // Reset all values
      boxScale.value = 1;
      boxOpacity.value = 1;
      lockScale.value = 0;
      lockRotation.value = 0;
      lockOpacity.value = 0;
      messageOpacity.value = 0;
      messageTranslateY.value = 20;

      // Start animation sequence
      startAnimation();

      // Auto-dismiss after 3 seconds
      const timeout = setTimeout(() => {
        handleDismiss();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const startAnimation = () => {
    // Haptic feedback at start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 1. Box closing animation (scale down + fade)
    boxScale.value = withSpring(0.7, {
      damping: 15,
      stiffness: 100,
    });

    boxOpacity.value = withTiming(0.3, {
      duration: 500,
    });

    // 2. Lock icon appear (after box closes)
    lockScale.value = withDelay(
      400,
      withSequence(
        withSpring(1.2, {
          damping: 8,
          stiffness: 150,
        }),
        withSpring(1, {
          damping: 10,
          stiffness: 100,
        })
      )
    );

    lockRotation.value = withDelay(
      400,
      withTiming(360, {
        duration: 600,
      })
    );

    lockOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 300,
      })
    );

    // 3. Success message fade in (after lock appears)
    messageOpacity.value = withDelay(
      900,
      withTiming(1, {
        duration: 400,
      })
    );

    messageTranslateY.value = withDelay(
      900,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );

    // Success haptic at animation complete
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1200);
  };

  const handleDismiss = () => {
    // Haptic feedback on dismiss
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  };

  // Animated styles
  const boxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boxScale.value }],
    opacity: boxOpacity.value,
  }));

  const lockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: lockScale.value },
      { rotate: `${lockRotation.value}deg` },
    ],
    opacity: lockOpacity.value,
  }));

  const messageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ translateY: messageTranslateY.value }],
  }));

  if (!visible) return null;

  const typeLabel = capsuleType.charAt(0).toUpperCase() + capsuleType.slice(1);
  const formattedDate = format(unlockDate, 'EEEE, MMMM dd, yyyy');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <View style={styles.container}>
          {/* Box icon (closing animation) */}
          <Animated.View style={[styles.boxContainer, boxAnimatedStyle]}>
            <View
              style={[
                styles.box,
                {
                  backgroundColor: typeColor.light,
                  borderColor: typeColor.primary,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={
                  capsuleType === 'emotion'
                    ? 'heart'
                    : capsuleType === 'goal'
                    ? 'flag-checkered'
                    : capsuleType === 'memory'
                    ? 'camera'
                    : 'scale-balance'
                }
                size={64}
                color={typeColor.primary}
              />
            </View>
          </Animated.View>

          {/* Lock icon (appearing animation) */}
          <Animated.View style={[styles.lockContainer, lockAnimatedStyle]}>
            <View
              style={[
                styles.lockCircle,
                { backgroundColor: typeColor.primary },
              ]}
            >
              <MaterialCommunityIcons
                name="lock"
                size={48}
                color={UIColors.textWhite}
              />
            </View>

            {/* Glow effect */}
            <View
              style={[
                styles.glowOuter,
                { backgroundColor: typeColor.primary, opacity: 0.2 },
              ]}
            />
            <View
              style={[
                styles.glowInner,
                { backgroundColor: typeColor.primary, opacity: 0.3 },
              ]}
            />
          </Animated.View>

          {/* Success message */}
          <Animated.View style={[styles.messageContainer, messageAnimatedStyle]}>
            <Text style={styles.title}>Viên nang đã được khóa!</Text>
            <Text style={styles.subtitle}>Hẹn gặp lại vào</Text>
            <Text style={[styles.date, { color: typeColor.primary }]}>
              {formattedDate}
            </Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                Viên nang {typeLabel}
              </Text>
            </View>
          </Animated.View>

          {/* Tap hint */}
          <Animated.View style={[styles.hintContainer, messageAnimatedStyle]}>
            <Text style={styles.hintText}>Chạm vào bất kỳ đâu để tiếp tục</Text>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: UIColors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  boxContainer: {
    marginBottom: Spacing.lg,
  },
  box: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    position: 'absolute',
    top: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glowOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    zIndex: -1,
  },
  glowInner: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    zIndex: -1,
  },
  messageContainer: {
    marginTop: 80,
    alignItems: 'center',
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
    marginBottom: Spacing.xs,
  },
  date: {
    ...Typography.h3,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  typeBadge: {
    backgroundColor: UIColors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  typeBadgeText: {
    ...Typography.caption,
    color: UIColors.textSecondary,
    fontWeight: '600',
  },
  hintContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
  },
  hintText: {
    ...Typography.caption,
    color: UIColors.textTertiary,
    textAlign: 'center',
  },
});

export default LockSuccessModal;
