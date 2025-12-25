# Home Screen UI/UX - Implementation Notes

## Overview

Home Screen UI đã được implement với các features chính:
- 3x2 grid layout hiển thị 6 capsules
- Countdown timers update real-time
- Differentiation giữa locked và ready states
- Smooth animations (fade, scale, pulse, stagger)
- Empty state với floating animation
- FAB với haptic feedback
- Pull-to-refresh

## Components Created

### 1. Design Tokens (`src/constants/`)

#### `colors.ts`
- **CapsuleTypeColors**: 4 loại capsule với primary, light, gradient colors
- **UIColors**: Primary, status, text, background, border colors
- **Helper functions**: `getCapsuleColor()`, `getReflectionColor()`

#### `theme.ts`
- **Typography**: H1-H3, body, caption, button styles
- **Spacing**: 8pt grid system (xs, sm, md, lg, xl, 2xl, 3xl)
- **BorderRadius**: Các giá trị bo góc
- **Shadows**: iOS-style elevation
- **AnimationDuration**: Timing values cho animations
- **Grid**: 3 columns configuration

### 2. UI Components (`src/components/`)

#### `CapsuleCard.tsx`
**Props:**
- `capsule: Capsule` - Capsule data object
- `onPress: (capsule: Capsule) => void` - Tap handler
- `countdown?: string` - Formatted countdown string

**Features:**
- Type-specific colors & icons (Heart, Flag, Camera, Balance)
- Gradient backgrounds (vibrant cho ready, muted cho locked)
- Lock icon badge (locked state)
- "Ready!" badge (ready state)
- Pulse animation cho ready capsules
- Scale animation on press
- Icon glow effect cho ready state

**States:**
- **Locked**: Muted background, lock icon, countdown text
- **Ready**: Gradient background, ready badge, pulse animation

#### `EmptyState.tsx`
**Props:**
- `onCreatePress: () => void` - CTA button handler

**Features:**
- Floating inbox icon với animation
- Clear messaging
- Primary CTA button
- Centered layout

#### `FAB.tsx`
**Props:**
- `onPress: () => void` - Tap handler

**Features:**
- Fixed bottom-right position
- Scale animation on press
- Shadow elevation
- Haptic feedback (iOS: Medium, Android: Light)
- Circular shape với "+" icon

### 3. Home Screen (`src/screens/`)

#### `HomeScreen.tsx`
**Features:**
- Header với Archive button và title
- FlatList với 3 columns grid
- Pull-to-refresh
- Stagger animation cho cards (50ms delay per card)
- Empty state handling
- Countdown timer updates (every 1 second)
- Loading state
- FAB overlay

**Layout:**
```
+----------------------------------+
|  [Archive]   FutureBoxes         |
+----------------------------------+
|  [Card 1]  [Card 2]  [Card 3]   |
|  [Card 4]  [Card 5]  [Card 6]   |
|                                  |
|                          [+ FAB] |
+----------------------------------+
```

**Navigation Placeholders:**
- `handleCapsuleTap()`: Shows alert, needs navigation to OpenCapsule
- `handleCreateCapsule()`: Shows alert, needs navigation to TypeSelection
- `handleArchiveTap()`: Shows alert, needs navigation to Archive

#### `mockData.ts`
**Exports:**
- `MOCK_CAPSULES`: 7 sample capsules (different types & states)
- `getUpcomingMockCapsules()`: Returns top 6 capsules sorted by unlock time
- `formatCountdown()`: Formats time remaining into readable string

**Countdown Formats:**
- `>= 1 year`: "1y 3mo"
- `>= 1 month`: "2mo 15d"
- `>= 1 week`: "2w 3d"
- `>= 1 day`: "3d 5h 30m"
- `< 1 day`: "12:30:45"
- `<= 0`: "Ready!"

## Integration with Business Logic

### Current State (Mock Data)
```typescript
// In HomeScreen.tsx line ~47
const data = getUpcomingMockCapsules();
```

### TODO: Replace with Database Service
```typescript
// Replace with:
const data = await databaseService.getUpcomingCapsules();
```

**Required from `databaseService`:**
```typescript
interface DatabaseService {
  getUpcomingCapsules(): Promise<Capsule[]>;
  // Should return max 6 capsules
  // Sorted by unlockAt ASC
  // Filter status IN ('locked', 'ready')
}
```

### Status Updates
Currently, countdowns update every second but don't update capsule status in DB.

**TODO: Agent-react needs to add:**
```typescript
// In timer interval (line ~88)
// Check if any locked capsule should become ready
capsules.forEach(async (capsule) => {
  if (capsule.status === 'locked' && capsule.unlockAt <= Date.now()) {
    await databaseService.updateCapsuleStatus(capsule.id, 'ready');
    // Trigger notification
  }
});
```

## Testing UI

### Run with Mock Data
1. Import HomeScreen: `import { HomeScreen } from './src/screens';`
2. Render in App.tsx (temporary)
3. See 6 capsules with countdowns
4. Test interactions:
   - Tap locked capsule → Alert
   - Tap ready capsule → Alert (placeholder)
   - Tap FAB → Alert (placeholder)
   - Tap Archive → Alert (placeholder)
   - Pull to refresh → Reload

### Test Different States
Modify `mockData.ts` to test:
- All locked: Change unlockAt to future dates
- All ready: Change unlockAt to past dates
- Empty: Return empty array from `getUpcomingMockCapsules()`
- Less than 6: Return only 3-4 capsules

## Design Decisions

### Color Palette
- **Emotion (Pink)**: Warm, emotional, heart-related
- **Goal (Green)**: Achievement, growth, success
- **Memory (Orange)**: Nostalgic, warm, cheerful
- **Decision (Blue)**: Calm, thoughtful, analytical

### Animations
- **Pulse (ready capsules)**: 1.5s loop, subtle scale 1.0 → 1.02
- **Press (cards)**: Spring animation, scale 0.95
- **Stagger (grid)**: 50ms delay per card, fade + translateY
- **Float (empty state)**: 3s loop, translateY -10px

### Typography
- **Header Title**: H2 (24px, Semibold)
- **Countdown (large)**: H3 (20px, Bold)
- **Body text**: 16px Regular
- **Captions**: 12px Regular

### Spacing
- **Card padding**: 16px (md)
- **Grid gutter**: 16px (md)
- **Screen padding**: 24px (lg)
- **FAB position**: 24px from bottom-right

## Next Steps for Agent-React

1. **Database Integration**
   - Replace `getUpcomingMockCapsules()` with real DB query
   - Implement status update logic in timer

2. **Navigation Setup**
   - Setup React Navigation stack
   - Add navigation prop to HomeScreen
   - Implement actual navigation calls

3. **Error Handling**
   - Add error boundaries
   - Handle DB query failures
   - Show retry UI

4. **Performance**
   - Optimize countdown calculation (don't recalc every second)
   - Memoize capsule cards
   - Use React.memo for components

5. **Accessibility**
   - Add accessibilityLabel to buttons
   - Add accessibilityHint for locked capsules
   - Test with VoiceOver/TalkBack

6. **Edge Cases**
   - Handle exactly 6 capsules
   - Handle rapid status changes
   - Handle timezone issues
   - Handle app backgrounding during countdown

## Known Limitations (Happy Cases Only)

- No error handling for DB failures
- No offline status indicator
- No background task for status updates
- No notification integration
- Navigation calls are placeholders (alerts)
- Mock data only

These will be handled by agent-react during business logic implementation.

---

**Implementation Date**: 2025-12-25
**Agent**: agent-uiux
**Status**: ✅ UI/UX Complete - Ready for Business Logic Integration
