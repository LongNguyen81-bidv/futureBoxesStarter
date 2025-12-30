/**
 * Celebration Screen - Enhanced version with animations
 *
 * Features:
 * - Type-specific animations (Positive, Negative, Neutral, Memory)
 * - Auto-advance to Archive after 3 seconds
 * - Tap to skip functionality
 * - Answer summary card
 * - Smooth transitions
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { RootStackParamList } from '../navigation/AppNavigator';
import { CapsuleType } from '../types/capsule';
import { UIColors, getCapsuleColor } from '../constants/colors';
import {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  TouchTarget,
  AnimationDuration,
} from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Extend RootStackParamList for Celebration route
type ExtendedStackParamList = RootStackParamList & {
  Celebration: {
    capsuleId: string;
    type: CapsuleType;
    answer: string;
  };
};

type NavigationProp = StackNavigationProp<ExtendedStackParamList, 'Celebration'>;
type CelebrationRouteProp = RouteProp<ExtendedStackParamList, 'Celebration'>;

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * SCREEN_WIDTH - SCREEN_WIDTH / 2);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT, {
        duration: 2000 + Math.random() * 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: 1000 + Math.random() * 1000,
          easing: Easing.linear,
        }),
        -1
      )
    );

    opacity.value = withDelay(
      delay + 1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

// Heart pulse component (for encouraging/memory)
const HeartPulse: React.FC<{ color: string }> = ({ color }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
        withTiming(1, { duration: 500 })
      ),
      3
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.heartContainer, animatedStyle]}>
      <MaterialCommunityIcons name="heart" size={100} color={color} />
    </Animated.View>
  );
};

// Star sparkle component (for positive)
const StarSparkle: React.FC<{ delay: number; position: { x: number; y: number } }> = ({
  delay,
  position,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.5, { damping: 8 }),
        withTiming(0, { duration: 300 })
      )
    );

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 300 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: position.x,
          top: position.y,
        },
        animatedStyle,
      ]}
    >
      <MaterialCommunityIcons name="star-four-points" size={24} color="#FFD700" />
    </Animated.View>
  );
};

export const CelebrationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CelebrationRouteProp>();

  const { capsuleId, type, answer } = route.params;

  // Animation values
  const iconScale = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const countdown = useSharedValue(3);

  // Get type colors
  const typeColor = getCapsuleColor(type);

  // Animation config based on answer type
  const getAnimationConfig = () => {
    // Memory type
    if (type === 'memory' || answer === 'memory') {
      return {
        type: 'memory' as const,
        icon: 'heart-multiple' as const,
        message: 'Cảm ơn bạn đã lưu giữ kỷ niệm tuyệt vời này',
        color: '#FF9800',
        bgColor: '#FFF3E0',
      };
    }

    // Yes/No types (Emotion, Goal)
    if (answer === 'yes') {
      return {
        type: 'positive' as const,
        icon: 'check-circle' as const,
        message: 'Tuyệt vời! Hãy tiếp tục phát huy!',
        color: '#4CAF50',
        bgColor: '#E8F5E9',
      };
    }

    if (answer === 'no') {
      return {
        type: 'encouraging' as const,
        icon: 'heart' as const,
        message: 'Không sao. Mỗi trải nghiệm đều dạy chúng ta điều gì đó.',
        color: '#FF5722',
        bgColor: '#FFEBEE',
      };
    }

    // Rating (Decision)
    const rating = parseInt(answer, 10);
    if (rating >= 4) {
      return {
        type: 'positive' as const,
        icon: 'check-circle' as const,
        message: 'Quyết định tuyệt vời! Bạn đã chọn đúng.',
        color: '#4CAF50',
        bgColor: '#E8F5E9',
      };
    }

    if (rating === 3) {
      return {
        type: 'neutral' as const,
        icon: 'information' as const,
        message: 'Tất cả đều là một phần của hành trình.',
        color: '#2196F3',
        bgColor: '#E3F2FD',
      };
    }

    if (rating <= 2) {
      return {
        type: 'encouraging' as const,
        icon: 'heart' as const,
        message: 'Mỗi quyết định đều là cơ hội để học hỏi.',
        color: '#FF5722',
        bgColor: '#FFEBEE',
      };
    }

    // Fallback
    return {
      type: 'neutral' as const,
      icon: 'information' as const,
      message: 'Cảm ơn bạn đã suy ngẫm!',
      color: typeColor.primary,
      bgColor: typeColor.light,
    };
  };

  const config = getAnimationConfig();

  // Auto-navigate after 3 seconds
  const handleAutoNavigate = () => {
    navigation.navigate('Archive');
  };

  useEffect(() => {
    // Icon entrance animation
    iconScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    // Message fade in
    messageOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 500 })
    );

    // Card slide up
    cardTranslateY.value = withDelay(
      500,
      withSpring(0, { damping: 15 })
    );

    // Countdown timer
    const interval = setInterval(() => {
      countdown.value = countdown.value - 1;
      if (countdown.value <= 0) {
        clearInterval(interval);
        runOnJS(handleAutoNavigate)();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const messageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: messageOpacity.value,
  }));

  const handleSkip = () => {
    navigation.navigate('Archive');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <Pressable style={styles.container} onPress={handleSkip}>
      <SafeAreaView style={styles.safeArea}>
        {/* Background effects */}
        <View style={[styles.backgroundOverlay, { backgroundColor: config.bgColor }]} />

        {/* Confetti particles (for positive) */}
        {config.type === 'positive' && (
          <View style={styles.confettiContainer}>
            {Array.from({ length: 20 }).map((_, i) => (
              <ConfettiParticle
                key={i}
                delay={i * 100}
                color={
                  ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'][
                    Math.floor(Math.random() * 5)
                  ]
                }
              />
            ))}
          </View>
        )}

        {/* Star sparkles (for positive) */}
        {config.type === 'positive' && (
          <View style={styles.starsContainer}>
            {[
              { x: 50, y: 100 },
              { x: SCREEN_WIDTH - 80, y: 150 },
              { x: 100, y: SCREEN_HEIGHT / 2 },
              { x: SCREEN_WIDTH - 120, y: SCREEN_HEIGHT / 2 + 50 },
            ].map((position, i) => (
              <StarSparkle key={i} delay={i * 200} position={position} />
            ))}
          </View>
        )}

        {/* Heart pulse (for encouraging/memory) */}
        {(config.type === 'encouraging' || config.type === 'memory') && (
          <View style={styles.heartPulseContainer}>
            <HeartPulse color={config.color} />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: config.bgColor,
                borderColor: config.color,
              },
              iconAnimatedStyle,
            ]}
          >
            <MaterialCommunityIcons name={config.icon} size={80} color={config.color} />
          </Animated.View>

          {/* Title */}
          <Animated.Text style={[styles.title, messageAnimatedStyle]}>
            Đã lưu suy ngẫm!
          </Animated.Text>

          {/* Message */}
          <Animated.Text
            style={[styles.message, { color: config.color }, messageAnimatedStyle]}
          >
            {config.message}
          </Animated.Text>

          {/* Answer Summary (skip for memory type) */}
          {answer !== 'memory' && type !== 'memory' && (
            <Animated.View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: UIColors.surface,
                  borderColor: config.color,
                },
                cardAnimatedStyle,
              ]}
            >
              <Text style={styles.summaryLabel}>Câu trả lời của bạn:</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color: config.color,
                  },
                ]}
              >
                {answer === 'yes' || answer === 'no'
                  ? answer.toUpperCase()
                  : `${answer} / 5`}
              </Text>
            </Animated.View>
          )}

          {/* Countdown */}
          <Animated.Text style={[styles.countdown, messageAnimatedStyle]}>
            Tự động chuyển sau {Math.ceil(countdown.value)}s
          </Animated.Text>

          {/* Tap to skip hint */}
          <Animated.Text style={[styles.skipHint, messageAnimatedStyle]}>
            Chạm vào bất kỳ đâu để bỏ qua
          </Animated.Text>
        </View>

        {/* Action Buttons */}
        <Animated.View style={[styles.buttonsContainer, cardAnimatedStyle]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSkip}
            style={[
              styles.primaryButton,
              {
                backgroundColor: config.color,
              },
            ]}
          >
            <MaterialCommunityIcons name="archive" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Xem Lưu trữ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleGoHome}
            style={[
              styles.secondaryButton,
              {
                borderColor: config.color,
              },
            ]}
          >
            <MaterialCommunityIcons name="home" size={20} color={config.color} />
            <Text
              style={[
                styles.secondaryButtonText,
                {
                  color: config.color,
                },
              ]}
            >
              Về Trang chủ
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UIColors.background,
  },
  safeArea: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  confettiParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: 0,
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
  },
  heartPulseContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 3,
    left: SCREEN_WIDTH / 2 - 50,
    opacity: 0.15,
  },
  heartContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    zIndex: 1,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 3,
    ...Shadows.lg,
  },
  title: {
    ...Typography.h1,
    color: UIColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.h3,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 28,
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    minWidth: 200,
    borderWidth: 2,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  summaryLabel: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    ...Typography.h1,
    fontWeight: 'bold',
  },
  countdown: {
    ...Typography.body,
    color: UIColors.textSecondary,
    marginTop: Spacing.md,
  },
  skipHint: {
    ...Typography.caption,
    color: UIColors.textTertiary,
    marginTop: Spacing.sm,
  },
  buttonsContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    zIndex: 2,
  },
  primaryButton: {
    height: TouchTarget.large,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  primaryButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
  },
  secondaryButton: {
    height: TouchTarget.large,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: UIColors.surface,
    borderWidth: 2,
  },
  secondaryButtonText: {
    ...Typography.button,
  },
});

export default CelebrationScreen;
