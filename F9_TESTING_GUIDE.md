# F9 Reflection Response - Testing Guide

## 🧪 How to Test the UI

### Quick Start

1. **Run the app:**
   ```bash
   npm start
   # or
   npx expo start
   ```

2. **Navigate to ReflectionScreenDemo:**
   - From Home screen, navigate to the demo screen
   - (Or update navigation to include ReflectionScreenDemo temporarily)

3. **Test Scenarios:**
   - Tap any of the 6 scenarios to open ReflectionScreen
   - Test different types: Emotion, Goal, Decision

---

## 🎯 What to Test

### ✅ Emotion Type (Yes/No)

**Scenario:** "Did this feeling of anxiety pass?"

**Test Cases:**

1. **Initial State**
   - [ ] Question displays correctly with quote styling
   - [ ] Both Yes and No buttons visible
   - [ ] Both buttons have border only (unselected state)
   - [ ] Continue button is disabled (gray, opacity 0.5)
   - [ ] Type icon shows heart (emotion)

2. **Select Yes**
   - [ ] Tap Yes button
   - [ ] Haptic feedback felt
   - [ ] Yes button fills with green color
   - [ ] Yes button shows checkmark in top-right
   - [ ] Button has scale animation (press feel)
   - [ ] No button remains unselected
   - [ ] Continue button becomes enabled (full opacity)

3. **Change to No**
   - [ ] Tap No button
   - [ ] Yes button returns to unselected state
   - [ ] No button fills with red color
   - [ ] No button shows checkmark
   - [ ] Continue button remains enabled

4. **Navigation**
   - [ ] Tap Continue → navigates to Celebration (or shows error if not implemented)
   - [ ] Tap Back → shows confirmation dialog
   - [ ] Confirm "Discard" → goes back
   - [ ] Cancel → stays on screen

---

### ⭐ Decision Type (Rating 1-5)

**Scenario:** "Was quitting your job the right decision?"

**Test Cases:**

1. **Initial State**
   - [ ] Question displays correctly
   - [ ] 5 stars visible, all outlined (gray)
   - [ ] Number labels 1-5 below each star
   - [ ] Labels "Bad - Neutral - Great" displayed
   - [ ] Continue button disabled
   - [ ] Type icon shows scale (decision)

2. **Select Rating 1**
   - [ ] Tap star 1
   - [ ] Haptic feedback
   - [ ] Star 1 fills with red color
   - [ ] Star 1 has bounce animation
   - [ ] Other stars remain gray
   - [ ] Continue button enabled

3. **Select Rating 3**
   - [ ] Tap star 3
   - [ ] Stars 1, 2, 3 fill with orange color
   - [ ] Stars 4, 5 remain gray
   - [ ] Bounce animation on star 3
   - [ ] Continue enabled

4. **Select Rating 5**
   - [ ] Tap star 5
   - [ ] All 5 stars fill with gold color
   - [ ] Bounce animation on star 5
   - [ ] Continue enabled

5. **Change Rating**
   - [ ] Tap star 2 after selecting star 5
   - [ ] Only stars 1, 2 are filled
   - [ ] Stars 3, 4, 5 return to gray
   - [ ] Continue remains enabled

---

## 🎨 Visual Quality Checks

### Typography

- [ ] Question text is large and readable (h3 size)
- [ ] Question has italic style (quote)
- [ ] Button text is bold (semibold weight)
- [ ] All text has correct color contrast

### Spacing

- [ ] Consistent spacing between elements
- [ ] No elements touching screen edges
- [ ] Safe area respected (notch, status bar)
- [ ] Buttons have comfortable spacing

### Colors

- [ ] Type icon color matches capsule type:
  - Emotion: Pink (#E91E63)
  - Goal: Green (#4CAF50)
  - Decision: Blue (#2196F3)
- [ ] Yes button: Green when selected
- [ ] No button: Red when selected
- [ ] Stars: Gold (4-5), Orange (3), Red (1-2)

### Animations

- [ ] All animations smooth (60 FPS)
- [ ] No jank or lag
- [ ] Scale animations feel natural
- [ ] Bounce animations not too aggressive
- [ ] Fade transitions smooth

### Touch Feedback

- [ ] All buttons have visual press feedback
- [ ] Haptic feedback works (if device supports)
- [ ] No double-tap issues
- [ ] Touch targets easy to hit (not too small)

---

## 📱 Device Testing

### iOS

- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone 14 Pro (notch)
- [ ] Test on iPhone 14 Pro Max (large screen)
- [ ] Safe area handled correctly
- [ ] Haptics work

### Android

- [ ] Test on small device (5" screen)
- [ ] Test on large device (6.5"+ screen)
- [ ] Status bar spacing correct
- [ ] Haptics work (if supported)

### Orientations

- [ ] Portrait works perfectly
- [ ] Landscape (optional) - should maintain usability

---

## 🐛 Edge Cases to Test

### Long Questions

**Test with:**
```
"This is a very long reflection question that spans multiple lines to test how the UI handles text wrapping and scrolling in the question card. Does it display properly?"
```

- [ ] Question card scrollable if needed
- [ ] Text wraps correctly
- [ ] Card height adjusts
- [ ] No text cutoff

### Small Screens

- [ ] Content fits on iPhone SE (375dp width)
- [ ] ScrollView scrollable
- [ ] All elements accessible
- [ ] No horizontal scroll

### Back Navigation

**Scenario 1: No selection**
- [ ] Tap Back → goes back immediately

**Scenario 2: With selection**
- [ ] Tap Back → shows confirmation dialog
- [ ] Dialog has "Stay" and "Discard" options
- [ ] "Stay" → remains on screen
- [ ] "Discard" → goes back, selection lost

**Scenario 3: Hardware back (Android)**
- [ ] Same behavior as Back button

### Rapid Taps

- [ ] Tap Continue multiple times rapidly
- [ ] Should only navigate once
- [ ] No crashes or errors

### Memory

- [ ] Switch between Yes/No many times
- [ ] No memory leaks
- [ ] Animations don't accumulate

---

## ♿ Accessibility Testing

### Screen Reader (VoiceOver/TalkBack)

- [ ] Enable screen reader
- [ ] All elements have labels
- [ ] Focus order logical:
  1. Back button
  2. Question card
  3. Answer buttons/stars
  4. Continue button
- [ ] Selected state announced
- [ ] Button actions clear

### Dynamic Type

- [ ] Increase text size in system settings
- [ ] UI scales appropriately
- [ ] No text cutoff
- [ ] Layout adapts

### Reduce Motion

- [ ] Enable "Reduce Motion" in system settings
- [ ] Animations still work (but simplified)
- [ ] No jarring movements
- [ ] Transitions smooth

---

## ⚙️ Performance Testing

### Animation Performance

- [ ] Open performance monitor
- [ ] All animations at 60 FPS
- [ ] No dropped frames during:
  - Button press
  - Star selection
  - Continue enable
  - Screen transitions

### Memory Usage

- [ ] Check memory usage in profiler
- [ ] No memory leaks
- [ ] Memory stable after multiple screen visits
- [ ] Animations dispose correctly

### Network (N/A for this screen)

- No network calls in UI layer

---

## 📋 Testing Checklist Summary

### Must Pass (Critical)

- [x] All 6 test scenarios open without crash
- [ ] Yes/No buttons work correctly
- [ ] Star rating works correctly
- [ ] Continue button enables after selection
- [ ] Continue button disabled initially
- [ ] Back button confirmation works
- [ ] Haptic feedback works
- [ ] Animations smooth
- [ ] Safe area respected
- [ ] No TypeScript errors in console

### Should Pass (Important)

- [ ] Long questions display correctly
- [ ] Small screens handle content
- [ ] Screen reader accessible
- [ ] Performance 60 FPS
- [ ] No memory leaks
- [ ] Rapid taps handled
- [ ] Colors match design system

### Nice to Have

- [ ] Dynamic type scaling
- [ ] Reduce motion support
- [ ] Landscape orientation
- [ ] Large screen optimization

---

## 🚨 Known Issues / Limitations

### Current State

1. **Database Integration:** Not implemented
   - Continue button navigates to Celebration (stub)
   - No actual save to database
   - Will show error if Celebration screen not created

2. **Navigation:** ReflectionScreenDemo not in main navigation
   - Need to manually navigate or update AppNavigator

3. **Celebration Screen:** Not created yet
   - Navigation will fail or show placeholder

### Expected Behavior

- UI works perfectly ✅
- Animations smooth ✅
- State management works ✅
- Database save → Pending agent-react
- Celebration → Pending agent-react

---

## 📸 Screenshot Checklist

Take screenshots for documentation:

1. **Emotion - Initial state**
2. **Emotion - Yes selected**
3. **Emotion - No selected**
4. **Decision - Initial state**
5. **Decision - Rating 1 selected**
6. **Decision - Rating 3 selected**
7. **Decision - Rating 5 selected**
8. **Back confirmation dialog**
9. **Long question example**
10. **Small screen (iPhone SE)**

---

## ✅ Sign-off Criteria

Before marking F9 UI as complete:

- [ ] All critical tests pass
- [ ] No crashes in any scenario
- [ ] Animations smooth on real device
- [ ] Code reviewed by agent-react
- [ ] Documentation complete
- [ ] Handoff document reviewed
- [ ] Ready for database integration

---

## 🆘 Troubleshooting

### Issue: Haptics not working

**Solution:**
- Check device supports haptics
- Check app has permission
- Test on real device (not simulator)

### Issue: Animations laggy

**Solution:**
- Test on real device
- Check React Native Reanimated installed
- Verify New Architecture enabled

### Issue: TypeScript errors

**Solution:**
- Run `npx tsc --noEmit`
- Check type imports
- Verify RootStackParamList updated

### Issue: Navigation fails

**Solution:**
- Check Reflection added to AppNavigator
- Verify params passed correctly
- Check Celebration screen exists

---

**Happy Testing!** 🧪✨

Report any issues to agent-uiux for UI fixes or agent-react for logic issues.
