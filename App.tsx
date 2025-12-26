import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useDatabase } from './src/hooks';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { isFirstLaunch, completeOnboarding } from './src/services/onboardingService';

// Import dev tools in development mode
if (__DEV__) {
  require('./src/utils/devTools');
}

export default function App() {
  const { isReady, isLoading: isDatabaseLoading, isError, error } = useDatabase();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Check if this is first launch
  useEffect(() => {
    checkFirstLaunch();
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
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
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
