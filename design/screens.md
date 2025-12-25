# Screen Descriptions
# FutureBoxes - Time Capsule App

**Version:** 1.0
**Last Updated:** 2025-12-25

---

## Table of Contents

1. [Onboarding Screens](#1-onboarding-screens)
2. [Home Screen](#2-home-screen)
3. [Capsule Type Selection Screen](#3-capsule-type-selection-screen)
4. [Create Capsule Screen](#4-create-capsule-screen)
5. [Preview Capsule Screen](#5-preview-capsule-screen)
6. [Lock Success Screen](#6-lock-success-screen)
7. [Capsule Detail Screen (Locked)](#7-capsule-detail-screen-locked)
8. [Open Capsule Screen](#8-open-capsule-screen)
9. [Reflection Response Screen](#9-reflection-response-screen)
10. [Celebration Screen](#10-celebration-screen)
11. [Archive List Screen](#11-archive-list-screen)
12. [Archive Detail Screen](#12-archive-detail-screen)
13. [Empty State Screens](#13-empty-state-screens)

---

## 1. Onboarding Screens

### Mục đích
Giới thiệu concept time capsule và các tính năng chính cho người dùng lần đầu sử dụng app.

### Các thành phần chính

#### Slide 1: Welcome

1. **Skip Button**
   - Mô tả: Text button "Skip" ở góc trên bên phải
   - Tương tác: Tap để bỏ qua onboarding, chuyển thẳng đến Home
   - Hiệu ứng: None

2. **Time Capsule Animation**
   - Mô tả: Lottie animation của hộp thời gian đang floating/rotating nhẹ nhàng
   - Tương tác: Không có tương tác, chỉ animation tự chạy loop
   - Hiệu ứng: Floating animation với ease-in-out, loop 2-3 giây

3. **Title Text**
   - Mô tả: "Welcome to FutureBoxes" - large, bold typography
   - Tương tác: None
   - Hiệu ứng: Fade in 300ms khi slide xuất hiện

4. **Subtitle Text**
   - Mô tả: "Send messages to your future self" - secondary text
   - Tương tác: None
   - Hiệu ứng: Fade in 400ms delay sau title

5. **Page Indicator**
   - Mô tả: 4 dots (o o o o), dot đầu tiên filled, 3 dot còn lại outline
   - Tương tác: None, chỉ indicator
   - Hiệu ứng: Smooth transition khi chuyển slides

6. **Next Button**
   - Mô tả: Primary button "Next →" ở bottom
   - Tương tác: Tap để chuyển sang Slide 2
   - Hiệu ứng: Slide transition sang phải 300ms

#### Slide 2: Create

1. **Skip Button** (same as Slide 1)

2. **Create Animation**
   - Mô tả: Animation người dùng viết text và thêm photos
   - Tương tác: None
   - Hiệu ứng: Writing animation, photos appearing

3. **Title Text**
   - Mô tả: "Capture the Moment"
   - Tương tác: None
   - Hiệu ứng: Fade in 300ms

4. **Subtitle Text**
   - Mô tả: "Write your thoughts, add photos, and set a question for reflection"
   - Tương tác: None
   - Hiệu ứng: Fade in 400ms

5. **Page Indicator** (dot thứ 2 filled)

6. **Back Button**
   - Mô tả: "← Back" button
   - Tương tác: Tap để quay lại Slide 1
   - Hiệu ứng: Slide transition sang trái

7. **Next Button** (same as Slide 1)

#### Slide 3: Wait

1. **Skip Button** (same as previous)

2. **Lock Animation**
   - Mô tả: Animation hộp đóng lại, khóa xuất hiện, countdown timer
   - Tương tác: None
   - Hiệu ứng: Box closing, lock appearing with click sound (haptic)

3. **Title Text**
   - Mô tả: "Lock It Away"
   - Tương tác: None
   - Hiệu ứng: Fade in 300ms

4. **Subtitle Text**
   - Mô tả: "Your capsule is sealed. No peeking until the unlock date!"
   - Tương tác: None
   - Hiệu ứng: Fade in 400ms

5. **Page Indicator** (dot thứ 3 filled)

6. **Back & Next Buttons** (same as Slide 2)

#### Slide 4: Reflect

1. **No Skip Button** (slide cuối)

2. **Open Animation**
   - Mô tả: Animation hộp mở ra, confetti/celebration effects
   - Tương tác: None
   - Hiệu ứng: Box opening, particles flying, glow effect

3. **Title Text**
   - Mô tả: "Open & Reflect"
   - Tương tác: None
   - Hiệu ứng: Fade in 300ms

4. **Subtitle Text**
   - Mô tả: "When time comes, open your capsule and see how much you've grown"
   - Tương tác: None
   - Hiệu ứng: Fade in 400ms

5. **Page Indicator** (dot thứ 4 filled)

6. **Back Button** (same as previous)

7. **Get Started Button**
   - Mô tả: Primary button "Get Started"
   - Tương tác: Tap để hoàn thành onboarding, chuyển đến Home
   - Hiệu ứng: Fade out toàn screen, fade in Home screen

### Navigation
- Đến screen này từ: App Launch (first time only)
- Từ screen này đến: Home Screen (skip hoặc get started)

### Ghi chú
- Swipe gestures: Swipe left để Next, swipe right để Back
- Onboarding chỉ hiển thị lần đầu launch app (check AsyncStorage key 'onboardingCompleted')
- Animation respect reduce motion setting
- All slides có safe area insets

---

## 2. Home Screen

### Mục đích
Màn hình chính hiển thị 6 capsules sắp mở gần nhất, cho phép tạo capsule mới và navigate đến Archive.

### Các thành phần chính

1. **Header**
   - Mô tả: Title "FutureBoxes" ở center, Archive icon (box/folder icon) ở left
   - Tương tác: Tap Archive icon để navigate đến Archive screen
   - Hiệu ứng: Archive icon có ripple effect khi tap

2. **Capsule Grid (3x2)**
   - Mô tả: Grid layout 3 columns x 2 rows hiển thị capsule cards
   - Tương tác: Tap vào từng card
   - Hiệu ứng: Card scale 0.95 khi press

3. **Capsule Card (Locked State)**
   - Mô tả:
     - Type icon (Heart/Target/Camera/Scale) ở top
     - Type color background với opacity thấp
     - Countdown text (e.g., "3d 5h 30m" hoặc "12:30:45")
     - Border với type color
   - Tương tác: Tap hiển thị toast "This capsule is still locked. Come back on [date]"
   - Hiệu ứng: Gentle shake animation khi tap locked capsule

4. **Capsule Card (Ready State)**
   - Mô tả:
     - Type icon với glow effect
     - Vibrant type color background
     - "Ready to open!" badge/text
     - Pulse animation subtle
   - Tương tác: Tap để navigate đến Open Capsule screen
   - Hiệu ứng: Card glow pulse (slow breath), scale to 1.02 on press

5. **Countdown Timer**
   - Mô tả: Dynamic text cập nhật mỗi phút (hoặc mỗi giây nếu < 1 ngày)
   - Tương tác: None
   - Hiệu ứng: Fade transition khi update số

6. **FAB (Floating Action Button)**
   - Mô tả: Circular button với icon "+" ở bottom-right, shadow elevation
   - Tương tác: Tap để navigate đến Type Selection screen
   - Hiệu ứng: Scale 1.1 on press, shadow expand

7. **Empty State** (khi không có capsules)
   - Mô tả: Illustration hộp trống, text "Create your first capsule"
   - Tương tác: Tap CTA button để create
   - Hiệu ứng: Illustration subtle float animation

### Navigation
- Đến screen này từ: App Launch, Onboarding complete, Lock success, Celebration, Archive back
- Từ screen này đến:
  - Type Selection (FAB tap)
  - Open Capsule (ready capsule tap)
  - Archive (header icon tap)

### Ghi chú
- Capsules sắp xếp theo unlockAt ASC (sớm nhất trước)
- Chỉ hiển thị status 'locked' và 'ready'
- Pull to refresh để check status updates
- Background task check status mỗi khi app vào foreground
- Countdown format:
  - >= 1 year: "Xy Xmo"
  - >= 1 month: "Xmo Xd"
  - >= 1 week: "Xw Xd"
  - >= 1 day: "Xd Xh Xm"
  - < 1 day: "HH:MM:SS"

---

## 3. Capsule Type Selection Screen

### Mục đích
Cho phép người dùng chọn 1 trong 4 loại capsule trước khi tạo nội dung.

### Các thành phần chính

1. **Header**
   - Mô tả: Back button "←" ở left, title "Select Type" ở center
   - Tương tác: Tap back để quay về Home
   - Hiệu ứng: None

2. **Instruction Text**
   - Mô tả: "Choose what kind of time capsule you want to create"
   - Tương tác: None
   - Hiệu ứng: None

3. **Emotion Type Card**
   - Mô tả:
     - Heart icon (pink/purple color)
     - Title "Emotion"
     - Description "Capture how you feel right now"
     - Border và background tùy state
   - Tương tác: Tap để select
   - Hiệu ứng:
     - Unselected: Muted border, light background
     - Selected: Thick colored border, accent background, checkmark icon top-right, scale 1.02
     - Press: Scale 0.98, haptic feedback

4. **Goal Type Card**
   - Mô tả:
     - Target/Flag icon (green/blue color)
     - Title "Goal"
     - Description "Set a goal and check back later"
   - Tương tác: Same as Emotion
   - Hiệu ứng: Same as Emotion với green/blue theme

5. **Memory Type Card**
   - Mô tả:
     - Camera/Photo icon (orange/yellow color)
     - Title "Memory"
     - Description "Preserve a special moment"
   - Tương tác: Same as Emotion
   - Hiệu ứng: Same as Emotion với orange/yellow theme

6. **Decision Type Card**
   - Mô tả:
     - Scale/Crossroads icon (blue/gray color)
     - Title "Decision"
     - Description "Record an important decision"
   - Tương tác: Same as Emotion
   - Hiệu ứng: Same as Emotion với blue/gray theme

7. **Continue Button**
   - Mô tả: Primary button "Continue", full-width ở bottom
   - Tương tác: Tap để navigate đến Create Capsule screen (pass type param)
   - Hiệu ứng:
     - Disabled state (no selection): Grayed out, opacity 0.5
     - Enabled state: Full color, scale 0.95 on press

### Navigation
- Đến screen này từ: Home Screen (FAB tap)
- Từ screen này đến:
  - Create Capsule Screen (Continue tap)
  - Home Screen (Back tap)

### Ghi chú
- Single selection only (radio behavior)
- No default selection
- Cards minimum 60dp height (touch target)
- Card selection animate với spring animation

---

## 4. Create Capsule Screen

### Mục đích
Cho phép người dùng nhập nội dung text, chọn ảnh, nhập câu hỏi reflection và chọn thời gian mở.

### Các thành phần chính

1. **Header**
   - Mô tả: Back button "←", title "Create [Type]" với type color
   - Tương tác: Tap back hiển thị confirm dialog nếu có data
   - Hiệu ứng: None

2. **Type Badge**
   - Mô tả: Pill badge hiển thị type icon + name với type color
   - Tương tác: None
   - Hiệu ứng: None

3. **Content Text Input**
   - Mô tả:
     - Label "What's on your mind?"
     - Multi-line text input (auto-grow)
     - Placeholder text tùy type
     - Character counter "0/2000" ở bottom-right
   - Tương tác:
     - Tap để focus, keyboard show
     - Type để nhập text
     - Auto-scroll khi text nhiều
   - Hiệu ứng:
     - Border highlight khi focus
     - Character counter chuyển red khi > 1900

4. **Image Section**
   - Mô tả:
     - Label "Add Photos (optional)"
     - Horizontal scrollable list chứa image thumbnails + Add button
     - Max 3 images
   - Tương tác: None (chứa các component con)
   - Hiệu ứng: None

5. **Image Thumbnail**
   - Mô tả:
     - Square thumbnail 80x80dp
     - Image preview
     - X button ở top-right corner
   - Tương tác:
     - Tap X để remove image
     - Tap thumbnail để preview full (optional)
   - Hiệu ứng:
     - Fade in khi add
     - Fade out + slide khi remove

6. **Add Image Button**
   - Mô tả:
     - Dashed border square 80x80dp
     - "+" icon center
     - Disabled khi đã có 3 ảnh
   - Tương tác: Tap để open image picker (request permission nếu cần)
   - Hiệu ứng:
     - Scale 0.9 on press
     - Fade out khi reach max 3 images

7. **Reflection Question Input** (hidden cho Memory type)
   - Mô tả:
     - Label "Question for future you"
     - Single-line text input
     - Placeholder "e.g., Did I achieve my goal?"
   - Tương tác: Tap để focus và nhập
   - Hiệu ứng: Border highlight khi focus

8. **Date Selection Section**
   - Mô tả:
     - Label "When to open?"
     - Preset buttons: [1 week] [1 month] [1 year]
     - Custom date/time picker
     - Selected date display "Opens on: Jan 15, 2026 9:00 AM"
   - Tương tác: Tap preset hoặc custom picker
   - Hiệu ứng: Preset buttons có selected state (filled)

9. **Preset Date Buttons**
   - Mô tả: Chip-style buttons horizontal row
   - Tương tác: Tap để auto-calculate và set date
   - Hiệu ứng: Selected state với accent color, unselected state outline

10. **Custom Date Picker**
    - Mô tả: Native date/time picker component
    - Tương tác: Tap để mở picker modal, chọn date và time
    - Hiệu ứng: Modal slide up from bottom

11. **Preview Button**
    - Mô tả: Primary button "Preview Capsule" ở bottom, full-width
    - Tương tác: Tap để navigate đến Preview screen
    - Hiệu ứng:
      - Disabled khi form invalid (grayed)
      - Enabled scale 0.95 on press

### Navigation
- Đến screen này từ: Type Selection Screen
- Từ screen này đến:
  - Preview Capsule Screen (Preview tap)
  - Type Selection Screen (Back tap with confirmation)

### Ghi chú
- Form validation real-time
- Keyboard avoiding view cho inputs
- Scroll view để fit nội dung dài
- Auto-save draft to state (không save DB cho đến lock)
- Image picker request permission với explanation
- Date picker validate future date only
- Back navigation có confirm dialog nếu có data: "Discard changes?"

---

## 5. Preview Capsule Screen

### Mục đích
Cho phép người dùng xem lại toàn bộ nội dung capsule trước khi lock.

### Các thành phần chính

1. **Header**
   - Mô tả: Edit button "← Edit" left, title "Preview" center
   - Tương tác: Tap Edit để quay lại Create screen với data giữ nguyên
   - Hiệu ứng: None

2. **Type Badge**
   - Mô tả: Large icon + type name với type color
   - Tương tác: None
   - Hiệu ứng: None

3. **Content Display**
   - Mô tả:
     - Card container với padding
     - Full text content với typography hierarchy
     - Scrollable nếu text dài
   - Tương tác: Scroll để đọc
   - Hiệu ứng: None

4. **Image Gallery**
   - Mô tả:
     - Horizontal scrollable row
     - Image thumbnails 100x100dp
     - Page indicator dots nếu có nhiều ảnh
   - Tương tác: Scroll horizontal để xem ảnh, tap để zoom (optional)
   - Hiệu ứng: Smooth scroll snap

5. **Reflection Question Display** (nếu có)
   - Mô tả:
     - Label "Question for future you:"
     - Card hiển thị câu hỏi với quote style
   - Tương tác: None
   - Hiệu ứng: None

6. **Unlock Date Display**
   - Mô tả:
     - Card container
     - "Opens on:" label
     - Date và time formatted: "January 15, 2026"
     - "9:00 AM"
     - Duration text: "(in 1 year, 3 months)"
   - Tương tác: None
   - Hiệu ứng: None

7. **Lock Button**
   - Mô tả: Primary button "Lock Capsule" ở bottom, full-width
   - Tương tác: Tap để hiển thị confirmation dialog
   - Hiệu ứng: Scale 0.95 on press, haptic feedback

8. **Lock Confirmation Dialog**
   - Mô tả:
     - Modal overlay với blur background
     - Title "Lock this capsule?"
     - Warning text về không thể view/edit/delete
     - Unlock date confirmation
     - Cancel và "Lock Forever" buttons
   - Tương tác:
     - Tap Cancel để đóng dialog
     - Tap "Lock Forever" để confirm lock
   - Hiệu ứng:
     - Dialog fade + scale in from center
     - Lock Forever button có warning red/orange color

### Navigation
- Đến screen này từ: Create Capsule Screen
- Từ screen này đến:
  - Create Capsule Screen (Edit tap)
  - Lock Success Screen (Lock confirmed)

### Ghi chú
- Tất cả content read-only
- Lock confirmation dialog blocking (must choose)
- Confirmation dialog text emphasize finality của lock action
- Lock process: Save images → Insert DB → Schedule notification → Show success

---

## 6. Lock Success Screen

### Mục đích
Hiển thị animation và message xác nhận capsule đã được lock thành công.

### Các thành phần chính

1. **Background Overlay**
   - Mô tả: Full-screen semi-transparent overlay
   - Tương tác: Tap anywhere để dismiss sau animation complete
   - Hiệu ứng: Fade in 200ms

2. **Lock Animation**
   - Mô tả:
     - Lottie animation hộp đóng lại
     - Khóa xuất hiện và click
     - Sparkle/glow particles xung quanh
   - Tương tác: None
   - Hiệu ứng:
     - Box closing: 500ms
     - Lock appear: 300ms
     - Sparkles: 600ms
     - Total: ~1.5s

3. **Success Message**
   - Mô tả:
     - Title "Your capsule is locked!"
     - Subtitle "See you on"
     - Date text "January 15, 2026"
   - Tương tác: None
   - Hiệu ứng: Fade in 300ms sau animation

4. **Dismiss Hint**
   - Mô tả: Small text "Tap anywhere to continue"
   - Tương tác: Informational only
   - Hiệu ứng: Fade in 500ms, subtle pulse

### Navigation
- Đến screen này từ: Preview Capsule Screen (lock confirmed)
- Từ screen này đến: Home Screen (tap hoặc auto sau 3s)

### Ghi chú
- Auto-dismiss sau 3 giây nếu user không tap
- Haptic success vibration khi animation complete
- Background blur Home screen ở phía sau
- Không thể dismiss bằng back button trong animation
- Sau dismiss, capsule xuất hiện trên Home với status 'locked'

---

## 7. Capsule Detail Screen (Locked)

### Mục đích
Hiển thị thông tin limited về capsule đang locked khi user tap từ Home.

### Các thành phần chính

1. **Header**
   - Mô tả: Close button "×" top-right, title capsule type
   - Tương tác: Tap close để quay Home
   - Hiệu ứng: None

2. **Lock Icon**
   - Mô tả: Large lock icon với type color
   - Tương tác: None
   - Hiệu ứng: Gentle pulse animation

3. **Locked Message**
   - Mô tả:
     - Title "This capsule is locked"
     - Subtitle "You can open it on:"
   - Tương tác: None
   - Hiệu ứng: None

4. **Countdown Display**
   - Mô tả:
     - Large countdown text
     - Format tùy time remaining
     - Type color accent
   - Tương tác: None
   - Hiệu ứng: Update mỗi phút (hoặc giây nếu < 1 day)

5. **Unlock Date Display**
   - Mô tả: Full date và time formatted
   - Tương tác: None
   - Hiệu ứng: None

6. **Tease Information** (optional)
   - Mô tả:
     - Type icon và name
     - Created date
     - Number of photos (if any): "Contains 3 photos"
   - Tương tác: None
   - Hiệu ứng: None

### Navigation
- Đến screen này từ: Home Screen (tap locked capsule)
- Từ screen này đến: Home Screen (close tap)

### Ghi chú
- Không hiển thị content, images, hoặc reflection question
- Toast message xuất hiện khi tap: "This capsule is still locked. Come back on [date]"
- Có thể implement như modal hoặc bottom sheet thay vì full screen

---

## 8. Open Capsule Screen

### Mục đích
Hiển thị animation mở hộp và nội dung đầy đủ của capsule khi đến thời gian unlock.

### Các thành phần chính

1. **Opening Animation (Initial)**
   - Mô tả:
     - Full-screen animation
     - Hộp từ đóng chuyển sang mở
     - Light rays/glow từ trong hộp
     - Particle effects (sparkles, stars)
   - Tương tác: None, auto-play
   - Hiệu ứng:
     - Box opening: 500ms
     - Light rays: 400ms
     - Particles float up: 600ms
     - Total: ~1.5s

2. **Header** (sau animation)
   - Mô tả: Close button "×" top-right
   - Tương tác: Tap để confirm leave (nếu chưa hoàn thành)
   - Hiệu ứng: None

3. **Type Badge**
   - Mô tả: Icon + type name với type color
   - Tương tác: None
   - Hiệu ứng: Fade in sau opening animation

4. **Metadata**
   - Mô tả:
     - "Created on [date]"
     - "Time locked: 1 year, 3 months"
   - Tương tác: None
   - Hiệu ứng: Fade in

5. **Content Display**
   - Mô tả:
     - Card container
     - Full text content
     - Scrollable nếu dài
     - Typography với proper hierarchy
   - Tương tác: Scroll để đọc
   - Hiệu ứng: Slide up + fade in 400ms

6. **Image Gallery** (nếu có)
   - Mô tả:
     - Horizontal scroll gallery
     - Image thumbnails 120x120dp
     - Tap để view full screen
   - Tương tác:
     - Scroll horizontal
     - Tap image để open full-screen viewer
   - Hiệu ứng: Stagger fade in từ trái sang phải

7. **Full-Screen Image Viewer** (modal)
   - Mô tả:
     - Black background overlay
     - Full image với pinch zoom
     - Close button "×" top-left
     - Page indicator "1/3" top-right
     - Swipe left/right để navigate images
     - Page dots ở bottom
   - Tương tác:
     - Pinch to zoom in/out
     - Double tap to toggle zoom
     - Swipe left/right để next/prev image
     - Tap X hoặc swipe down để close
   - Hiệu ứng:
     - Modal slide up
     - Smooth zoom animation
     - Swipe transition between images

8. **Continue Button**
   - Mô tả: Primary button "Continue" ở bottom
   - Tương tác:
     - Emotion/Goal/Decision → Navigate to Reflection
     - Memory → Update status + Navigate to Celebration
   - Hiệu ứng: Scale 0.95 on press

9. **Leave Confirmation Dialog** (nếu tap X trước Continue)
   - Mô tả:
     - Title "Leave without finishing?"
     - Message "You can come back to open this capsule anytime."
     - [Stay] [Leave] buttons
   - Tương tác: Chọn Stay hoặc Leave
   - Hiệu ứng: Modal fade + scale in

### Navigation
- Đến screen này từ:
  - Home Screen (tap ready capsule)
  - Push Notification (tap notification)
- Từ screen này đến:
  - Reflection Screen (Continue, có reflection)
  - Celebration Screen (Continue, Memory type)
  - Home Screen (Leave confirmed)

### Ghi chú
- Opening animation chỉ play một lần khi enter screen
- Animation respect reduce motion setting
- Capsule vẫn status 'ready' cho đến khi user Complete reflection hoặc Continue (Memory)
- Image viewer support gestures: pinch, double-tap, swipe
- Content scrollable với smooth scroll

---

## 9. Reflection Response Screen

### Mục đích
Cho phép người dùng trả lời câu hỏi reflection đã tạo trước đó.

### Các thành phần chính

#### For Emotion/Goal Types (Yes/No)

1. **Header**
   - Mô tả: Back button "←", title "Reflect"
   - Tương tác: Tap back để quay Open screen
   - Hiệu ứng: None

2. **Type Icon**
   - Mô tả: Large centered icon với type color
   - Tương tác: None
   - Hiệu ứng: Subtle pulse

3. **Question Display**
   - Mô tả:
     - Label "Your question:"
     - Card container
     - Question text với quote typography
   - Tương tác: None
   - Hiệu ứng: None

4. **Instruction Text**
   - Mô tả: "How do you answer?"
   - Tương tác: None
   - Hiệu ứng: None

5. **Yes Button**
   - Mô tả:
     - Large button (half screen width)
     - Text "YES"
     - Smiley icon ":)"
     - Green accent khi selected
   - Tương tác: Tap để select Yes
   - Hiệu ứng:
     - Unselected: Outline border, white background
     - Selected: Filled green, checkmark icon, scale 1.05
     - Press: Scale 0.95, haptic feedback

6. **No Button**
   - Mô tả:
     - Large button (half screen width)
     - Text "NO"
     - Sad icon ":("
     - Red/orange accent khi selected
   - Tương tác: Tap để select No
   - Hiệu ứng: Same as Yes button với red theme

#### For Decision Type (Rating 1-5)

1. **Header, Icon, Question** (same as above)

2. **Instruction Text**
   - Mô tả: "Rate your decision:"
   - Tương tác: None
   - Hiệu ứng: None

3. **Rating Stars**
   - Mô tả:
     - 5 star icons horizontal
     - Labels below: "Bad" - "Neutral" - "Great"
     - Selected stars filled với type color
   - Tương tác: Tap star để select rating (all stars up to selected fill)
   - Hiệu ứng:
     - Fill animation từ trái sang phải
     - Each star có bounce khi select
     - Haptic feedback

4. **Continue Button** (common for all types)
   - Mô tả: Primary button "Continue" ở bottom
   - Tương tác: Tap để save answer + navigate Celebration
   - Hiệu ứng:
     - Disabled khi chưa chọn (grayed)
     - Enabled scale 0.95 on press

### Navigation
- Đến screen này từ: Open Capsule Screen (Continue tap)
- Từ screen này đến:
  - Celebration Screen (Continue tap)
  - Open Capsule Screen (Back tap)

### Ghi chú
- Single selection required
- Cannot Continue without selection
- Selection có thể thay đổi trước khi Continue
- Back navigation có confirm nếu đã select: "Discard answer?"
- Answer saved cùng với update status='opened' và openedAt timestamp

---

## 10. Celebration Screen

### Mục đích
Hiển thị hiệu ứng celebration phù hợp với câu trả lời reflection hoặc type capsule.

### Các thành phần chính

#### Effect Types

**A. Positive Effect (Yes/Rating 4-5)**

1. **Confetti Animation**
   - Mô tả:
     - Full-screen particle system
     - 50-100 colorful confetti (gold, blue, pink, green)
     - Rơi từ trên xuống, rotate, fade out
   - Tương tác: Tap anywhere để skip
   - Hiệu ứng: 3s duration, particles fall với gravity

2. **Center Icon**
   - Mô tả: Party popper/celebration icon
   - Tương tác: None
   - Hiệu ứng: Scale bounce 1.0 → 1.2 → 1.0

3. **Title Text**
   - Mô tả: "Congratulations!" hoặc "Amazing!" (randomized)
   - Tương tác: None
   - Hiệu ứng: Fade in + slight bounce

4. **Subtitle Text**
   - Mô tả: Encouraging message "You achieved your goal! Keep up the great work!"
   - Tương tác: None
   - Hiệu ứng: Fade in 400ms delay

**B. Encouraging Effect (No/Rating 1-2)**

1. **Gentle Particles**
   - Mô tả:
     - 20-30 hearts/bubbles
     - Soft pink/lavender colors
     - Float up slowly, fade out
   - Tương tác: Tap to skip
   - Hiệu ứng: 2.5s gentle float animation

2. **Center Icon**
   - Mô tả: Heart icon
   - Tương tác: None
   - Hiệu ứng: Gentle pulse

3. **Title Text**
   - Mô tả: "That's okay!" hoặc "Keep going!"
   - Tương tác: None
   - Hiệu ứng: Soft fade in

4. **Subtitle Text**
   - Mô tả: "Every experience teaches us something. You're still growing!"
   - Tương tác: None
   - Hiệu ứng: Fade in

**C. Neutral Effect (Rating 3)**

1. **Sparkle Animation**
   - Mô tả:
     - 15-20 subtle sparkles
     - Blue/silver colors
     - Gentle twinkle
   - Tương tác: Tap to skip
   - Hiệu ứng: 2.5s twinkle

2. **Center Icon, Texts** (similar với neutral tone)

**D. Nostalgic Effect (Memory)**

1. **Warm Glow**
   - Mô tả:
     - Warm orange/yellow glow expand từ center
     - Gentle stars fade in/out
   - Tương tác: Tap to skip
   - Hiệu ứng: 2s glow expansion

2. **Center Icon**
   - Mô tả: Camera icon
   - Tương tác: None
   - Hiệu ứng: Soft pulse

3. **Title Text**
   - Mô tả: "A moment captured"
   - Tương tác: None
   - Hiệu ứng: Fade in

4. **Subtitle Text**
   - Mô tả: "This memory is now forever preserved in your archive."
   - Tương tác: None
   - Hiệu ứng: Fade in

#### Common Components (All Effects)

5. **View Archive Button**
   - Mô tả: Secondary button "View Archive" ở bottom-left
   - Tương tác: Tap để navigate đến Archive screen
   - Hiệu ứng: Fade in sau animation, scale 0.95 on press

6. **Done Button**
   - Mô tả: Primary button "Done" ở bottom-right
   - Tương tác: Tap để navigate đến Home screen
   - Hiệu ứng: Fade in sau animation, scale 0.95 on press

### Navigation
- Đến screen này từ:
  - Reflection Screen (Continue tap)
  - Open Capsule Screen (Memory type Continue)
- Từ screen này đến:
  - Archive Screen (View Archive tap)
  - Home Screen (Done tap or hardware back)

### Ghi chú
- Animation auto-play khi enter
- Tap anywhere trên screen để skip animation
- Buttons hiện rõ hơn (fade in) sau animation complete
- Capsule status đã update sang 'opened' trước khi vào screen này
- Respect reduce motion: hiển thị static completion screen
- Haptic feedback tùy effect type (success/light tap)
- Animation dispose sau complete để tiết kiệm memory

---

## 11. Archive List Screen

### Mục đích
Hiển thị danh sách tất cả capsules đã mở, sắp xếp theo ngày mở.

### Các thành phần chính

1. **Header**
   - Mô tả: Back button "←", title "Archive"
   - Tương tác: Tap back để về Home
   - Hiệu ứng: None

2. **Capsule List**
   - Mô tả: Vertical scrollable FlatList với capsule items
   - Tương tác: Scroll vertical, tap items
   - Hiệu ứng: Smooth scroll

3. **Capsule List Item**
   - Mô tả:
     - Card container với padding
     - Type icon + type name ở top-left
     - Dates: "Opened [date]" và "Created [date]" (smaller, secondary)
     - Divider line
     - Content preview (first 50 chars + "...")
     - Image indicators nếu có: small thumbnails hoặc "[3 photos]" badge
     - Divider line
     - Reflection answer (nếu có): "Reflection: Yes" hoặc "Rating: 4/5"
   - Tương tác:
     - Tap để navigate to Archive Detail
     - Swipe left để reveal Delete button
   - Hiệu ứng:
     - Press: Card background slight darkening
     - Swipe: Smooth slide reveal delete button

4. **Delete Button** (swipe revealed)
   - Mô tả:
     - Red background
     - Trash icon
     - Hiện sau khi swipe left
   - Tương tác: Tap để show delete confirmation dialog
   - Hiệu ứng: Slide in từ phải khi swipe

5. **Pull-to-Refresh Indicator**
   - Mô tả: Native refresh control ở top
   - Tương tác: Pull down để refresh list
   - Hiệu ứng: Spinner animation khi loading

6. **Empty State**
   - Mô tả:
     - Illustration hộp trống
     - Title "No opened capsules yet"
     - Subtitle "When you open a time capsule, it will appear here."
     - CTA button "Create a Capsule"
   - Tương tác: Tap CTA để navigate Home (hoặc Create flow)
   - Hiệu ứng: Illustration subtle float

### Navigation
- Đến screen này từ:
  - Home Screen (Archive icon tap)
  - Celebration Screen (View Archive tap)
- Từ screen này đến:
  - Archive Detail Screen (item tap)
  - Home Screen (Back tap)
  - Delete Confirmation Dialog (swipe delete tap)

### Ghi chú
- List sorted by openedAt DESC (mới nhất trước)
- FlatList với virtualization cho performance
- Image thumbnails lazy load
- Swipe-to-delete gesture (iOS/Android native feel)
- Pull-to-refresh query lại database
- List item min height 80dp cho touch target

---

## 12. Archive Detail Screen

### Mục đích
Hiển thị toàn bộ nội dung và thông tin của capsule đã mở.

### Các thành phần chính

1. **Header**
   - Mô tả: Back button "←", title "Detail", Delete button (trash icon) ở right
   - Tương tác:
     - Back → Archive List
     - Delete → Show delete confirmation
   - Hiệu ứng: None

2. **Type Badge**
   - Mô tả: Icon + type name với type color
   - Tương tác: None
   - Hiệu ứng: None

3. **Metadata Section**
   - Mô tả:
     - "Created: [full date]"
     - "Opened: [full date]"
     - "Locked for: X years, X months, X days" (calculated duration)
   - Tương tác: None
   - Hiệu ứng: None

4. **Content Display**
   - Mô tả:
     - Card container
     - Full text content
     - Scrollable
   - Tương tác: Scroll để đọc
   - Hiệu ứng: None

5. **Image Gallery** (nếu có)
   - Mô tả:
     - Horizontal scroll
     - Image thumbnails 120x120dp
   - Tương tác:
     - Scroll horizontal
     - Tap để open full-screen viewer (same as Open Capsule screen)
   - Hiệu ứng: Smooth scroll

6. **Reflection Section** (nếu có)
   - Mô tả:
     - Label "Your reflection:"
     - Card container
     - Question text "Q: [question]"
     - Answer text "A: [Yes/No/Rating]" với color coding (green=Yes, red=No, rating stars)
   - Tương tác: None
   - Hiệu ứng: None

7. **Delete Confirmation Dialog**
   - Mô tả:
     - Title "Delete this capsule?"
     - Warning "This cannot be undone"
     - [Cancel] [Delete] buttons
   - Tương tác:
     - Cancel → Close dialog
     - Delete → Delete capsule + navigate back to Archive
   - Hiệu ứng: Modal fade + scale in

### Navigation
- Đến screen này từ: Archive List Screen (item tap)
- Từ screen này đến:
  - Archive List Screen (Back tap)
  - Archive List Screen (Delete confirmed)

### Ghi chú
- Read-only view, không thể edit
- Delete action permanent, xóa cả DB record và image files
- Full-screen image viewer reuse component từ Open Capsule screen
- Reflection answer có visual indicators (colors, icons)
- Content fully scrollable

---

## 13. Empty State Screens

### Mục đích
Hiển thị UI thân thiện khi không có dữ liệu, hướng dẫn user action tiếp theo.

### 13.1 Home Screen Empty State

**Các thành phần chính:**

1. **Illustration**
   - Mô tả: Empty box hoặc time capsule đang chờ
   - Tương tác: None
   - Hiệu ứng: Subtle float animation (up/down 10px, 3s loop)

2. **Title Text**
   - Mô tả: "No capsules yet"
   - Tương tác: None
   - Hiệu ứng: None

3. **Subtitle Text**
   - Mô tả: "Create your first time capsule to send a message to your future self"
   - Tương tác: None
   - Hiệu ứng: None

4. **CTA Button**
   - Mô tả: Primary button "Create a Capsule"
   - Tương tác: Tap để navigate to Type Selection
   - Hiệu ứng: Scale 0.95 on press

5. **FAB** (vẫn hiển thị)
   - Mô tả: Floating "+" button
   - Tương tác: Same as normal Home screen
   - Hiệu ứng: Same

### 13.2 Archive Empty State

**Các thành phần chính:**

1. **Illustration**
   - Mô tả: Open empty box
   - Tương tác: None
   - Hiệu ứng: Subtle animation

2. **Title Text**
   - Mô tả: "No opened capsules yet"
   - Tương tác: None
   - Hiệu ứng: None

3. **Subtitle Text**
   - Mô tả: "When you open a time capsule, it will appear here."
   - Tương tác: None
   - Hiệu ứng: None

4. **CTA Button** (optional)
   - Mô tả: Secondary button "Go to Home"
   - Tương tác: Tap để navigate to Home
   - Hiệu ứng: Scale 0.95 on press

### Navigation
- Empty states inline trong screens tương ứng
- CTA buttons navigate đến actions phù hợp

### Ghi chú
- Empty states visual appealing, không chỉ text
- Illustrations có animation nhẹ để tạo sự sống động
- Messages clear và actionable
- Giữ navigation options (header back button, FAB) vẫn available

---

## Color Palette Reference

### Capsule Type Colors

| Type | Primary Color | Light Background | Icon |
|------|---------------|------------------|------|
| **Emotion** | #E91E63 (Pink) | #FCE4EC | Heart |
| **Goal** | #4CAF50 (Green) | #E8F5E9 | Target/Flag |
| **Memory** | #FF9800 (Orange) | #FFF3E0 | Camera |
| **Decision** | #2196F3 (Blue) | #E3F2FD | Scale/Balance |

### UI Colors

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #6366F1 (Indigo) | Buttons, FAB, accents |
| Success | #10B981 (Green) | Yes answers, positive |
| Warning | #F59E0B (Orange) | Alerts |
| Danger | #EF4444 (Red) | Delete, No answers |
| Text Primary | #1F2937 | Main text |
| Text Secondary | #6B7280 | Metadata, labels |
| Background | #FFFFFF | Cards, screens |
| Surface | #F9FAFB | App background |

---

## Typography Scale

| Style | Font Size | Weight | Line Height | Usage |
|-------|-----------|--------|-------------|-------|
| H1 | 32px | Bold | 40px | Screen titles |
| H2 | 24px | Semibold | 32px | Section headers |
| H3 | 20px | Semibold | 28px | Card titles |
| Body | 16px | Regular | 24px | Main content |
| Body Small | 14px | Regular | 20px | Secondary text |
| Caption | 12px | Regular | 16px | Labels, hints |
| Button | 16px | Semibold | 24px | Button text |

---

## Spacing System (8pt Grid)

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Component padding |
| md | 16px | Default padding |
| lg | 24px | Section spacing |
| xl | 32px | Screen padding |
| 2xl | 48px | Large gaps |

---

## Animation Durations

| Type | Duration | Easing |
|------|----------|--------|
| Micro (tap) | 100-150ms | ease-out |
| Short (transitions) | 200-300ms | ease-in-out |
| Medium (modals) | 300-400ms | ease-out |
| Long (celebrations) | 2-3s | linear/ease-out |

---

*End of Screen Descriptions Document*
