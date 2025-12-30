/**
 * Preview Capsule Screen
 *
 * Display capsule content before locking
 * - Show all form data for review
 * - Display images in gallery view
 * - Allow navigation back to edit
 * - Confirm and lock capsule
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCapsuleColor, UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, TouchTarget, Shadows } from '../constants/theme';
import { createCapsule } from '../services/databaseService';
import { scheduleNotification } from '../services/notificationService';
import { LockSuccessModal } from '../components/LockSuccessModal';

type NavigationProp = StackNavigationProp<RootStackParamList, 'PreviewCapsule'>;
type PreviewCapsuleRouteProp = RouteProp<RootStackParamList, 'PreviewCapsule'>;

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - Spacing.md * 4; // Leave padding on sides

export const PreviewCapsuleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PreviewCapsuleRouteProp>();
  const { type, content, images, reflectionQuestion, unlockAt } = route.params;

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const typeColor = getCapsuleColor(type);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSuccessModalDismiss = () => {
    setShowSuccessModal(false);
    // Navigate to Home after modal dismissed
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleLock = () => {
    Alert.alert(
      'Khóa viên nang?',
      'Sau khi khóa, bạn không thể xem, chỉnh sửa hoặc xóa viên nang này cho đến ngày mở khóa.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Khóa',
          style: 'default',
          onPress: handleLockConfirmed,
        },
      ]
    );
  };

  const handleLockConfirmed = async () => {
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('[PreviewCapsule] Locking capsule...', {
        type,
        contentLength: content.length,
        imagesCount: images.length,
        unlockAt: unlockAt.toISOString(),
      });

      // Create capsule in database (with image copying and DB insert)
      const capsule = await createCapsule({
        type,
        content,
        images: images.length > 0 ? images : undefined,
        reflectionQuestion,
        unlockDate: unlockAt,
      });

      console.log('[PreviewCapsule] Capsule created:', capsule.id);

      // Schedule notification (best effort - don't block if fails)
      try {
        const notificationId = await scheduleNotification(capsule);
        if (notificationId) {
          console.log('[PreviewCapsule] Notification scheduled:', notificationId);
        } else {
          console.warn('[PreviewCapsule] Notification not scheduled (permission denied or error)');
        }
      } catch (notificationError) {
        console.warn('[PreviewCapsule] Notification scheduling failed:', notificationError);
        // Continue anyway - notification is nice-to-have
      }

      // Success! Show lock animation modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('[PreviewCapsule] Lock capsule error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        'Không thể khóa viên nang',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={loading}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={loading ? UIColors.textDisabled : UIColors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xem trước viên nang</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: typeColor.light }]}>
          <MaterialCommunityIcons
            name={
              type === 'emotion'
                ? 'heart'
                : type === 'goal'
                ? 'flag-checkered'
                : type === 'memory'
                ? 'camera'
                : 'scale-balance'
            }
            size={20}
            color={typeColor.primary}
          />
          <Text style={[styles.typeBadgeText, { color: typeColor.primary }]}>
            Viên nang {typeLabel}
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Thông điệp của bạn</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{content}</Text>
          </View>
        </View>

        {/* Images Section */}
        {images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Hình ảnh ({images.length}/3)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}
            >
              {images.map((imageUri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Reflection Question */}
        {reflectionQuestion && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Câu hỏi cho tương lai</Text>
            <View style={styles.reflectionBox}>
              <Text style={styles.reflectionText}>{reflectionQuestion}</Text>
            </View>
          </View>
        )}

        {/* Unlock Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mở vào ngày</Text>
          <View style={styles.dateBox}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={24}
              color={typeColor.primary}
            />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateText}>
                {format(unlockAt, 'EEEE, MMMM dd, yyyy')}
              </Text>
              <Text style={styles.timeText}>
                {format(unlockAt, 'h:mm a')}
              </Text>
            </View>
          </View>
        </View>

        {/* Created Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tạo vào ngày</Text>
          <View style={styles.createdBox}>
            <Text style={styles.createdText}>
              {format(new Date(), 'EEEE, MMMM dd, yyyy \'at\' h:mm a')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backToEditButton}
          onPress={handleBack}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={UIColors.primary}
          />
          <Text style={styles.backToEditText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.lockButton, loading && styles.lockButtonDisabled]}
          onPress={handleLock}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={UIColors.textWhite} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="lock"
                size={20}
                color={UIColors.textWhite}
              />
              <Text style={styles.lockButtonText}>Khóa viên nang</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Lock Success Modal */}
      <LockSuccessModal
        visible={showSuccessModal}
        capsuleType={type}
        unlockDate={unlockAt}
        onDismiss={handleSuccessModalDismiss}
      />
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
    fontWeight: '600',
    color: UIColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  contentBox: {
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: UIColors.border,
  },
  contentText: {
    ...Typography.body,
    color: UIColors.textPrimary,
    lineHeight: 24,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  imageWrapper: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  image: {
    width: IMAGE_SIZE / 2,
    height: IMAGE_SIZE / 2,
    backgroundColor: UIColors.borderLight,
  },
  reflectionBox: {
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: UIColors.border,
  },
  reflectionText: {
    ...Typography.body,
    color: UIColors.textSecondary,
    fontStyle: 'italic',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: UIColors.border,
  },
  dateTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  dateText: {
    ...Typography.body,
    fontWeight: '600',
    color: UIColors.textPrimary,
  },
  timeText: {
    ...Typography.caption,
    color: UIColors.textSecondary,
    marginTop: Spacing.xs,
  },
  createdBox: {
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: UIColors.borderLight,
  },
  createdText: {
    ...Typography.caption,
    color: UIColors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: UIColors.background,
    borderTopWidth: 1,
    borderTopColor: UIColors.borderLight,
    gap: Spacing.sm,
  },
  backToEditButton: {
    flex: 1,
    flexDirection: 'row',
    height: TouchTarget.default,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: UIColors.primary,
    backgroundColor: UIColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToEditText: {
    ...Typography.button,
    color: UIColors.primary,
    marginLeft: Spacing.xs,
  },
  lockButton: {
    flex: 2,
    flexDirection: 'row',
    height: TouchTarget.default,
    borderRadius: BorderRadius.md,
    backgroundColor: UIColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  lockButtonDisabled: {
    backgroundColor: UIColors.textDisabled,
  },
  lockButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
    marginLeft: Spacing.xs,
  },
});

export default PreviewCapsuleScreen;
