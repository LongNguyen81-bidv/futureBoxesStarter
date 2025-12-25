/**
 * Archive Screen
 *
 * Placeholder screen for viewing opened capsules history.
 * TODO: Implement list of opened capsules with details
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UIColors } from '../constants/colors';
import { Typography, Spacing } from '../constants/theme';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Archive'>;

export const ArchiveScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archive</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      <Text style={styles.description}>
        This screen will show all opened capsules with:
      </Text>
      <Text style={styles.list}>• Capsule type and icon</Text>
      <Text style={styles.list}>• Creation date and opened date</Text>
      <Text style={styles.list}>• Preview text</Text>
      <Text style={styles.list}>• Reflection answer</Text>
      <Text style={styles.list}>• Delete option</Text>

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

export default ArchiveScreen;
