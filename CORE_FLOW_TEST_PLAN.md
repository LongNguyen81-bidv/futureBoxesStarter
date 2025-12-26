# Core Flow Test Plan - FutureBoxes v2

**Date:** 2025-12-26
**Status:** Ready for Testing
**Coverage:** F1-F5, F8-F9, F11

---

## Test Environment Setup

### Prerequisites:
- [ ] Node.js 20.x installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Dependencies installed (`npm install`)
- [ ] iOS Simulator or Android Emulator running
- [ ] Or physical device with Expo Go app

### Run App:
```bash
npm start
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Or scan QR code on physical device
```

---

## Full Flow Test: Create → Lock → Open → Reflect → Archive

### **Test Case 1: Emotion Capsule (Yes/No Reflection)**

**Scenario:** User creates emotion capsule about anxiety, locks it, waits (or manually change time), opens it, reflects with "Yes" answer.

#### Steps:

1. **Home Screen (F2)**
   - [ ] App launches successfully
   - [ ] Home screen displays (empty state or existing capsules)
   - [ ] FAB (+) button visible at bottom-right
   - [ ] Archive icon visible in header
   - Action: Tap FAB (+)

2. **Type Selection (F3)**
   - [ ] Type Selection screen appears with modal presentation
   - [ ] 4 type cards displayed: Emotion, Goal, Memory, Decision
   - [ ] Emotion card tap → highlights with pink border
   - [ ] Continue button enables after selection
   - Action: Select Emotion → Tap Continue

3. **Create Capsule (F4)**
   - [ ] Create screen shows "Emotion Capsule" header (pink)
   - [ ] Content input field shows placeholder
   - [ ] Character counter shows "0/2000"
   - Action: Enter text "I'm feeling anxious about my job interview tomorrow. I hope I can stay calm and present my best self."
   - [ ] Character counter updates → "115/2000"

   - Action: Tap "Add Images"
   - [ ] Image picker opens (gallery permission requested if first time)
   - Action: Select 2 images
   - [ ] Image thumbnails appear with delete (X) buttons

   - [ ] Reflection question field visible (required for Emotion)
   - Action: Enter "Did this feeling pass?"

   - [ ] Date selector shows with presets (1 week, 1 month, 1 year)
   - Action: Select "1 week" preset
   - [ ] Selected date displays correctly

   - [ ] Preview button enables (all required fields filled)
   - Action: Tap Preview

4. **Preview Capsule (F4)**
   - [ ] Preview screen shows:
     - Type badge (pink Emotion)
     - Full content text
     - 2 images in gallery
     - Reflection question
     - Unlock date formatted
   - [ ] Edit button visible
   - [ ] Lock Capsule button visible
   - Action: Tap Lock Capsule
   - [ ] Confirmation dialog appears: "Lock this capsule? Cannot be edited after."
   - Action: Tap Confirm

5. **Lock Animation (F5)**
   - [ ] Lock success modal appears
   - [ ] Box closing animation plays (~1.5s)
   - [ ] Lock icon rotates and appears
   - [ ] Glow effects visible
   - [ ] Success message: "Your capsule is locked!"
   - [ ] Unlock date displayed with type color (pink)
   - [ ] Haptic feedback felt (on device)
   - [ ] Auto-dismiss after 3 seconds OR tap to skip
   - Action: Wait for auto-dismiss
   - [ ] Navigates back to Home screen

6. **Home Screen - Locked Capsule (F2)**
   - [ ] Capsule appears in grid (3x2 layout)
   - [ ] Shows Emotion icon (heart, pink)
   - [ ] Shows countdown timer (e.g., "7d 0h 0m")
   - [ ] Lock icon visible
   - [ ] Status: locked
   - Action: Tap on locked capsule
   - [ ] Alert appears: "This capsule will unlock on [date]"
   - Action: Dismiss alert

7. **Simulate Time Passing** (Manual Database Update)
   ```sql
   -- Update unlockAt to past time to make it ready
   UPDATE capsule
   SET unlockAt = strftime('%s', 'now', '-1 minute') * 1000
   WHERE type = 'emotion'
   ORDER BY createdAt DESC
   LIMIT 1;
   ```
   - Action: Kill and restart app
   - [ ] Home screen refreshes
   - [ ] Capsule status changes to "Ready!"
   - [ ] Ready badge appears (green)
   - [ ] Lock icon replaced with glow effect
   - Action: Tap ready capsule

8. **Open Capsule (F8)**
   - [ ] Opening animation plays (~1.5s):
     - Box scales in
     - Lid opens (3D rotation)
     - Glow appears
     - Content fades in
   - [ ] After animation, content displayed:
     - Type badge (Emotion, pink)
     - Full text content
     - 2 images in horizontal gallery
     - Tap image → Fullscreen zoom
     - Pinch to zoom works (1x-3x)
     - Swipe between images works
   - [ ] Metadata section shows:
     - Created: [date]
     - Opened: [date]
     - Time locked: "After 7 days"
   - [ ] Continue button visible
   - Action: Tap Continue

9. **Reflection Response (F9)**
   - [ ] Reflection screen appears
   - [ ] Type badge: Emotion (pink)
   - [ ] Question displayed: "Did this feeling pass?"
   - [ ] Two large buttons: Yes (green) | No (red)
   - [ ] Continue button disabled initially
   - Action: Tap Yes
   - [ ] Yes button fills with green, checkmark appears
   - [ ] Haptic feedback (medium)
   - [ ] Continue button enables
   - Action: Tap Continue
   - [ ] Loading spinner appears briefly
   - [ ] "Saving..." text shows

10. **Celebration (F10 - Placeholder)**
    - [ ] Celebration screen appears
    - [ ] Icon: check-circle (green)
    - [ ] Message: "Amazing! Keep up the great work!"
    - [ ] Answer summary: "Your answer: yes"
    - [ ] Two buttons: "View Archive" | "Go Home"
    - Action: Tap View Archive

11. **Archive (F11)**
    - [ ] Archive screen loads
    - [ ] Emotion capsule appears in list
    - [ ] Card shows:
      - Pink left border
      - Emotion icon (heart) in pink circle
      - Content preview (first ~150 chars with "...")
      - Created date
      - Opened date
      - Time locked: "After 7 days"
      - Reflection badge: ✓ Yes (green)
      - 2 image thumbnails
    - [ ] Pull-to-refresh works
    - Action: Tap capsule card

12. **Archive Detail View**
    - [ ] Opens capsule detail (reuses OpenCapsuleScreen)
    - [ ] Shows full content
    - [ ] Shows all images
    - [ ] Shows reflection question + answer
    - [ ] No opening animation (already opened)
    - [ ] Back button visible
    - Action: Tap Back
    - [ ] Returns to Archive

**Expected Result:** ✅ Full flow works end-to-end without errors

---

### **Test Case 2: Goal Capsule (Yes/No Reflection)**

**Scenario:** User creates goal capsule about running 5k, reflects with "No" answer.

#### Quick Steps:
1. Home → FAB → Goal → Continue
2. Content: "I want to run a 5k race within 3 months"
3. No images
4. Reflection: "Did you achieve this goal?"
5. Date: 1 month
6. Preview → Lock → Confirm
7. Lock animation → Home
8. [Simulate time passing]
9. Tap ready capsule → Open animation
10. View content → Continue
11. Reflection: Tap No → Continue
12. Celebration: "That's okay. Every experience teaches us something"
13. Archive → View in list

**Validation Points:**
- [ ] Goal type uses green color throughout
- [ ] Flag icon displayed
- [ ] No images = no gallery section
- [ ] "No" answer → Red badge in Archive
- [ ] Encouraging celebration message

---

### **Test Case 3: Memory Capsule (No Reflection)**

**Scenario:** User creates memory capsule about beach trip, no reflection question.

#### Quick Steps:
1. Home → FAB → Memory → Continue
2. Content: "Best day at the beach with family. The sunset was absolutely stunning and we built an amazing sandcastle together."
3. Add 3 images
4. **NO reflection question field** (Memory type)
5. Date: 1 year
6. Preview → Lock
7. [Simulate time passing]
8. Open → View content
9. Continue button → **Skip Reflection, go straight to Celebration**
10. Celebration: "Thank you for preserving this beautiful memory"
11. Navigate to Archive
12. Archive shows Memory with no reflection badge

**Validation Points:**
- [ ] Orange color theme
- [ ] Camera icon
- [ ] No reflection question field in Create
- [ ] No reflection screen after opening
- [ ] Archive item shows 3 image thumbnails
- [ ] No reflection badge (memory type)

---

### **Test Case 4: Decision Capsule (Rating 1-5)**

**Scenario:** User creates decision capsule about job change, rates 4/5 stars.

#### Quick Steps:
1. Home → FAB → Decision → Continue
2. Content: "Should I accept the job offer in another city?"
3. Add 1 image
4. Reflection: "How do you feel about this decision?"
5. Date: Custom date (3 months)
6. Preview → Lock
7. [Simulate time passing]
8. Open → Continue
9. Reflection: Tap 4th star → All 4 stars fill gold
10. Continue
11. Celebration: "Excellent decision!" (positive message for 4/5)
12. Archive shows ★★★★☆ (4 stars)

**Validation Points:**
- [ ] Blue color theme
- [ ] Scale balance icon
- [ ] Star rating UI (5 stars)
- [ ] Tap star 4 → fills 1-4, empties 5
- [ ] Archive shows 4 filled stars

---

## Edge Cases & Error Scenarios

### **Test Case 5: Empty States**

1. **Empty Home**
   - [ ] Fresh install → Home shows empty state
   - [ ] Message: "Create your first capsule"
   - [ ] Illustration visible
   - [ ] FAB still accessible

2. **Empty Archive**
   - [ ] Before opening any capsule → Archive shows empty
   - [ ] Message: "No opened capsules yet"
   - [ ] "Go to Home" button works

### **Test Case 6: Validation Errors**

1. **Create Capsule - Missing Fields**
   - [ ] Empty content → Preview button disabled
   - [ ] Empty reflection (Emotion/Goal/Decision) → Preview disabled
   - [ ] No date selected → Preview disabled
   - [ ] Fill all fields → Preview enables

2. **Create Capsule - Limits**
   - [ ] Content > 2000 chars → Warning or truncation
   - [ ] Select 4th image → Blocked or warning
   - [ ] Past date selection → Error or blocked

3. **Character Counter**
   - [ ] Updates real-time
   - [ ] Color changes: gray → yellow (>1500) → red (>1900)

### **Test Case 7: Multiple Capsules**

1. Create 7+ capsules with different unlock times
   - [ ] Home shows only 6 (3x2 grid)
   - [ ] Sorted by unlock time (nearest first)
   - [ ] Scroll not available on Home (fixed 6)

2. Open multiple capsules
   - [ ] Archive list shows all opened
   - [ ] Sorted by openedAt DESC (newest first)
   - [ ] Scrollable list

### **Test Case 8: Navigation & Back Buttons**

1. **Create Flow Interruption**
   - [ ] TypeSelection → Back → Home
   - [ ] CreateCapsule (with data) → Back → Confirmation dialog
   - [ ] Preview → Edit → Returns to Create with data preserved

2. **Reflection Screen**
   - [ ] Back button → Confirmation: "Leave without answering?"
   - [ ] Yes → Returns to Open Capsule or Home
   - [ ] No → Stay on Reflection

### **Test Case 9: Pull-to-Refresh**

1. **Home Screen**
   - [ ] Pull down → Refreshes capsule list
   - [ ] Status updates (locked → ready)
   - [ ] Countdown timers refresh

2. **Archive Screen**
   - [ ] Pull down → Reloads from database
   - [ ] New opened capsules appear

### **Test Case 10: Image Handling**

1. **Image Picker**
   - [ ] Permission denied → Error message, fallback
   - [ ] Large images → Load without crash
   - [ ] Delete image thumbnail → Removes from selection

2. **Image Gallery**
   - [ ] Horizontal scroll between thumbnails
   - [ ] Tap thumbnail → Fullscreen
   - [ ] Pinch zoom works smoothly
   - [ ] Double-tap toggle zoom
   - [ ] Pan when zoomed
   - [ ] Swipe to navigate between images
   - [ ] Close button works

### **Test Case 11: Database Persistence**

1. **App Restart**
   - [ ] Kill app
   - [ ] Reopen
   - [ ] All capsules still present
   - [ ] Countdown timers correct
   - [ ] Images load correctly

2. **Data Integrity**
   - [ ] Reflection answers saved correctly
   - [ ] openedAt timestamp accurate
   - [ ] Image paths valid

---

## Performance Tests

### **Test Case 12: Performance**

1. **Animations**
   - [ ] Lock animation smooth (60 FPS)
   - [ ] Opening animation smooth
   - [ ] List scroll smooth
   - [ ] No janky transitions

2. **Large Data**
   - [ ] 50+ capsules in Archive → Scroll smooth
   - [ ] FlatList virtualization working
   - [ ] Memory usage acceptable

3. **Image Loading**
   - [ ] Images load progressively
   - [ ] No blocking of UI
   - [ ] Placeholder while loading

---

## Cross-Platform Tests

### **iOS Specific:**
- [ ] Safe area handling correct
- [ ] Haptic feedback works
- [ ] Keyboard avoidance works
- [ ] Date picker native style
- [ ] Swipe back gestures work

### **Android Specific:**
- [ ] Back button behavior correct
- [ ] Date picker dialog style
- [ ] Haptic feedback works (if supported)
- [ ] Keyboard handling correct

---

## Accessibility Tests

1. **Touch Targets**
   - [ ] All buttons ≥ 44dp
   - [ ] Cards easy to tap
   - [ ] FAB large enough

2. **Text Readability**
   - [ ] Font sizes appropriate
   - [ ] Contrast ratios sufficient
   - [ ] Long text scrollable

---

## Known Issues to Check

### From Implementation Notes:

1. **F8 - Manual Navigation Update Required**
   - File: `src/navigation/AppNavigator.tsx`
   - Line 19: Change to `OpenCapsuleScreenContainer`
   - Line 85: Change component to `OpenCapsuleScreenContainer`
   - Status: [ ] Fixed / [ ] Not Fixed

2. **Type Casting in HomeScreen**
   - File: `src/screens/HomeScreen.tsx`
   - Line 71: `as any` cast for unlockAt property
   - Impact: Minimal, internal state only
   - Status: [ ] OK / [ ] Needs refactor

3. **Celebration Placeholder**
   - Currently: Basic placeholder screen
   - TODO: Lottie animations for better UX
   - Status: [ ] Enhanced / [ ] Still placeholder

---

## Bug Tracking Template

For each bug found during testing:

```markdown
### Bug #[Number]: [Short Title]

**Severity:** Critical / High / Medium / Low
**Feature:** F[X] - [Feature Name]
**Screen:** [Screen Name]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Logs:**
[If available]

**Fix Status:** [ ] Open / [ ] In Progress / [ ] Fixed

**Fix Details:**
[Description of fix]
```

---

## Test Completion Checklist

- [ ] All 12+ test cases executed
- [ ] Edge cases tested
- [ ] Performance acceptable
- [ ] Cross-platform tested (iOS & Android)
- [ ] Bugs documented and tracked
- [ ] Critical bugs fixed
- [ ] Regression testing passed
- [ ] User acceptance criteria met

---

## Next Steps After Testing

1. **If bugs found:**
   - Document in BUGS.md
   - Prioritize: Critical → High → Medium → Low
   - Fix critical and high priority bugs
   - Re-test after fixes

2. **If tests pass:**
   - Proceed to F10 Celebration enhancement
   - Add Lottie animations
   - Polish transitions

3. **Final polish:**
   - Code cleanup
   - Remove console.logs
   - Update documentation
   - Commit and push to Git

---

**Test Plan Created:** 2025-12-26
**Status:** Ready for execution
**Estimated Time:** 2-3 hours for full testing
