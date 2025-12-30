/**
 * Unit Tests for Notification Service
 */

import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  scheduleNotification,
  cancelNotification,
} from '../notificationService';
import { createMockCapsule, createReadyCapsule } from '../../tests/utils/testHelpers';

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestNotificationPermissions', () => {
    it('should return true when permission is already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await requestNotificationPermissions();

      expect(result).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('should request permission when not granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await requestNotificationPermissions();

      expect(result).toBe(true);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when permission is denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await requestNotificationPermissions();

      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await requestNotificationPermissions();

      expect(result).toBe(false);
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule notification for locked capsule', async () => {
      const capsule = createMockCapsule();
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        'notification-id-123'
      );

      const notificationId = await scheduleNotification(capsule);

      expect(notificationId).toBe('notification-id-123');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: expect.stringContaining('capsule is ready'),
            body: expect.any(String),
            data: expect.objectContaining({
              capsuleId: capsule.id,
              type: capsule.type,
            }),
          }),
          trigger: expect.objectContaining({
            date: expect.any(Date),
          }),
        })
      );
    });

    it('should return null when permission is denied', async () => {
      const capsule = createMockCapsule();
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const notificationId = await scheduleNotification(capsule);

      expect(notificationId).toBeNull();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('should return null for capsules with unlock date in the past', async () => {
      const capsule = createReadyCapsule();
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const notificationId = await scheduleNotification(capsule);

      expect(notificationId).toBeNull();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('should handle scheduling errors', async () => {
      const capsule = createMockCapsule();
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        new Error('Schedule failed')
      );

      const notificationId = await scheduleNotification(capsule);

      expect(notificationId).toBeNull();
    });
  });

  describe('cancelNotification', () => {
    it('should cancel scheduled notification', async () => {
      const notificationId = 'notification-id-123';

      await cancelNotification(notificationId);

      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        notificationId
      );
    });

    it('should handle cancellation errors gracefully', async () => {
      const notificationId = 'notification-id-123';
      (Notifications.cancelScheduledNotificationAsync as jest.Mock).mockRejectedValue(
        new Error('Cancel failed')
      );

      await expect(cancelNotification(notificationId)).resolves.not.toThrow();
    });
  });
});
