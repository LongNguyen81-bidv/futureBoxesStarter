/**
 * HomeScreen Component
 *
 * Main screen displaying 6 upcoming capsules in a 3x2 grid.
 * Shows locked and ready capsules with countdown timers.
 *
 * Features:
 * - 3x2 Grid layout
 * - Countdown timers (update every minute or second)
 * - Empty state when no capsules
 * - Pull-to-refresh
 * - FAB for creating new capsules
 * - Navigation to Archive
 * - Stagger animation for cards
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Alert,
  SafeAreaView,
  StatusBar,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import type { Capsule } from '../types/capsule';
import { CapsuleCard } from '../components/CapsuleCard';
import { EmptyState } from '../components/EmptyState';
import { FAB } from '../components/FAB';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, Grid } from '../constants/theme';
import { formatCountdown } from './mockData';
import { getUpcomingCapsules, updateCapsuleStatus, updatePendingCapsules } from '../services';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdowns, setCountdowns] = useState<Record<string, string>>({});

  // Animation values for stagger effect
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load capsules from database
  const loadCapsules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get upcoming capsules from database
      const data = await getUpcomingCapsules();

      setCapsules(data);

      // Calculate initial countdowns
      const initialCountdowns: Record<string, string> = {};
      data.forEach((capsule) => {
        const unlockTimestamp = new Date(capsule.unlockDate).getTime();
        initialCountdowns[capsule.id] = formatCountdown(unlockTimestamp);
      });
      setCountdowns(initialCountdowns);
    } catch (err) {
      console.error('Error loading capsules:', err);
      setError('Không thể tải viên nang. Kéo xuống để thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCapsules();
    setRefreshing(false);
  }, [loadCapsules]);

  // Initial load
  useEffect(() => {
    loadCapsules();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [loadCapsules, fadeAnim]);

  // App state handler - check for expired capsules when app resumes
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('[HomeScreen] App resumed - checking for expired capsules');

        try {
          // Batch update all expired capsules
          const updatedCount = await updatePendingCapsules();

          if (updatedCount > 0) {
            console.log(`[HomeScreen] Updated ${updatedCount} expired capsule(s) on resume`);
            // Reload capsules to reflect status changes
            await loadCapsules();
          } else {
            // Still recalculate countdowns even if no status changed
            const newCountdowns: Record<string, string> = {};
            capsules.forEach((capsule) => {
              const unlockTimestamp = new Date(capsule.unlockDate).getTime();
              newCountdowns[capsule.id] = formatCountdown(unlockTimestamp);
            });
            setCountdowns(newCountdowns);
          }
        } catch (err) {
          console.error('[HomeScreen] Failed to update capsules on resume:', err);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [loadCapsules, capsules]);

  // Timer to update countdowns and check status (optimized intervals)
  useEffect(() => {
    // Determine optimal interval based on capsules
    const hasUrgentCapsule = capsules.some((capsule) => {
      const unlockTimestamp = new Date(capsule.unlockDate).getTime();
      const timeRemaining = unlockTimestamp - Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      return timeRemaining > 0 && timeRemaining < oneDayInMs;
    });

    // Use 1 second interval if any capsule < 1 day, else 1 minute
    const intervalMs = hasUrgentCapsule ? 1000 : 60000;

    console.log(
      `[HomeScreen] Timer interval set to ${intervalMs / 1000}s (urgent: ${hasUrgentCapsule})`
    );

    const interval = setInterval(async () => {
      const newCountdowns: Record<string, string> = {};
      let statusChanged = false;

      // Update countdowns and check for status changes
      for (const capsule of capsules) {
        const unlockTimestamp = new Date(capsule.unlockDate).getTime();
        newCountdowns[capsule.id] = formatCountdown(unlockTimestamp);

        // Check if locked capsule should transition to ready
        if (capsule.status === 'locked' && unlockTimestamp <= Date.now()) {
          try {
            await updateCapsuleStatus(capsule.id, 'ready');
            statusChanged = true;
            console.log('[HomeScreen] Capsule status updated to ready:', capsule.id);
          } catch (err) {
            console.error('[HomeScreen] Failed to update capsule status:', err);
          }
        }
      }

      setCountdowns(newCountdowns);

      // Reload capsules if any status changed
      if (statusChanged) {
        await loadCapsules();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [capsules, loadCapsules]);

  // Handle capsule tap
  const handleCapsuleTap = (capsule: Capsule) => {
    if (capsule.status === 'locked') {
      // Show locked message
      const unlockDate = new Date(capsule.unlockDate).toLocaleDateString();
      Alert.alert(
        'Viên nang đã khóa',
        `Viên nang này vẫn đang bị khóa. Quay lại vào ${unlockDate}.`,
        [{ text: 'OK' }]
      );
    } else if (capsule.status === 'ready') {
      // Navigate to Open Capsule Screen
      console.log('Navigate to Open Capsule:', capsule.id);
      navigation.navigate('OpenCapsule', { capsuleId: capsule.id });
    }
  };

  // Handle FAB tap
  const handleCreateCapsule = () => {
    console.log('Navigate to Type Selection');
    navigation.navigate('TypeSelection');
  };

  // Handle Archive navigation
  const handleArchiveTap = () => {
    console.log('Navigate to Archive');
    navigation.navigate('Archive');
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleArchiveTap} style={styles.archiveButton}>
        <MaterialIcons name="archive" size={24} color={UIColors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>FutureBoxes</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  // Render capsule card with stagger animation
  const renderCapsuleCard = ({ item, index }: { item: Capsule; index: number }) => {
    const staggerDelay = index * 50; // 50ms delay per card

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <CapsuleCard
          capsule={item}
          onPress={handleCapsuleTap}
          countdown={countdowns[item.id]}
        />
      </Animated.View>
    );
  };

  // Error state
  if (error && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {renderHeader()}
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={UIColors.textSecondary} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCapsules}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (capsules.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {renderHeader()}
        <EmptyState onCreatePress={handleCreateCapsule} />
        <FAB onPress={handleCreateCapsule} />
      </SafeAreaView>
    );
  }

  // Main render with grid
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}

      <FlatList
        data={capsules}
        renderItem={renderCapsuleCard}
        keyExtractor={(item) => item.id}
        numColumns={Grid.columns}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={UIColors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={handleCreateCapsule} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UIColors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: UIColors.background,
    borderBottomWidth: 1,
    borderBottomColor: UIColors.border,
  },
  archiveButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h2,
    color: UIColors.textPrimary,
  },
  headerSpacer: {
    width: 40, // Same width as archive button for centering
  },
  gridContainer: {
    padding: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    aspectRatio: 0.9, // Cards slightly taller than wide
    maxWidth: '31%', // 3 columns with spacing
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: UIColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    color: UIColors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: UIColors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
});

export default HomeScreen;
