/**
 * Celebration Placeholder Screen
 * Temporary screen for F10 until full Celebration feature is implemented
 *
 * Shows:
 * - Reflection answer summary
 * - Success message
 * - Navigation to Archive or Home
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import { CapsuleType } from '../types/capsule';
import { UIColors, getCapsuleColor } from '../constants/colors';
import {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  TouchTarget,
} from '../constants/theme';

// Extend RootStackParamList for Celebration route
type ExtendedStackParamList = RootStackParamList & {
  Celebration: {
    capsuleId: string;
    type: CapsuleType;
    answer: string;
  };
};

type NavigationProp = StackNavigationProp<ExtendedStackParamList, 'Celebration'>;
type CelebrationRouteProp = RouteProp<ExtendedStackParamList, 'Celebration'>;

export const CelebrationPlaceholderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CelebrationRouteProp>();

  const { capsuleId, type, answer } = route.params;

  // Get type colors
  const typeColor = getCapsuleColor(type);

  // Get icon based on answer
  const getIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    if (answer === 'memory') {
      return 'heart-multiple';
    }
    if (answer === 'yes' || answer === '4' || answer === '5') {
      return 'check-circle';
    }
    if (answer === 'no' || answer === '1' || answer === '2') {
      return 'heart';
    }
    return 'information';
  };

  // Get message based on answer
  const getMessage = (): string => {
    if (answer === 'memory') {
      return 'Cảm ơn bạn đã lưu giữ kỷ niệm tuyệt vời này.';
    }
    if (answer === 'yes') {
      return 'Tuyệt vời! Hãy tiếp tục phát huy!';
    }
    if (answer === 'no') {
      return 'Không sao. Mỗi trải nghiệm đều dạy chúng ta điều gì đó.';
    }
    if (answer === '5' || answer === '4') {
      return 'Quyết định tuyệt vời! Bạn đã chọn đúng.';
    }
    if (answer === '3') {
      return 'Tất cả đều là một phần của hành trình.';
    }
    if (answer === '1' || answer === '2') {
      return 'Mỗi quyết định đều là cơ hội để học hỏi.';
    }
    return 'Cảm ơn bạn đã suy ngẫm!';
  };

  const handleViewArchive = () => {
    navigation.navigate('Archive');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: typeColor.light,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getIcon()}
            size={80}
            color={typeColor.primary}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Đã lưu suy ngẫm!</Text>

        {/* Message */}
        <Text style={styles.message}>{getMessage()}</Text>

        {/* Answer Summary (skip for memory type) */}
        {answer !== 'memory' && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Câu trả lời của bạn:</Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: typeColor.primary,
                },
              ]}
            >
              {answer === 'yes' || answer === 'no'
                ? answer.toUpperCase()
                : `${answer} / 5`}
            </Text>
          </View>
        )}

        {/* Capsule ID (for debugging) */}
        <Text style={styles.debugText}>Viên nang: {capsuleId.slice(0, 8)}...</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleViewArchive}
          style={[
            styles.primaryButton,
            {
              backgroundColor: typeColor.primary,
            },
          ]}
        >
          <MaterialCommunityIcons name="archive" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Xem Lưu trữ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleGoHome}
          style={styles.secondaryButton}
        >
          <MaterialCommunityIcons name="home" size={20} color={typeColor.primary} />
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: typeColor.primary,
              },
            ]}
          >
            Về Trang chủ
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UIColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  title: {
    ...Typography.h1,
    color: UIColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.h3,
    color: UIColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 28,
  },
  summaryCard: {
    backgroundColor: UIColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    minWidth: 200,
    ...Shadows.sm,
  },
  summaryLabel: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    ...Typography.h1,
    fontWeight: 'bold',
  },
  debugText: {
    ...Typography.caption,
    color: UIColors.textTertiary,
    marginTop: Spacing.lg,
  },
  buttonsContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    height: TouchTarget.large,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  primaryButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
  },
  secondaryButton: {
    height: TouchTarget.large,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: UIColors.surface,
    borderWidth: 1,
    borderColor: UIColors.borderLight,
  },
  secondaryButtonText: {
    ...Typography.button,
  },
});

export default CelebrationPlaceholderScreen;
