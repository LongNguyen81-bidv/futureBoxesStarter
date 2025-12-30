/**
 * Mock for expo-notifications
 */

const scheduledNotifications: Map<string, any> = new Map();

export const setNotificationHandler = jest.fn();

export const getPermissionsAsync = jest.fn(() =>
  Promise.resolve({
    status: 'granted',
    expires: 'never',
    allowsSound: true,
    allowsAlert: true,
    allowsBadge: true,
  })
);

export const requestPermissionsAsync = jest.fn(() =>
  Promise.resolve({
    status: 'granted',
    expires: 'never',
    allowsSound: true,
    allowsAlert: true,
    allowsBadge: true,
  })
);

export const scheduleNotificationAsync = jest.fn((content: any, trigger: any) => {
  const id = `notification-${Date.now()}-${Math.random()}`;
  scheduledNotifications.set(id, { content, trigger });
  return Promise.resolve(id);
});

export const cancelScheduledNotificationAsync = jest.fn((notificationId: string) => {
  scheduledNotifications.delete(notificationId);
  return Promise.resolve();
});

export const cancelAllScheduledNotificationsAsync = jest.fn(() => {
  scheduledNotifications.clear();
  return Promise.resolve();
});

export const getAllScheduledNotificationsAsync = jest.fn(() => {
  return Promise.resolve(
    Array.from(scheduledNotifications.entries()).map(([id, notification]) => ({
      identifier: id,
      ...notification,
    }))
  );
});

export const addNotificationReceivedListener = jest.fn(() => ({
  remove: jest.fn(),
}));

export const addNotificationResponseReceivedListener = jest.fn(() => ({
  remove: jest.fn(),
}));

export const setNotificationChannelAsync = jest.fn(() => Promise.resolve());

export const getNotificationChannelsAsync = jest.fn(() => Promise.resolve([]));

export const deleteNotificationChannelAsync = jest.fn(() => Promise.resolve());

export const AndroidImportance = {
  MIN: 1,
  LOW: 2,
  DEFAULT: 3,
  HIGH: 4,
  MAX: 5,
};

// Helper to reset notifications
export const __reset = () => {
  scheduledNotifications.clear();
};

// Helper to get scheduled notifications
export const __getScheduledNotifications = () => {
  return Array.from(scheduledNotifications.entries());
};
