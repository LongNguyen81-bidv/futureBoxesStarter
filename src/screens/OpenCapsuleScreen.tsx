/**
 * Open Capsule Screen
 *
 * Placeholder screen for opening and viewing a ready capsule.
 * TODO: Implement capsule opening animation, content display, and reflection flow
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UIColors } from '../constants/colors';
import { Typography, Spacing } from '../constants/theme';

type NavigationProp = StackNavigationProp<RootStackParamList, 'OpenCapsule'>;
type OpenCapsuleRouteProp = RouteProp<RootStackParamList, 'OpenCapsule'>;

export const OpenCapsuleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OpenCapsuleRouteProp>();
  const { capsuleId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Open Capsule</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      <Text style={styles.description}>
        This screen will display the capsule content with:
      </Text>
      <Text style={styles.list}>• Opening animation</Text>
      <Text style={styles.list}>• Text content</Text>
      <Text style={styles.list}>• Images (if any)</Text>
      <Text style={styles.list}>• Reflection question</Text>
      <Text style={styles.list}>• Celebration effects</Text>

      <Text style={styles.capsuleId}>Capsule ID: {capsuleId}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UIColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: UIColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.h3,
    color: UIColors.textSecondary,
    marginBottom: Spacing.xl,
  },
  description: {
    ...Typography.body,
    color: UIColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  list: {
    ...Typography.body,
    color: UIColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  capsuleId: {
    ...Typography.caption,
    color: UIColors.textSecondary,
    marginTop: Spacing.xl,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: UIColors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.xl,
  },
  buttonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
});

export default OpenCapsuleScreen;
