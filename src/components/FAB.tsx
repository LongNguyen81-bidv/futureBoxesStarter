/**
 * FAB (Floating Action Button) Component
 *
 * Primary action button for creating new capsules.
 * Fixed position at bottom-right of screen.
 *
 * Features:
 * - Scale animation on press
 * - Shadow elevation
 * - Haptic feedback
 * - Ripple effect (Android)
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { UIColors } from '../constants/colors';
import { Spacing, BorderRadius, Shadows, TouchTarget } from '../constants/theme';

interface FABProps {
  onPress: () => void;
}

export const FAB: React.FC<FABProps> = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    // Trigger haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Scale down animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    // Scale up animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = () => {
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <MaterialIcons name="add" size={28} color={UIColors.textWhite} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    zIndex: 100,
  },
  button: {
    width: TouchTarget.large,
    height: TouchTarget.large,
    borderRadius: TouchTarget.large / 2,
    backgroundColor: UIColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.xl,
  },
});

export default FAB;
