/**
 * OnboardingIllustration Component
 *
 * Animated illustrations for each onboarding slide.
 * Uses React Native Reanimated for smooth animations.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface OnboardingIllustrationProps {
  type: 'welcome' | 'create' | 'wait' | 'reflect';
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({ type }) => {
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    // Start looping animation
    animationProgress.value = withRepeat(
      withTiming(1, {
        duration: 2500,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1, // Infinite repeat
      false
    );
  }, []);

  const welcomeStyle = useAnimatedStyle(() => {
    // Floating animation: vertical movement + slight rotation
    const translateY = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, -15, 0]
    );
    const rotate = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 3, 0]
    );

    return {
      transform: [
        { translateY },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const createStyle = useAnimatedStyle(() => {
    // Writing animation: scale pulse + opacity
    const scale = interpolate(
      animationProgress.value,
      [0, 0.3, 0.6, 1],
      [1, 1.1, 1, 1]
    );

    return {
      transform: [{ scale }],
    };
  });

  const waitStyle = useAnimatedStyle(() => {
    // Lock animation: rotation + scale
    const rotate = interpolate(
      animationProgress.value,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      [0, -5, 5, -5, 5, 0]
    );
    const scale = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [1, 1.05, 1]
    );

    return {
      transform: [
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const reflectStyle = useAnimatedStyle(() => {
    // Opening animation: scale grow + opacity
    const scale = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0.95, 1.05, 0.95]
    );
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0.8, 1, 0.8]
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Render based on type
  switch (type) {
    case 'welcome':
      return (
        <View style={styles.container}>
          <Animated.View style={[styles.iconContainer, welcomeStyle]}>
            <View style={[styles.capsuleBox, { backgroundColor: Colors.ui.primary }]}>
              <Ionicons name="gift" size={80} color="#FFFFFF" />
            </View>
            {/* Glow effect */}
            <View style={[styles.glowCircle, { backgroundColor: `${Colors.ui.primary}20` }]} />
          </Animated.View>
        </View>
      );

    case 'create':
      return (
        <View style={styles.container}>
          <Animated.View style={[styles.iconContainer, createStyle]}>
            <View style={[styles.capsuleBox, { backgroundColor: Colors.capsuleTypes.memory.primary }]}>
              <Ionicons name="create" size={60} color="#FFFFFF" />
            </View>
            {/* Writing elements */}
            <View style={styles.createElements}>
              <Ionicons
                name="image"
                size={28}
                color={Colors.capsuleTypes.memory.primary}
                style={styles.floatingIcon1}
              />
              <Ionicons
                name="document-text"
                size={28}
                color={Colors.capsuleTypes.memory.primary}
                style={styles.floatingIcon2}
              />
            </View>
          </Animated.View>
        </View>
      );

    case 'wait':
      return (
        <View style={styles.container}>
          <Animated.View style={[styles.iconContainer, waitStyle]}>
            <View style={[styles.capsuleBox, { backgroundColor: Colors.ui.textSecondary }]}>
              <Ionicons name="lock-closed" size={70} color="#FFFFFF" />
            </View>
            {/* Timer elements */}
            <View style={styles.timerContainer}>
              <Ionicons
                name="time"
                size={32}
                color={Colors.ui.textSecondary}
                style={styles.timerIcon}
              />
            </View>
          </Animated.View>
        </View>
      );

    case 'reflect':
      return (
        <View style={styles.container}>
          <Animated.View style={[styles.iconContainer, reflectStyle]}>
            <View style={[styles.capsuleBox, { backgroundColor: Colors.ui.success }]}>
              <Ionicons name="gift-open" size={70} color="#FFFFFF" />
            </View>
            {/* Celebration sparkles */}
            <View style={styles.sparklesContainer}>
              {[0, 1, 2, 3, 4].map((index) => (
                <Ionicons
                  key={index}
                  name="sparkles"
                  size={20}
                  color={Colors.celebration.confetti[index]}
                  style={[
                    styles.sparkle,
                    {
                      top: `${20 + index * 15}%`,
                      left: `${15 + index * 15}%`,
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  capsuleBox: {
    width: 140,
    height: 140,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glowCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -20,
    zIndex: -1,
  },
  createElements: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  floatingIcon1: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: 30,
    left: 10,
  },
  timerContainer: {
    position: 'absolute',
    top: -30,
    right: -10,
  },
  timerIcon: {
    opacity: 0.7,
  },
  sparklesContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  sparkle: {
    position: 'absolute',
  },
});
