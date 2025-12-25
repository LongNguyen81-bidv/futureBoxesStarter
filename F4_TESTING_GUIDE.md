# F4: Create Capsule - Testing Guide

**Feature:** F4: Create Capsule
**Status:** ✅ Ready for Testing
**Date:** 2025-12-25

---

## Prerequisites

1. Ensure app is running: `npm start` or `npx expo start`
2. Have a physical device or simulator ready
3. Grant notification permissions when prompted

---

## Test Scenarios

### Scenario 1: Create Emotion Capsule (Happy Path)

**Steps:**
1. Launch app
2. Tap FAB (+) button on Home screen
3. Select **Emotion** type
4. Tap Continue
5. Enter content: "Feeling excited about my new project!"
6. Add 2 images from gallery
7. Enter reflection: "Did this excitement last?"
8. Select unlock date: **1 week** preset
9. Tap **Preview Capsule**
10. Review all data on preview screen
11. Tap **Lock Capsule**
12. Confirm lock in dialog
13. Wait for success message

**Expected Results:**
- ✅ Preview shows all entered data
- ✅ Images display correctly
- ✅ Date formatted nicely
- ✅ Lock confirmation dialog appears
- ✅ Loading indicator shows during save
- ✅ Success alert appears
- ✅ Navigate back to Home
- ✅ New capsule appears on Home screen

---

### Scenario 2: Create Goal Capsule (No Images)

**Steps:**
1. Tap FAB (+)
2. Select **Goal**
3. Enter content: "Complete React Native course by end of month"
4. Skip adding images
5. Enter reflection: "Did you finish the course?"
6. Select **1 month** preset
7. Preview → Lock

**Expected Results:**
- ✅ Works without images
- ✅ Preview shows "Photos (0/3)" section (optional)
- ✅ Lock succeeds

---

### Scenario 3: Create Memory Capsule (No Reflection)

**Steps:**
1. Tap FAB (+)
2. Select **Memory**
3. Enter content: "First time visiting the Grand Canyon"
4. Add 3 images (max)
5. Try to add 4th image → **Should block**
6. Select **1 year** preset
7. Preview

**Expected Results:**
- ✅ No reflection field shown in CreateCapsule
- ✅ No reflection shown in Preview
- ✅ 4th image blocked with alert
- ✅ Lock succeeds

---

### Scenario 4: Create Decision Capsule (Custom Date)

**Steps:**
1. Tap FAB (+)
2. Select **Decision**
3. Enter content: "Decided to switch careers to tech"
4. Add 1 image
5. Enter reflection: "How do you feel about this decision now?"
6. Select **Custom** date
7. Pick specific date (e.g., 6 months from now)
8. Preview → Lock

**Expected Results:**
- ✅ Custom date picker works
- ✅ Selected date shows correctly
- ✅ Lock succeeds

---

## Validation Testing

### Test 1: Empty Content

**Steps:**
1. Create capsule
2. Leave content empty
3. Fill other fields
4. Tap Preview

**Expected:**
- ❌ Alert: "Content required"
- ❌ Preview button disabled (opacity 0.5)

---

### Test 2: Missing Reflection (Goal/Emotion/Decision)

**Steps:**
1. Create Goal capsule
2. Fill content
3. Leave reflection empty
4. Tap Preview

**Expected:**
- ❌ Alert: "Reflection required"

---

### Test 3: Missing Unlock Date

**Steps:**
1. Create capsule
2. Fill content and reflection
3. Don't select date
4. Tap Preview

**Expected:**
- ❌ Alert: "Date required"
- ❌ Preview button disabled

---

### Test 4: Past Date

**Steps:**
1. Create capsule
2. Fill form
3. Select Custom date
4. Try to pick past date

**Expected:**
- ❌ DateSelector should prevent past dates
- ❌ Alert if somehow selected

---

### Test 5: Max Content Length

**Steps:**
1. Create capsule
2. Paste very long text (>2000 chars)

**Expected:**
- ✅ Text truncated at 2000 chars
- ✅ Character counter shows 2000/2000
- ✅ Counter turns red

---

## Navigation Testing

### Test 1: Back from CreateCapsule (Empty)

**Steps:**
1. Open CreateCapsule
2. Don't enter anything
3. Tap Back

**Expected:**
- ✅ Navigate back immediately (no confirmation)

---

### Test 2: Back from CreateCapsule (With Data)

**Steps:**
1. Open CreateCapsule
2. Enter some content
3. Tap Back

**Expected:**
- ✅ Confirmation dialog appears
- ✅ "Cancel" → stay on screen
- ✅ "Discard" → navigate back

---

### Test 3: Back from Preview to Edit

**Steps:**
1. Fill form → Preview
2. Tap "Edit" button
3. Modify content
4. Preview again

**Expected:**
- ✅ Navigate back to CreateCapsule
- ✅ Data preserved
- ✅ Changes reflected in new preview

---

## Error Handling Testing

### Test 1: Image Permission Denied

**Steps:**
1. Deny photo library permission in settings
2. Try to add image

**Expected:**
- ❌ Alert: Permission required
- ✅ Option to open settings

---

### Test 2: Invalid Image Format

**Steps:**
1. Try to select non-image file (if possible)

**Expected:**
- ❌ File rejected by picker or validation

---

### Test 3: Network/Database Error Simulation

**Note:** Hard to test without dev tools

**Expected:**
- ❌ Error alert with descriptive message
- ✅ Data not lost (can retry)
- ✅ Transaction rollback (no partial saves)

---

## Notification Testing

### Test 1: Notification Permission Granted

**Steps:**
1. Create capsule with unlock date 1 minute from now
2. Grant notification permission
3. Lock capsule
4. Wait 1 minute

**Expected:**
- ✅ Permission request appears
- ✅ Notification scheduled successfully
- ✅ Notification appears at unlock time
- ✅ Notification content correct

---

### Test 2: Notification Permission Denied

**Steps:**
1. Deny notification permission
2. Create and lock capsule

**Expected:**
- ✅ Capsule still created
- ⚠️ Warning logged (check console)
- ❌ No notification at unlock time

---

### Test 3: Notification Tap (Future - F7)

**Note:** Handling tap is F7 feature

---

## Performance Testing

### Test 1: Multiple Images

**Steps:**
1. Add 3 large images
2. Lock capsule

**Expected:**
- ✅ Loading indicator shows
- ✅ Images copy within 2-3 seconds
- ✅ No app freeze

---

### Test 2: Very Long Content

**Steps:**
1. Enter 2000 chars of content
2. Lock capsule

**Expected:**
- ✅ Save completes quickly (< 1 second)
- ✅ No lag

---

## Edge Cases

### Test 1: App Crash During Lock

**Steps:**
1. Fill form → Preview → Lock
2. Force quit app immediately after tapping Lock

**Expected:**
- ✅ Transaction rollback on next launch
- ✅ No partial capsule in database
- ✅ No orphaned image files

---

### Test 2: Change Device Time (Clock Manipulation)

**Note:** Out of scope for v1 (trust-based system)

---

### Test 3: Storage Full

**Steps:**
1. Fill device storage (hard to test)
2. Try to lock capsule with images

**Expected:**
- ❌ Error alert about storage
- ✅ Rollback, no data loss

---

## Platform-Specific Testing

### iOS
- [ ] Date picker shows native spinner
- [ ] Keyboard avoidance works
- [ ] Haptic feedback works
- [ ] Notification permission dialog native
- [ ] Back swipe gesture works

### Android
- [ ] Date picker shows native dialog
- [ ] Keyboard handling smooth
- [ ] Haptic feedback works (if supported)
- [ ] Notification permission dialog native
- [ ] Back button navigation works

---

## Accessibility Testing

### Test 1: Touch Targets

**Steps:**
1. Tap all buttons with thumb

**Expected:**
- ✅ All buttons easy to tap (>= 44dp)

---

### Test 2: Text Readability

**Steps:**
1. Check text contrast on all screens

**Expected:**
- ✅ All text readable (WCAG AA)
- ✅ Placeholder text visible

---

## Regression Testing

After any code changes, re-run:
1. Happy path for each capsule type
2. Validation tests
3. Navigation tests
4. One error scenario

---

## Bug Reporting Template

If you find a bug, report with:

```
**Bug:** [Short description]
**Scenario:** [Which test scenario]
**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected:** [What should happen]
**Actual:** [What happened]
**Logs:** [Copy from console if available]
**Screenshots:** [If helpful]
**Device:** [iOS/Android, version]
```

---

## Known Issues / Limitations

1. **No draft auto-save** - Data lost if app crashes during creation
2. **No image compression** - Large images may take time to copy
3. **No retry mechanism** - Single attempt for lock (but transaction safe)
4. **Clock manipulation** - Users can change device time (accepted risk for v1)

---

## Quick Checklist

Before marking F4 as complete:

- [ ] All 4 capsule types can be created
- [ ] Preview shows correct data
- [ ] Lock succeeds and saves to database
- [ ] Notifications schedule (if permission granted)
- [ ] Validation prevents invalid submissions
- [ ] Error handling works (graceful failures)
- [ ] Navigation flows correctly
- [ ] UI looks good on iOS and Android
- [ ] No console errors (except warnings)
- [ ] Performance acceptable (no lag)

---

**Happy Testing!** 🚀

If you encounter any issues, check:
1. Console logs for errors
2. Database in Expo dev tools
3. File system in device storage
4. Notification permissions in device settings
