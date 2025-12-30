/**
 * Mock for react-native-reanimated
 * Custom implementation to avoid worklets dependency
 */

const Animated = {
  View: require('react-native').View,
  Text: require('react-native').Text,
  ScrollView: require('react-native').ScrollView,
  Image: require('react-native').Image,
  TouchableOpacity: require('react-native').TouchableOpacity,
  FlatList: require('react-native').FlatList,
  createAnimatedComponent: (component: any) => component,
};

// Mock hooks
export const useSharedValue = jest.fn((initialValue: any) => ({
  value: initialValue,
}));

export const useAnimatedStyle = jest.fn((styleFunc: () => any) => {
  try {
    return styleFunc();
  } catch {
    return {};
  }
});

export const withTiming = jest.fn((value: any) => value);
export const withSpring = jest.fn((value: any) => value);
export const withSequence = jest.fn((...values: any[]) => values[0]);
export const withRepeat = jest.fn((animation: any) => animation);
export const withDelay = jest.fn((delay: number, animation: any) => animation);

export const useAnimatedGestureHandler = jest.fn((handlers: any) => handlers);
export const useAnimatedScrollHandler = jest.fn((handler: any) => handler);
export const useWorkletCallback = jest.fn((callback: any) => callback);
export const useDerivedValue = jest.fn((valueFunc: () => any) => ({
  value: valueFunc(),
}));

export const runOnJS = jest.fn((fn: any) => fn);
export const runOnUI = jest.fn((fn: any) => fn);

export const Easing = {
  linear: jest.fn(),
  ease: jest.fn(),
  quad: jest.fn(),
  cubic: jest.fn(),
  bezier: jest.fn(),
  in: jest.fn(),
  out: jest.fn(),
  inOut: jest.fn(),
};

export const Extrapolate = {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
};

export const interpolate = jest.fn((value: number, input: number[], output: number[]) => {
  return output[0];
});

export const cancelAnimation = jest.fn();
export const measure = jest.fn();
export const scrollTo = jest.fn();

export default Animated;
