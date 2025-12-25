/**
 * useDatabase Hook
 * React hook for database initialization and status
 *
 * Features:
 * - Initialize database on app start
 * - Provide database status (loading, ready, error)
 * - Initialize file system
 * - Handle errors gracefully
 */

import { useEffect, useState } from 'react';
import { initializeDatabase } from '../database/database';
import { initializeImagesDirectory } from '../services/fileService';

export type DatabaseStatus = 'loading' | 'ready' | 'error';

interface UseDatabaseResult {
  status: DatabaseStatus;
  error: Error | null;
  isReady: boolean;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook to initialize and monitor database status
 */
export const useDatabase = (): UseDatabaseResult => {
  const [status, setStatus] = useState<DatabaseStatus>('loading');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log('[useDatabase] Initializing database...');

        // Initialize database
        await initializeDatabase();

        // Initialize file system
        await initializeImagesDirectory();

        if (mounted) {
          setStatus('ready');
          setError(null);
          console.log('[useDatabase] Database ready');
        }
      } catch (err) {
        console.error('[useDatabase] Initialization failed:', err);

        if (mounted) {
          setStatus('error');
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    status,
    error,
    isReady: status === 'ready',
    isLoading: status === 'loading',
    isError: status === 'error',
  };
};

/**
 * Hook version that throws error for Suspense-like usage
 */
export const useDatabaseStrict = (): void => {
  const { status, error } = useDatabase();

  if (status === 'loading') {
    throw new Promise(() => {}); // Suspend
  }

  if (status === 'error') {
    throw error || new Error('Database initialization failed');
  }
};
