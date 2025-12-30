/**
 * Open Capsule Screen Container
 * Loads capsule data from database and displays UI
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { OpenCapsuleScreen } from '../../components/OpenCapsuleScreen';
import { markCapsuleAsOpened, deleteCapsule } from '../services/databaseService';
import {
  getCapsuleWithImages,
  toOpenCapsuleData,
  type OpenCapsuleData,
} from '../services/capsuleHelpers';
import { UIColors } from '../constants/colors';
import { Spacing, Typography } from '../constants/theme';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type OpenCapsuleRouteProp = RouteProp<RootStackParamList, 'OpenCapsule'>;

export const OpenCapsuleScreenContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OpenCapsuleRouteProp>();
  const { capsuleId, fromArchive } = route.params;

  const [capsule, setCapsule] = useState<OpenCapsuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCapsule();
  }, [capsuleId]);

  const loadCapsule = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load capsule with images from database
      const capsuleData = await getCapsuleWithImages(capsuleId);

      if (!capsuleData) {
        throw new Error('Không tìm thấy viên nang');
      }

      // Verify status
      if (capsuleData.status !== 'ready') {
        if (capsuleData.status === 'locked') {
          throw new Error('Viên nang vẫn đang bị khóa. Vui lòng đợi đến thời gian mở khóa.');
        }
        if (capsuleData.status === 'opened') {
          // Redirect to Archive for opened capsules
          Alert.alert(
            'Đã mở',
            'Viên nang này đã được mở. Bạn có thể xem nó trong Lưu trữ.',
            [
              {
                text: 'Đến Lưu trữ',
                onPress: () => navigation.replace('Archive'),
              },
              {
                text: 'Hủy',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              },
            ]
          );
          return;
        }
      }

      // Convert to OpenCapsuleData format for UI
      const openCapsuleData = toOpenCapsuleData(capsuleData);

      setCapsule(openCapsuleData);
    } catch (err: any) {
      console.error('[OpenCapsuleContainer] Failed to load capsule:', err);
      setError(err.message || 'Failed to load capsule');

      // Show error alert and navigate back
      Alert.alert(
        'Lỗi',
        err.message || 'Không thể tải viên nang. Vui lòng thử lại.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleContinue = async () => {
    if (!capsule) return;

    try {
      // Determine navigation based on capsule type
      if (capsule.reflectionQuestion) {
        // Emotion, Goal, Decision → Navigate to Reflection (F9)
        navigation.navigate('Reflection', {
          capsuleId: capsule.id,
          type: capsule.type,
          reflectionQuestion: capsule.reflectionQuestion,
        });
      } else {
        // Memory type (no reflection) → Mark as opened and navigate to Celebration
        await markCapsuleAsOpened(capsule.id);

        // Navigate to Celebration with null answer (memory type)
        navigation.navigate('Celebration', {
          capsuleId: capsule.id,
          type: capsule.type,
          answer: 'memory', // Special value for memory type
        });
      }
    } catch (err: any) {
      console.error('[OpenCapsuleContainer] Failed to continue:', err);
      Alert.alert('Lỗi', 'Không thể tiếp tục. Vui lòng thử lại.');
    }
  };

  const handleDelete = () => {
    if (!capsule) return;

    Alert.alert(
      'Xóa viên nang',
      'Bạn có chắc chắn muốn xóa viên nang này? Hành động này không thể hoàn tác.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => handleDeleteConfirm(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteConfirm = async () => {
    if (!capsule) return;

    console.log('[OpenCapsuleContainer] Delete confirmed for capsule:', capsule.id);

    try {
      // Show loading state
      setLoading(true);

      // Delete from database and file system (atomic operation)
      await deleteCapsule(capsule.id);

      console.log('[OpenCapsuleContainer] Capsule deleted successfully:', capsule.id);

      // Navigate back to Archive (list will auto-refresh via useFocusEffect)
      navigation.navigate('Archive');

      // Success feedback is implicit - user sees capsule gone from Archive list
    } catch (error) {
      console.error('[OpenCapsuleContainer] Delete failed:', error);

      // Show error alert and keep on current screen
      Alert.alert(
        'Xóa thất bại',
        error instanceof Error ? error.message : 'Không thể xóa viên nang. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );

      // Reset loading state to allow retry
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={UIColors.primary} />
        <Text style={styles.loadingText}>Đang mở viên nang...</Text>
      </View>
    );
  }

  // Error state
  if (error || !capsule) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Không thể tải viên nang'}</Text>
      </View>
    );
  }

  // Render OpenCapsuleScreen with loaded data
  return (
    <OpenCapsuleScreen
      capsule={capsule}
      onClose={handleClose}
      onContinue={handleContinue}
      onDelete={fromArchive ? handleDelete : undefined}
      fromArchive={fromArchive}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: UIColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: UIColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: UIColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    color: UIColors.error,
    textAlign: 'center',
  },
});

export default OpenCapsuleScreenContainer;
