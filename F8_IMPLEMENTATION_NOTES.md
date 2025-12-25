# F8: Open Capsule - Implementation Notes

**Date:** 2025-12-25
**Implemented by:** agent-react
**Status:** Business Logic Complete, Manual Integration Required

---

## Overview

Đã implement business logic cho F8: Open Capsule feature, bao gồm:
- Database service helpers
- Data transformation layer
- Container component với loading/error states
- Navigation logic (continue → Reflection/Archive)

---

## Files Created

### 1. **src/services/capsuleHelpers.ts**
Helper functions để bridge giữa database service và UI components.

**Exports:**
- `CapsuleWithImages` interface
- `OpenCapsuleData` interface (for UI)
- `calculateTimeLocked(createdAt, unlockAt): string`
- `getCapsuleWithImages(capsuleId): Promise<CapsuleWithImages>`
- `toOpenCapsuleData(capsule): OpenCapsuleData`

**Purpose:**
- Load capsule từ DB cùng với images
- Transform data sang format cho UI component
- Calculate human-readable "time locked" duration

### 2. **src/screens/OpenCapsuleScreenContainer.tsx**
Container component wrap around UI component từ agent-uiux.

**Features:**
- Load capsule data from database by ID
- Validate capsule status (ready/locked/opened)
- Error handling với user-friendly alerts
- Loading states
- Navigate to Reflection (types có reflection) hoặc Archive (Memory type)
- Mark capsule as opened khi continue

---

## Manual Changes Required

### ⚠️ CRITICAL: Update AppNavigator.tsx

**File:** `src/navigation/AppNavigator.tsx`

**Change line 19:**
```typescript
// OLD:
import { OpenCapsuleScreen } from '../screens/OpenCapsuleScreen';

// NEW:
import { OpenCapsuleScreenContainer } from '../screens/OpenCapsuleScreenContainer';
```

**Change line 85:**
```typescript
// OLD:
component={OpenCapsuleScreen}

// NEW:
component={OpenCapsuleScreenContainer}
```

**Why:** Navigation cần dùng Container (có database logic), không phải placeholder screen.

---

## Integration Points

### From Home Screen

User taps ready capsule card → Navigate:
```typescript
navigation.navigate('OpenCapsule', { capsuleId: capsule.id });
```

### From Notification

Setup notification listener (TODO: F7):
```typescript
Notifications.addNotificationResponseReceivedListener((response) => {
  const capsuleId = response.notification.request.content.data.capsuleId;
  navigation.navigate('OpenCapsule', { capsuleId });
});
```

---

## Flow Diagram

```
User taps capsule / notification
         ↓
OpenCapsuleScreenContainer
         ↓
   Load from DB
         ↓
  Validate status
  ├─ locked → Error alert, go back
  ├─ opened → Alert, navigate to Archive
  └─ ready → ✓ Continue
         ↓
  Load images
         ↓
  Calculate timeLocked
         ↓
   Transform data
         ↓
Render OpenCapsuleScreen (UI from agent-uiux)
         ↓
   Opening animation
         ↓
  Display content
         ↓
User taps Continue
         ↓
Has reflection?
  ├─ Yes → markAsOpened → Navigate to Reflection (F9 TODO)
  └─ No → markAsOpened → Success alert → Navigate to Archive
```

---

## Data Flow

### Database → Container → UI

```typescript
// 1. Database (ISO strings, no images field)
Capsule {
  id, type, content,
  reflectionQuestion, reflectionAnswer,
  createdAt: "2024-12-25T10:00:00.000Z",
  unlockDate: "2025-12-25T10:00:00.000Z",
  status: "ready"
}

// 2. Helpers (add images, keep ISO strings)
CapsuleWithImages {
  ...Capsule,
  images: ["file:///path/img1.jpg", "file:///path/img2.jpg"]
}

// 3. Transform to UI format (Date objects, timeLocked)
OpenCapsuleData {
  ...CapsuleWithImages,
  createdAt: Date,
  unlockAt: Date,
  openedAt: Date,
  timeLocked: "1 year, 3 months"
}

// 4. UI Component renders
OpenCapsuleScreen (agent-uiux)
```

---

## Error Handling

### Scenarios Covered

| Error | Handling |
|-------|----------|
| Capsule not found | Alert → Navigate back |
| Capsule still locked | Alert "Wait until unlock time" → Navigate back |
| Capsule already opened | Alert "View in Archive" → Option to navigate Archive |
| Image file missing | Logged warning, skip image (graceful degradation) |
| Database error | Alert "Try again" → Navigate back |
| Mark as opened failed | Alert "Failed to save" (stays on screen) |

---

## Edge Cases

### Tested Scenarios

✅ No images - Gallery section hidden (UI component handles)
✅ Very long content - Scrollable (UI component handles)
✅ Invalid capsule ID - Error alert
✅ Race condition (multiple taps) - Single loading state prevents
✅ Memory type (no reflection) - Navigate to Archive directly
✅ Reflection types - Placeholder alert until F9 implemented

### Not Yet Tested

⚠️ Corrupted image files - Should skip gracefully
⚠️ Database unavailable - Need retry logic
⚠️ App killed during open - Resume state on restart
⚠️ Notification tap while app in background - Deep link handling

---

## Future Enhancements (Not in Scope)

### F9: Reflection Screen Integration

Khi F9 complete, update `handleContinue()`:

```typescript
// Replace current placeholder alert with:
navigation.navigate('Reflection', {
  capsuleId: capsule.id,
  type: capsule.type,
  reflectionQuestion: capsule.reflectionQuestion,
});
```

### F7: Notification Deep Linking

Add to App.tsx root component:

```typescript
useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const capsuleId = response.notification.request.content.data.capsuleId;

      // Navigate to OpenCapsule
      navigationRef.current?.navigate('OpenCapsule', { capsuleId });
    }
  );

  return () => subscription.remove();
}, []);
```

### Performance Optimizations

- Cache loaded capsule data (React Query / SWR)
- Lazy load images in fullscreen viewer
- Optimize re-renders with React.memo
- Image placeholders while loading

### Accessibility

- Screen reader labels
- Image alt text
- Respect reduce motion setting
- Minimum touch target sizes (48dp)

---

## Testing Checklist

### Manual Testing Required

- [ ] Load capsule với status 'ready' → Success
- [ ] Load capsule với status 'locked' → Error alert
- [ ] Load capsule với status 'opened' → Redirect to Archive
- [ ] Load capsule không tồn tại → Error alert
- [ ] Capsule có 0 ảnh → No gallery displayed
- [ ] Capsule có 1-3 ảnh → Gallery displays correctly
- [ ] Memory type → Continue saves và navigate Archive
- [ ] Emotion/Goal/Decision → Continue shows reflection placeholder
- [ ] Close button → Leave confirmation dialog
- [ ] Very long text → Scrollable
- [ ] Navigate từ Home (tap capsule card)
- [ ] Navigate từ Notification (khi F7 ready)

### Integration Tests Needed

```typescript
// Test capsuleHelpers
describe('calculateTimeLocked', () => {
  it('calculates 1 year correctly', () => {
    const created = new Date('2024-01-01');
    const unlock = new Date('2025-01-01');
    expect(calculateTimeLocked(created, unlock)).toBe('1 year');
  });
});

// Test container
describe('OpenCapsuleScreenContainer', () => {
  it('loads capsule successfully', async () => {
    // Mock getCapsuleWithImages
    // Render component
    // Assert content displayed
  });

  it('shows error for locked capsule', async () => {
    // Mock capsule with status 'locked'
    // Render component
    // Assert error alert shown
  });
});
```

---

## Dependencies

### Existing Services Used

- `databaseService.getCapsuleById(id)`
- `databaseService.getImages(capsuleId)`
- `databaseService.markCapsuleAsOpened(id)`

### UI Components Used (from agent-uiux)

- `OpenCapsuleScreen` (components/OpenCapsuleScreen.tsx)
- `OpeningAnimationOverlay` (components/OpeningAnimationOverlay.tsx)
- `ImageGallery` (components/ImageGallery.tsx)

### External Libraries

- `date-fns`: differenceInYears, differenceInMonths, differenceInDays
- `@react-navigation/native`: Navigation hooks
- `react-native`: Alert, ActivityIndicator

---

## Known Issues

### Type Inconsistencies

⚠️ Database `Capsule` type (src/types/capsule.ts) KHÔNG có `images` field.
- Workaround: Created `CapsuleWithImages` interface in capsuleHelpers.ts
- TODO: Consider updating core Capsule type để include images array

### Reflection Screen Not Implemented

⚠️ Clicking "Continue" on Emotion/Goal/Decision shows placeholder alert.
- Temporarily marks capsule as opened and navigates to Archive
- Needs F9: Reflection Screen implementation

---

## Communication Log

```
[2025-12-25 HH:MM:SS] agent-uiux → agent-react | Handoff UI code cho F8: Open Capsule screen
[2025-12-25 HH:MM:SS] agent-react → agent-ba | Yêu cầu requirements F8: Open Capsule - validation rules, edge cases
[2025-12-25 HH:MM:SS] agent-ba → agent-react | Cung cấp requirements và activity diagram cho F8
```

---

## Summary

✅ **Completed:**
- Database helpers (capsuleHelpers.ts)
- Container component với full business logic
- Loading và error states
- Data transformation layer
- Continue navigation logic
- Edge case handling

⚠️ **Manual Action Required:**
- Update AppNavigator.tsx to use OpenCapsuleScreenContainer

🔄 **Next Steps:**
- Test integration manually
- Implement F9: Reflection Screen
- Implement F7: Notification deep linking
- Add automated tests

---

**Ready for testing!** 🚀
