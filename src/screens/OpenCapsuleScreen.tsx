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
      <Text style={styles.title}>Mở viên nang</Text>
      <Text style={styles.subtitle}>Sắp ra mắt</Text>
      <Text style={styles.description}>
        Màn hình này sẽ hiển thị nội dung viên nang với:
      </Text>
      <Text style={styles.list}>• Hiệu ứng mở</Text>
      <Text style={styles.list}>• Nội dung văn bản</Text>
      <Text style={styles.list}>• Hình ảnh (nếu có)</Text>
      <Text style={styles.list}>• Câu hỏi suy ngẫm</Text>
      <Text style={styles.list}>• Hiệu ứng chúc mừng</Text>

      <Text style={styles.capsuleId}>ID viên nang: {capsuleId}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Quay lại</Text>
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
