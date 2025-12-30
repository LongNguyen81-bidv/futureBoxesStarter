/**
 * OnboardingScreen
 *
 * First-time user experience with 4-slide carousel.
 * Features:
 * - Swipe navigation (left/right)
 * - Skip button (slides 1-3)
 * - Back/Next navigation buttons
 * - Page indicators
 * - Smooth animations with Reanimated
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { OnboardingSlide, OnboardingSlideData } from '../components/OnboardingSlide';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, BorderRadius, TouchTarget } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Onboarding slide data
const SLIDES: OnboardingSlideData[] = [
  {
    id: 0,
    type: 'welcome',
    title: 'Chào mừng đến FutureBoxes',
    subtitle: 'Gửi tin nhắn cho chính bạn trong tương lai',
  },
  {
    id: 1,
    type: 'create',
    title: 'Ghi lại khoảnh khắc',
    subtitle: 'Viết suy nghĩ, thêm ảnh và đặt câu hỏi để suy ngẫm',
  },
  {
    id: 2,
    type: 'wait',
    title: 'Khóa lại',
    subtitle: 'Viên nang của bạn đã được niêm phong. Không được nhìn trộm cho đến ngày mở khóa!',
  },
  {
    id: 3,
    type: 'reflect',
    title: 'Mở và suy ngẫm',
    subtitle: 'Khi đến lúc, hãy mở viên nang và xem bạn đã trưởng thành như thế nào',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      // Update current index
      const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(setCurrentIndex)(index);
    },
  });

  // Navigation functions
  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      // Last slide - complete onboarding
      handleGetStarted();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: prevIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleGetStarted = () => {
    onComplete();
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;
  const isFirstSlide = currentIndex === 0;
  const showSkipButton = !isLastSlide;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ui.background} />

      {/* Skip Button */}
      {showSkipButton && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      )}

      {/* Slides Carousel */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {SLIDES.map((slide) => (
          <OnboardingSlide
            key={slide.id}
            data={slide}
            isActive={currentIndex === slide.id}
          />
        ))}
      </Animated.ScrollView>

      {/* Page Indicators */}
      <View style={styles.pageIndicatorContainer}>
        {SLIDES.map((_, index) => {
          const dotAnimatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH,
            ];

            const scale = interpolate(
              scrollX.value,
              inputRange,
              [0.8, 1.2, 0.8],
              'clamp'
            );

            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.3, 1, 0.3],
              'clamp'
            );

            return {
              transform: [{ scale }],
              opacity,
            };
          });

          const isActive = currentIndex === index;

          return (
            <Animated.View
              key={index}
              style={[
                styles.pageIndicator,
                isActive && styles.pageIndicatorActive,
                dotAnimatedStyle,
              ]}
            />
          );
        })}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={[
            styles.navigationButton,
            styles.backButton,
            isFirstSlide && styles.navigationButtonHidden,
          ]}
          onPress={handleBack}
          disabled={isFirstSlide}
        >
          <Text
            style={[
              styles.navigationButtonText,
              styles.backButtonText,
              isFirstSlide && styles.navigationButtonTextHidden,
            ]}
          >
            Quay lại
          </Text>
        </TouchableOpacity>

        {/* Next / Get Started Button */}
        <TouchableOpacity
          style={[styles.navigationButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={[styles.navigationButtonText, styles.nextButtonText]}>
            {isLastSlide ? 'Bắt đầu' : 'Tiếp theo'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  skipButton: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 50,
    right: Spacing.lg,
    zIndex: 10,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    ...Typography.body,
    color: Colors.ui.textMuted,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  pageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: 12,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.ui.border,
  },
  pageIndicatorActive: {
    backgroundColor: Colors.ui.primary,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  navigationButton: {
    flex: 1,
    height: TouchTarget.default,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtonHidden: {
    opacity: 0,
  },
  backButton: {
    backgroundColor: Colors.ui.surface,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  nextButton: {
    backgroundColor: Colors.ui.primary,
  },
  navigationButtonText: {
    ...Typography.button,
  },
  backButtonText: {
    color: Colors.ui.textSecondary,
  },
  nextButtonText: {
    color: Colors.ui.background,
  },
  navigationButtonTextHidden: {
    opacity: 0,
  },
});
