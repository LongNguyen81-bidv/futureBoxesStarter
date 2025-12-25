/**
 * Reflection Response Screen (F9)
 *
 * Screen cho phép user trả lời câu hỏi reflection sau khi mở capsule.
 *
 * Reflection Types:
 * - Emotion/Goal: Yes/No buttons
 * - Decision: Star rating 1-5
 *
 * Flow:
 * 1. Display capsule type badge
 * 2. Display reflection question
 * 3. Show appropriate answer UI (Yes/No or Stars)
 * 4. Enable Continue button after selection
 * 5. Save answer + update status + navigate to Celebration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/AppNavigator';
import { CapsuleType } from '../types/capsule';
import { YesNoButtons } from '../components/YesNoButtons';
import { StarRating } from '../components/StarRating';
import { UIColors, getCapsuleColor } from '../constants/colors';
import {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  TouchTarget,
  AnimationDuration,
} from '../constants/theme';
import { updateReflectionAnswer } from '../services/databaseService';

// Define navigation params (will be added to AppNavigator later)
type ReflectionScreenParams = {
  capsuleId: string;
  type: CapsuleType;
  reflectionQuestion: string;
};

// Temporary extension of RootStackParamList for development
type ExtendedStackParamList = RootStackParamList & {
  Reflection: ReflectionScreenParams;
  Celebration: {
    capsuleId: string;
    type: CapsuleType;
    answer: string;
  };
};

type NavigationProp = StackNavigationProp<ExtendedStackParamList, 'Reflection'>;
type ReflectionRouteProp = RouteProp<ExtendedStackParamList, 'Reflection'>;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ReflectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReflectionRouteProp>();

  const { capsuleId, type, reflectionQuestion } = route.params;

  // State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const continueOpacity = useSharedValue(0.5);
  const continueScale = useSharedValue(1);

  // Get type colors
  const typeColor = getCapsuleColor(type);

  // Get icon for type
  const getTypeIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (type) {
      case 'emotion':
        return 'heart';
      case 'goal':
        return 'flag-checkered';
      case 'decision':
        return 'scale-balance';
      default:
        return 'help-circle';
    }
  };

  // Determine if type needs Yes/No or Rating
  const isYesNoType = type === 'emotion' || type === 'goal';

  // Handle answer selection
  const handleSelectYes = () => {
    setSelectedAnswer('yes');
    enableContinueButton();
  };

  const handleSelectNo = () => {
    setSelectedAnswer('no');
    enableContinueButton();
  };

  const handleSelectRating = (rating: number) => {
    setSelectedAnswer(rating.toString());
    enableContinueButton();
  };

  const enableContinueButton = () => {
    continueOpacity.value = withTiming(1, { duration: AnimationDuration.short });
  };

  // Continue button press
  const handleContinue = async () => {
    if (!selectedAnswer || loading) return;

    try {
      setLoading(true);
      setError(null);

      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Scale animation
      continueScale.value = withTiming(0.95, { duration: 100 }, () => {
        continueScale.value = withTiming(1, { duration: 100 });
      });

      // Save reflection answer to database
      await updateReflectionAnswer(capsuleId, selectedAnswer);

      console.log('[ReflectionScreen] Answer saved successfully:', selectedAnswer);

      // Navigate to Celebration screen (F10)
      // @ts-ignore - Celebration screen will be created
      navigation.navigate('Celebration', {
        capsuleId,
        type,
        answer: selectedAnswer,
      });
    } catch (err: any) {
      console.error('[ReflectionScreen] Failed to save answer:', err);
      setError(err.message || 'Failed to save reflection');

      // Show error alert with retry option
      Alert.alert(
        'Error',
        err.message || 'Failed to save your answer. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => handleContinue(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Back button handler
  const handleBack = () => {
    if (selectedAnswer) {
      Alert.alert(
        'Discard answer?',
        'You have selected an answer. Are you sure you want to go back?',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Animated styles
  const continueAnimatedStyle = useAnimatedStyle(() => ({
    opacity: continueOpacity.value,
    transform: [{ scale: continueScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={UIColors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reflect</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: typeColor.light,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getTypeIcon()}
            size={64}
            color={typeColor.primary}
          />
        </View>

        {/* Question Section */}
        <View style={styles.questionSection}>
          <Text style={styles.questionLabel}>Your question:</Text>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>"{reflectionQuestion}"</Text>
          </View>
        </View>

        {/* Instruction */}
        <Text style={styles.instruction}>
          {isYesNoType ? 'How do you answer?' : 'Rate your decision:'}
        </Text>

        {/* Answer UI */}
        <View style={styles.answerSection}>
          {isYesNoType ? (
            <YesNoButtons
              selectedAnswer={selectedAnswer as 'yes' | 'no' | null}
              onSelectYes={handleSelectYes}
              onSelectNo={handleSelectNo}
            />
          ) : (
            <StarRating
              selectedRating={selectedAnswer ? parseInt(selectedAnswer, 10) : null}
              onSelectRating={handleSelectRating}
            />
          )}
        </View>

        {/* Spacer for bottom button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <AnimatedTouchable
          activeOpacity={0.9}
          onPress={handleContinue}
          disabled={!selectedAnswer || loading}
          style={[continueAnimatedStyle]}
        >
          <View
            style={[
              styles.continueButton,
              {
                backgroundColor:
                  selectedAnswer && !loading
                    ? typeColor.primary
                    : UIColors.borderDark,
              },
            ]}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.continueButtonText}>Saving...</Text>
              </>
            ) : (
              <>
                <Text style={styles.continueButtonText}>Continue</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
              </>
            )}
          </View>
        </AnimatedTouchable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UIColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: UIColors.borderLight,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: UIColors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  questionSection: {
    marginBottom: Spacing.xl,
  },
  questionLabel: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  questionCard: {
    backgroundColor: UIColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: UIColors.primary,
    ...Shadows.sm,
  },
  questionText: {
    ...Typography.h3,
    color: UIColors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 32,
  },
  instruction: {
    ...Typography.h3,
    color: UIColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  answerSection: {
    width: '100%',
    alignItems: 'center',
  },
  bottomSpacer: {
    height: Spacing['2xl'],
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: UIColors.background,
    borderTopWidth: 1,
    borderTopColor: UIColors.borderLight,
  },
  continueButton: {
    height: TouchTarget.large,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  continueButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
  },
});

export default ReflectionScreen;
