import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useDatabase } from './src/hooks';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RootStackParamList } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { isFirstLaunch, completeOnboarding } from './src/services/onboardingService';
import { registerBackgroundTask, updatePendingCapsules } from './src/services';
import { InAppNotificationBanner } from './src/components';

// Import dev tools in development mode
if (__DEV__) {
  require('./src/utils/devTools');
}

export default function App() {
  const { isReady, isLoading: isDatabaseLoading, isError, error } = useDatabase();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [inAppNotification, setInAppNotification] = useState<{
    title: string;
    body: string;
    capsuleId: string;
  } | null>(null);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Check if this is first launch and register background tasks
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  // Register background task when database is ready
  useEffect(() => {
    if (isReady) {
      initializeApp();
    }
  }, [isReady]);

  // Set up notification listeners
  useEffect(() => {
    // Listener for notification response (user taps notification)
    // Handles background and killed states
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const { capsuleId } = response.notification.request.content.data as {
          capsuleId?: string;
          type?: string;
        };

        if (__DEV__) {
          console.log('[App] Notification tapped:', { capsuleId });
        }

        if (capsuleId && navigationRef.current?.isReady()) {
          // Navigate to OpenCapsule screen
          navigationRef.current.navigate('OpenCapsule', { capsuleId });
        } else if (capsuleId) {
          // Navigation not ready yet, wait and retry
          setTimeout(() => {
            if (navigationRef.current?.isReady()) {
              navigationRef.current.navigate('OpenCapsule', { capsuleId });
            }
          }, 500);
        }
      }
    );

    // Listener for notification received in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { capsuleId, type } = notification.request.content.data as {
          capsuleId?: string;
          type?: string;
        };

        if (__DEV__) {
          console.log('[App] Foreground notification received:', { capsuleId, type });
        }

        if (capsuleId) {
          // Show in-app notification banner
          setInAppNotification({
            title: notification.request.content.title || 'Time Capsule Ready!',
            body: notification.request.content.body || 'Your capsule is ready to open!',
            capsuleId,
          });
        }
      }
    );

    return () => {
      responseSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const isFirst = await isFirstLaunch();
      setShowOnboarding(isFirst);

      if (__DEV__) {
        console.log('[App] First launch check:', { isFirst });
      }
    } catch (error) {
      console.error('[App] Failed to check first launch:', error);
      // On error, skip onboarding to not block user
      setShowOnboarding(false);
    }
  };

  const initializeApp = async () => {
    try {
      // Register background task for capsule timer checks
      await registerBackgroundTask();
      console.log('[App] Background task registered');

      // Check and update expired capsules on app start
      const updatedCount = await updatePendingCapsules();
      if (updatedCount > 0) {
        console.log(`[App] Updated ${updatedCount} expired capsule(s) on launch`);
      }
    } catch (error) {
      console.error('[App] Failed to initialize app services:', error);
      // Don't block app launch on failure
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await completeOnboarding();

      if (__DEV__) {
        console.log('[App] Onboarding completed, navigating to Home');
      }

      setShowOnboarding(false);
    } catch (error) {
      console.error('[App] Failed to save onboarding completion:', error);
      // Still navigate to Home even if save fails
      // User might see onboarding again on next launch, but that's acceptable
      setShowOnboarding(false);
    }
  };

  const handleInAppNotificationPress = () => {
    if (inAppNotification && navigationRef.current?.isReady()) {
      navigationRef.current.navigate('OpenCapsule', {
        capsuleId: inAppNotification.capsuleId,
      });
      setInAppNotification(null);
    }
  };

  const handleInAppNotificationDismiss = () => {
    setInAppNotification(null);
  };

  // Show loading while database initializes OR checking first launch
  if (isDatabaseLoading || showOnboarding === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.subtitle}>
          {isDatabaseLoading ? 'Initializing Database...' : 'Loading...'}
        </Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Show error if database fails
  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Database Error</Text>
        <Text style={styles.errorMessage}>{error?.message}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Show onboarding on first launch
  if (showOnboarding) {
    return (
      <>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
        <StatusBar style="auto" />
      </>
    );
  }

  // Database ready and onboarding completed - show main app
  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
      <StatusBar style="auto" />

      {/* In-app notification banner for foreground notifications */}
      {inAppNotification && (
        <InAppNotificationBanner
          title={inAppNotification.title}
          body={inAppNotification.body}
          onPress={handleInAppNotificationPress}
          onDismiss={handleInAppNotificationDismiss}
        />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
