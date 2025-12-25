/**
 * Type Selection Screen
 *
 * Allows users to select one of 4 capsule types:
 * - Emotion (Pink Heart)
 * - Goal (Green Flag)
 * - Memory (Orange Camera)
 * - Decision (Blue Balance)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, TouchTarget } from '../constants/theme';
import { TypeCard, CapsuleType } from '../components/TypeCard';

type NavigationProp = StackNavigationProp<RootStackParamList, 'TypeSelection'>;

// Capsule type configurations
const CAPSULE_TYPES = [
  {
    type: 'emotion' as CapsuleType,
    title: 'Emotion',
    description: 'Capture how you feel right now',
    icon: 'heart' as keyof typeof MaterialCommunityIcons.glyphMap,
  },
  {
    type: 'goal' as CapsuleType,
    title: 'Goal',
    description: 'Set a goal and check back later',
    icon: 'flag-checkered' as keyof typeof MaterialCommunityIcons.glyphMap,
  },
  {
    type: 'memory' as CapsuleType,
    title: 'Memory',
    description: 'Preserve a special moment',
    icon: 'camera' as keyof typeof MaterialCommunityIcons.glyphMap,
  },
  {
    type: 'decision' as CapsuleType,
    title: 'Decision',
    description: 'Record an important decision',
    icon: 'scale-balance' as keyof typeof MaterialCommunityIcons.glyphMap,
  },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TypeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedType, setSelectedType] = useState<CapsuleType | null>(null);

  // Animation for continue button
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(selectedType ? 1 : 0.5);

  React.useEffect(() => {
    buttonOpacity.value = withTiming(selectedType ? 1 : 0.5, { duration: 200 });
  }, [selectedType]);

  const handlePressIn = () => {
    if (selectedType) {
      buttonScale.value = withTiming(0.95, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (selectedType) {
      buttonScale.value = withTiming(1, { duration: 100 });
    }
  };

  const handleContinue = () => {
    if (!selectedType) return;

    try {
      // Navigate to Create Capsule Screen with selectedType param
      navigation.navigate('CreateCapsule', { type: selectedType });
    } catch (error) {
      console.error('Navigation error:', error);
      // In production, show user-friendly error message
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={UIColors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Type</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instruction Text */}
        <Text style={styles.instruction}>
          Choose what kind of time capsule you want to create
        </Text>

        {/* Type Cards */}
        <View style={styles.cardsContainer}>
          {CAPSULE_TYPES.map((item) => (
            <TypeCard
              key={item.type}
              type={item.type}
              title={item.title}
              description={item.description}
              icon={item.icon}
              isSelected={selectedType === item.type}
              onPress={() => setSelectedType(item.type)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <AnimatedTouchable
          style={[
            styles.continueButton,
            animatedButtonStyle,
            !selectedType && styles.continueButtonDisabled,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleContinue}
          disabled={!selectedType}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </AnimatedTouchable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UIColors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: UIColors.background,
    borderBottomWidth: 1,
    borderBottomColor: UIColors.borderLight,
  },
  backButton: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...Typography.h3,
    color: UIColors.textPrimary,
  },
  headerSpacer: {
    width: TouchTarget.min,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  instruction: {
    ...Typography.body,
    color: UIColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  cardsContainer: {
    width: '100%',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: UIColors.background,
    borderTopWidth: 1,
    borderTopColor: UIColors.borderLight,
  },
  continueButton: {
    backgroundColor: UIColors.primary,
    height: TouchTarget.default,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: UIColors.textDisabled,
  },
  continueButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
  },
});

export default TypeSelectionScreen;
