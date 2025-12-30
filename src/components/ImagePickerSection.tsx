/**
 * ImagePickerSection Component
 *
 * Allows users to select up to 3 images from gallery
 * Shows thumbnails with delete button for each selected image
 * Displays add button (hidden when max 3 images reached)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { ImageThumbnail } from './ImageThumbnail';

interface ImagePickerSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImagePickerSection: React.FC<ImagePickerSectionProps> = ({
  images,
  onImagesChange,
  maxImages = 3,
}) => {
  const handleAddImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Đã đạt giới hạn', `Bạn chỉ có thể thêm tối đa ${maxImages} ảnh.`);
      return;
    }

    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Cần cấp quyền',
          'Vui lòng cho phép truy cập thư viện ảnh để thêm ảnh.',
          [{ text: 'Đồng ý' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onImagesChange([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Thêm ảnh (tùy chọn)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Thumbnails */}
        {images.map((uri, index) => (
          <ImageThumbnail
            key={`${uri}-${index}`}
            uri={uri}
            onRemove={() => handleRemoveImage(index)}
          />
        ))}

        {/* Add Button (hidden when max reached) */}
        {images.length < maxImages && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddImage}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus"
              size={32}
              color={UIColors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Helper text */}
      <Text style={styles.helperText}>
        {images.length}/{maxImages} ảnh
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: UIColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  scrollContent: {
    paddingVertical: Spacing.xs,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: UIColors.border,
    backgroundColor: UIColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    ...Typography.caption,
    color: UIColors.textSecondary,
    marginTop: Spacing.xs,
  },
});

export default ImagePickerSection;
