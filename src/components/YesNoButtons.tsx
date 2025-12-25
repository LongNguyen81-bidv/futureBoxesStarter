/**
 * YesNoButtons Component
 *
 * Interactive Yes/No button pair for Emotion/Goal reflection types.
 * Features:
 * - Large touch targets (56dp minimum)
 * - Selected state with color fill
 * - Haptic feedback
 * - Scale animation on press
 * - Checkmark/X icons
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, TouchTarget } from '../constants/theme';

interface YesNoButtonsProps {
  selectedAnswer: 'yes' | 'no' | null;
  onSelectYes: () => void;
  onSelectNo: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const YesNoButtons: React.FC<YesNoButtonsProps> = ({
  selectedAnswer,
  onSelectYes,
  onSelectNo,
}) => {
  const yesScale = useSharedValue(1);
  const noScale = useSharedValue(1);

  const handleYesPressIn = () => {
    yesScale.value = withSpring(0.95, { damping: 15 });
  };

  const handleYesPressOut = () => {
    yesScale.value = withSpring(1, { damping: 15 });
  };

  const handleYesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectYes();
  };

  const handleNoPressIn = () => {
    noScale.value = withSpring(0.95, { damping: 15 });
  };

  const handleNoPressOut = () => {
    noScale.value = withSpring(1, { damping: 15 });
  };

  const handleNoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectNo();
  };

  // Animated styles
  const yesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: yesScale.value }],
  }));

  const noAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: noScale.value }],
  }));

  const isYesSelected = selectedAnswer === 'yes';
  const isNoSelected = selectedAnswer === 'no';

  return (
    <View style={styles.container}>
      {/* Yes Button */}
      <AnimatedTouchable
        activeOpacity={0.9}
        onPressIn={handleYesPressIn}
        onPressOut={handleYesPressOut}
        onPress={handleYesPress}
        style={[yesAnimatedStyle, styles.buttonWrapper]}
      >
        <View
          style={[
            styles.button,
            {
              backgroundColor: isYesSelected ? UIColors.success : UIColors.background,
              borderColor: isYesSelected ? UIColors.success : UIColors.border,
              borderWidth: isYesSelected ? 2 : 1,
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isYesSelected
                  ? 'rgba(255, 255, 255, 0.2)'
                  : UIColors.successLight,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isYesSelected ? 'check-circle' : 'emoticon-happy-outline'}
              size={32}
              color={isYesSelected ? UIColors.textWhite : UIColors.success}
            />
          </View>

          {/* Text */}
          <Text
            style={[
              styles.buttonText,
              { color: isYesSelected ? UIColors.textWhite : UIColors.success },
            ]}
          >
            YES
          </Text>

          {/* Checkmark indicator */}
          {isYesSelected && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check" size={16} color={UIColors.textWhite} />
            </View>
          )}
        </View>
      </AnimatedTouchable>

      {/* No Button */}
      <AnimatedTouchable
        activeOpacity={0.9}
        onPressIn={handleNoPressIn}
        onPressOut={handleNoPressOut}
        onPress={handleNoPress}
        style={[noAnimatedStyle, styles.buttonWrapper]}
      >
        <View
          style={[
            styles.button,
            {
              backgroundColor: isNoSelected ? UIColors.danger : UIColors.background,
              borderColor: isNoSelected ? UIColors.danger : UIColors.border,
              borderWidth: isNoSelected ? 2 : 1,
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isNoSelected
                  ? 'rgba(255, 255, 255, 0.2)'
                  : UIColors.dangerLight,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isNoSelected ? 'close-circle' : 'emoticon-sad-outline'}
              size={32}
              color={isNoSelected ? UIColors.textWhite : UIColors.danger}
            />
          </View>

          {/* Text */}
          <Text
            style={[
              styles.buttonText,
              { color: isNoSelected ? UIColors.textWhite : UIColors.danger },
            ]}
          >
            NO
          </Text>

          {/* Checkmark indicator */}
          {isNoSelected && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check" size={16} color={UIColors.textWhite} />
            </View>
          )}
        </View>
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    minHeight: TouchTarget.large,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.button,
    letterSpacing: 1,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YesNoButtons;
