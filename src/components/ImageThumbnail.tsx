/**
 * ImageThumbnail Component
 *
 * Displays image thumbnail with delete button
 * Used in ImagePickerSection to show selected images
 */

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { UIColors } from '../constants/colors';
import { BorderRadius, Shadows } from '../constants/theme';

interface ImageThumbnailProps {
  uri: string;
  onRemove: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ uri, onRemove }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    // Fade in animation when mounted
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1, { damping: 15 });
  }, []);

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Fade out animation before removing
    opacity.value = withTiming(0, { duration: 150 });
    scale.value = withTiming(0.8, { duration: 150 }, () => {
      runOnJS(onRemove)();
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedView style={[styles.container, animatedStyle]}>
      <Image source={{ uri }} style={styles.image} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleRemove}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.deleteIcon}>
          <MaterialCommunityIcons name="close" size={16} color={UIColors.textWhite} />
        </View>
      </TouchableOpacity>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.md,
    backgroundColor: UIColors.surface,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 1,
  },
  deleteIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: UIColors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
});

export default ImageThumbnail;
