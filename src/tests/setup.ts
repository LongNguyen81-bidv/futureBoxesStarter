/**
 * Jest Setup File
 * Global test configuration and mocks
 */

import '@testing-library/react-native';

// Silence console errors/warnings in tests
// Note: Temporarily commented out to avoid conflict with jest-expo
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
//   log: jest.fn(),
// };

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('./mocks/asyncStorage')
);

// Mock expo-sqlite
jest.mock('expo-sqlite', () => require('./mocks/expoSQLite'));

// Mock expo-file-system
jest.mock('expo-file-system', () => require('./mocks/expoFileSystem'));

// Mock expo-notifications
jest.mock('expo-notifications', () => require('./mocks/expoNotifications'));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => require('./mocks/expoImagePicker'));

// Mock expo-haptics
jest.mock('expo-haptics', () => require('./mocks/expoHaptics'));

// Mock expo-task-manager
jest.mock('expo-task-manager', () => require('./mocks/expoTaskManager'));

// Mock expo-modules-core
jest.mock('expo-modules-core', () => require('./mocks/expoModulesCore'));

// Mock expo-background-fetch
jest.mock('expo-background-fetch', () => require('./mocks/expoBackgroundFetch'));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: View,
    MaterialIcons: View,
    FontAwesome: View,
    Ionicons: View,
    Feather: View,
    AntDesign: View,
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => require('./mocks/reactNativeReanimated'));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock @react-navigation/native
// Store mock params so tests can override them
let mockRouteParams: any = {};

export const setMockRouteParams = (params: any) => {
  mockRouteParams = params;
};

export const clearMockRouteParams = () => {
  mockRouteParams = {};
};

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: mockRouteParams,
      key: 'test-route',
      name: 'TestScreen',
    }),
    useFocusEffect: jest.fn(),
  };
});

// Mock lottie-react-native
jest.mock('lottie-react-native', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef(() => null),
  };
});
