/**
 * Mock for expo-modules-core
 */

export class EventEmitter {
  addListener = jest.fn(() => ({ remove: jest.fn() }));
  removeListener = jest.fn();
  removeAllListeners = jest.fn();
  emit = jest.fn();
}

export const NativeModulesProxy = {};

export const requireNativeModule = jest.fn();

export const requireOptionalNativeModule = jest.fn();

export const requireNativeViewManager = jest.fn((viewName: string) => {
  const { View } = require('react-native');
  return View;
});

export const Platform = {
  OS: 'ios',
  Version: '14.0',
  select: jest.fn((obj) => obj.ios || obj.default),
};

export const CodedError = class CodedError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
};

export const UnavailabilityError = class UnavailabilityError extends Error {};
