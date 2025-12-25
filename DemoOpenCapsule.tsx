/**
 * Standalone Demo for Open Capsule Screen
 * Run this to preview the Open Capsule UI/UX
 *
 * To use: Change App.tsx import from './App' to './DemoOpenCapsule'
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { OpenCapsuleScreen } from './components/OpenCapsuleScreen';
import { getMockCapsule } from './utils/mockData';
import { Colors, type CapsuleType } from './constants/Colors';
import { Spacing, BorderRadius } from './constants/Spacing';
import { Typography } from './constants/Typography';

export default function DemoOpenCapsule() {
  const [selectedType, setSelectedType] = useState<CapsuleType | null>(null);

  const handleTypeSelect = (type: CapsuleType) => {
    setSelectedType(type);
  };

  const handleClose = () => {
    setSelectedType(null);
  };

  const handleContinue = () => {
    alert('Continue to Reflection screen (F9 - not implemented in this demo)');
    setSelectedType(null);
  };

  if (selectedType) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OpenCapsuleScreen
          capsule={getMockCapsule(selectedType)}
          onClose={handleClose}
          onContinue={handleContinue}
        />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 Open Capsule Demo</Text>
          <Text style={styles.subtitle}>Select a capsule type to preview F8: Open Capsule</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>UI/UX Demo - agent-uiux</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.ui.primary} />
            <Text style={styles.infoText}>
              This demo showcases the opening animation, content display, and image gallery with zoom for the Open Capsule feature.
            </Text>
          </View>

          {/* Emotion Type */}
          <TypeCard
            type="emotion"
            icon="heart"
            title="Emotion Capsule"
            description="Anxious about job interview • Has reflection • 2 images"
            onPress={() => handleTypeSelect('emotion')}
          />

          {/* Goal Type */}
          <TypeCard
            type="goal"
            icon="flag"
            title="Goal Capsule"
            description="Run a 5K marathon • Has reflection • 1 image"
            onPress={() => handleTypeSelect('goal')}
          />

          {/* Memory Type */}
          <TypeCard
            type="memory"
            icon="camera"
            title="Memory Capsule"
            description="First family beach vacation • No reflection • 3 images"
            onPress={() => handleTypeSelect('memory')}
          />

          {/* Decision Type */}
          <TypeCard
            type="decision"
            icon="scale"
            title="Decision Capsule"
            description="Starting own business • Has reflection • No images"
            onPress={() => handleTypeSelect('decision')}
          />

          <View style={styles.features}>
            <Text style={styles.featuresTitle}>Features Demonstrated:</Text>
            <FeatureItem text="Opening animation (box opening, glow effects)" />
            <FeatureItem text="Type-specific colors and styling" />
            <FeatureItem text="Content display with scrolling" />
            <FeatureItem text="Image gallery with horizontal scroll" />
            <FeatureItem text="Fullscreen image viewer with pinch zoom" />
            <FeatureItem text="Double-tap to zoom in/out" />
            <FeatureItem text="Swipe navigation between images" />
            <FeatureItem text="Metadata display (dates, duration)" />
            <FeatureItem text="Conditional button text (reflection vs archive)" />
            <FeatureItem text="Leave confirmation dialog" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

interface TypeCardProps {
  type: CapsuleType;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}

const TypeCard: React.FC<TypeCardProps> = ({
  type,
  icon,
  title,
  description,
  onPress,
}) => {
  const typeColor = Colors.capsuleTypes[type];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: typeColor.light }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: typeColor.primary }]}>
        <Ionicons name={icon} size={32} color="#FFFFFF" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: typeColor.primary }]}>
          {title}
        </Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={typeColor.primary} />
    </TouchableOpacity>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.featureItem}>
    <Ionicons name="checkmark-circle" size={20} color={Colors.ui.success} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.surface,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.ui.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  title: {
    ...Typography.h1,
    color: Colors.ui.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.ui.textSecondary,
    marginBottom: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.ui.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.ui.primary + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.ui.textPrimary,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs / 2,
  },
  cardDescription: {
    ...Typography.bodySmall,
    color: Colors.ui.textSecondary,
  },
  features: {
    backgroundColor: Colors.ui.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  featuresTitle: {
    ...Typography.h3,
    color: Colors.ui.textPrimary,
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  featureText: {
    ...Typography.bodySmall,
    color: Colors.ui.textPrimary,
    flex: 1,
  },
});
