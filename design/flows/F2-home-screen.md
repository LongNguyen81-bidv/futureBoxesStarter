# F2: Home Screen - Activity Diagram

**Feature:** Home Screen
**Priority:** Must Have
**Dependencies:** F1 (Local Data Storage)

---

## 1. Overview

Home Screen la man hinh chinh cua app, hien thi toi da 6 capsules sap mo nhat theo dang grid 3x2. Nguoi dung co the xem countdown, tap vao capsule ready de mo, hoac tao capsule moi.

---

## 2. Activity Diagram - Load Home Screen

```mermaid
flowchart TD
    Start([Open Home Screen]) --> CheckFirstLaunch{First launch?}

    CheckFirstLaunch -->|Yes| ShowOnboarding[Navigate to Onboarding]
    ShowOnboarding --> End1([End - Onboarding])

    CheckFirstLaunch -->|No| QueryCapsules[Query: 6 capsules nearest unlock time]
    QueryCapsules --> HasCapsules{Has capsules?}

    HasCapsules -->|No| ShowEmptyState[Show Empty State UI]
    ShowEmptyState --> RenderFAB

    HasCapsules -->|Yes| ProcessCapsules[Process capsule list]
    ProcessCapsules --> CheckStatus[Check each capsule status]
    CheckStatus --> UpdateReadyStatus[Update status 'locked' -> 'ready' if unlockAt passed]
    UpdateReadyStatus --> RenderGrid[Render 3x2 Grid]
    RenderGrid --> RenderFAB[Render FAB button]
    RenderFAB --> StartTimers[Start countdown timers]
    StartTimers --> End2([Home Screen Ready])
```

---

## 3. Activity Diagram - Tap Capsule

```mermaid
flowchart TD
    Start([User taps capsule card]) --> CheckStatus{Capsule status?}

    CheckStatus -->|locked| ShowLockedMessage[Show toast: 'This capsule is still locked']
    ShowLockedMessage --> End1([End - No action])

    CheckStatus -->|ready| NavigateOpen[Navigate to Open Capsule Screen]
    NavigateOpen --> End2([End - Open flow])

    CheckStatus -->|opened| NavigateDetail[Navigate to Capsule Detail]
    NavigateDetail --> End3([End - View detail])
```

---

## 4. Activity Diagram - Create New Capsule

```mermaid
flowchart TD
    Start([User taps FAB +]) --> Navigate[Navigate to Type Selection Screen]
    Navigate --> End([End - Create flow starts])
```

---

## 5. Activity Diagram - Navigate to Archive

```mermaid
flowchart TD
    Start([User taps Archive]) --> Navigate[Navigate to Archive Screen]
    Navigate --> End([End - Archive screen])
```

---

## 6. Activity Diagram - Countdown Timer Update

```mermaid
flowchart TD
    Start([Timer interval - every minute]) --> GetCapsules[Get displayed capsules]
    GetCapsules --> LoopStart{More capsules?}

    LoopStart -->|No| End1([End - All updated])

    LoopStart -->|Yes| CalcTime[Calculate time remaining]
    CalcTime --> IsUnlocked{Time remaining <= 0?}

    IsUnlocked -->|Yes| UpdateStatus[Update capsule status to 'ready']
    UpdateStatus --> RefreshCard[Refresh card UI - show 'Ready']
    RefreshCard --> NextCapsule[Process next capsule]
    NextCapsule --> LoopStart

    IsUnlocked -->|No| UpdateDisplay[Update countdown display]
    UpdateDisplay --> CheckLessThan1Day{Less than 1 day?}

    CheckLessThan1Day -->|Yes| ShowHMS[Show HH:MM:SS format]
    ShowHMS --> NextCapsule

    CheckLessThan1Day -->|No| ShowDHM[Show Xd Xh Xm format]
    ShowDHM --> NextCapsule
```

---

## 7. UI Components

### 7.1 Home Screen Layout

```
+----------------------------------+
|  [Archive Icon]   FutureBoxes    |
+----------------------------------+
|                                  |
|  +--------+  +--------+          |
|  |Capsule1|  |Capsule2|          |
|  | 3d 5h  |  | Ready! |          |
|  +--------+  +--------+          |
|                                  |
|  +--------+  +--------+          |
|  |Capsule3|  |Capsule4|          |
|  | 1w 2d  |  | 12:30  |          |
|  +--------+  +--------+          |
|                                  |
|  +--------+  +--------+          |
|  |Capsule5|  |Capsule6|          |
|  | 2mo 5d |  | 1y 3mo |          |
|  +--------+  +--------+          |
|                                  |
|                          [+ FAB] |
+----------------------------------+
```

### 7.2 Capsule Card Components

| Component | Locked State | Ready State |
|-----------|--------------|-------------|
| Icon | Type icon (heart/target/camera/scale) | Same + glow effect |
| Badge | Countdown text | "Ready to open" badge |
| Background | Muted color | Vibrant color + pulse |
| Interaction | Show locked message | Navigate to open |

---

## 8. User Interaction Flow

### 8.1 Mo app va xem Home

1. User mo app
2. App load du lieu tu SQLite (6 capsules gan unlock nhat)
3. App check va update status cac capsule da den gio
4. App hien thi grid 3x2
5. App bat dau countdown timers

### 8.2 Tap capsule dang locked

1. User tap vao capsule card
2. App check status = 'locked'
3. App hien thi toast message: "This capsule is still locked. Come back on [date]"
4. Khong co navigation

### 8.3 Tap capsule ready

1. User tap vao capsule card
2. App check status = 'ready'
3. App navigate den Open Capsule Screen
4. Truyen capsuleId qua navigation params

### 8.4 Tao capsule moi

1. User tap FAB (+)
2. App navigate den Type Selection Screen
3. Bat dau create flow

### 8.5 Xem Archive

1. User tap Archive icon (header)
2. App navigate den Archive Screen

---

## 9. Countdown Format Rules

| Time Remaining | Format | Example |
|----------------|--------|---------|
| >= 1 year | Xy Xmo | 1y 3mo |
| >= 1 month | Xmo Xd | 2mo 15d |
| >= 1 week | Xw Xd | 2w 3d |
| >= 1 day | Xd Xh Xm | 3d 5h 30m |
| < 1 day | HH:MM:SS | 12:30:45 |
| <= 0 | Ready badge | "Ready to open" |

---

## 10. Error Handling

| Error | Handling |
|-------|----------|
| Database query failed | Show error message, allow retry |
| No capsules | Show empty state UI |
| Timer sync issue | Recalculate on focus |
| Navigation failed | Show error, stay on Home |

---

## 11. Performance Considerations

| Aspect | Implementation |
|--------|----------------|
| Query optimization | Use index on unlockAt, status |
| Timer efficiency | Update every minute (not seconds) unless < 1 day |
| Image loading | Lazy load capsule images |
| Re-render | Only update changed cards |

---

*F2 Activity Diagram End*
