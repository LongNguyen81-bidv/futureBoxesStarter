/**
 * Database Configuration & Initialization
 * SQLite database with expo-sqlite
 *
 * Features:
 * - Database creation and connection
 * - Schema migrations
 * - Table creation with constraints
 * - Index creation for performance
 */

import * as SQLite from 'expo-sqlite';

// Database configuration
const DATABASE_NAME = 'futureboxes.db';
const CURRENT_DB_VERSION = 1;

// Database instance (singleton)
let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or create database instance
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log('[Database] Opened successfully');
    return dbInstance;
  } catch (error) {
    console.error('[Database] Failed to open:', error);
    throw new Error('Failed to open database');
  }
};

/**
 * Initialize database with tables and indexes
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const db = await getDatabase();

    // Check current version
    const currentVersion = await getDatabaseVersion(db);
    console.log('[Database] Current version:', currentVersion);

    if (currentVersion === 0) {
      // Fresh database - create schema
      await createSchema(db);
      await setDatabaseVersion(db, CURRENT_DB_VERSION);
      console.log('[Database] Schema created successfully');
    } else if (currentVersion < CURRENT_DB_VERSION) {
      // Run migrations
      await runMigrations(db, currentVersion, CURRENT_DB_VERSION);
      console.log('[Database] Migrations completed');
    } else {
      console.log('[Database] Already up to date');
    }
  } catch (error) {
    console.error('[Database] Initialization failed:', error);
    throw error;
  }
};

/**
 * Create initial database schema
 */
const createSchema = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
    -- Enable foreign keys
    PRAGMA foreign_keys = ON;

    -- Create capsule table
    CREATE TABLE IF NOT EXISTS capsule (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('emotion', 'goal', 'memory', 'decision')),
      status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'ready', 'opened')),
      content TEXT NOT NULL,
      reflectionQuestion TEXT,
      reflectionAnswer TEXT CHECK (
        reflectionAnswer IN ('yes', 'no', '1', '2', '3', '4', '5')
        OR reflectionAnswer IS NULL
      ),
      createdAt INTEGER NOT NULL,
      unlockAt INTEGER NOT NULL,
      openedAt INTEGER,
      updatedAt INTEGER NOT NULL,
      CHECK (unlockAt > createdAt)
    );

    -- Create capsule_image table
    CREATE TABLE IF NOT EXISTS capsule_image (
      id TEXT PRIMARY KEY,
      capsuleId TEXT NOT NULL,
      filePath TEXT NOT NULL,
      orderIndex INTEGER NOT NULL CHECK (orderIndex >= 0 AND orderIndex <= 2),
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (capsuleId) REFERENCES capsule(id) ON DELETE CASCADE
    );

    -- Create indexes for performance
    -- Index for Home Screen query (6 upcoming capsules)
    CREATE INDEX IF NOT EXISTS idx_capsule_unlock_status
    ON capsule(unlockAt ASC, status)
    WHERE status IN ('locked', 'ready');

    -- Index for Archive query (opened capsules)
    CREATE INDEX IF NOT EXISTS idx_capsule_opened
    ON capsule(openedAt DESC)
    WHERE status = 'opened';

    -- Index for image lookup by capsule
    CREATE INDEX IF NOT EXISTS idx_image_capsule
    ON capsule_image(capsuleId, orderIndex);

    -- Index for background timer check
    CREATE INDEX IF NOT EXISTS idx_capsule_pending_unlock
    ON capsule(unlockAt ASC)
    WHERE status = 'locked';
  `);

  console.log('[Database] Schema created: tables and indexes');
};

/**
 * Get current database version
 */
const getDatabaseVersion = async (db: SQLite.SQLiteDatabase): Promise<number> => {
  try {
    const result = await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version'
    );
    return result?.user_version ?? 0;
  } catch (error) {
    console.error('[Database] Failed to get version:', error);
    return 0;
  }
};

/**
 * Set database version
 */
const setDatabaseVersion = async (
  db: SQLite.SQLiteDatabase,
  version: number
): Promise<void> => {
  await db.execAsync(`PRAGMA user_version = ${version}`);
  console.log('[Database] Version set to:', version);
};

/**
 * Run database migrations
 */
const runMigrations = async (
  db: SQLite.SQLiteDatabase,
  fromVersion: number,
  toVersion: number
): Promise<void> => {
  console.log(`[Database] Running migrations from v${fromVersion} to v${toVersion}`);

  // Future migrations will be added here
  // Example:
  // if (fromVersion < 2) {
  //   await migrateToV2(db);
  // }
  // if (fromVersion < 3) {
  //   await migrateToV3(db);
  // }

  await setDatabaseVersion(db, toVersion);
};

/**
 * Close database connection
 * Note: Usually not needed unless app is shutting down
 */
export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
    console.log('[Database] Closed successfully');
  }
};

/**
 * Reset database (for development/testing only)
 * WARNING: This will delete all data
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.execAsync(`
      DROP TABLE IF EXISTS capsule_image;
      DROP TABLE IF EXISTS capsule;
      DROP INDEX IF EXISTS idx_capsule_unlock_status;
      DROP INDEX IF EXISTS idx_capsule_opened;
      DROP INDEX IF EXISTS idx_image_capsule;
      DROP INDEX IF EXISTS idx_capsule_pending_unlock;
    `);

    await setDatabaseVersion(db, 0);
    console.log('[Database] Reset completed');

    // Reinitialize
    await initializeDatabase();
  } catch (error) {
    console.error('[Database] Reset failed:', error);
    throw error;
  }
};
