/**
 * Demo Onboarding Screen
 *
 * Test component to preview Onboarding UI/UX.
 * Replace App.tsx content temporarily with this to test.
 *
 * Usage:
 * 1. Copy content of this file
 * 2. Paste into App.tsx temporarily
 * 3. Run: npx expo start
 * 4. Test on device/simulator
 */

import React from 'react';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

export default function App() {
  const handleOnboardingComplete = () => {
    console.log('Onboarding completed!');
    // In real app, this will:
    // - Save AsyncStorage.setItem('onboardingCompleted', 'true')
    // - Navigate to Home screen
    alert('Onboarding Complete! (In production, this would navigate to Home)');
  };

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}
