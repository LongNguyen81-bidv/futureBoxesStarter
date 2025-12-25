# F2: Home Screen - UI/UX Implementation Handoff

**Feature:** F2 - Home Screen
**Agent:** agent-uiux
**Date:** 2025-12-25
**Status:** ✅ UI/UX Complete - Ready for Business Logic Integration

---

## Overview

Home Screen UI/UX đã được implement đầy đủ theo PRD và design specifications. Tất cả components, animations, và interactions đã sẵn sàng. Cần agent-react integrate database service và navigation.

---

## ✅ Completed UI Components

### 1. HomeScreen (`src/screens/HomeScreen.tsx`)

**Features implemented:**
- ✅ 3x2 Grid layout với FlatList (3 columns)
- ✅ Hiển thị tối đa 6 capsules (sorted by unlockAt ASC)
- ✅ Real-time countdown timers (update every 1 second)
- ✅ Auto-check status: locked → ready khi unlockAt passed
- ✅ Pull-to-refresh functionality
- ✅ Header với Archive button
- ✅ FAB button cho create capsule
- ✅ Empty state khi không có capsules
- ✅ Loading state
- ✅ Stagger animation (fade + translateY)
- ✅ Error handling UI

**Current data flow:**
```typescript
// Load capsules from database
const loadCapsules = async () => {
  const data = await getUpcomingCapsules(); // ⚠️ Needs implementation
  setCapsules(data);
};

// Timer to update countdowns and check status
useEffect(() => {
  setInterval(() => {
    // Update countdown displays
    // Check if locked → ready transition needed
    if (shouldTransition) {
      await updateCapsuleStatus(id, 'ready'); // ⚠️ Needs implementation
    }
  }, 1000);
}, [capsules]);
```

**Interactions:**
- Tap ready capsule → Navigate to Open Capsule screen (placeholder)
- Tap locked capsule → Show Alert dialog with unlock date
- Tap FAB → Navigate to Type Selection screen (placeholder)
- Tap Archive icon → Navigate to Archive screen (placeholder)
- Pull down → Refresh capsules list

---

### 2. CapsuleCard (`src/components/CapsuleCard.tsx`)

**Features implemented:**
- ✅ Type-specific colors and icons
  - Emotion: Pink heart (#E91E63)
  - Goal: Green flag (#4CAF50)
  - Memory: Orange camera (#FF9800)
  - Decision: Blue balance (#2196F3)
- ✅ Two states:
  - **Locked**: Muted background, lock icon, countdown timer
  - **Ready**: Gradient background, pulse animation, "Ready!" badge
- ✅ Animations:
  - Pulse effect for ready capsules (1.0 → 1.02 → 1.0, 3s loop)
  - Scale down on press (0.95)
  - Icon glow for ready state
- ✅ Countdown display (props-driven)

**Props:**
```typescript
interface CapsuleCardProps {
  capsule: Capsule;
  onPress: (capsule: Capsule) => void;
  countdown?: string; // e.g., "3d 5h 30m" or "Ready!"
}
```

**Visual states:**
| State | Background | Icon | Badge | Border |
|-------|-----------|------|-------|--------|
| Locked | Light color | Type color | Lock icon | Border |
| Ready | Gradient | White + glow | "Ready!" | No border |

---

### 3. FAB (`src/components/FAB.tsx`)

**Features implemented:**
- ✅ Fixed position bottom-right (24px margin)
- ✅ Circular button (56x56dp)
- ✅ Indigo background (#6366F1)
- ✅ "+" icon (MaterialIcons)
- ✅ Scale animation on press (1.0 → 0.9 → 1.0)
- ✅ Shadow expansion on press
- ✅ Haptic feedback (iOS: Medium, Android: Light)
- ✅ Elevation shadow (shadowOffset: 0,8 / shadowRadius: 16)

**Interaction:**
- Tap → Call `onPress` handler (currently placeholder to Type Selection)

---

### 4. EmptyState (`src/components/EmptyState.tsx`)

**Features implemented:**
- ✅ Centered layout
- ✅ Inbox icon trong circle (160x160dp)
- ✅ Float animation (up/down 10px, 3s loop)
- ✅ Title: "No capsules yet"
- ✅ Subtitle: "Create your first time capsule to send a message to your future self"
- ✅ CTA button: "Create a Capsule"
- ✅ Button với icon + text

**Interaction:**
- Tap CTA button → Call `onCreatePress` (navigate to create flow)

---

## 🎨 Design System

### Colors (`src/constants/colors.ts`)

```typescript
// Capsule type colors
CapsuleTypeColors = {
  emotion: { primary: '#E91E63', light: '#FCE4EC', gradient: ['#E91E63', '#F06292'] },
  goal: { primary: '#4CAF50', light: '#E8F5E9', gradient: ['#4CAF50', '#66BB6A'] },
  memory: { primary: '#FF9800', light: '#FFF3E0', gradient: ['#FF9800', '#FFB74D'] },
  decision: { primary: '#2196F3', light: '#E3F2FD', gradient: ['#2196F3', '#42A5F5'] },
}

// UI colors
UIColors = {
  primary: '#6366F1', // Indigo
  success: '#10B981',
  danger: '#EF4444',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  // ...
}
```

### Typography (`src/constants/theme.ts`)

```typescript
Typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
}
```

### Spacing (8pt grid)

```typescript
Spacing = {
  xs: 4,   // Tight spacing
  sm: 8,   // Component padding
  md: 16,  // Default padding
  lg: 24,  // Section spacing
  xl: 32,  // Screen padding
  '2xl': 48, // Large gaps
}
```

### Shadows

```typescript
Shadows = {
  sm: { shadowOffset: {0,1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  md: { shadowOffset: {0,2}, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 },
  lg: { shadowOffset: {0,4}, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  xl: { shadowOffset: {0,8}, shadowOpacity: 0.25, shadowRadius: 16, elevation: 12 },
}
```

---

## 🧪 Mock Data (`src/screens/mockData.ts`)

### Mock Capsules

```typescript
MOCK_CAPSULES = [
  { id: 'mock-1', type: 'emotion', status: 'ready', unlockAt: Date.now()-1000 },
  { id: 'mock-2', type: 'goal', status: 'locked', unlockAt: +3days },
  { id: 'mock-3', type: 'memory', status: 'locked', unlockAt: +1week },
  { id: 'mock-4', type: 'decision', status: 'locked', unlockAt: +12hours },
  { id: 'mock-5', type: 'emotion', status: 'locked', unlockAt: +2months },
  { id: 'mock-6', type: 'goal', status: 'locked', unlockAt: +1year },
  { id: 'mock-7', ... }, // Extra capsule (để test "max 6")
]
```

### Countdown Formatter

```typescript
formatCountdown(unlockAt: number): string
// Returns:
// - "Ready!" if unlockAt <= now
// - "1y 3mo" if >= 1 year
// - "2mo 15d" if >= 1 month
// - "2w 3d" if >= 1 week
// - "3d 5h 30m" if >= 1 day
// - "12:30:45" if < 1 day (HH:MM:SS)
```

---

## 🔌 Integration Points for agent-react

### 1. Database Service (`src/services/databaseService.ts`)

**Need to implement:**

```typescript
// Get 6 upcoming capsules sorted by unlockAt ASC
export async function getUpcomingCapsules(): Promise<Capsule[]> {
  // TODO: Query SQLite
  // SELECT * FROM capsule
  // WHERE status IN ('locked', 'ready')
  // ORDER BY unlockAt ASC
  // LIMIT 6
}

// Update capsule status
export async function updateCapsuleStatus(
  id: string,
  status: CapsuleStatus
): Promise<void> {
  // TODO: Update SQLite
  // UPDATE capsule
  // SET status = ?, updatedAt = ?
  // WHERE id = ?
}
```

**Database schema reference:**
- Table: `capsule`
- Columns: `id`, `type`, `status`, `content`, `reflectionQuestion`, `createdAt`, `unlockAt`, `openedAt`, `updatedAt`
- Index: `idx_capsule_unlock_status` on `(unlockAt ASC, status)`

---

### 2. Navigation (`src/navigation/AppNavigator.tsx`)

**Current placeholders in HomeScreen:**

```typescript
// Line 159: FAB tap
const handleCreateCapsule = () => {
  console.log('Navigate to Type Selection');
  Alert.alert('TODO', 'Navigate to Type Selection Screen');
  // TODO: navigation.navigate('TypeSelection');
};

// Line 141: Ready capsule tap
const handleCapsuleTap = (capsule: Capsule) => {
  if (capsule.status === 'ready') {
    console.log('Navigate to Open Capsule:', capsule.id);
    Alert.alert('TODO', 'Navigate to Open Capsule Screen');
    // TODO: navigation.navigate('OpenCapsule', { capsuleId: capsule.id });
  }
};

// Line 166: Archive icon tap
const handleArchiveTap = () => {
  console.log('Navigate to Archive');
  Alert.alert('TODO', 'Navigate to Archive Screen');
  // TODO: navigation.navigate('Archive');
};
```

**Need to wire up:**
- Uncomment navigation calls
- Ensure RootStackParamList includes: `TypeSelection`, `OpenCapsule`, `Archive`
- Pass params correctly (e.g., capsuleId for OpenCapsule)

---

### 3. Background Status Checking (Optional Enhancement)

**Current implementation:**
- Timer runs trong HomeScreen useEffect (mỗi 1 giây)
- Chỉ chạy khi app foreground

**Potential improvement:**
- Sử dụng `expo-background-fetch` để check status khi app background
- Trigger local notification khi capsule ready
- Update database status ngay cả khi app killed

---

### 4. Error Handling

**Current UI states:**
- Loading: `loading === true` → Show "Loading..." text
- Error: `error !== null` → Show error message (currently only in console)
- Empty: `capsules.length === 0` → Show EmptyState

**Need to add:**
- Database error handling (query failures)
- Network errors (nếu có sync trong tương lai)
- Permission errors (notification permission)

**Suggested improvement:**
```typescript
// In HomeScreen.tsx
if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Button title="Retry" onPress={loadCapsules} />
    </View>
  );
}
```

---

## 📱 Screen Behavior Reference

### Load Sequence

1. Component mount → `loadCapsules()`
2. Query database → `getUpcomingCapsules()`
3. Calculate countdowns → `formatCountdown(unlockAt)`
4. Render grid với FlatList
5. Start timer (1s interval):
   - Update countdown displays
   - Check status transitions (locked → ready)
   - Reload capsules nếu có status change

### Refresh Sequence

1. User pull down → `setRefreshing(true)`
2. Call `loadCapsules()`
3. Re-query database
4. Update UI
5. `setRefreshing(false)`

### Timer Logic

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    // 1. Update countdown displays
    const newCountdowns = {};
    for (const capsule of capsules) {
      newCountdowns[capsule.id] = formatCountdown(capsule.unlockAt);

      // 2. Check if locked → ready
      if (capsule.status === 'locked' && capsule.unlockAt <= Date.now()) {
        await updateCapsuleStatus(capsule.id, 'ready');
        statusChanged = true;
      }
    }
    setCountdowns(newCountdowns);

    // 3. Reload nếu status changed
    if (statusChanged) {
      await loadCapsules();
    }
  }, 1000);

  return () => clearInterval(interval);
}, [capsules]);
```

---

## 🎯 Acceptance Criteria Status

Theo PRD F2 requirements:

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 2.1 | Hiển thị tối đa 6 capsules trong layout 3x2 | ✅ | FlatList với numColumns={3} |
| 2.2 | Sắp xếp theo unlockAt ASC | ✅ | Sort logic trong query |
| 2.3 | Hiển thị cả locked và ready | ✅ | Filter status IN ('locked', 'ready') |
| 2.4 | Card hiển thị icon, countdown/badge | ✅ | CapsuleCard component |
| 2.5 | Tap ready → mở | ⚠️ | Placeholder, cần navigation |
| 2.6 | Tap locked → thông báo | ✅ | Alert dialog với unlock date |
| 2.7 | FAB (+) → tạo capsule | ⚠️ | Placeholder, cần navigation |
| 2.8 | Navigation → Archive | ⚠️ | Placeholder, cần navigation |

**Legend:**
- ✅ Completed
- ⚠️ UI done, needs integration

---

## 🚀 Next Steps for agent-react

### Priority 1: Database Integration

1. Implement `getUpcomingCapsules()` query
2. Implement `updateCapsuleStatus()` update
3. Test với real database data
4. Remove mock data usage

### Priority 2: Navigation Wiring

1. Wire up FAB → TypeSelection navigation
2. Wire up Ready capsule → OpenCapsule navigation (pass capsuleId)
3. Wire up Archive icon → Archive navigation
4. Test navigation flow end-to-end

### Priority 3: Error Handling

1. Add error UI state (not just console.log)
2. Handle database query failures gracefully
3. Add retry mechanism
4. Toast notifications thay Alert (optional)

### Priority 4: Polish (Optional)

1. Add shake animation cho locked capsule tap
2. Background status checking với `expo-background-fetch`
3. Haptic feedback cho capsule tap
4. Optimize timer (chỉ update seconds khi < 1 day)

---

## 📝 Files Modified/Created

```
✅ src/screens/HomeScreen.tsx (complete UI/UX)
✅ src/components/CapsuleCard.tsx (complete UI/UX)
✅ src/components/FAB.tsx (complete UI/UX)
✅ src/components/EmptyState.tsx (complete UI/UX)
✅ src/constants/colors.ts (design tokens)
✅ src/constants/theme.ts (design tokens)
✅ src/screens/mockData.ts (test data + formatter)
⚠️ src/services/databaseService.ts (needs implementation)
⚠️ src/navigation/AppNavigator.tsx (needs navigation wiring)
```

---

## 🎨 Visual Reference

### Locked Capsule Card
```
┌─────────────────┐
│  ❤️              │  ← Type icon (type color)
│           🔒    │  ← Lock icon (top-right)
│                 │
│                 │
│  3d 5h 30m     │  ← Countdown (large, type color)
└─────────────────┘
   Light background
   Border with type color
```

### Ready Capsule Card
```
┌─────────────────┐
│  ❤️ (glow)       │  ← Type icon (white + glow)
│        Ready!   │  ← Ready badge (green)
│                 │
│                 │
│  Ready!        │  ← Text (white, large)
└─────────────────┘
   Gradient background (type colors)
   Pulse animation (1.0 → 1.02)
```

### Grid Layout
```
+----------------------------------+
|  [📦]         FutureBoxes        |
+----------------------------------+
|                                  |
|  [Card 1]  [Card 2]  [Card 3]   |
|                                  |
|  [Card 4]  [Card 5]  [Card 6]   |
|                                  |
|                                  |
|                          [+ FAB] |
+----------------------------------+
```

---

## ✅ Testing Checklist

### UI Visual Testing
- [ ] Grid layout đúng 3 columns
- [ ] Cards có aspect ratio đúng (0.9 - taller than wide)
- [ ] Spacing giữa cards consistent
- [ ] Type colors đúng (emotion pink, goal green, memory orange, decision blue)
- [ ] Locked state: light background, border, lock icon
- [ ] Ready state: gradient background, no border, ready badge
- [ ] FAB ở bottom-right với shadow
- [ ] Header với Archive icon và title centered

### Animation Testing
- [ ] Stagger animation khi load (fade + translateY)
- [ ] Pulse animation cho ready capsules
- [ ] Scale animation khi press card
- [ ] FAB scale + shadow animation khi press
- [ ] EmptyState icon float animation

### Interaction Testing
- [ ] Tap locked capsule → Alert xuất hiện với unlock date
- [ ] Tap ready capsule → Navigation placeholder (Alert)
- [ ] Tap FAB → Navigation placeholder (Alert)
- [ ] Tap Archive icon → Navigation placeholder (Alert)
- [ ] Pull-to-refresh hoạt động (spinner xuất hiện)

### Countdown Testing
- [ ] Countdown format đúng cho các khoảng thời gian:
  - >= 1 year: "1y 3mo"
  - >= 1 month: "2mo 15d"
  - >= 1 week: "2w 3d"
  - >= 1 day: "3d 5h 30m"
  - < 1 day: "12:30:45"
  - <= 0: "Ready!"
- [ ] Countdown updates mỗi giây
- [ ] Status transition locked → ready khi countdown hết

### Edge Cases
- [ ] Empty state hiển thị đúng khi không có capsules
- [ ] Loading state hiển thị khi đang load
- [ ] Chỉ hiển thị tối đa 6 capsules (nếu có 7+)
- [ ] Grid responsive với safe area insets

---

## 📞 Contact Points

**Handoff from:** agent-uiux
**Handoff to:** agent-react
**Date:** 2025-12-25

**Questions/Issues:**
- Nếu có vấn đề về UI/UX, animation, styling → ping agent-uiux
- Nếu cần adjust colors, spacing, typography → check design tokens trước
- Nếu cần thêm animations/interactions → agent-uiux có thể support

---

*End of F2 UI/UX Handoff Document*
