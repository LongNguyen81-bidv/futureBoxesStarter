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
    title: 'Cảm xúc',
    icon: 'heart' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'Bạn đang cảm thấy thế nào? Hãy bày tỏ cảm xúc của mình...',
    reflectionPlaceholder: 'VD: Cảm giác này đã qua chưa?',
    hasReflection: true,
  },
  goal: {
    title: 'Mục tiêu',
    icon: 'flag-checkered' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'Mục tiêu bạn muốn đạt được là gì? Mô tả chi tiết...',
    reflectionPlaceholder: 'VD: Bạn đã đạt được mục tiêu này chưa?',
    hasReflection: true,
  },
  memory: {
    title: 'Kỷ niệm',
    icon: 'camera' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'Mô tả khoảnh khắc đặc biệt bạn muốn lưu giữ...',
    reflectionPlaceholder: '',
    hasReflection: false,
  },
  decision: {
    title: 'Quyết định',
    icon: 'scale-balance' as keyof typeof MaterialCommunityIcons.glyphMap,
    contentPlaceholder: 'Quyết định quan trọng bạn đã đưa ra là gì? Tại sao?',
    reflectionPlaceholder: 'VD: Bạn cảm thấy thế nào về quyết định này?',
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
      Alert.alert('Hủy thay đổi?', 'Bản nháp viên nang của bạn sẽ bị mất.', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
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
        Alert.alert('Cần có nội dung', 'Vui lòng nhập tin nhắn của bạn.');
      } else if (content.length > MAX_CONTENT_LENGTH) {
        Alert.alert('Nội dung quá dài', `Tối đa ${MAX_CONTENT_LENGTH} ký tự.`);
      } else if (typeConfig.hasReflection && reflectionQuestion.trim().length === 0) {
        Alert.alert('Cần có câu hỏi', 'Vui lòng nhập câu hỏi cho bản thân tương lai.');
      } else if (!unlockDate) {
        Alert.alert('Cần chọn ngày', 'Vui lòng chọn thời điểm mở viên nang.');
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
        <Text style={styles.headerTitle}>Tạo {typeConfig.title}</Text>
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
              Viên nang {typeConfig.title}
            </Text>
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Bạn đang nghĩ gì?</Text>
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
              <Text style={styles.sectionLabel}>Câu hỏi cho bạn trong tương lai</Text>
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
            <Text style={styles.previewButtonText}>Xem trước viên nang</Text>
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
