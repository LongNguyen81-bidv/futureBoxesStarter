# F9 Reflection Response - UI Flow Diagram

## Screen Layout Visualization

```
┌─────────────────────────────────────────────────┐
│  ← Back              Reflect                    │ Header
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│               ┌─────────────┐                   │
│               │             │                   │
│               │   [Icon]    │                   │ Type Badge
│               │             │                   │ (Heart/Flag/Scale)
│               └─────────────┘                   │
│                                                 │
│         Your question:                          │
│         ┌───────────────────────────────┐      │
│         │                               │      │
│         │  "Did this feeling pass?"     │      │ Question Card
│         │                               │      │ (Quote style)
│         └───────────────────────────────┘      │
│                                                 │
│         How do you answer?                      │ Instruction
│                                                 │
│    ┌────────────────┐   ┌────────────────┐    │
│    │                │   │                │    │
│    │      YES       │   │       NO       │    │ Answer UI
│    │       😊       │   │       😢       │    │ (Yes/No or Stars)
│    │                │   │                │    │
│    └────────────────┘   └────────────────┘    │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│           [    Continue  →    ]                 │ Continue Button
│                                                 │ (Disabled until selection)
└─────────────────────────────────────────────────┘
```

## UI States

### State 1: Initial (No Selection)

```
Answer UI:  [  YES  ]  [  NO  ]
            Border     Border
            only       only

Continue:   [ Continue → ]  (Disabled, gray, opacity 0.5)
```

### State 2: Yes Selected

```
Answer UI:  [✓ YES ✓]  [  NO  ]
            Green      Border
            filled     only

Continue:   [ Continue → ]  (Enabled, colored, opacity 1.0)
```

### State 3: No Selected

```
Answer UI:  [  YES  ]  [✓ NO ✓]
            Border     Red
            only       filled

Continue:   [ Continue → ]  (Enabled, colored, opacity 1.0)
```

## Interaction Flow

```
┌──────────────┐
│ User enters  │
│   screen     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ ReflectionScreen     │
│ - Show type icon     │
│ - Show question      │
│ - Show answer UI     │
│ - Continue disabled  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ User taps Yes/No     │
│ or selects Rating    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ - Haptic feedback    │
│ - Animation plays    │
│ - Selection updates  │
│ - Continue enables   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ User taps Continue   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ - Save to database   │
│ - Update status      │
│ - Navigate to        │
│   Celebration        │
└──────────────────────┘
```

## Type-Specific Layouts

### Emotion/Goal (Yes/No)

```
┌─────────────────────────────────┐
│        ❤️  Emotion               │
├─────────────────────────────────┤
│                                 │
│  Your question:                 │
│  ┌───────────────────────────┐ │
│  │ "Did this feeling pass?"  │ │
│  └───────────────────────────┘ │
│                                 │
│  How do you answer?             │
│                                 │
│  ┌──────────┐   ┌──────────┐  │
│  │          │   │          │  │
│  │   YES    │   │    NO    │  │
│  │    😊    │   │    😢    │  │
│  │          │   │          │  │
│  └──────────┘   └──────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Decision (Rating 1-5)

```
┌─────────────────────────────────┐
│        ⚖️  Decision              │
├─────────────────────────────────┤
│                                 │
│  Your question:                 │
│  ┌───────────────────────────┐ │
│  │ "Was this the right       │ │
│  │  decision?"                │ │
│  └───────────────────────────┘ │
│                                 │
│  Rate your decision:            │
│                                 │
│   ⭐  ⭐  ⭐  ⭐  ⭐            │
│   1   2   3   4   5            │
│                                 │
│  Bad     Neutral       Great    │
│                                 │
└─────────────────────────────────┘
```

## Component Hierarchy

```
ReflectionScreen
│
├── Header
│   ├── BackButton
│   ├── Title ("Reflect")
│   └── Spacer
│
├── ScrollView
│   ├── TypeIcon (Circle badge)
│   ├── QuestionSection
│   │   ├── Label ("Your question:")
│   │   └── QuestionCard
│   │       └── QuestionText (Quote style)
│   ├── Instruction
│   └── AnswerSection
│       ├── YesNoButtons (if emotion/goal)
│       │   ├── YesButton
│       │   └── NoButton
│       └── StarRating (if decision)
│           ├── Star1
│           ├── Star2
│           ├── Star3
│           ├── Star4
│           └── Star5
│
└── ButtonContainer
    └── ContinueButton
        ├── Text ("Continue")
        └── Icon (arrow-right)
```

## Animation Sequence

### Yes/No Button Press

```
1. Press In
   Scale: 1.0 → 0.95
   Duration: 100ms

2. Press Out
   Scale: 0.95 → 1.0
   Duration: 100ms

3. Selection Change
   Background: White → Green/Red
   Border: 1px → 2px
   Icon: Outline → Filled
   Duration: 200ms

4. Checkmark Appear
   Opacity: 0 → 1
   Scale: 0.8 → 1.0
   Duration: 150ms
```

### Star Rating Select

```
1. Tap Star
   Haptic: Light impact

2. Selected Star Bounce
   Scale: 1.0 → 1.2 → 1.0
   Duration: 200ms

3. Fill Stars Sequentially
   Stars 1→N: Empty → Filled
   Color: Gray → Gold/Orange/Red
   Stagger: 50ms delay each
```

### Continue Button Enable

```
1. Opacity Change
   From: 0.5 (disabled)
   To: 1.0 (enabled)
   Duration: 200ms
   Easing: ease-out

2. Background Color
   From: Gray (#D1D5DB)
   To: Type color (Pink/Green/Blue)
   Duration: 200ms
```

## Color Mapping

### Type Colors

| Type     | Icon  | Primary | Light Background |
|----------|-------|---------|------------------|
| Emotion  | ❤️    | #E91E63 | #FCE4EC          |
| Goal     | 🏁    | #4CAF50 | #E8F5E9          |
| Decision | ⚖️    | #2196F3 | #E3F2FD          |

### Answer Colors

| Answer    | Color   | Hex     | Usage           |
|-----------|---------|---------|-----------------|
| Yes       | Green   | #10B981 | Success/Positive|
| No        | Red     | #EF4444 | Danger/Negative |
| Rating 5  | Gold    | #FFD700 | Best            |
| Rating 4  | Gold    | #FFD700 | Good            |
| Rating 3  | Orange  | #F59E0B | Neutral         |
| Rating 2  | Red     | #EF4444 | Bad             |
| Rating 1  | Red     | #EF4444 | Worst           |

## Touch Targets

```
Minimum Touch Targets (iOS HIG):

┌─────────────────┐
│                 │
│   Yes Button    │  56dp height
│                 │  Half screen width
└─────────────────┘

┌───────┐
│       │
│  ⭐   │  48dp × 48dp
│       │  (Star with padding)
└───────┘

┌─────────────────────┐
│                     │
│  Continue Button    │  56dp height
│                     │  Full width
└─────────────────────┘
```

## Responsive Behavior

### Small Screens (<375dp width)

```
- Question text wraps
- ScrollView scrollable
- Buttons stack vertically if needed
- Type icon 64dp → 56dp
- Padding xl (32dp) → lg (24dp)
```

### Large Screens (>428dp width)

```
- Max width constraint: 600dp
- Center content horizontally
- Increased spacing between elements
- Type icon: 64dp
- Full padding: xl (32dp)
```

## Accessibility

### Screen Reader Labels

```
Type Icon:        "[Type] capsule icon"
Question Card:    "Your reflection question: [question text]"
Yes Button:       "Answer yes to reflection question"
No Button:        "Answer no to reflection question"
Star 1:           "Rate 1 out of 5, bad decision"
Star 2:           "Rate 2 out of 5"
Star 3:           "Rate 3 out of 5, neutral"
Star 4:           "Rate 4 out of 5"
Star 5:           "Rate 5 out of 5, great decision"
Continue Button:  "Continue to celebration"
```

### Focus Order

```
1. Back button
2. Question card (focusable for reading)
3. Yes button OR Star 1
4. No button OR Star 2
5. Star 3 (if rating)
6. Star 4 (if rating)
7. Star 5 (if rating)
8. Continue button
```

---

**End of UI Flow Diagram**
