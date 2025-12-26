/**
 * Open Capsule Screen
 * Displays capsule content with opening animation and navigation to reflection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { OpeningAnimationOverlay } from './OpeningAnimationOverlay';
import { ImageGallery } from './ImageGallery';
import { Colors, type CapsuleType } from '../constants/Colors';
import { Spacing, BorderRadius, Elevation } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import type { OpenCapsuleData } from '../types/capsule';

interface OpenCapsuleScreenProps {
  capsule: OpenCapsuleData;
  onClose: () => void;
  onContinue: () => void;
  onDelete?: () => void; // Optional delete handler for Archive view
  fromArchive?: boolean; // Flag to indicate viewing from Archive
}

export const OpenCapsuleScreen: React.FC<OpenCapsuleScreenProps> = ({
  capsule,
  onClose,
  onContinue,
  onDelete,
  fromArchive = false,
}) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Content animation values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  const typeColor = Colors.capsuleTypes[capsule.type];

  useEffect(() => {
    if (animationComplete) {
      // Trigger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Fade in content
      contentOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
      contentTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [animationComplete]);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setAnimationComplete(true);
  };

  const handleClose = () => {
    Alert.alert(
      'Leave without finishing?',
      'You can come back to open this capsule anytime.',
      [
        {
          text: 'Stay',
          style: 'cancel',
        },
        {
          text: 'Leave',
          onPress: onClose,
          style: 'destructive',
        },
      ]
    );
  };

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue();
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const getTypeIcon = (type: CapsuleType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'emotion':
        return 'heart';
      case 'goal':
        return 'flag';
      case 'memory':
        return 'camera';
      case 'decision':
        return 'scale';
    }
  };

  const formatCapsuleType = (type: CapsuleType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Opening Animation */}
      {showAnimation && (
        <OpeningAnimationOverlay
          capsuleType={capsule.type}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* Main Content */}
      <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          {fromArchive && onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={24} color={Colors.ui.danger} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.ui.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: typeColor.light }]}>
            <Ionicons
              name={getTypeIcon(capsule.type)}
              size={24}
              color={typeColor.primary}
            />
            <Text style={[styles.typeText, { color: typeColor.primary }]}>
              {formatCapsuleType(capsule.type)} Capsule
            </Text>
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              Created on {format(capsule.createdAt, 'EEEE, MMM dd, yyyy')}
            </Text>
            <Text style={styles.metadataText}>
              Opened on {format(capsule.openedAt || new Date(), 'EEEE, MMM dd, yyyy')}
            </Text>
            <Text style={[styles.metadataText, styles.durationText]}>
              Time locked: {capsule.timeLocked}
            </Text>
          </View>

          {/* Content Text */}
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{capsule.content}</Text>
          </View>

          {/* Image Gallery */}
          {capsule.images.length > 0 && (
            <ImageGallery images={capsule.images} />
          )}

          {/* Bottom Spacing */}
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: typeColor.primary }]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              {capsule.reflectionQuestion ? 'Answer Reflection' : 'Save to Archive'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.surface,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerLeft: {
    width: 40, // Spacer for alignment
  },
  deleteButton: {
    padding: Spacing.sm,
    marginRight: Spacing.xs,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeText: {
    ...Typography.h3,
  },
  metadata: {
    marginBottom: Spacing.lg,
  },
  metadataText: {
    ...Typography.bodySmall,
    color: Colors.ui.textSecondary,
    marginBottom: Spacing.xs,
  },
  durationText: {
    ...Typography.body,
    color: Colors.ui.textPrimary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  contentCard: {
    backgroundColor: Colors.ui.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Elevation.sm,
  },
  contentText: {
    ...Typography.body,
    color: Colors.ui.textPrimary,
    lineHeight: 26, // Slightly increased for better readability
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.ui.background,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.border,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Elevation.md,
  },
  continueButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
});
