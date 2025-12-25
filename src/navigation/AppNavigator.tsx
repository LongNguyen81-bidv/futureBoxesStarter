/**
 * App Navigator
 *
 * Main navigation stack for FutureBoxes app.
 *
 * Stack Routes:
 * - Home: Main screen with capsule grid
 * - TypeSelection: Choose capsule type when creating
 * - OpenCapsule: View and interact with ready capsule
 * - Archive: View opened capsules history
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TypeSelectionScreen } from '../screens/TypeSelectionScreen';
import { CreateCapsuleScreen } from '../screens/CreateCapsuleScreen';
import { PreviewCapsuleScreen } from '../screens/PreviewCapsuleScreen';
import { OpenCapsuleScreen } from '../screens/OpenCapsuleScreen';
import { ReflectionScreen } from '../screens/ReflectionScreen';
import { CelebrationPlaceholderScreen } from '../screens/CelebrationPlaceholderScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { CapsuleType } from '../types/capsule';

/**
 * Navigation parameter list
 * Defines the params for each screen in the stack
 */
export type RootStackParamList = {
  Home: undefined;
  TypeSelection: undefined;
  CreateCapsule: { type: CapsuleType };
  PreviewCapsule: {
    type: CapsuleType;
    content: string;
    images: string[];
    reflectionQuestion: string | null;
    unlockAt: Date;
  };
  OpenCapsule: { capsuleId: string };
  Reflection: {
    capsuleId: string;
    type: CapsuleType;
    reflectionQuestion: string;
  };
  Celebration: {
    capsuleId: string;
    type: CapsuleType;
    answer: string;
  };
  Archive: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="TypeSelection"
        component={TypeSelectionScreen}
        options={{
          presentation: 'modal',
          gestureDirection: 'vertical',
        }}
      />
      <Stack.Screen
        name="CreateCapsule"
        component={CreateCapsuleScreen}
        options={{
          presentation: 'card',
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen
        name="PreviewCapsule"
        component={PreviewCapsuleScreen}
        options={{
          presentation: 'card',
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen
        name="OpenCapsule"
        component={OpenCapsuleScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="Reflection"
        component={ReflectionScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="Celebration"
        component={CelebrationPlaceholderScreen}
        options={{
          presentation: 'card',
          gestureEnabled: false, // Prevent swipe back from Celebration
        }}
      />
      <Stack.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
