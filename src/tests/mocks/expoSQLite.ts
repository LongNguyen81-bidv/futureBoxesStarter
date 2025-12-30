/**
 * Mock for expo-sqlite
 */

// In-memory database for testing
const databases: Map<string, MockDatabase> = new Map();

class MockDatabase {
  name: string;
  tables: Map<string, any[]> = new Map();
  execAsync: jest.Mock;
  runAsync: jest.Mock;
  getFirstAsync: jest.Mock;
  getAllAsync: jest.Mock;
  prepareAsync: jest.Mock;
  closeAsync: jest.Mock;

  constructor(name: string) {
    this.name = name;

    // Create jest mocks for all database methods
    this.execAsync = jest.fn().mockResolvedValue(undefined);

    this.runAsync = jest.fn().mockResolvedValue({
      lastInsertRowId: Math.floor(Math.random() * 10000),
      changes: 1,
    });

    this.getFirstAsync = jest.fn().mockResolvedValue(null);

    this.getAllAsync = jest.fn().mockResolvedValue([]);

    this.prepareAsync = jest.fn().mockResolvedValue(new MockStatement(''));

    this.closeAsync = jest.fn().mockResolvedValue(undefined);
  }

  // Helper method for tests to insert mock data
  __setMockData(tableName: string, data: any[]) {
    this.tables.set(tableName, data);
  }

  // Helper to clear all data
  __reset() {
    this.tables.clear();
  }
}

class MockStatement {
  sql: string;
  executeAsync: jest.Mock;
  finalizeAsync: jest.Mock;

  constructor(sql: string) {
    this.sql = sql;
    this.executeAsync = jest.fn().mockResolvedValue({ rows: [] });
    this.finalizeAsync = jest.fn().mockResolvedValue(undefined);
  }
}

export const openDatabaseAsync = jest.fn((databaseName: string) => {
  if (!databases.has(databaseName)) {
    databases.set(databaseName, new MockDatabase(databaseName));
  }
  return Promise.resolve(databases.get(databaseName)!);
});

export const openDatabaseSync = jest.fn((databaseName: string) => {
  if (!databases.has(databaseName)) {
    databases.set(databaseName, new MockDatabase(databaseName));
  }
  return databases.get(databaseName)!;
});

export const deleteDatabaseAsync = jest.fn((databaseName: string) => {
  databases.delete(databaseName);
  return Promise.resolve();
});

// Helper for tests to reset all databases
export const __resetAllDatabases = () => {
  databases.clear();
};

// Export mock database class for testing utilities
export { MockDatabase };
