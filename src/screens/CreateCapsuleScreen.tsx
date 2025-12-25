/**
 * Create Capsule Screen
 *
 * Full implementation of capsule creation form with:
 * - Text content input (max 2000 chars)
 * - Image picker (max 3 images)
 * - Reflection question (type-specific)
 * - Date/time selector with presets
 * - Form validation and preview navigation
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
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
import { RootStackParamList } from '../navigation/AppNavigator';
import { CapsuleTypeColors, UIColors, getCapsuleColor } from '../constants/colors';
import { Typography, Spacing, BorderRadius, TouchTarget, Shadows } from '../constants/theme';
import { CharacterCounter } from '../components/CharacterCounter';
import { ImagePickerSection } from '../components/ImagePickerSection';
import { DateSelector } from '../components/DateSelector';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CreateCapsule'>;
type CreateCapsuleRouteProp = RouteProp<RootStackParamList, 'CreateCapsule'>;

const MAX_CONTENT_LENGTH = 2000;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Type-specific configurations
const TYPE_CONFIG = {
  emotion: {
    title: 'Emotion',
    icon: 'heart' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'What are you feeling right now? Express your emotions...',
    reflectionPlaceholder: 'e.g., Did this feeling pass?',
    hasReflection: true,
  },
  goal: {
    title: 'Goal',
    icon: 'flag-checkered' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'What goal do you want to achieve? Describe it in detail...',
    reflectionPlaceholder: 'e.g., Did you achieve this goal?',
    hasReflection: true,
  },
  memory: {
    title: 'Memory',
    icon: 'camera' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'Describe this special moment you want to remember...',
    reflectionPlaceholder: '',
    hasReflection: false,
  },
  decision: {
    title: 'Decision',
    icon: 'scale-balance' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'What important decision did you make? Why?',
    reflectionPlaceholder: 'e.g., How do you feel about this decision now?',
    hasReflection: true,
  },
} as const;

export const CreateCapsuleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CreateCapsuleRouteProp>();
  const { type } = route.params;

  const typeConfig = TYPE_CONFIG[type];
  const typeColor = getCapsuleColor(type);

  // Form state
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [reflectionQuestion, setReflectionQuestion] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date | null>(null);

  // Refs
  const contentInputRef = useRef<TextInput>(null);
  const reflectionInputRef = useRef<TextInput>(null);

  // Animation values
  const previewButtonScale = useSharedValue(1);
  const previewButtonOpacity = useSharedValue(0.5);

  // Form validation
  const isFormValid = () => {
    const hasContent = content.trim().length > 0 && content.length <= MAX_CONTENT_LENGTH;
    const hasReflection = !typeConfig.hasReflection || reflectionQuestion.trim().length > 0;
    const hasDate = unlockDate !== null;

    return hasContent && hasReflection && hasDate;
  };

  React.useEffect(() => {
    previewButtonOpacity.value = withTiming(isFormValid() ? 1 : 0.5, { duration: 200 });
  }, [content, reflectionQuestion, unlockDate, isFormValid]);

  const handleBack = () => {
    // Check if form has data
    const hasData =
      content.trim().length > 0 ||
      images.length > 0 ||
      reflectionQuestion.trim().length > 0 ||
      unlockDate !== null;

    if (hasData) {
      Alert.alert('Discard changes?', 'Your capsule draft will be lost.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const handlePreviewPress = () => {
    if (!isFormValid()) {
      // Show specific error message
      if (content.trim().length === 0) {
        Alert.alert('Content required', 'Please enter your message.');
      } else if (content.length > MAX_CONTENT_LENGTH) {
        Alert.alert('Content too long', `Maximum ${MAX_CONTENT_LENGTH} characters allowed.`);
      } else if (typeConfig.hasReflection && reflectionQuestion.trim().length === 0) {
        Alert.alert('Reflection required', 'Please enter a question for your future self.');
      } else if (!unlockDate) {
        Alert.alert('Date required', 'Please select when to open this capsule.');
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Navigate to Preview screen with form data
    navigation.navigate('PreviewCapsule', {
      type,
      content,
      images,
      reflectionQuestion: typeConfig.hasReflection ? reflectionQuestion : null,
      unlockAt: unlockDate!,
    });
  };

  const handlePreviewPressIn = () => {
    if (isFormValid()) {
      previewButtonScale.value = withTiming(0.95, { duration: 100 });
    }
  };

  const handlePreviewPressOut = () => {
    if (isFormValid()) {
      previewButtonScale.value = withTiming(1, { duration: 100 });
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: previewButtonScale.value }],
    opacity: previewButtonOpacity.value,
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
        <Text style={styles.headerTitle}>Create {typeConfig.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: typeColor.light }]}>
            <MaterialCommunityIcons
              name={typeConfig.icon}
              size={20}
              color={typeColor.primary}
            />
            <Text style={[styles.typeBadgeText, { color: typeColor.primary }]}>
              {typeConfig.title} Capsule
            </Text>
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>What's on your mind?</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={contentInputRef}
                style={styles.contentInput}
                placeholder={typeConfig.contentPlaceholder}
                placeholderTextColor={UIColors.textTertiary}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                maxLength={MAX_CONTENT_LENGTH}
              />
            </View>
            <View style={styles.counterContainer}>
              <CharacterCounter
                currentLength={content.length}
                maxLength={MAX_CONTENT_LENGTH}
                warningThreshold={0.95}
              />
            </View>
          </View>

          {/* Image Picker */}
          <ImagePickerSection images={images} onImagesChange={setImages} maxImages={3} />

          {/* Reflection Question (conditional) */}
          {typeConfig.hasReflection && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Question for future you</Text>
              <TextInput
                ref={reflectionInputRef}
                style={styles.reflectionInput}
                placeholder={typeConfig.reflectionPlaceholder}
                placeholderTextColor={UIColors.textTertiary}
                value={reflectionQuestion}
                onChangeText={setReflectionQuestion}
                returnKeyType="done"
              />
            </View>
          )}

          {/* Date Selector */}
          <DateSelector selectedDate={unlockDate} onDateChange={setUnlockDate} />
        </ScrollView>

        {/* Preview Button */}
        <View style={styles.footer}>
          <AnimatedTouchable
            style={[
              styles.previewButton,
              animatedButtonStyle,
              !isFormValid() && styles.previewButtonDisabled,
            ]}
            onPressIn={handlePreviewPressIn}
            onPressOut={handlePreviewPressOut}
            onPress={handlePreviewPress}
            disabled={!isFormValid()}
            activeOpacity={0.9}
          >
            <Text style={styles.previewButtonText}>Preview Capsule</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={UIColors.textWhite}
            />
          </AnimatedTouchable>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  typeBadgeText: {
    ...Typography.buttonSmall,
    marginLeft: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.body,
    color: UIColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  textInputContainer: {
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: UIColors.border,
    minHeight: 120,
    ...Shadows.sm,
  },
  contentInput: {
    ...Typography.body,
    color: UIColors.textPrimary,
    padding: Spacing.md,
    minHeight: 120,
  },
  counterContainer: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  reflectionInput: {
    ...Typography.body,
    color: UIColors.textPrimary,
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: UIColors.border,
    padding: Spacing.md,
    height: TouchTarget.large,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: UIColors.background,
    borderTopWidth: 1,
    borderTopColor: UIColors.borderLight,
  },
  previewButton: {
    flexDirection: 'row',
    backgroundColor: UIColors.primary,
    height: TouchTarget.default,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  previewButtonDisabled: {
    backgroundColor: UIColors.textDisabled,
  },
  previewButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
    marginRight: Spacing.xs,
  },
});

export default CreateCapsuleScreen;
