/**
 * Opening Animation Overlay Component
 * Displays the box opening animation when user opens a capsule
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, type CapsuleType } from '../constants/Colors';

interface OpeningAnimationOverlayProps {
  capsuleType: CapsuleType;
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export const OpeningAnimationOverlay: React.FC<OpeningAnimationOverlayProps> = ({
  capsuleType,
  onComplete,
}) => {
  // Animation shared values
  const boxScale = useSharedValue(0.8);
  const lidRotateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.5);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  const typeColor = Colors.capsuleTypes[capsuleType];

  useEffect(() => {
    // Animation sequence
    // 1. Box scale in (300ms)
    boxScale.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    // 2. Lid opens (500ms after delay)
    lidRotateY.value = withDelay(
      300,
      withTiming(-90, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      })
    );

    // 3. Glow appears (400ms, starts during lid opening)
    glowOpacity.value = withDelay(
      500,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      })
    );
    glowScale.value = withDelay(
      500,
      withTiming(1.5, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      })
    );

    // 4. Content reveal (400ms, after glow starts)
    contentOpacity.value = withDelay(
      900,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      })
    );
    contentTranslateY.value = withDelay(
      900,
      withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      }, (finished) => {
        if (finished) {
          // Animation complete, trigger callback
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  // Animated styles
  const boxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boxScale.value }],
  }));

  const lidAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${lidRotateY.value}deg` },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Box Container */}
      <Animated.View style={[styles.boxContainer, boxAnimatedStyle]}>
        {/* Box Body */}
        <View style={[styles.boxBody, { backgroundColor: typeColor.light }]}>
          <View style={[styles.boxBorder, { borderColor: typeColor.primary }]} />
        </View>

        {/* Box Lid */}
        <Animated.View style={[styles.lidContainer, lidAnimatedStyle]}>
          <View style={[styles.boxLid, { backgroundColor: typeColor.primary }]}>
            <View style={styles.lidDecoration} />
          </View>
        </Animated.View>

        {/* Glow Effect */}
        <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
          <LinearGradient
            colors={[typeColor.primary, 'transparent']}
            style={styles.glow}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>
      </Animated.View>

      {/* Reveal Text */}
      <Animated.View style={[styles.contentReveal, contentAnimatedStyle]}>
        <View style={[styles.sparkle, { backgroundColor: typeColor.primary }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  boxContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxBody: {
    width: 180,
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxBorder: {
    width: '90%',
    height: '90%',
    borderWidth: 3,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  lidContainer: {
    position: 'absolute',
    top: -10,
    width: 200,
    height: 40,
  },
  boxLid: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lidDecoration: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  glowContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
    opacity: 0.6,
  },
  contentReveal: {
    marginTop: 40,
    alignItems: 'center',
  },
  sparkle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
});
