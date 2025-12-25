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
import { markCapsuleAsOpened } from '../services/databaseService';
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
  const { capsuleId } = route.params;

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
        throw new Error('Capsule not found');
      }

      // Verify status
      if (capsuleData.status !== 'ready') {
        if (capsuleData.status === 'locked') {
          throw new Error('Capsule is still locked. Please wait until unlock time.');
        }
        if (capsuleData.status === 'opened') {
          // Redirect to Archive for opened capsules
          Alert.alert(
            'Already Opened',
            'This capsule has already been opened. You can view it in the Archive.',
            [
              {
                text: 'Go to Archive',
                onPress: () => navigation.replace('Archive'),
              },
              {
                text: 'Cancel',
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
        'Error',
        err.message || 'Failed to load capsule. Please try again.',
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
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={UIColors.primary} />
        <Text style={styles.loadingText}>Opening capsule...</Text>
      </View>
    );
  }

  // Error state
  if (error || !capsule) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Failed to load capsule'}</Text>
      </View>
    );
  }

  // Render OpenCapsuleScreen with loaded data
  return (
    <OpenCapsuleScreen
      capsule={capsule}
      onClose={handleClose}
      onContinue={handleContinue}
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
