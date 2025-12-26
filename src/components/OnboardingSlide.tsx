/**
 * OnboardingSlide Component
 *
 * Reusable slide component for onboarding carousel.
 * Displays illustration, title, subtitle for each onboarding step.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { OnboardingIllustration } from './OnboardingIllustration';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface OnboardingSlideData {
  id: number;
  type: 'welcome' | 'create' | 'wait' | 'reflect';
  title: string;
  subtitle: string;
}

interface OnboardingSlideProps {
  data: OnboardingSlideData;
  isActive: boolean;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ data, isActive }) => {
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);

  useEffect(() => {
    if (isActive) {
      // Animate title
      titleOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      titleTranslateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      // Animate subtitle with delay
      subtitleOpacity.value = withDelay(
        100,
        withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        })
      );
      subtitleTranslateY.value = withDelay(
        100,
        withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        })
      );
    } else {
      // Reset animations
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      subtitleOpacity.value = 0;
      subtitleTranslateY.value = 20;
    }
  }, [isActive]);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  return (
    <View style={styles.slideContainer}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <OnboardingIllustration type={data.type} />
      </View>

      {/* Title */}
      <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
        <Text style={styles.title}>{data.title}</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustrationContainer: {
    marginBottom: Spacing['2xl'],
  },
  titleContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    color: Colors.ui.textPrimary,
    textAlign: 'center',
  },
  subtitleContainer: {
    paddingHorizontal: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.ui.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
