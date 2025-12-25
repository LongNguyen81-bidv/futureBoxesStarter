# F7: Push Notification - Activity Diagram

**Feature:** Push Notification
**Priority:** Must Have
**Dependencies:** F5 (Lock Capsule)

---

## 1. Overview

Push Notification thong bao cho nguoi dung khi capsule den thoi gian mo. Su dung Expo Notifications de schedule local notification. Khi user tap notification, app mo va navigate den capsule do.

---

## 2. Activity Diagram - Request Permission

```mermaid
flowchart TD
    Start([First capsule creation]) --> CheckPermission{Permission already granted?}

    CheckPermission -->|Yes| End1([End - Ready to schedule])

    CheckPermission -->|No| CheckPlatform{Platform?}

    CheckPlatform -->|iOS| RequestIOS[Request iOS notification permission]
    CheckPlatform -->|Android| CheckAndroidVersion{Android >= 13?}

    CheckAndroidVersion -->|Yes| RequestAndroid[Request Android POST_NOTIFICATIONS]
    CheckAndroidVersion -->|No| End2([End - Auto granted on Android < 13])

    RequestIOS --> IOSResult{Permission granted?}
    RequestAndroid --> AndroidResult{Permission granted?}

    IOSResult -->|Yes| SavePermission[Save permission status]
    IOSResult -->|No| ShowDenied[Show: Notifications disabled message]

    AndroidResult -->|Yes| SavePermission
    AndroidResult -->|No| ShowDenied

    SavePermission --> End3([End - Permission granted])
    ShowDenied --> End4([End - User can still create capsule])
```

---

## 3. Activity Diagram - Schedule Notification

```mermaid
flowchart TD
    Start([Capsule locked successfully]) --> CheckPermission{Notification permission?}

    CheckPermission -->|No| LogWarning[Log: No notification permission]
    LogWarning --> End1([End - No notification])

    CheckPermission -->|Yes| BuildContent[Build notification content]
    BuildContent --> SetTrigger[Set trigger date = unlockAt]
    SetTrigger --> Schedule[scheduleNotificationAsync]
    Schedule --> Result{Schedule successful?}

    Result -->|Yes| SaveNotifId[Save notification ID to capsule]
    SaveNotifId --> End2([End - Notification scheduled])

    Result -->|No| LogError[Log scheduling error]
    LogError --> End1
```

---

## 4. Activity Diagram - Notification Received (Foreground)

```mermaid
flowchart TD
    Start([Notification fires while app open]) --> ShowInApp[Show in-app notification banner]
    ShowInApp --> WaitAction{User action}

    WaitAction -->|Tap banner| NavigateCapsule[Navigate to capsule]
    NavigateCapsule --> End1([End - Open capsule])

    WaitAction -->|Dismiss| HideBanner[Hide banner]
    HideBanner --> End2([End - Dismissed])

    WaitAction -->|Ignore timeout| AutoHide[Auto-hide after 5 seconds]
    AutoHide --> End2
```

---

## 5. Activity Diagram - Notification Received (Background/Killed)

```mermaid
flowchart TD
    Start([User taps notification]) --> AppLaunch{App state}

    AppLaunch -->|Background| BringToForeground[Bring app to foreground]
    AppLaunch -->|Killed| LaunchApp[Launch app]

    BringToForeground --> ProcessNotif
    LaunchApp --> ProcessNotif[Process notification data]

    ProcessNotif --> ExtractData[Extract capsuleId from data]
    ExtractData --> QueryCapsule[Query capsule from database]
    QueryCapsule --> Found{Capsule exists?}

    Found -->|No| ShowError[Show: Capsule not found]
    ShowError --> NavigateHome[Navigate to Home]
    NavigateHome --> End1([End])

    Found -->|Yes| CheckStatus{Capsule status?}

    CheckStatus -->|ready| NavigateOpen[Navigate to Open Capsule Screen]
    NavigateOpen --> End2([End - Opening capsule])

    CheckStatus -->|locked| UpdateStatus[Update status to 'ready']
    UpdateStatus --> NavigateOpen

    CheckStatus -->|opened| NavigateDetail[Navigate to Capsule Detail]
    NavigateDetail --> End3([End - View archived])
```

---

## 6. Notification Content

### 6.1 Content by Capsule Type

| Type | Title | Body |
|------|-------|------|
| Emotion | Time Capsule Ready! | Your Emotion capsule is ready to open! |
| Goal | Time Capsule Ready! | Your Goal capsule is ready to open! |
| Memory | Time Capsule Ready! | Your Memory capsule is ready to open! |
| Decision | Time Capsule Ready! | Your Decision capsule is ready to open! |

### 6.2 Notification Structure

```typescript
interface NotificationContent {
  title: string;
  body: string;
  data: {
    capsuleId: string;
    type: string;
  };
  sound: 'default';
  badge: number; // iOS only
}
```

---

## 7. Implementation Details

### 7.1 Schedule Notification

```typescript
async function scheduleNotification(capsule: Capsule): Promise<string | null> {
  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time Capsule Ready!',
        body: `Your ${capsule.type} capsule is ready to open!`,
        data: {
          capsuleId: capsule.id,
          type: capsule.type,
        },
        sound: 'default',
      },
      trigger: {
        date: new Date(capsule.unlockAt),
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}
```

### 7.2 Handle Notification Response

```typescript
// Set up notification response handler
Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;

  if (data.capsuleId) {
    // Navigate to capsule
    navigationRef.current?.navigate('OpenCapsule', {
      capsuleId: data.capsuleId,
    });
  }
});
```

### 7.3 Handle Foreground Notification

```typescript
// Set up foreground notification handler
Notifications.addNotificationReceivedListener((notification) => {
  const data = notification.request.content.data;

  // Show in-app notification
  showInAppNotification({
    title: notification.request.content.title,
    body: notification.request.content.body,
    onPress: () => {
      navigationRef.current?.navigate('OpenCapsule', {
        capsuleId: data.capsuleId,
      });
    },
  });
});
```

---

## 8. User Interaction Flow

### 8.1 Lan dau tao capsule

1. User tap Lock de tao capsule
2. App check notification permission
3. Neu chua co, hien dialog xin permission
4. User cho phep hoac tu choi
5. Neu cho phep, app schedule notification

### 8.2 Nhan notification khi app dong

1. Den gio unlock, notification hien tren device
2. User tap notification
3. App mo va navigate den Open Capsule Screen
4. User co the mo capsule

### 8.3 Nhan notification khi app dang mo

1. Den gio unlock, in-app banner hien o tren
2. User tap banner de di den capsule
3. Hoac banner tu an sau 5 giay

---

## 9. Permission Handling

### 9.1 iOS Permission Flow

| Step | Action |
|------|--------|
| 1 | Call `requestPermissionsAsync()` |
| 2 | System dialog appears |
| 3 | User taps Allow or Don't Allow |
| 4 | Save result to AsyncStorage |

### 9.2 Android Permission Flow

| Android Version | Behavior |
|-----------------|----------|
| < 13 (API 32) | Auto granted |
| >= 13 (API 33) | Must request POST_NOTIFICATIONS |

---

## 10. Notification Categories (Future)

```typescript
// Define action categories (optional)
await Notifications.setNotificationCategoryAsync('capsule', [
  {
    identifier: 'open',
    buttonTitle: 'Open Now',
    options: { opensAppToForeground: true },
  },
  {
    identifier: 'remind',
    buttonTitle: 'Remind Later',
    options: { opensAppToForeground: false },
  },
]);
```

---

## 11. Error Handling

| Error | Handling |
|-------|----------|
| Permission denied | Log warning, continue without notification |
| Schedule failed | Log error, continue (capsule still works) |
| Capsule not found on tap | Show error, navigate to Home |
| Multiple notifications | Only one per capsule |

---

## 12. Edge Cases

| Case | Handling |
|------|----------|
| App uninstalled | Notification cancelled by system |
| Device reboot | Expo handles rescheduling |
| Past date scheduled | Notification fires immediately |
| Notification disabled in settings | Respect user choice |
| Time zone change | Use UTC internally |

---

## 13. Testing Checklist

| Test | Expected Result |
|------|-----------------|
| Schedule notification | Notification ID returned |
| Notification at unlock time | Notification appears |
| Tap notification (app killed) | App opens, navigates to capsule |
| Tap notification (app background) | App foregrounds, navigates |
| Tap notification (app open) | In-app banner shown |
| Permission denied | Capsule created without notification |

---

*F7 Activity Diagram End*
