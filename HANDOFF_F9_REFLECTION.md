# Handoff Document: F9 - Reflection Response

**From:** agent-uiux
**To:** agent-react
**Date:** 2025-12-25
**Feature:** F9 - Reflection Response Screen

---

## 📦 Deliverables

Tôi đã hoàn thành thiết kế và implement UI/UX cho tính năng F9: Reflection Response. Dưới đây là tóm tắt những gì đã làm.

### Files Created

1. **src/screens/ReflectionScreen.tsx**
   - Main screen cho reflection response
   - Hiển thị reflection question
   - Render UI phù hợp theo capsule type (Yes/No hoặc Rating)
   - Handle navigation và state management
   - Placeholder cho database operations

2. **src/components/YesNoButtons.tsx**
   - Component cho Emotion/Goal types
   - 2 buttons: Yes (green) và No (red)
   - Selected state với color fill và checkmark
   - Scale animations và haptic feedback

3. **src/components/StarRating.tsx**
   - Component cho Decision type
   - 5 stars với rating 1-5
   - Fill animation từ trái sang phải
   - Labels: Bad - Neutral - Great
   - Bounce animation khi select

4. **src/screens/ReflectionScreenDemo.tsx**
   - Demo screen với 6 test scenarios
   - Để test UI/UX trong development
   - Access từ navigation để xem các states khác nhau

### Files Modified

5. **src/navigation/AppNavigator.tsx**
   - Added `Reflection` screen to navigation stack
   - Updated `RootStackParamList` với params:
     - `capsuleId: string`
     - `type: CapsuleType`
     - `reflectionQuestion: string`

---

## 🎨 UI/UX Design Overview

### Screen Layout

```
┌─────────────────────────────────┐
│    [<- Back]    Reflect          │  ← Header
├─────────────────────────────────┤
│                                 │
│        [Type Icon]              │  ← Type badge (heart/flag/scale)
│                                 │
│   Your question:                │
│   ┌──────────────────────┐     │
│   │ "Reflection          │     │  ← Question card
│   │  question here"      │     │
│   └──────────────────────┘     │
│                                 │
│   How do you answer?            │  ← Instruction
│                                 │
│   ┌──────┐     ┌──────┐        │
│   │ YES  │     │ NO   │        │  ← Answer UI (Yes/No or Stars)
│   └──────┘     └──────┘        │
│                                 │
├─────────────────────────────────┤
│       [Continue →]              │  ← Continue button
└─────────────────────────────────┘
```

### Type-Specific UI

#### Emotion/Goal Types (Yes/No)
- 2 large buttons side-by-side
- **Yes Button:**
  - Unselected: White background, green border, green smiley icon
  - Selected: Green fill, white text, checkmark, happy icon
- **No Button:**
  - Unselected: White background, red border, red sad icon
  - Selected: Red fill, white text, checkmark, sad icon
- Minimum touch target: 56dp
- Scale animation on press: 0.95

#### Decision Type (Rating 1-5)
- 5 star icons in horizontal row
- Tap star N → fill stars 1 to N
- Star colors:
  - Rating 4-5: Gold (#FFD700)
  - Rating 3: Orange (warning)
  - Rating 1-2: Red (danger)
  - Unselected: Gray (border)
- Bounce animation on select
- Labels below: "Bad" - "Neutral" - "Great"

### Animations & Interactions

1. **Button Press:**
   - Scale: 1.0 → 0.95 → 1.0
   - Duration: 100ms
   - Spring animation with damping: 15

2. **Star Select:**
   - Bounce: 1.0 → 1.2 → 1.0
   - Duration: 200ms
   - Sequential fill animation

3. **Continue Button:**
   - Initially disabled (opacity 0.5)
   - After selection: fade to opacity 1.0
   - Duration: 200ms
   - Scale on press: 0.95

4. **Haptic Feedback:**
   - Yes/No buttons: Medium impact
   - Star rating: Light impact
   - Continue button: Success notification

### Colors & Styling

- Uses design tokens from `src/constants/colors.ts` và `theme.ts`
- Type-specific colors:
  - Emotion: Pink (#E91E63)
  - Goal: Green (#4CAF50)
  - Decision: Blue (#2196F3)
- Success/Danger colors cho Yes/No
- Gold/Orange/Red cho star ratings
- Follows 8pt spacing grid
- Border radius: 12dp (lg)
- Shadows: sm for cards, md for buttons

---

## 🔌 Integration Points

### Navigation Flow

```
OpenCapsuleScreen (Continue button)
  ↓
ReflectionScreen
  - User selects answer (Yes/No or Rating)
  - Tap Continue
  ↓
CelebrationScreen (to be implemented by agent-react)
```

### Props/Params

**ReflectionScreen receives:**
```typescript
{
  capsuleId: string;        // Capsule ID to update
  type: CapsuleType;        // 'emotion' | 'goal' | 'decision'
  reflectionQuestion: string; // Question to display
}
```

**ReflectionScreen navigates to Celebration with:**
```typescript
{
  capsuleId: string;
  type: CapsuleType;
  answer: string;  // 'yes' | 'no' | '1' | '2' | '3' | '4' | '5'
}
```

---

## 🚧 TODO for agent-react

### 1. Database Integration

**File:** `src/screens/ReflectionScreen.tsx`

**Location:** Line ~122-127 (handleContinue function)

```typescript
// TODO: Save answer to database
// - Update capsule.reflectionAnswer = selectedAnswer
// - Update capsule.status = 'opened'
// - Update capsule.openedAt = new Date().toISOString()
```

**Requirements:**
- Update capsule record in SQLite database
- Set `reflectionAnswer` = selectedAnswer ('yes'/'no'/'1'-'5')
- Set `status` = 'opened'
- Set `openedAt` = current timestamp
- Handle database errors with user-friendly error message

**Example implementation:**
```typescript
try {
  await updateCapsule(capsuleId, {
    reflectionAnswer: selectedAnswer,
    status: 'opened',
    openedAt: new Date().toISOString(),
  });

  // Navigate to Celebration
  navigation.navigate('Celebration', {
    capsuleId,
    type,
    answer: selectedAnswer,
  });
} catch (error) {
  Alert.alert(
    'Error',
    'Failed to save your answer. Please try again.',
    [{ text: 'OK' }]
  );
}
```

### 2. OpenCapsuleScreen Integration

**File:** `src/screens/OpenCapsuleScreen.tsx`

**Requirements:**
- Add Continue button at bottom of OpenCapsuleScreen
- Check capsule type:
  - If type === 'memory' → No reflection, navigate directly to Celebration
  - If type === 'emotion' | 'goal' | 'decision' → Navigate to ReflectionScreen
- Pass correct params:
  - capsuleId
  - type
  - reflectionQuestion (from capsule data)

**Example navigation:**
```typescript
// For Emotion/Goal/Decision
if (capsule.reflectionQuestion) {
  navigation.navigate('Reflection', {
    capsuleId: capsule.id,
    type: capsule.type,
    reflectionQuestion: capsule.reflectionQuestion,
  });
} else {
  // Memory type - no reflection
  navigation.navigate('Celebration', {
    capsuleId: capsule.id,
    type: capsule.type,
    answer: null,
  });
}
```

### 3. Create CelebrationScreen

**File:** `src/screens/CelebrationScreen.tsx` (new file)

**Requirements:**
- Receive params: `{ capsuleId, type, answer }`
- Display celebration effects based on answer:
  - Yes / Rating 4-5: Confetti animation
  - No / Rating 1-2: Encouraging animation
  - Rating 3: Neutral animation
  - Memory: Nostalgic animation
- Duration: 2-3 seconds
- Allow tap to skip
- After animation: Show buttons
  - "View Archive" → Navigate to Archive
  - "Done" → Navigate to Home
- Update navigation stack với CelebrationScreen

**References:**
- PRD F10: Celebration Effects
- design/screens.md - Section 10: Celebration Screen
- Use Lottie for animations (lottie-react-native)

### 4. Error Handling

**Scenarios to handle:**
- Database update failed
- Navigation params missing/invalid
- Capsule not found
- Invalid reflection type

**Strategy:**
- Use try-catch for database operations
- Show Alert.alert for user-facing errors
- Log errors to console for debugging
- Provide retry option where applicable

### 5. Edge Cases

- **Back navigation:** Confirmation dialog if answer selected but not saved
- **Hardware back button (Android):** Same behavior as back button tap
- **App killed during save:** Capsule remains 'ready', user can try again
- **Multiple rapid taps on Continue:** Debounce or disable button after first tap
- **Long reflection questions:** ScrollView ensures all content visible

---

## 🧪 Testing

### Manual Testing Checklist

**Use ReflectionScreenDemo** for testing:

1. **Emotion Type - Yes/No:**
   - [ ] Yes button selectable, shows green fill
   - [ ] No button selectable, shows red fill
   - [ ] Switch between Yes/No updates selection
   - [ ] Continue button disabled initially
   - [ ] Continue button enabled after selection
   - [ ] Haptic feedback on button press
   - [ ] Scale animation smooth

2. **Goal Type - Yes/No:**
   - [ ] Same as Emotion type
   - [ ] Correct icon displayed (flag)

3. **Decision Type - Rating:**
   - [ ] All 5 stars tappable
   - [ ] Tap star 3 → stars 1,2,3 filled
   - [ ] Tap star 5 → all stars filled
   - [ ] Tap star 1 → only star 1 filled
   - [ ] Correct colors (gold/orange/red)
   - [ ] Bounce animation on select
   - [ ] Continue enabled after selection

4. **Navigation:**
   - [ ] Back button shows confirm dialog if answer selected
   - [ ] Back button works without confirmation if no selection
   - [ ] Continue navigates to Celebration (stub screen OK)

5. **Styling:**
   - [ ] Safe area respected (notch/status bar)
   - [ ] Scrollable on small screens
   - [ ] Touch targets >= 44dp
   - [ ] Colors match design system
   - [ ] Typography consistent

6. **Accessibility:**
   - [ ] Screen reader friendly labels
   - [ ] Haptic feedback works
   - [ ] Buttons have sufficient contrast

### Test Scenarios in Demo

Access demo via: `ReflectionScreenDemo` screen

6 pre-configured scenarios:
1. Emotion - Anxiety (Yes/No)
2. Emotion - Happiness (Yes/No)
3. Goal - Running 5k (Yes/No)
4. Goal - Learn Guitar (Yes/No)
5. Decision - Job Change (Rating)
6. Decision - Moving City (Rating)

---

## 📝 Code Quality Notes

- **TypeScript:** Full type safety, no `any` types
- **React Native Reanimated 4.x:** Used for animations (New Architecture compatible)
- **Haptics:** Expo Haptics for tactile feedback
- **Design Tokens:** All colors, spacing, typography from constants
- **Component Reusability:** YesNoButtons and StarRating are reusable
- **Comments:** Inline comments for complex logic
- **Naming:** Clear, descriptive variable/function names

---

## 🔗 Dependencies

All dependencies already in project:

- `react-native-reanimated`: ^4.2.0 (animations)
- `expo-haptics`: Latest (haptic feedback)
- `@expo/vector-icons`: Latest (icons)
- `react-native-safe-area-context`: Latest (safe area)
- `@react-navigation/native`: ^7.1.0 (navigation)
- `@react-navigation/stack`: ^7.1.0 (stack navigator)

No additional packages needed.

---

## 🎯 Next Steps

1. **agent-react:** Implement database integration in `handleContinue`
2. **agent-react:** Update `OpenCapsuleScreen` to navigate to Reflection
3. **agent-react:** Create `CelebrationScreen` with effects
4. **agent-react:** Add `CelebrationScreen` to navigation
5. **agent-react:** Test full flow: Open → Reflection → Celebration → Archive
6. **agent-react:** Handle edge cases and errors
7. **User:** Test on device/simulator, provide feedback

---

## 📸 Screenshots/Mockups

Refer to:
- **design/screens.md** - Section 9: Reflection Response Screen
- **design/flows/F9-reflection-response.md** - Activity diagram
- **PRD.md** - F9: Reflection Response acceptance criteria

UI matches screen descriptions exactly:
- Type badge với icon và color
- Question card với quote styling
- Yes/No buttons hoặc Star rating
- Continue button at bottom
- Clean, focused layout

---

## 💬 Questions?

Nếu có vấn đề hoặc cần clarification về UI/UX:

1. Check design docs: `design/screens.md` và `design/flows/F9-*.md`
2. Review component code: Comments inline
3. Test with `ReflectionScreenDemo`
4. Contact agent-uiux nếu cần adjust design

---

**Handoff Complete!** 🎉

UI/UX layer cho F9 đã sẵn sàng. Agent-react có thể bắt đầu implement business logic, database integration và celebration effects.

Good luck! 🚀
