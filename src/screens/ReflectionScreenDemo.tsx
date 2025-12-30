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
    title: 'Cảm xúc - Lo lắng',
    type: 'emotion',
    question: 'Cảm giác lo lắng này đã qua chưa?',
    description: 'Nút Có/Không cho suy ngẫm cảm xúc',
  },
  {
    id: '2',
    title: 'Cảm xúc - Hạnh phúc',
    type: 'emotion',
    question: 'Bạn vẫn hạnh phúc như vậy chứ?',
    description: 'Nút Có/Không cho cảm xúc tích cực',
  },
  {
    id: '3',
    title: 'Mục tiêu - Chạy 5km',
    type: 'goal',
    question: 'Bạn đã đạt được mục tiêu chạy 5km chưa?',
    description: 'Nút Có/Không cho mục tiêu đạt được',
  },
  {
    id: '4',
    title: 'Mục tiêu - Học Guitar',
    type: 'goal',
    question: 'Bạn đã học được 3 bài hát guitar chưa?',
    description: 'Nút Có/Không cho mục tiêu kỹ năng',
  },
  {
    id: '5',
    title: 'Quyết định - Đổi việc',
    type: 'decision',
    question: 'Nghỉ việc có phải là quyết định đúng đắn?',
    description: 'Đánh giá 1-5 sao cho quyết định quan trọng',
  },
  {
    id: '6',
    title: 'Quyết định - Chuyển thành phố',
    type: 'decision',
    question: 'Bây giờ bạn cảm thấy thế nào về việc chuyển đến thành phố mới?',
    description: 'Đánh giá 1-5 sao cho quyết định địa điểm',
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
        <Text style={styles.headerTitle}>Demo Suy ngẫm</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialCommunityIcons name="information" size={20} color={UIColors.primary} />
        <Text style={styles.infoText}>
          Chạm vào bất kỳ kịch bản nào bên dưới để kiểm tra UI/UX Suy ngẫm
        </Text>
      </View>

      {/* Scenarios List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Kịch bản kiểm tra</Text>

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
              <Text style={styles.testLabel}>Chạm để kiểm tra</Text>
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
