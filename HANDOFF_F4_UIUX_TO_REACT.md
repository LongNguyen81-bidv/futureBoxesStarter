# Handoff Document: F4 Create Capsule UI/UX → Business Logic

**From:** agent-uiux
**To:** agent-react
**Date:** 2025-12-25
**Feature:** F4: Create Capsule

---

## Summary

Tôi đã hoàn thành thiết kế và implement UI/UX layer cho F4: Create Capsule. Đây là feature core nhất của app với form phức tạp bao gồm:

- ✅ Text content input với character counter (max 2000)
- ✅ Image picker (max 3 images từ gallery)
- ✅ Reflection question input (conditional theo type)
- ✅ Date/time selector với presets (1 week, 1 month, 1 year, custom)
- ✅ Form validation UI với error messages
- ✅ Type-specific customization (placeholders, colors, reflection visibility)
- ✅ Keyboard handling và animations
- ✅ Back navigation với confirmation dialog

---

## Files Created/Modified

### New Components

1. **`src/components/CharacterCounter.tsx`**
   - Hiển thị character count với color feedback
   - Warning color khi gần đạt max (95%)
   - Danger color khi vượt max

2. **`src/components/ImageThumbnail.tsx`**
   - Hiển thị image thumbnail với delete button
   - Fade in/out animations
   - Delete confirmation với haptic feedback

3. **`src/components/ImagePickerSection.tsx`**
   - Image picker với expo-image-picker
   - Request permissions
   - Max 3 images validation
   - Horizontal scroll cho thumbnails
   - Add button (hidden khi max reached)

4. **`src/components/DateSelector.tsx`**
   - Preset buttons (1 week, 1 month, 1 year)
   - Custom date/time picker (native)
   - Future date validation
   - Selected date display với format
   - iOS/Android platform-specific handling

### Modified Screen

5. **`src/screens/CreateCapsuleScreen.tsx`**
   - Full implementation thay cho placeholder
   - Form state management (content, images, reflection, unlockDate)
   - Type-specific configuration object (`TYPE_CONFIG`)
   - Form validation logic (`isFormValid()`)
   - Back navigation với discard confirmation
   - Preview button với animated states
   - KeyboardAvoidingView cho smooth UX

---

## UI/UX Features Implemented

### 1. Type-Specific Customization

```typescript
const TYPE_CONFIG = {
  emotion: {
    contentPlaceholder: 'What are you feeling right now? Express your emotions...',
    reflectionPlaceholder: 'e.g., Did this feeling pass?',
    hasReflection: true,
  },
  goal: {
    contentPlaceholder: 'What goal do you want to achieve? Describe it in detail...',
    reflectionPlaceholder: 'e.g., Did you achieve this goal?',
    hasReflection: true,
  },
  memory: {
    contentPlaceholder: 'Describe this special moment you want to remember...',
    hasReflection: false, // Memory type không có reflection
  },
  decision: {
    contentPlaceholder: 'What important decision did you make? Why?',
    reflectionPlaceholder: 'e.g., How do you feel about this decision now?',
    hasReflection: true,
  },
};
```

### 2. Form Validation

```typescript
const isFormValid = () => {
  const hasContent = content.trim().length > 0 && content.length <= MAX_CONTENT_LENGTH;
  const hasReflection = !typeConfig.hasReflection || reflectionQuestion.trim().length > 0;
  const hasDate = unlockDate !== null;

  return hasContent && hasReflection && hasDate;
};
```

Validation errors hiển thị specific messages:
- "Content required" - nếu content trống
- "Content too long" - nếu vượt 2000 chars
- "Reflection required" - nếu thiếu reflection (Emotion/Goal/Decision)
- "Date required" - nếu chưa chọn unlock date

### 3. Animations & Interactions

- **Preview Button**: Scale animation khi press, opacity fade khi valid/invalid
- **Image Thumbnails**: Fade in khi add, fade out + slide khi remove
- **Type Badge**: Type color background với icon
- **Keyboard Handling**: KeyboardAvoidingView với platform-specific offsets
- **Haptic Feedback**: Light impact khi select images, Medium khi tap Preview

### 4. User Feedback

- **Character Counter**: Color changes (gray → yellow → red)
- **Discard Confirmation**: Alert dialog khi back với data
- **Image Max Alert**: Warning khi đã đạt max 3 images
- **Permission Request**: Alert khi gallery permission denied
- **Date Validation**: Alert khi chọn past date

---

## Form State Structure

```typescript
// Current state (local)
const [content, setContent] = useState('');
const [images, setImages] = useState<string[]>([]);
const [reflectionQuestion, setReflectionQuestion] = useState('');
const [unlockDate, setUnlockDate] = useState<Date | null>(null);
```

---

## TODO for agent-react

### 1. Navigation Integration

**Current:** Preview button shows Alert with mock data

**Needed:**
- Create `PreviewCapsuleScreen` (F5 feature)
- Navigate với form data:

```typescript
navigation.navigate('PreviewCapsule', {
  type: type,
  content: content,
  images: images,
  reflectionQuestion: reflectionQuestion,
  unlockAt: unlockDate,
});
```

### 2. Business Logic to Implement

#### A. Image Storage
- Save images to file system (expo-file-system)
- Generate unique filenames
- Get file URIs để store trong DB

#### B. Form Data Validation
- Server-side validation (nếu có API)
- Additional business rules:
  - Content sanitization
  - Date range limits (e.g., max 10 years future?)
  - Image file size validation
  - Image format validation

#### C. Database Integration
- Create `capsules` table record khi lock (sau Preview)
- Store: type, content, imageUris[], reflectionQuestion, unlockAt, status='locked', createdAt
- Handle transaction: save images → insert DB → schedule notification

#### D. Error Handling
- Image picker failures
- File system errors
- Database insert failures
- Network issues (nếu có cloud backup)
- Rollback mechanism nếu save fails

#### E. Edge Cases
- App crash mid-creation (draft persistence?)
- Image deletion after selection nhưng trước save
- Date picker timezone handling
- Memory pressure khi nhiều images
- Concurrent capsule creation

### 3. Preview Screen (F5 Integration)

Tạo `PreviewCapsuleScreen.tsx` với:
- Read-only display của all form data
- Image gallery preview
- "Lock Capsule" button với confirmation
- Back to edit navigation
- Lock animation khi confirm

### 4. Notification Scheduling

Khi lock capsule:
```typescript
import * as Notifications from 'expo-notifications';

await Notifications.scheduleNotificationAsync({
  content: {
    title: `Your ${type} capsule is ready to open!`,
    body: 'Tap to unlock your message from the past.',
  },
  trigger: {
    date: unlockDate,
  },
});
```

### 5. Type Definitions

Tạo shared type cho form data:

```typescript
// src/types/capsule.ts
export interface CapsuleFormData {
  type: 'emotion' | 'goal' | 'memory' | 'decision';
  content: string;
  images: string[]; // Local URIs
  reflectionQuestion: string | null;
  unlockAt: Date;
}

export interface CapsuleRecord extends CapsuleFormData {
  id: string;
  status: 'locked' | 'ready' | 'opened';
  createdAt: Date;
  openedAt?: Date;
  reflectionAnswer?: string | null;
}
```

---

## Testing Checklist for agent-react

### Happy Path
- [ ] Create Emotion capsule với text + 3 images + reflection + 1 month preset
- [ ] Create Goal capsule với text only + custom date
- [ ] Create Memory capsule (no reflection) với 1 image + 1 week
- [ ] Create Decision capsule với text + reflection + 1 year
- [ ] Navigate to Preview và back to edit
- [ ] Lock capsule successfully

### Validation Tests
- [ ] Try submit với empty content → Show error
- [ ] Try submit với 2001 chars → Show error (should be prevented by maxLength)
- [ ] Try submit Emotion/Goal/Decision với empty reflection → Show error
- [ ] Try submit với no date → Show error
- [ ] Select past date → Show error

### Edge Cases
- [ ] Back navigation với empty form → Direct back
- [ ] Back navigation với partial data → Show confirmation
- [ ] Tap back on discard confirmation → Stay on screen
- [ ] Add 4th image → Show max alert
- [ ] Remove image after adding 3 → Add button appears again
- [ ] Long content text → Scroll works, counter shows warning
- [ ] Keyboard appears → Form scrolls, inputs visible
- [ ] Change type after selecting reflection → N/A (type fixed from TypeSelection)

### Platform Tests
- [ ] iOS: Date picker spinner modal
- [ ] Android: Date picker native dialog
- [ ] iOS: Keyboard avoidance works
- [ ] Android: Keyboard avoidance works

---

## Known Limitations / Nice-to-Haves

### Current Implementation
- Image picker: Gallery only (no camera)
- No draft auto-save (data lost on app crash)
- No image compression (using quality: 0.8)
- No image editing (crop handled by picker's allowsEditing)
- No preview modal before lock (goes to separate screen)

### Future Enhancements
- Camera support (F2 feature?)
- Draft persistence to AsyncStorage
- Image compression with expo-image-manipulator
- Rich text editor cho content
- Voice recording option
- Video clips support

---

## Design System Usage

All components sử dụng:
- `UIColors` từ `src/constants/colors.ts`
- `CapsuleTypeColors` cho type-specific colors
- `Typography` scale từ `src/constants/theme.ts`
- `Spacing` system (8pt grid)
- `BorderRadius` values
- `Shadows` cho depth
- `TouchTarget` sizes cho accessibility

---

## Questions for agent-react

1. **Preview vs Direct Lock**: Có cần Preview screen riêng hay combine lock confirmation vào CreateCapsuleScreen?
2. **Draft Persistence**: Có implement auto-save draft không? (Requirement không mention)
3. **Image Storage Strategy**: Local file system hay cần optimize với caching?
4. **Validation Rules**: Có business rules bổ sung ngoài UI validation?
5. **Error Retry**: Có cần retry mechanism cho failed operations?

---

## UI/UX Notes

### Accessibility
- All touch targets >= 44dp (iOS HIG)
- Color contrast ratios meet WCAG AA
- Placeholder text có semantic meaning
- Error messages descriptive và actionable

### Performance
- Images lazy load trong thumbnails
- Form validation debounced
- Animations use Reanimated worklet thread
- ScrollView với keyboardShouldPersistTaps="handled"

### UX Patterns
- Progressive disclosure (chỉ show reflection khi needed)
- Visual hierarchy clear (type badge → content → images → reflection → date → preview)
- Immediate feedback (character counter, button states)
- Forgiving (easy to remove images, change date)
- Confirmation for destructive actions (discard)

---

## Contact

Nếu có vấn đề với UI/UX layer hoặc cần adjustment:
- Báo qua AGENT_COMMUNICATION.log
- Tag @agent-uiux để tôi fix

Chúc may mắn với business logic implementation! 🚀
