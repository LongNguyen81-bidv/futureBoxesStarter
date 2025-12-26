# UI/UX Handoff Document - F11: Archive/History

**Feature:** Archive/History
**Agent:** agent-uiux
**Handoff to:** agent-react
**Date:** 2025-12-26

---

## Overview

UI/UX implementation cho **F11: Archive/History** đã hoàn thành. Tính năng này cho phép người dùng xem lại tất cả capsules đã mở, hiển thị trong một danh sách scrollable với các thông tin chi tiết.

---

## Components Created

### 1. **ReflectionAnswerBadge.tsx**
**Location:** `src/components/ReflectionAnswerBadge.tsx`

**Purpose:** Hiển thị câu trả lời reflection (Yes/No hoặc Rating 1-5) với visual indicators.

**Props:**
```typescript
interface ReflectionAnswerBadgeProps {
  answer: string | null;
  type?: 'emotion' | 'goal' | 'memory' | 'decision';
}
```

**Features:**
- ✅ Yes answer: Green checkmark icon + "Yes" text
- ❌ No answer: Red X icon + "No" text
- ⭐ Rating 1-5: Star visualization với color coding
  - Rating 4-5: Green (success)
  - Rating 3: Orange (warning)
  - Rating 1-2: Red (danger)
- Null handling: Returns null nếu không có answer

**Color Scheme:**
- Yes: `UIColors.success` (#10B981) với `successLight` background
- No: `UIColors.danger` (#EF4444) với `dangerLight` background
- Rating: Dynamic color based on rating value

---

### 2. **ArchiveItemCard.tsx**
**Location:** `src/components/ArchiveItemCard.tsx`

**Purpose:** Card component để hiển thị một capsule item trong Archive list.

**Props:**
```typescript
interface ArchiveItemCardProps {
  item: ArchiveItem;
  onPress: () => void;
}

export interface ArchiveItem {
  id: string;
  type: 'emotion' | 'goal' | 'memory' | 'decision';
  content: string;
  createdAt: string; // ISO date string
  openedAt: string;  // ISO date string
  reflectionAnswer: string | null;
  imageCount?: number;
  imagePreviews?: string[]; // First 3 image URIs
}
```

**Layout Structure:**
```
┌─────────────────────────────────┐
│ [Icon] Type Name                │
│ Created: Dec 01, 2024           │ ← Header
├─────────────────────────────────┤
│ Content preview text...         │ ← Content (max 150 chars)
│ [img] [img] [img]               │ ← Image previews (if any)
├─────────────────────────────────┤
│ 📅 Opened: Jan 01, 2025 (31d)  │ ← Footer
├─────────────────────────────────┤
│ Reflection: ✓ Yes              │ ← Reflection badge
└─────────────────────────────────┘
```

**Visual Features:**
- **Type-specific left border:** 4px colored border matching capsule type
- **Type icon circle:** 32x32 circle với type color background
- **Date formatting:** "MMM dd, yyyy" format (e.g., "Dec 01, 2024")
- **Time locked calculation:**
  - Shows duration từ createdAt đến openedAt
  - Format: "After Xy Xmo" hoặc "After Xmo Xd" hoặc "After Xw Xd" hoặc "After X days"
- **Content truncation:** Max 150 characters với "..." suffix
- **Image thumbnails:** 60x60 thumbnails, max 3 hiển thị, "+X" indicator nếu có nhiều hơn
- **Press interaction:** Opacity 0.7 khi pressed

**Dependencies:**
- `date-fns` for date formatting
- `ReflectionAnswerBadge` component
- Type icons từ `MaterialIcons`

---

### 3. **EmptyArchiveState.tsx**
**Location:** `src/components/EmptyArchiveState.tsx`

**Purpose:** Empty state component hiển thị khi chưa có opened capsules.

**Props:**
```typescript
interface EmptyArchiveStateProps {
  onGoHome?: () => void; // Optional callback to navigate home
}
```

**Features:**
- **Floating animation:** Icon float up/down 10px trong 3 giây (loop)
- **Icon:** `inventory-2` (empty box) trong dashed border circle
- **Message:**
  - Title: "No opened capsules yet"
  - Subtitle: "When you open a time capsule, it will appear here."
- **Optional CTA:** "Go to Home" button (nếu onGoHome provided)

**Animation:**
- Float animation: -10px → 0px → -10px (loop)
- Duration: 3000ms each direction
- Easing: `Easing.inOut(Easing.ease)`
- Uses native driver for performance

---

### 4. **ArchiveScreen.tsx** (Updated)
**Location:** `src/screens/ArchiveScreen.tsx`

**Purpose:** Main Archive screen với FlatList của opened capsules.

**Current Implementation:**
- ✅ Header với back button và title "Archive"
- ✅ FlatList với mock data
- ✅ Pull-to-refresh control
- ✅ Empty state integration
- ✅ Item press navigation to OpenCapsuleScreen
- ✅ Type-specific styling

**Mock Data:**
```typescript
const MOCK_ARCHIVE_ITEMS: ArchiveItem[] = [
  // 4 sample items covering all capsule types
  // Emotion, Goal, Memory (with images), Decision (with rating)
];
```

**State Management:**
```typescript
const [capsules, setCapsules] = useState<ArchiveItem[]>(MOCK_ARCHIVE_ITEMS);
const [refreshing, setRefreshing] = useState(false);
```

---

## TODO for agent-react (Business Logic)

### 1. Database Integration

**Replace mock data với database queries:**

```typescript
// In ArchiveScreen.tsx - onRefresh function
const onRefresh = useCallback(async () => {
  setRefreshing(true);

  try {
    // Query opened capsules from database
    const openedCapsules = await database.getAllAsync<CapsuleRow>(
      `SELECT
        c.id,
        c.type,
        c.content,
        c.createdAt,
        c.openedAt,
        c.reflectionAnswer,
        (SELECT COUNT(*) FROM capsule_image ci WHERE ci.capsuleId = c.id) as imageCount
      FROM capsule c
      WHERE c.status = 'opened'
      ORDER BY c.openedAt DESC`
    );

    // Load image previews for capsules
    const capsulesWithImages = await Promise.all(
      openedCapsules.map(async (capsule) => {
        const images = await database.getAllAsync<CapsuleImageRow>(
          `SELECT filePath FROM capsule_image
           WHERE capsuleId = ?
           ORDER BY orderIndex
           LIMIT 3`,
          [capsule.id]
        );

        return {
          ...capsule,
          imagePreviews: images.map(img => img.filePath),
        };
      })
    );

    setCapsules(capsulesWithImages);
  } catch (error) {
    console.error('Error loading archive:', error);
    // Show error toast/alert
  } finally {
    setRefreshing(false);
  }
}, []);
```

**Initial load on mount:**
```typescript
useEffect(() => {
  onRefresh();
}, []);
```

### 2. Navigation to Detail View

**Current implementation sử dụng OpenCapsuleScreen:**
```typescript
const handleCapsulePress = useCallback(
  (capsuleId: string) => {
    navigation.navigate('OpenCapsule', { capsuleId });
  },
  [navigation]
);
```

**Agent-react cần:**
- ✅ Đã có: OpenCapsuleScreen accept `capsuleId` param
- 🔧 Update: OpenCapsuleScreen cần hiển thị đúng cho Archive context
  - Skip opening animation (đã opened rồi)
  - Show full content + images
  - Show reflection answer (read-only)
  - Show metadata (created, opened, time locked)

**Hoặc tạo ArchiveDetailScreen riêng nếu cần:**
- Same layout như OpenCapsuleScreen
- Read-only mode
- No reflection flow (đã answered)
- Add Delete button (F12)

### 3. Pull-to-Refresh Logic

**Current:** Mock simulation với timeout 1000ms

**Agent-react cần:**
- Query database lại
- Update state với fresh data
- Handle errors gracefully
- Show loading indicator

### 4. Error Handling

**Scenarios cần handle:**
- Database query failed
- No capsules found (handled bởi EmptyState)
- Image load failed (handled by Image component)
- Navigation errors

**Suggestions:**
```typescript
try {
  // Query logic
} catch (error) {
  console.error('Archive error:', error);
  Alert.alert('Error', 'Failed to load archive. Please try again.');
  // Or use toast notification
}
```

### 5. Performance Optimization

**FlatList đã có các optimizations:**
- `keyExtractor` for unique keys
- `useCallback` cho render functions
- Virtualization (built-in FlatList)

**Agent-react có thể add:**
- Pagination nếu có nhiều capsules (load 20 at a time)
- Image lazy loading (đã có bởi Image component)
- Memoization cho expensive calculations

### 6. Delete Action (F12)

**Not implemented yet - chờ F12 implementation**

**Khi implement F12:**
- Add swipe-to-delete gesture (React Native Gesture Handler)
- Add delete button trong ArchiveDetailScreen
- Show confirmation dialog
- Delete from database
- Remove from UI list
- Delete image files

---

## File Structure

```
src/
├── components/
│   ├── ArchiveItemCard.tsx          ✅ NEW
│   ├── ReflectionAnswerBadge.tsx    ✅ NEW
│   └── EmptyArchiveState.tsx        ✅ NEW
├── screens/
│   └── ArchiveScreen.tsx            🔧 UPDATED
```

---

## Design Tokens Used

### Colors
- Type colors: `CapsuleTypeColors.emotion/goal/memory/decision`
- UI colors: `UIColors.primary`, `success`, `danger`, `warning`
- Text: `textPrimary`, `textSecondary`, `textTertiary`
- Backgrounds: `background`, `surface`
- Borders: `border`

### Typography
- `Typography.h2` - Header title
- `Typography.h3` - Card type name
- `Typography.body` - Content preview
- `Typography.bodySmall` - Metadata, dates
- `Typography.button` - Button text

### Spacing
- `Spacing.xs` (4px) - Tight spacing
- `Spacing.sm` (8px) - Component padding
- `Spacing.md` (16px) - Default padding
- `Spacing.lg` (24px) - Section spacing
- `Spacing.xl` (32px) - Screen padding

### Border Radius
- `BorderRadius.sm` (4px) - Image thumbnails
- `BorderRadius.md` (8px) - Cards, buttons
- `BorderRadius.full` - Pill buttons

### Shadows
- `Shadows.sm` - Card elevation

---

## Type Definitions

**ArchiveItem interface:**
```typescript
export interface ArchiveItem {
  id: string;
  type: 'emotion' | 'goal' | 'memory' | 'decision';
  content: string;
  createdAt: string; // ISO 8601 date string
  openedAt: string;  // ISO 8601 date string
  reflectionAnswer: string | null; // 'yes', 'no', or '1'-'5'
  imageCount?: number;
  imagePreviews?: string[]; // File paths or URIs
}
```

---

## Navigation Flow

```
Home → Archive (tap Archive icon)
  ↓
ArchiveScreen (list view)
  ↓
OpenCapsuleScreen (tap item, pass capsuleId)
  ↓
Back to ArchiveScreen (back button)
```

**Alternative flow từ Celebration:**
```
Celebration → Archive (tap "View Archive")
  ↓
ArchiveScreen
```

---

## Testing Checklist for agent-react

- [ ] Load opened capsules từ database
- [ ] Sort by openedAt DESC
- [ ] Display correct data trong ArchiveItemCard
- [ ] Handle empty state (no opened capsules)
- [ ] Pull-to-refresh reloads data
- [ ] Tap item navigates to detail view
- [ ] Image previews load correctly
- [ ] Reflection answers display correctly (Yes/No/Rating)
- [ ] Date formatting correct
- [ ] Time locked calculation accurate
- [ ] Performance tốt với nhiều capsules (test với 50+ items)
- [ ] Error handling khi database fails
- [ ] Back navigation works
- [ ] Safe area handling on different devices

---

## Known Limitations / Future Enhancements

1. **Delete action (F12):** Chưa implement, chờ F12 feature
2. **Search/Filter:** Không có trong v1, có thể thêm sau
3. **Pagination:** Chưa cần, implement khi có nhiều capsules
4. **Swipe gestures:** Có thể thêm swipe-to-delete sau
5. **Image full-screen viewer:** Có thể reuse từ OpenCapsuleScreen

---

## Dependencies

**Required packages:**
- `date-fns` - Date formatting (đã có trong project)
- `@expo/vector-icons` - Icons
- `react-navigation` - Navigation

**No additional packages needed.**

---

## Screenshots / Visual Reference

Mock data tạo 4 capsules demo:
1. **Emotion capsule** - Yes answer, no images
2. **Goal capsule** - No answer, no images
3. **Memory capsule** - No reflection (Memory type), 3 images
4. **Decision capsule** - Rating 4/5, no images

User có thể thấy:
- Type-specific colors
- Different reflection answer types
- Image previews
- Time locked calculations
- Proper date formatting

---

## Additional Notes

- All components use TypeScript strict mode
- Components are fully typed
- Mock data sử dụng Picsum placeholder images
- Pull-to-refresh có smooth animation
- Empty state có floating animation
- All interactions có proper feedback (opacity, activeOpacity)

---

## Contact

**Questions/Issues:**
- UI/UX clarifications → contact agent-uiux
- Business logic questions → refer to PRD.md và activity diagrams
- Database schema questions → refer to design/database/schema.md

---

**Handoff completed. Ready for agent-react implementation.**

---

**Signature:**
Agent: agent-uiux
Date: 2025-12-26
Status: ✅ UI/UX Complete - Ready for Business Logic Integration
