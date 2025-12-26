/**
 * ArchiveItemCard Component
 *
 * Card component for displaying an opened capsule in the Archive list.
 * Shows type, dates, content preview, images, and reflection answer.
 *
 * Features:
 * - Type-specific colors and icons
 * - Date information (created and opened)
 * - Content preview (truncated to ~150 chars)
 * - Image thumbnails preview
 * - Reflection answer badge
 * - Press interaction
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getCapsuleColor, UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { ReflectionAnswerBadge } from './ReflectionAnswerBadge';

// Type icons mapping
const TYPE_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  emotion: 'favorite',
  goal: 'flag',
  memory: 'camera-alt',
  decision: 'balance',
};

// Type names mapping
const TYPE_NAMES: Record<string, string> = {
  emotion: 'Emotion',
  goal: 'Goal',
  memory: 'Memory',
  decision: 'Decision',
};

export interface ArchiveItem {
  id: string;
  type: 'emotion' | 'goal' | 'memory' | 'decision';
  content: string;
  createdAt: string;
  openedAt: string;
  reflectionAnswer: string | null;
  imageCount?: number;
  imagePreviews?: string[]; // First 3 image URIs for preview
}

interface ArchiveItemCardProps {
  item: ArchiveItem;
  onPress: () => void;
}

export const ArchiveItemCard: React.FC<ArchiveItemCardProps> = ({
  item,
  onPress,
}) => {
  const typeColor = getCapsuleColor(item.type);

  // Format dates
  const createdDate = format(new Date(item.createdAt), 'MMM dd, yyyy');
  const openedDate = format(new Date(item.openedAt), 'MMM dd, yyyy');

  // Calculate time locked
  const created = new Date(item.createdAt);
  const opened = new Date(item.openedAt);
  const diffMs = opened.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeLocked = '';
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    timeLocked = `After ${years}y ${months}mo`;
  } else if (diffDays >= 30) {
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    timeLocked = `After ${months}mo ${days}d`;
  } else if (diffDays >= 7) {
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    timeLocked = `After ${weeks}w ${days}d`;
  } else {
    timeLocked = `After ${diffDays} days`;
  }

  // Truncate content for preview
  const contentPreview =
    item.content.length > 150
      ? item.content.substring(0, 150) + '...'
      : item.content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderLeftColor: typeColor.primary,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {/* Header: Type + Dates */}
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: typeColor.light },
            ]}
          >
            <MaterialIcons
              name={TYPE_ICONS[item.type]}
              size={20}
              color={typeColor.primary}
            />
          </View>
          <Text style={[styles.typeName, { color: typeColor.primary }]}>
            {TYPE_NAMES[item.type]}
          </Text>
        </View>
        <View style={styles.datesContainer}>
          <Text style={styles.dateText}>
            <Text style={styles.dateLabel}>Created: </Text>
            {createdDate}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Content Preview */}
      <Text style={styles.contentPreview} numberOfLines={3}>
        {contentPreview}
      </Text>

      {/* Image Previews */}
      {item.imagePreviews && item.imagePreviews.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          {item.imagePreviews.slice(0, 3).map((uri, index) => (
            <View key={index} style={styles.imageThumbnailWrapper}>
              <Image
                source={{ uri }}
                style={styles.imageThumbnail}
                resizeMode="cover"
              />
            </View>
          ))}
          {item.imageCount && item.imageCount > 3 && (
            <View style={styles.moreImagesIndicator}>
              <Text style={styles.moreImagesText}>
                +{item.imageCount - 3}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer: Opened date + Time locked */}
      <View style={styles.footer}>
        <View style={styles.openedInfo}>
          <MaterialIcons
            name="event-available"
            size={14}
            color={UIColors.textSecondary}
          />
          <Text style={styles.openedText}>
            Opened: {openedDate} ({timeLocked})
          </Text>
        </View>
      </View>

      {/* Reflection Answer */}
      {item.reflectionAnswer && (
        <>
          <View style={styles.divider} />
          <ReflectionAnswerBadge
            answer={item.reflectionAnswer}
            type={item.type}
          />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    ...Shadows.sm,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  typeName: {
    ...Typography.h3,
    fontSize: 18,
  },
  datesContainer: {
    marginLeft: 40, // Align with type name
  },
  dateText: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
  },
  dateLabel: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: UIColors.border,
    marginVertical: Spacing.sm,
  },
  contentPreview: {
    ...Typography.body,
    color: UIColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  imageThumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: UIColors.surface,
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  moreImagesIndicator: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    backgroundColor: UIColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  openedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  openedText: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
  },
});

export default ArchiveItemCard;
