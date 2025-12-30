/**
 * Test Utilities and Helpers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Capsule, CapsuleType, CapsuleStatus } from '../../types/capsule';

/**
 * Custom render with providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRouteName?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <NavigationContainer>{children}</NavigationContainer>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock Capsule Factory
 */
export const createMockCapsule = (overrides?: Partial<Capsule>): Capsule => {
  const now = Date.now();
  const unlockDate = new Date(now + 7 * 24 * 60 * 60 * 1000); // 1 week from now

  return {
    id: `capsule-${Math.random()}`,
    type: 'emotion',
    status: 'locked',
    content: 'Test capsule content',
    reflectionQuestion: 'Did you feel better?',
    reflectionAnswer: null,
    createdDate: new Date(now).toISOString(),
    unlockDate: unlockDate.toISOString(),
    openedDate: null,
    imagePaths: [],
    ...overrides,
  };
};

/**
 * Mock multiple capsules
 */
export const createMockCapsules = (count: number): Capsule[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockCapsule({
      id: `capsule-${index}`,
      type: ['emotion', 'goal', 'memory', 'decision'][
        index % 4
      ] as CapsuleType,
    })
  );
};

/**
 * Mock ready capsule (unlockDate in the past)
 */
export const createReadyCapsule = (overrides?: Partial<Capsule>): Capsule => {
  const now = Date.now();
  const unlockDate = new Date(now - 1000); // 1 second ago

  return createMockCapsule({
    status: 'ready',
    unlockDate: unlockDate.toISOString(),
    ...overrides,
  });
};

/**
 * Mock opened capsule
 */
export const createOpenedCapsule = (overrides?: Partial<Capsule>): Capsule => {
  const now = Date.now();
  const unlockDate = new Date(now - 7 * 24 * 60 * 60 * 1000); // 1 week ago

  return createMockCapsule({
    status: 'opened',
    unlockDate: unlockDate.toISOString(),
    openedDate: new Date(now - 1000).toISOString(),
    reflectionAnswer: 'yes',
    ...overrides,
  });
};

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock navigation prop
 */
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  reset: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

/**
 * Mock route prop
 */
export const createMockRoute = <T extends object>(params?: T) => ({
  key: 'test-route',
  name: 'TestScreen',
  params: params || ({} as T),
});

// Re-export testing library utilities
export * from '@testing-library/react-native';
export { renderWithProviders as render };
