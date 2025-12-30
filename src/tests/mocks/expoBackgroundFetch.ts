/**
 * Mock for expo-background-fetch
 */

export const BackgroundFetchStatus = {
  Denied: 1,
  Restricted: 2,
  Available: 3,
};

export const BackgroundFetchResult = {
  NoData: 1,
  NewData: 2,
  Failed: 3,
};

export const getStatusAsync = jest.fn(() =>
  Promise.resolve(BackgroundFetchStatus.Available)
);

export const setMinimumIntervalAsync = jest.fn(() => Promise.resolve());

export const registerTaskAsync = jest.fn(() => Promise.resolve());

export const unregisterTaskAsync = jest.fn(() => Promise.resolve());
