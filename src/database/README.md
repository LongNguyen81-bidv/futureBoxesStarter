# F1: Local Data Storage

## Overview

Implementation of local data storage using SQLite and FileSystem for FutureBoxes app.

## Features

✅ SQLite database with 2 tables (`capsule`, `capsule_image`)
✅ 4 performance indexes
✅ File system management for images
✅ CRUD operations with validation
✅ Transaction support with rollback
✅ Offline-first architecture
✅ Type-safe TypeScript implementation

## Architecture

```
src/
├── database/
│   ├── database.ts        # DB connection, schema, migrations
│   └── index.ts           # Exports
├── services/
│   ├── databaseService.ts # CRUD operations
│   ├── fileService.ts     # Image file operations
│   └── index.ts           # Exports
├── hooks/
│   ├── useDatabase.ts     # React hook for DB initialization
│   └── index.ts           # Exports
└── types/
    └── capsule.ts         # TypeScript types
```

## Usage

### 1. Initialize Database in App Entry

```typescript
import { useDatabase } from './src/hooks';

function App() {
  const { isReady, isLoading, isError, error } = useDatabase();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorScreen error={error} />;
  }

  return <MainApp />;
}
```

### 2. Create Capsule

```typescript
import { createCapsule } from './src/services';

const capsule = await createCapsule({
  type: 'emotion',
  content: 'My thoughts today...',
  reflectionQuestion: 'Did my feelings change?',
  unlockDate: new Date('2025-12-31'),
  images: ['file:///path/to/image1.jpg', 'file:///path/to/image2.jpg'],
});
```

### 3. Get Capsules

```typescript
import {
  getCapsules,
  getUpcomingCapsules,
  getOpenedCapsules,
} from './src/services';

// All capsules
const all = await getCapsules();

// Upcoming capsules for Home Screen (max 6)
const upcoming = await getUpcomingCapsules();

// Opened capsules for Archive
const archive = await getOpenedCapsules();

// Filter by status
const locked = await getCapsules('locked');
const ready = await getCapsules('ready');
```

### 4. Get Capsule with Images

```typescript
import { getCapsuleById, getImages } from './src/services';

const capsule = await getCapsuleById('capsule-id');
const images = await getImages('capsule-id');
```

### 5. Update Capsule

```typescript
import {
  updateCapsuleStatus,
  updateReflectionAnswer,
  markCapsuleAsOpened,
} from './src/services';

// Update status
await updateCapsuleStatus('capsule-id', 'ready');

// Answer reflection (auto-marks as opened)
await updateReflectionAnswer('capsule-id', 'yes'); // or '1'-'5'

// Mark as opened (for memory type)
await markCapsuleAsOpened('capsule-id');
```

### 6. Delete Capsule

```typescript
import { deleteCapsule } from './src/services';

// Only works for opened capsules
await deleteCapsule('capsule-id');
```

### 7. Background Status Update

```typescript
import { updatePendingCapsules } from './src/services';

// Called by background task or on app launch
const updatedCount = await updatePendingCapsules();
// Returns number of capsules updated from 'locked' to 'ready'
```

## Validation Rules

### Content
- **Required**: Yes
- **Max length**: 2000 characters
- **Error**: Throws if empty or too long

### Images
- **Required**: No
- **Max count**: 3 images
- **Formats**: JPG, PNG
- **Max size**: 10MB per image
- **Error**: Throws if > 3 images or invalid format

### Reflection Question
- **Required**: Yes for emotion/goal/decision, No for memory
- **Max length**: 500 characters
- **Error**: Throws if missing (when required) or too long

### Unlock Date
- **Required**: Yes
- **Constraint**: Must be > current time + 1 minute
- **Error**: Throws if in the past or too soon

### Reflection Answer
- **Emotion/Goal**: "yes" | "no"
- **Decision**: "1" | "2" | "3" | "4" | "5"
- **Memory**: null (no reflection)

## Database Schema

### Tables

#### capsule
- `id` TEXT PRIMARY KEY (UUID v4)
- `type` TEXT (emotion|goal|memory|decision)
- `status` TEXT (locked|ready|opened)
- `content` TEXT
- `reflectionQuestion` TEXT
- `reflectionAnswer` TEXT
- `createdAt` INTEGER (Unix timestamp ms)
- `unlockAt` INTEGER (Unix timestamp ms)
- `openedAt` INTEGER (Unix timestamp ms, nullable)
- `updatedAt` INTEGER (Unix timestamp ms)

#### capsule_image
- `id` TEXT PRIMARY KEY (UUID-like)
- `capsuleId` TEXT (FK to capsule)
- `filePath` TEXT
- `orderIndex` INTEGER (0-2)
- `createdAt` INTEGER (Unix timestamp ms)

### Indexes

1. `idx_capsule_unlock_status` - Home Screen query
2. `idx_capsule_opened` - Archive query
3. `idx_image_capsule` - Image lookup
4. `idx_capsule_pending_unlock` - Background timer check

## File Storage

```
{documentDirectory}/
  capsule_images/
    {capsuleId}/
      {imageId}_0.jpg
      {imageId}_1.jpg
      {imageId}_2.jpg
```

## Error Handling

All functions throw errors with descriptive messages:

```typescript
try {
  await createCapsule(input);
} catch (error) {
  // Error types:
  // - Validation errors (content too long, etc.)
  // - Database errors
  // - File system errors (storage full, etc.)
  console.error(error.message);
}
```

## Transaction Safety

Operations use SQLite transactions with automatic rollback on error:

```typescript
await db.execAsync('BEGIN TRANSACTION');
try {
  // ... operations
  await db.execAsync('COMMIT');
} catch (error) {
  await db.execAsync('ROLLBACK');
  // Cleanup (delete copied files, etc.)
  throw error;
}
```

## Performance

- **Database queries**: < 50ms (Home Screen), < 100ms (Archive)
- **Indexes**: Optimized for common queries
- **Image loading**: Lazy loading, file existence check
- **Background updates**: Efficient batch status updates

## Testing

To test the implementation:

1. Use Expo Go or development build
2. Create test capsules with different types
3. Verify database persistence (close/reopen app)
4. Test offline capability (airplane mode)
5. Test image operations (add/view/delete)
6. Test validation rules (edge cases)

## Acceptance Criteria Status

✅ **1.1**: Dữ liệu capsule lưu vào SQLite trên device
✅ **1.2**: Ảnh lưu vào local file system với reference trong DB
✅ **1.3**: App hoạt động hoàn toàn offline
✅ **1.4**: Dữ liệu persist sau khi restart app

## Next Steps

F1 is complete! Ready for:
- **F2**: Home Screen UI implementation
- **F3**: Capsule Type Selection
- **F4**: Create Capsule UI

## Notes

- Database version is stored in `PRAGMA user_version`
- Future migrations can be added to `runMigrations()`
- For development, use `resetDatabase()` to clear all data
- Production builds should never call `resetDatabase()`
