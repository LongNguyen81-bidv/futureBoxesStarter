# Test Infrastructure

This folder contains all test infrastructure, mocks, and utilities for the FutureBoxes project.

## Structure

```
src/tests/
├── mocks/                  # Mock implementations for Expo modules
│   ├── asyncStorage.ts     # @react-native-async-storage/async-storage
│   ├── expoSQLite.ts       # expo-sqlite
│   ├── expoFileSystem.ts   # expo-file-system
│   ├── expoNotifications.ts # expo-notifications
│   ├── expoImagePicker.ts  # expo-image-picker
│   ├── expoHaptics.ts      # expo-haptics
│   ├── expoTaskManager.ts  # expo-task-manager
│   └── expoBackgroundFetch.ts # expo-background-fetch
├── utils/
│   └── testHelpers.tsx     # Test utilities and helpers
├── setup.ts                # Jest global setup
└── README.md               # This file
```

## Mock Files

All Expo modules are mocked to work in Jest test environment without native dependencies.

### Using Mocks

Mocks are automatically loaded via `setup.ts`. No manual imports needed in tests.

### Mock Helpers

Most mocks provide helper methods for testing:

```typescript
// Reset mock state between tests
import { __reset } from '../tests/mocks/expoFileSystem';
import { __resetAllDatabases } from '../tests/mocks/expoSQLite';

beforeEach(() => {
  __reset();
  __resetAllDatabases();
});
```

### Custom Mock Data

```typescript
// Set mock file in FileSystem
import { __setMockFile } from '../tests/mocks/expoFileSystem';
__setMockFile('path/to/file.jpg', 'mock-content');

// Set mock database data
const mockDb = await SQLite.openDatabaseAsync('test.db');
mockDb.__setMockData('capsule', [/* mock rows */]);
```

## Test Helpers

`testHelpers.tsx` provides utilities for writing tests:

### Component Rendering

```typescript
import { render, renderWithProviders } from '../tests/utils/testHelpers';

// Simple render
const { getByText } = render(<Component />);

// With Navigation
const { getByText } = renderWithProviders(<Screen />);
```

### Mock Data Factories

```typescript
import {
  createMockCapsule,
  createReadyCapsule,
  createOpenedCapsule,
  createMockCapsules,
} from '../tests/utils/testHelpers';

// Create single mock capsule
const capsule = createMockCapsule({ type: 'emotion' });

// Create ready capsule (unlockDate in past)
const readyCapsule = createReadyCapsule();

// Create opened capsule
const openedCapsule = createOpenedCapsule({ reflectionAnswer: 'yes' });

// Create multiple capsules
const capsules = createMockCapsules(5);
```

### Mock Navigation/Route

```typescript
import {
  createMockNavigation,
  createMockRoute,
} from '../tests/utils/testHelpers';

const navigation = createMockNavigation();
const route = createMockRoute({ capsuleId: '123' });

render(<Screen navigation={navigation} route={route} />);
```

## Adding New Mocks

When adding a new Expo dependency:

1. Create mock file in `mocks/`:
   ```typescript
   // mocks/expoNewModule.ts
   export const someMethod = jest.fn(() => Promise.resolve('result'));
   export const __reset = () => { /* reset state */ };
   ```

2. Register in `setup.ts`:
   ```typescript
   jest.mock('expo-new-module', () => require('./mocks/expoNewModule'));
   ```

3. Document in this README

## Best Practices

1. **Always reset mocks** between tests:
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
     __reset(); // Custom reset helpers
   });
   ```

2. **Use factories** for test data instead of hardcoding:
   ```typescript
   // Good
   const capsule = createMockCapsule({ type: 'goal' });

   // Bad
   const capsule = { id: '123', type: 'goal', /* ... */ };
   ```

3. **Keep mocks simple** - only implement what's needed for tests

4. **Document mock helpers** - add comments for non-obvious behavior

## Troubleshooting

### Mock not working?

1. Check `setup.ts` - is module mocked?
2. Clear jest cache: `npm test -- --clearCache`
3. Restart jest watch mode

### Type errors with mocks?

Mocks should match real module API. Check:
- Function signatures
- Return types
- Async/sync behavior

### Tests interfering with each other?

Use proper cleanup:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  __resetAllDatabases();
  __reset();
});
```

## See Also

- [Main Testing Guide](../../TESTING.md) - Full testing documentation
- [Jest Configuration](../../jest.config.js) - Jest settings
