/**
 * Reflection Screen Demo
 *
 * Demo screen để test và showcase các UI states của ReflectionScreen:
 * - Emotion type (Yes/No)
 * - Goal type (Yes/No)
 * - Decision type (Rating 1-5)
 *
 * Có thể truy cập từ Home screen để test UI/UX.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/AppNavigator';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface DemoScenario {
  id: string;
  title: string;
  type: 'emotion' | 'goal' | 'decision';
  question: string;
  description: string;
}

const demoScenarios: DemoScenario[] = [
  {
    id: '1',
    title: 'Emotion - Anxiety',
    type: 'emotion',
    question: 'Did this feeling of anxiety pass?',
    description: 'Yes/No buttons for emotion reflection',
  },
  {
    id: '2',
    title: 'Emotion - Happiness',
    type: 'emotion',
    question: 'Are you still this happy?',
    description: 'Yes/No buttons for positive emotion',
  },
  {
    id: '3',
    title: 'Goal - Running 5k',
    type: 'goal',
    question: 'Did you achieve your goal of running 5k?',
    description: 'Yes/No buttons for goal achievement',
  },
  {
    id: '4',
    title: 'Goal - Learn Guitar',
    type: 'goal',
    question: 'Did you learn to play 3 songs on guitar?',
    description: 'Yes/No buttons for skill goal',
  },
  {
    id: '5',
    title: 'Decision - Job Change',
    type: 'decision',
    question: 'Was quitting your job the right decision?',
    description: 'Rating 1-5 for major life decision',
  },
  {
    id: '6',
    title: 'Decision - Moving City',
    type: 'decision',
    question: 'How do you feel about moving to a new city now?',
    description: 'Rating 1-5 for location decision',
  },
];

export const ReflectionScreenDemo: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleScenarioPress = (scenario: DemoScenario) => {
    // @ts-ignore - Navigate to Reflection screen with demo data
    navigation.navigate('Reflection', {
      capsuleId: `demo-${scenario.id}`,
      type: scenario.type,
      reflectionQuestion: scenario.question,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={UIColors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reflection Demo</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialCommunityIcons name="information" size={20} color={UIColors.primary} />
        <Text style={styles.infoText}>
          Tap any scenario below to test the Reflection UI/UX
        </Text>
      </View>

      {/* Scenarios List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Test Scenarios</Text>

        {demoScenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            style={styles.scenarioCard}
            onPress={() => handleScenarioPress(scenario)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name={
                  scenario.type === 'emotion'
                    ? 'heart'
                    : scenario.type === 'goal'
                    ? 'flag-checkered'
                    : 'scale-balance'
                }
                size={24}
                color={
                  scenario.type === 'emotion'
                    ? '#E91E63'
                    : scenario.type === 'goal'
                    ? '#4CAF50'
                    : '#2196F3'
                }
              />
              <Text style={styles.cardTitle}>{scenario.title}</Text>
            </View>
            <Text style={styles.cardQuestion}>"{scenario.question}"</Text>
            <Text style={styles.cardDescription}>{scenario.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.testLabel}>Tap to test</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={UIColors.textSecondary}
              />
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UIColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: UIColors.borderLight,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: UIColors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: UIColors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: UIColors.borderLight,
  },
  infoText: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h2,
    color: UIColors.textPrimary,
    marginBottom: Spacing.md,
  },
  scenarioCard: {
    backgroundColor: UIColors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: UIColors.border,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    ...Typography.h3,
    color: UIColors.textPrimary,
    flex: 1,
  },
  cardQuestion: {
    ...Typography.body,
    color: UIColors.textPrimary,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    ...Typography.bodySmall,
    color: UIColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: UIColors.borderLight,
  },
  testLabel: {
    ...Typography.bodySmall,
    color: UIColors.primary,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

export default ReflectionScreenDemo;
