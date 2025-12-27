# F7: Push Notification - Testing Guide

## Overview

Feature F7 (Push Notification) is now complete with the following enhancements:

### What Was Implemented

1. **InAppNotificationBanner Component** (NEW)
   - Beautiful banner that slides in from top
   - Auto-dismisses after 5 seconds
   - Manual dismiss with X button
   - Tap to navigate to capsule
   - Safe area support for notch devices

2. **Notification Response Listener** (App.tsx)
   - Handles notification tap when app is in background
   - Handles notification tap when app is killed (cold start)
   - Navigates to OpenCapsule screen with capsuleId
   - Waits for navigation to be ready (handles race conditions)

3. **Foreground Notification Listener** (App.tsx)
   - Detects notification when app is open
   - Shows in-app banner instead of system notification
   - User can tap banner to navigate or dismiss it

4. **Error Handling**
   - OpenCapsuleScreenContainer already handles:
     - Capsule not found → Show error, navigate back
     - Capsule already opened → Offer to go to Archive
     - Capsule still locked → Show error message

---

## Testing Checklist

### Prerequisites

1. **Create a test capsule with short unlock time:**
   ```
   - Type: Any (Emotion, Goal, Memory, Decision)
   - Content: "Test notification"
   - Unlock time: 2 minutes from now
   ```

2. **Grant notification permissions:**
   - On iOS: Tap "Allow" when prompted
   - On Android 13+: Tap "Allow" when prompted
   - On Android < 13: Auto-granted

---

### Test Case 1: Foreground Notification (App Open)

**Steps:**
1. Create a capsule with unlock time 2 minutes from now
2. Keep app open on Home screen
3. Wait for notification to fire

**Expected Result:**
- ✅ In-app banner slides in from top
- ✅ Banner shows: "Time Capsule Ready!"
- ✅ Banner shows: "Your [Type] capsule is ready to open!"
- ✅ Gift icon (🎁) displayed
- ✅ Banner auto-dismisses after 5 seconds

**Interaction Test:**
- **Tap banner** → Should navigate to OpenCapsule screen
- **Tap X button** → Should dismiss banner immediately
- **Ignore banner** → Should auto-dismiss after 5 seconds

---

### Test Case 2: Background Notification (App Backgrounded)

**Steps:**
1. Create a capsule with unlock time 2 minutes from now
2. Lock capsule successfully
3. Press Home button to background app
4. Wait for notification to fire
5. Tap notification from notification center

**Expected Result:**
- ✅ System notification appears in notification center
- ✅ Shows: "Time Capsule Ready!"
- ✅ Shows: "Your [Type] capsule is ready to open!"
- ✅ Tap notification → App comes to foreground
- ✅ App navigates to OpenCapsule screen
- ✅ Capsule content loads and displays correctly

---

### Test Case 3: Notification from Killed State (Cold Start)

**Steps:**
1. Create a capsule with unlock time 2 minutes from now
2. Lock capsule successfully
3. Force quit app completely (swipe up from multitasking)
4. Wait for notification to fire
5. Tap notification from notification center

**Expected Result:**
- ✅ System notification appears even when app is killed
- ✅ Shows correct title and body
- ✅ Tap notification → App launches from scratch
- ✅ Database initializes
- ✅ Onboarding is skipped (already completed)
- ✅ App navigates to OpenCapsule screen
- ✅ Capsule content loads correctly

**Common Issues:**
- If navigation doesn't work → Check logs for navigation timing
- If app crashes → Check database initialization status
- If shows Home instead of OpenCapsule → Check notification data payload

---

### Test Case 4: Multiple Capsules Ready

**Steps:**
1. Create 3 capsules with unlock times 1 min apart
2. Wait for all notifications to fire
3. Test tapping each notification

**Expected Result:**
- ✅ Each notification has correct capsuleId in data
- ✅ Tapping notification navigates to correct capsule
- ✅ Navigation works for each capsule independently

---

### Test Case 5: Edge Cases

#### 5.1 Capsule Not Found
**Steps:**
1. Create capsule, wait for notification
2. Manually delete capsule from database (dev tools)
3. Tap notification

**Expected Result:**
- ✅ Shows error alert: "Capsule not found"
- ✅ Navigates back to Home

#### 5.2 Permission Denied
**Steps:**
1. Deny notification permission when creating capsule
2. Capsule is still created successfully
3. Wait for unlock time

**Expected Result:**
- ✅ Capsule is created (notification optional)
- ✅ No notification fired (expected)
- ✅ Capsule status changes to 'ready' (background task)
- ✅ Can still open capsule from Home screen

#### 5.3 Foreground + Background Notifications
**Steps:**
1. Create 2 capsules (1 min apart)
2. First fires when app is open (foreground)
3. Background app before second fires

**Expected Result:**
- ✅ First shows in-app banner (foreground)
- ✅ Second shows system notification (background)
- ✅ Both navigate correctly when tapped

---

## Implementation Details

### Files Modified

1. **src/components/InAppNotificationBanner.tsx** (NEW)
   - Beautiful banner component
   - Slide-in animation
   - Auto-dismiss timer
   - Tap to navigate, tap X to dismiss

2. **App.tsx**
   - Added `navigationRef` for programmatic navigation
   - Added notification response listener (background/killed)
   - Added foreground notification listener
   - Added in-app notification state management
   - Rendered InAppNotificationBanner component

3. **src/components/index.ts**
   - Exported InAppNotificationBanner

### Key Code Snippets

**Notification Response Handler (Background/Killed):**
```typescript
Notifications.addNotificationResponseReceivedListener((response) => {
  const { capsuleId } = response.notification.request.content.data;

  if (capsuleId && navigationRef.current?.isReady()) {
    navigationRef.current.navigate('OpenCapsule', { capsuleId });
  } else if (capsuleId) {
    // Wait for navigation to be ready
    setTimeout(() => {
      if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate('OpenCapsule', { capsuleId });
      }
    }, 500);
  }
});
```

**Foreground Notification Handler:**
```typescript
Notifications.addNotificationReceivedListener((notification) => {
  const { capsuleId } = notification.request.content.data;

  if (capsuleId) {
    setInAppNotification({
      title: notification.request.content.title,
      body: notification.request.content.body,
      capsuleId,
    });
  }
});
```

---

## Acceptance Criteria Status

| # | Criteria | Status |
|---|----------|--------|
| 7.1 | Request notification permission when needed | ✅ Already implemented |
| 7.2 | Schedule local notification bằng Expo Notifications | ✅ Already implemented |
| 7.3 | Notification hiển thị đúng thời gian unlock | ✅ Already implemented |
| 7.4 | Notification content: "Your [Type] capsule is ready to open!" | ✅ Already implemented |
| 7.5 | Tap notification mở app đến capsule đó | ✅ **NOW COMPLETE** |
| 7.6 | Notification hoạt động khi app ở background/killed | ✅ **NOW COMPLETE** |

---

## Debugging Tips

### Check Scheduled Notifications

```javascript
// In dev tools or component
import * as Notifications from 'expo-notifications';

const notifications = await Notifications.getAllScheduledNotificationsAsync();
console.log('Scheduled:', notifications);
```

### Check Notification Permissions

```javascript
const { status } = await Notifications.getPermissionsAsync();
console.log('Permission status:', status); // should be 'granted'
```

### Check Notification Data Payload

Look for logs in console:
```
[App] Notification tapped: { capsuleId: 'xxx-xxx-xxx' }
[App] Foreground notification received: { capsuleId: 'xxx-xxx-xxx', type: 'emotion' }
```

### Common Issues

**Issue:** Notification doesn't navigate to capsule
- **Solution:** Check if `capsuleId` is in notification data
- **Check:** `console.log` in notification response listener

**Issue:** App crashes on notification tap
- **Solution:** Ensure database is initialized before navigation
- **Check:** Navigation ref is ready before calling navigate()

**Issue:** Banner doesn't show in foreground
- **Solution:** Check foreground listener is registered
- **Check:** `inAppNotification` state is set correctly

---

## Next Steps

After testing F7 successfully:

1. ✅ Mark F7 as complete in PROJECT_STATUS.md
2. 🚀 Move to next feature (F8, F9, F10 if not done)
3. 🧪 Test integration between notification and reflection flow
4. 📱 Test on both iOS and Android devices

---

## Notes

- Notification scheduling already implemented in `PreviewCapsuleScreen.tsx`
- Notification service already has type-specific content
- Error handling already robust in `OpenCapsuleScreenContainer.tsx`
- This implementation focuses on LISTENING and RESPONDING to notifications
- No changes needed to notification scheduling logic

---

*Feature F7 implementation complete! 🎉*
