/**
 * In-App Notification Banner
 *
 * Displays a banner at the top of the screen when notification is received
 * while app is in foreground.
 *
 * Features:
 * - Slides in from top with animation
 * - Auto-dismisses after 5 seconds
 * - Can be manually dismissed with X button
 * - Can be tapped to trigger navigation action
 * - Uses safe area context to avoid notch
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_HEIGHT = 80;
const AUTO_DISMISS_DURATION = 5000; // 5 seconds

export interface InAppNotificationProps {
  title: string;
  body: string;
  onPress?: () => void;
  onDismiss: () => void;
}

export const InAppNotificationBanner: React.FC<InAppNotificationProps> = ({
  title,
  body,
  onPress,
  onDismiss,
}) => {
  const slideAnim = useRef(new Animated.Value(-BANNER_HEIGHT)).current;
  const autoDismissTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    // Auto-dismiss after 5 seconds
    autoDismissTimer.current = setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_DURATION);

    return () => {
      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    // Clear auto-dismiss timer
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
    }

    // Slide out animation
    Animated.timing(slideAnim, {
      toValue: -BANNER_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const handlePress = () => {
    // Clear auto-dismiss timer
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
    }

    // Call onPress if provided
    if (onPress) {
      onPress();
    }

    // Dismiss banner
    handleDismiss();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.banner}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="gift" size={28} color="#007AFF" />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.body} numberOfLines={2}>
              {body}
            </Text>
          </View>

          {/* Dismiss button */}
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  safeArea: {
    backgroundColor: '#fff',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  body: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  dismissButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
