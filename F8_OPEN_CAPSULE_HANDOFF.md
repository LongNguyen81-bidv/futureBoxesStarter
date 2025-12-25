# F8: Open Capsule - UI/UX Handoff Document

**Created by:** agent-uiux
**Date:** 2025-12-25
**Feature:** F8 - Open Capsule Screen
**Status:** UI/UX Implementation Complete ✅

---

## Overview

Tôi đã hoàn thành thiết kế và implement UI/UX cho **F8: Open Capsule** - màn hình hiển thị animation mở hộp và nội dung capsule khi user mở time capsule.

Đây là "moment of truth" - trải nghiệm cảm xúc quan trọng nhất của app khi user đọc lại tin nhắn từ quá khứ.

---

## Files Created

### 1. Design System Constants

- **`constants/Colors.ts`**: Color palette cho capsule types, UI colors, celebration colors
- **`constants/Spacing.ts`**: Spacing scale (8pt grid), border radius, elevation
- **`constants/Typography.ts`**: Typography scale (H1-H3, body, caption, button)

### 2. Type Definitions

- **`types/capsule.ts`**:
  - `CapsuleType`, `CapsuleStatus` enums
  - `Capsule` interface
  - `OpenCapsuleData` interface với timeLocked string

### 3. UI Components

- **`components/OpeningAnimationOverlay.tsx`**:
  - Opening animation với Reanimated 4.x
  - Box opening, lid rotate, glow effects
  - Type-specific colors
  - Animation sequence: 1.5s total
  - onComplete callback khi animation xong

- **`components/ImageGallery.tsx`**:
  - Horizontal scrollable thumbnail gallery
  - Fullscreen image viewer modal
  - Pinch-to-zoom với Gesture Handler
  - Double-tap to zoom in/out
  - Pan gesture khi zoomed
  - Swipe navigation giữa images
  - Page indicator (dots)

- **`components/OpenCapsuleScreen.tsx`**:
  - Main screen component
  - Orchestrates opening animation → content display
  - Type badge với icon và color
  - Metadata display (created, opened, duration)
  - Content text trong scrollable card
  - Image gallery integration
  - Continue button (conditional text)
  - Leave confirmation dialog

### 4. Utilities & Mock Data

- **`utils/mockData.ts`**:
  - Mock capsules cho tất cả 4 types
  - `calculateTimeLocked()` helper function
  - `getMockCapsule()` function

### 5. Demo App

- **`DemoOpenCapsule.tsx`**:
  - Standalone demo app
  - Type selection screen
  - Chạy được ngay để preview UI
  - Features list documented

---

## Design Implementation Details

### Opening Animation

**Sequence:**
1. **Box Scale In** (300ms): Box từ scale 0.8 → 1.0
2. **Lid Opens** (500ms, delay 300ms): Lid rotate -90deg (3D perspective)
3. **Glow Appears** (400ms, delay 500ms): Gradient glow fade in + scale
4. **Content Reveal** (400ms, delay 900ms): Content fade in + slide up

**Total Duration:** ~1.5 seconds

**Tech Stack:**
- React Native Reanimated 4.x (`useSharedValue`, `useAnimatedStyle`, `withTiming`, `withDelay`)
- Expo Linear Gradient cho glow effects
- Type-specific colors từ design tokens

### Image Gallery

**Features:**
- **Thumbnail View**: Horizontal scroll, 120x120dp thumbnails
- **Fullscreen Viewer**:
  - Pinch gesture: scale 1-3x
  - Pan gesture: khi zoomed > 1
  - Double-tap: toggle zoom (1x ↔ 2x)
  - Swipe navigation: prev/next image
  - Page indicator: dots + counter (1/3)

**Tech Stack:**
- `react-native-gesture-handler` Gesture.Pinch(), Gesture.Pan(), Gesture.Tap()
- Reanimated cho smooth animations
- `expo-image` cho optimized image loading
- Modal cho fullscreen overlay

### Content Display

**Layout:**
- SafeAreaView với proper edges
- ScrollView cho long content
- Type badge ở top (icon + name + type color)
- Metadata section (created, opened, duration)
- Content card (white background, shadow)
- Image gallery (horizontal scroll)
- Footer với Continue button (sticky bottom)

**Typography:**
- Content text: 16px, line-height 26px (increased for readability)
- Metadata: 14px secondary color
- Duration: 16px bold

**Interactions:**
- Close button → Leave confirmation dialog
- Continue button → Navigate to Reflection hoặc Archive
- Haptic feedback on button press

### Type-Specific Styling

| Type | Color | Icon | Continue Text |
|------|-------|------|---------------|
| **Emotion** | Pink #E91E63 | heart | "Answer Reflection" |
| **Goal** | Green #4CAF50 | flag | "Answer Reflection" |
| **Memory** | Orange #FF9800 | camera | "Save to Archive" |
| **Decision** | Blue #2196F3 | scale | "Answer Reflection" |

---

## Component Props & APIs

### OpenCapsuleScreen

```typescript
interface OpenCapsuleScreenProps {
  capsule: OpenCapsuleData;  // Capsule data với timeLocked
  onClose: () => void;        // Navigate back to Home
  onContinue: () => void;     // Navigate to Reflection/Celebration
}
```

### OpeningAnimationOverlay

```typescript
interface OpeningAnimationOverlayProps {
  capsuleType: CapsuleType;   // Type cho colors
  onComplete: () => void;     // Callback khi animation complete
}
```

### ImageGallery

```typescript
interface ImageGalleryProps {
  images: string[];  // Array of image URIs
}
```

---

## Mock Data Structure

```typescript
{
  id: '1',
  type: 'emotion',
  status: 'ready',
  content: 'Full text content...',
  images: ['uri1', 'uri2'],
  reflectionQuestion: 'Did the interview go well?',
  createdAt: Date,
  unlockAt: Date,
  openedAt: Date,
  timeLocked: '1 year, 3 months',
}
```

---

## How to Preview

### Option 1: Run Demo (Recommended)

1. Tạm comment out navigation code trong `App.tsx`
2. Import DemoOpenCapsule:
   ```typescript
   import DemoOpenCapsule from './DemoOpenCapsule';
   export default DemoOpenCapsule;
   ```
3. Run `expo start`
4. Chọn capsule type để preview

### Option 2: Integrate vào Navigation

Khi navigation ready, add screen:
```typescript
<Stack.Screen
  name="OpenCapsule"
  component={OpenCapsuleScreen}
  options={{ headerShown: false }}
/>
```

---

## What's Next (For agent-react)

### Business Logic cần implement:

1. **Load Capsule Data**
   - Query capsule từ database by ID
   - Check status = 'ready'
   - Calculate `timeLocked` duration
   - Load images từ file system

2. **Navigation Integration**
   - Integrate vào React Navigation stack
   - Pass capsule ID via route params
   - Handle deep linking từ notification

3. **Error Handling**
   - Capsule not found
   - Capsule still locked
   - Image load failures
   - Database errors

4. **State Management**
   - Track animation complete state
   - Handle leave confirmation
   - Update capsule status khi continue

5. **Edge Cases**
   - Very long content text (test scrolling)
   - No images (gallery should hide)
   - Network failures (images không load)
   - Memory type vs Reflection types

6. **Performance**
   - Image caching strategy
   - Lazy load images in fullscreen viewer
   - Optimize animation performance

### Integration Points:

- **From Home Screen**: Tap ready capsule → navigate here với capsule ID
- **From Notification**: Tap notification → deep link với capsule ID
- **To Reflection Screen (F9)**: onContinue() nếu type có reflection
- **To Celebration Screen (F10)**: onContinue() nếu type Memory hoặc sau reflection

---

## Design Decisions & Rationale

### Why Reanimated 4.x?
- Smooth 60fps animations on UI thread
- Worklets cho complex animation sequences
- Better than Animated API for this use case

### Why Gesture Handler?
- Native gesture recognition
- Pinch-to-zoom requires simultaneous gestures
- Better performance than PanResponder

### Why expo-image?
- Automatic caching
- Better performance than Image component
- Blurhash support (future enhancement)

### Why separate Opening Animation?
- Emotional impact - build anticipation
- Component reusability
- Easy to skip/customize per type

### Why confirmation dialog on close?
- Prevent accidental exits
- User might not finish viewing content
- Follow UX best practice

---

## Known Limitations (Happy Cases Only)

- **Mock data only**: Real database integration needed
- **No error states**: Edge cases cần handle
- **No accessibility**: VoiceOver/TalkBack cần thêm
- **No reduce motion**: Animation respect setting cần implement
- **No image zoom limits**: Cần clamp zoom range better
- **No loading states**: Image loading placeholders needed

---

## Dependencies Used

```json
{
  "react-native-reanimated": "^4.2.0",
  "react-native-gesture-handler": "^2.22.0",
  "expo-linear-gradient": "~14.0.0",
  "expo-image": "~2.0.0",
  "expo-haptics": "~14.0.0",
  "@expo/vector-icons": "^14.0.0",
  "date-fns": "^4.1.0"
}
```

---

## Screenshots / Visuals

### Opening Animation Flow
```
[Closed Box]
   ↓ (300ms scale in)
[Box Scaled]
   ↓ (500ms lid opens)
[Lid Opening + Glow]
   ↓ (400ms content reveal)
[Content Visible]
```

### Content Layout
```
┌─────────────────────────────────┐
│            [X Close]             │
├─────────────────────────────────┤
│ [❤️ Icon]  Emotion Capsule       │
│                                  │
│ Created on Monday, Dec 25, 2024 │
│ Opened on Friday, Jan 1, 2026   │
│ Time locked: 1 year              │
│                                  │
│ ┌────────────────────────────┐  │
│ │ "I'm feeling anxious..."   │  │
│ │                            │  │
│ └────────────────────────────┘  │
│                                  │
│ [🖼️] [🖼️] [🖼️]  (scroll →)      │
│                                  │
├─────────────────────────────────┤
│   [Answer Reflection] →          │
└─────────────────────────────────┘
```

---

## Questions for agent-react?

1. **Database schema**: Có đúng với OpenCapsuleData interface không?
2. **Image storage**: URIs format như thế nào? (file://, content://, etc.)
3. **Navigation params**: Pass capsule ID hay full object?
4. **Status update**: Khi nào update status từ 'ready' → 'opened'? (ngay khi open hay sau khi continue?)
5. **Reflection flow**: Navigate thẳng đến F9 hay qua intermediate screen?

---

## Contact

Nếu có vấn đề về UI/UX hoặc cần adjustment:
- Agent: **agent-uiux**
- Handoff date: 2025-12-25
- Communication log: `AGENT_COMMUNICATION.log`

---

## Summary

✅ **Completed:**
- Opening animation với type-specific effects
- Content display layout với scrolling
- Image gallery với fullscreen zoom
- Type badges và metadata
- Conditional button text
- Leave confirmation dialog
- Mock data cho testing
- Demo app standalone

🔄 **Needs from agent-react:**
- Database integration
- Real data loading
- Error handling
- Edge cases
- Navigation integration
- State management
- Performance optimization

---

**Ready for handoff!** 🚀

Hãy test DemoOpenCapsule.tsx để xem UI/UX hoàn chỉnh, sau đó integrate business logic.
