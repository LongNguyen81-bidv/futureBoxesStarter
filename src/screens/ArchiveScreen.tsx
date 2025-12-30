/**
 * Archive Screen
 *
 * Displays all opened capsules in a scrollable list.
 * Users can view details of each capsule by tapping on them.
 *
 * Features:
 * - FlatList of opened capsules
 * - Pull-to-refresh
 * - Empty state when no opened capsules
 * - Navigate to detail view (OpenCapsuleScreen)
 * - Type-specific styling
 *
 * Business Logic:
 * - Load opened capsules from database (status = 'opened')
 * - Sort by openedAt DESC (newest first)
 * - Load image previews (first 3 images)
 * - Handle loading, error, and empty states
 * - Pull-to-refresh reloads data
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { ArchiveItemCard, ArchiveItem } from '../components/ArchiveItemCard';
import { EmptyArchiveState } from '../components/EmptyArchiveState';
import { getOpenedCapsules, getImages, deleteCapsule } from '../services/databaseService';
import { Capsule } from '../types/capsule';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Archive'>;

/**
 * Transform Capsule to ArchiveItem
 * Loads images and formats data for UI display
 */
const transformCapsuleToArchiveItem = async (
  capsule: Capsule
): Promise<ArchiveItem> => {
  try {
    // Load images for this capsule
    const images = await getImages(capsule.id);

    // Get first 3 image URIs for preview
    const imagePreviews = images.slice(0, 3).map((img) => img.imagePath);

    return {
      id: capsule.id,
      type: capsule.type,
      content: capsule.content,
      createdAt: capsule.createdAt,
      openedAt: capsule.openedAt || capsule.createdAt, // Fallback to createdAt
      reflectionAnswer: capsule.reflectionAnswer,
      imageCount: images.length,
      imagePreviews: imagePreviews.length > 0 ? imagePreviews : undefined,
    };
  } catch (error) {
    console.error('[ArchiveScreen] Failed to transform capsule:', error);
    // Return basic item without images on error
    return {
      id: capsule.id,
      type: capsule.type,
      content: capsule.content,
      createdAt: capsule.createdAt,
      openedAt: capsule.openedAt || capsule.createdAt,
      reflectionAnswer: capsule.reflectionAnswer,
      imageCount: 0,
    };
  }
};

export const ArchiveScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // State
  const [capsules, setCapsules] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load opened capsules from database
   */
  const loadCapsules = useCallback(async () => {
    try {
      setError(null);

      // Query opened capsules from database
      const openedCapsules = await getOpenedCapsules();

      // Transform capsules with images
      const archiveItems = await Promise.all(
        openedCapsules.map(transformCapsuleToArchiveItem)
      );

      setCapsules(archiveItems);

      console.log('[ArchiveScreen] Loaded capsules:', archiveItems.length);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load archive';
      console.error('[ArchiveScreen] Load error:', err);
      setError(errorMessage);

      // Show error alert
      Alert.alert(
        'Lỗi',
        'Không thể tải lưu trữ. Vui lòng thử lại.',
        [
          {
            text: 'Thử lại',
            onPress: () => loadCapsules(),
          },
          {
            text: 'Hủy',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load capsules on mount and when screen is focused
   */
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCapsules();
    }, [loadCapsules])
  );

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCapsules();
    setRefreshing(false);
  }, [loadCapsules]);

  /**
   * Handle capsule item press
   * Navigate to OpenCapsuleScreen to view full details (read-only mode)
   */
  const handleCapsulePress = useCallback(
    (capsuleId: string) => {
      navigation.navigate('OpenCapsule', {
        capsuleId,
        fromArchive: true, // Indicate this is from Archive for different UI behavior
      });
    },
    [navigation]
  );

  /**
   * Handle go home from empty state
   */
  const handleGoHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  /**
   * Handle delete confirmation
   * Shows confirmation dialog before deleting capsule
   */
  const handleDeletePress = useCallback((capsuleId: string) => {
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
          onPress: () => handleDeleteConfirm(capsuleId),
        },
      ],
      { cancelable: true }
    );
  }, []);

  /**
   * Handle delete confirmation
   * Deletes capsule from database and file system, then updates UI
   */
  const handleDeleteConfirm = useCallback(
    async (capsuleId: string) => {
      console.log('[ArchiveScreen] Delete confirmed for capsule:', capsuleId);

      try {
        // Show loading state
        setLoading(true);

        // Delete from database and file system (atomic operation)
        await deleteCapsule(capsuleId);

        // Update UI - remove from state
        setCapsules((prev) => prev.filter((c) => c.id !== capsuleId));

        console.log('[ArchiveScreen] Capsule deleted successfully:', capsuleId);

        // Show success feedback (optional - visual feedback from UI is enough)
        // Alert.alert('Success', 'Capsule deleted successfully');
      } catch (error) {
        console.error('[ArchiveScreen] Delete failed:', error);

        // Show error alert
        Alert.alert(
          'Xóa thất bại',
          error instanceof Error ? error.message : 'Không thể xóa viên nang. Vui lòng thử lại.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Render swipeable delete action
   */
  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>,
      capsuleId: string
    ) => {
      const translateX = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [0, 80],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          style={[
            styles.deleteAction,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(capsuleId)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={24} color="white" />
            <Text style={styles.deleteText}>Xóa</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [handleDeletePress]
  );

  /**
   * Render list item with swipe-to-delete
   */
  const renderItem = useCallback(
    ({ item }: { item: ArchiveItem }) => (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item.id)
        }
        overshootRight={false}
        friction={2}
      >
        <ArchiveItemCard item={item} onPress={() => handleCapsulePress(item.id)} />
      </Swipeable>
    ),
    [handleCapsulePress, renderRightActions]
  );

  /**
   * Render empty state
   */
  const renderEmpty = useCallback(
    () => <EmptyArchiveState onGoHome={handleGoHome} />,
    [handleGoHome]
  );

  /**
   * Item key extractor
   */
  const keyExtractor = useCallback((item: ArchiveItem) => item.id, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={UIColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lưu trữ</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Initial Loading State */}
        {loading && capsules.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={UIColors.primary} />
            <Text style={styles.loadingText}>Đang tải lưu trữ...</Text>
          </View>
        ) : (
          /* Capsule List */
          <FlatList
            data={capsules}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={
              capsules.length === 0 ? styles.emptyContainer : styles.listContainer
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={UIColors.primary}
                colors={[UIColors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    borderBottomColor: UIColors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  headerTitle: {
    ...Typography.h2,
    color: UIColors.textPrimary,
  },
  headerRight: {
    width: 40, // Spacer for center alignment
  },
  listContainer: {
    paddingVertical: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UIColors.surface,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: UIColors.textSecondary,
  },
  deleteAction: {
    backgroundColor: UIColors.danger,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    width: 80,
    marginVertical: Spacing.sm,
    borderTopRightRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: Spacing.sm,
  },
  deleteText: {
    color: 'white',
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});

export default ArchiveScreen;
