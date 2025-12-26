# Handoff: F12 Delete Opened Capsule - UI/UX to Business Logic

**Date**: 2025-12-26
**From**: agent-uiux
**To**: agent-react
**Feature**: F12 - Delete Opened Capsule

---

## Summary

UI/UX layer for delete functionality has been implemented with:
1. **Swipe-to-delete** in Archive list screen
2. **Delete button** in OpenCapsule detail view (when fromArchive = true)
3. **Confirmation dialogs** for both approaches
4. **Placeholder handlers** ready for business logic integration

---

## Files Modified

### 1. `src/screens/ArchiveScreen.tsx`

**Changes:**
- Added `react-native-gesture-handler` imports for Swipeable
- Wrapped SafeAreaView with `GestureHandlerRootView`
- Implemented swipe-to-delete gesture on list items
- Added `handleDeletePress()` - shows confirmation dialog
- Added `handleDeleteConfirm()` - **PLACEHOLDER** for actual delete logic
- Added `renderRightActions()` - renders red delete button when swiped
- Added styles: `deleteAction`, `deleteButton`, `deleteText`

**Key Code Sections:**

```typescript
// Confirmation dialog
const handleDeletePress = useCallback((capsuleId: string) => {
  Alert.alert(
    'Delete Capsule',
    'Are you sure you want to delete this capsule? This cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteConfirm(capsuleId) },
    ]
  );
}, []);

// PLACEHOLDER - needs business logic
const handleDeleteConfirm = useCallback(async (capsuleId: string) => {
  console.log('[ArchiveScreen] Delete confirmed for capsule:', capsuleId);

  // TODO (agent-react): Implement actual delete logic
  // 1. Delete image files from FileSystem
  // 2. Delete database record (CASCADE will delete image records)
  // 3. Update UI state
  // 4. Show success feedback

  Alert.alert('Delete Feature', 'Delete functionality will be implemented by agent-react...');
}, []);
```

### 2. `src/screens/OpenCapsuleScreenContainer.tsx`

**Changes:**
- Extract `fromArchive` param from route
- Added `handleDelete()` - shows confirmation dialog
- Added `handleDeleteConfirm()` - **PLACEHOLDER** for actual delete logic
- Pass `onDelete` and `fromArchive` props to OpenCapsuleScreen

**Key Code Sections:**

```typescript
const { capsuleId, fromArchive } = route.params;

const handleDelete = () => {
  if (!capsule) return;

  Alert.alert(
    'Delete Capsule',
    'Are you sure you want to delete this capsule? This cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteConfirm() },
    ]
  );
};

const handleDeleteConfirm = async () => {
  if (!capsule) return;

  console.log('[OpenCapsuleContainer] Delete confirmed for capsule:', capsule.id);

  // TODO (agent-react): Implement actual delete logic
  // 1. Delete image files from FileSystem
  // 2. Delete database record (CASCADE will delete image records)
  // 3. Navigate back to Archive
  // 4. Show success feedback

  Alert.alert('Delete Feature', 'Delete functionality will be implemented by agent-react...');
};

// Pass to UI component
<OpenCapsuleScreen
  capsule={capsule}
  onClose={handleClose}
  onContinue={handleContinue}
  onDelete={fromArchive ? handleDelete : undefined}
  fromArchive={fromArchive}
/>
```

### 3. `components/OpenCapsuleScreen.tsx`

**Changes:**
- Added `onDelete?: () => void` optional prop
- Added `fromArchive?: boolean` prop
- Updated header to conditionally show delete button (trash icon)
- Added styles: `headerLeft`, `deleteButton`

**Key Code Sections:**

```typescript
interface OpenCapsuleScreenProps {
  capsule: OpenCapsuleData;
  onClose: () => void;
  onContinue: () => void;
  onDelete?: () => void; // Optional delete handler for Archive view
  fromArchive?: boolean; // Flag to indicate viewing from Archive
}

// In header JSX
{fromArchive && onDelete && (
  <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
    <Ionicons name="trash-outline" size={24} color={Colors.ui.danger} />
  </TouchableOpacity>
)}
```

---

## Business Logic Requirements for agent-react

### Task: Implement actual delete functionality

Replace placeholder `handleDeleteConfirm` functions in both files with:

#### 1. Delete Image Files from FileSystem

```typescript
import * as FileSystem from 'expo-file-system';

async function deleteCapsuleImages(capsuleId: string): Promise<void> {
  const documentDirectory = FileSystem.documentDirectory;
  const folderPath = `${documentDirectory}capsule_images/${capsuleId}/`;

  try {
    const folderInfo = await FileSystem.getInfoAsync(folderPath);
    if (folderInfo.exists) {
      await FileSystem.deleteAsync(folderPath, { idempotent: true });
      console.log('[Delete] Deleted images folder:', folderPath);
    } else {
      console.log('[Delete] Images folder does not exist:', folderPath);
    }
  } catch (error) {
    console.warn('[Delete] Failed to delete images folder:', error);
    // Continue with database delete even if file delete fails
  }
}
```

#### 2. Delete Database Record

Create new database service function:

```typescript
// In src/services/databaseService.ts

export async function deleteCapsule(capsuleId: string): Promise<void> {
  const db = await getDatabase();

  try {
    // DELETE capsule (CASCADE will auto-delete related image records)
    await db.runAsync(
      'DELETE FROM capsule WHERE id = ? AND status = ?',
      [capsuleId, 'opened']
    );

    console.log('[DB] Deleted capsule:', capsuleId);
  } catch (error) {
    console.error('[DB] Failed to delete capsule:', error);
    throw new Error('Failed to delete capsule from database');
  }
}
```

**IMPORTANT**: Only allow deleting capsules with `status = 'opened'`. The SQL query already enforces this with `WHERE status = 'opened'`.

#### 3. Update UI State

**In ArchiveScreen.tsx:**

```typescript
const handleDeleteConfirm = useCallback(async (capsuleId: string) => {
  try {
    // 1. Delete image files
    await deleteCapsuleImages(capsuleId);

    // 2. Delete database record
    await deleteCapsule(capsuleId);

    // 3. Update UI - remove from list
    setCapsules(prev => prev.filter(item => item.id !== capsuleId));

    // 4. Show success feedback
    Alert.alert('Deleted', 'Capsule successfully removed from archive');

  } catch (error) {
    console.error('[ArchiveScreen] Delete failed:', error);
    Alert.alert('Error', 'Failed to delete capsule. Please try again.');
  }
}, []);
```

**In OpenCapsuleScreenContainer.tsx:**

```typescript
const handleDeleteConfirm = async () => {
  if (!capsule) return;

  try {
    // 1. Delete image files
    await deleteCapsuleImages(capsule.id);

    // 2. Delete database record
    await deleteCapsule(capsule.id);

    // 3. Navigate back to Archive
    navigation.goBack();

    // 4. Show success feedback (after navigation)
    setTimeout(() => {
      Alert.alert('Deleted', 'Capsule successfully removed from archive');
    }, 300);

  } catch (error) {
    console.error('[OpenCapsuleContainer] Delete failed:', error);
    Alert.alert('Error', 'Failed to delete capsule. Please try again.');
  }
};
```

---

## Validation & Edge Cases

### 1. Status Validation
- Only capsules with `status = 'opened'` can be deleted
- Database query enforces this with `WHERE status = 'opened'`
- Locked capsules should never show delete option

### 2. File Cleanup
- If image folder doesn't exist, continue with database delete (don't fail)
- Use `idempotent: true` option to avoid errors if folder already deleted
- Log warnings for file cleanup failures but don't block database delete

### 3. UI State Updates
- **ArchiveScreen**: Remove deleted item from local state array
- **OpenCapsuleContainer**: Navigate back immediately after successful delete
- Show success feedback AFTER navigation completes (use setTimeout)

### 4. Error Handling
- Catch and log errors at each step
- Show user-friendly error messages
- Don't leave orphan data (if DB delete fails, images remain - acceptable)

---

## Testing Checklist

### Swipe-to-Delete (ArchiveScreen)
- [ ] Swipe left reveals red delete button
- [ ] Tap delete button shows confirmation dialog
- [ ] Tap "Cancel" closes dialog and keeps capsule
- [ ] Tap "Delete" removes capsule from list
- [ ] Images folder is deleted from FileSystem
- [ ] Database record is deleted
- [ ] Success message is shown
- [ ] List updates without flicker

### Delete from Detail View (OpenCapsuleScreen)
- [ ] Delete button only shows when `fromArchive = true`
- [ ] Tap trash icon shows confirmation dialog
- [ ] Tap "Cancel" keeps capsule and stays on detail view
- [ ] Tap "Delete" navigates back to Archive
- [ ] Capsule is removed from Archive list
- [ ] Success message is shown after navigation

### Error Scenarios
- [ ] If images folder missing, database delete still succeeds
- [ ] If database delete fails, show error and keep capsule in list
- [ ] Network offline doesn't affect delete (local only)

---

## Animation & UX Notes

### Swipe Gesture
- Threshold: 80px swipe distance to reveal delete button
- Friction: 2 (smooth but not too fast)
- Overshoot: Disabled (`overshootRight={false}`)
- Delete button background: `UIColors.danger` (#EF4444 red)

### Confirmation Dialogs
- Both dialogs use native `Alert.alert`
- "Delete" button has `style: 'destructive'` (red on iOS)
- Dialogs are `cancelable: true` (tap outside to dismiss)

### Success Feedback
- Use simple Alert with "Deleted" title
- Message: "Capsule successfully removed from archive"
- Auto-dismiss after user taps OK

### Optional Enhancement (Future)
- Consider adding fade-out animation when removing from list
- Could use Animated.timing to animate opacity 1 → 0 before removing

---

## Dependencies

**Already installed (no new dependencies needed):**
- `react-native-gesture-handler` - for Swipeable component
- `expo-file-system` - for image file deletion
- `expo-sqlite` - for database operations

---

## Database Schema Reference

```sql
-- Capsule table with CASCADE delete
CREATE TABLE IF NOT EXISTS capsule (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('emotion', 'goal', 'memory', 'decision')),
  content TEXT NOT NULL,
  reflectionQuestion TEXT,
  reflectionAnswer TEXT,
  status TEXT NOT NULL CHECK(status IN ('locked', 'ready', 'opened')) DEFAULT 'locked',
  unlockAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  openedAt TEXT,
  UNIQUE(id)
);

-- Image table with foreign key
CREATE TABLE IF NOT EXISTS image (
  id TEXT PRIMARY KEY,
  capsuleId TEXT NOT NULL,
  imagePath TEXT NOT NULL,
  FOREIGN KEY (capsuleId) REFERENCES capsule(id) ON DELETE CASCADE
);
```

**Important**: When deleting capsule, image records are automatically deleted by CASCADE.

---

## Color Constants Used

```typescript
// From src/constants/colors.ts
UIColors.danger = '#EF4444' // Red for delete button

// From constants/Colors.ts
Colors.ui.danger = '#EF4444' // Red for trash icon
```

---

## Next Steps for agent-react

1. Create `deleteCapsuleImages(capsuleId)` helper function
2. Add `deleteCapsule(capsuleId)` to `databaseService.ts`
3. Replace placeholder `handleDeleteConfirm` in `ArchiveScreen.tsx`
4. Replace placeholder `handleDeleteConfirm` in `OpenCapsuleScreenContainer.tsx`
5. Test all delete scenarios
6. Verify database CASCADE delete works correctly
7. Confirm image files are cleaned up

---

## Questions or Issues?

If you encounter any issues during implementation:
- Check that `status = 'opened'` validation is working
- Verify CASCADE delete is configured in database schema
- Test file deletion with both existing and non-existing folders
- Ensure UI state updates are synchronous (setCapsules immediately)

---

**Status**: UI/UX implementation complete, ready for business logic integration.
**Estimated effort**: 1-2 hours for full implementation and testing.
