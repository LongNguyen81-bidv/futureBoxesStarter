/**
 * Mock for expo-file-system
 */

const mockFileSystem: Record<string, string> = {};

export const documentDirectory = 'file:///mock/document/';
export const cacheDirectory = 'file:///mock/cache/';

export const copyAsync = jest.fn((options: { from: string; to: string }) => {
  mockFileSystem[options.to] = mockFileSystem[options.from] || 'mock-file-content';
  return Promise.resolve();
});

export const deleteAsync = jest.fn((fileUri: string, options?: any) => {
  delete mockFileSystem[fileUri];
  return Promise.resolve();
});

export const getInfoAsync = jest.fn((fileUri: string) => {
  const exists = fileUri in mockFileSystem;
  return Promise.resolve({
    exists,
    uri: fileUri,
    size: exists ? 1024 : 0,
    isDirectory: false,
    modificationTime: Date.now(),
  });
});

export const makeDirectoryAsync = jest.fn((fileUri: string, options?: any) => {
  mockFileSystem[fileUri] = 'directory';
  return Promise.resolve();
});

export const readAsStringAsync = jest.fn((fileUri: string) => {
  return Promise.resolve(mockFileSystem[fileUri] || '');
});

export const writeAsStringAsync = jest.fn((fileUri: string, contents: string) => {
  mockFileSystem[fileUri] = contents;
  return Promise.resolve();
});

export const readDirectoryAsync = jest.fn((fileUri: string) => {
  return Promise.resolve([]);
});

// Helper to reset file system
export const __reset = () => {
  Object.keys(mockFileSystem).forEach((key) => delete mockFileSystem[key]);
};

// Helper to set mock files
export const __setMockFile = (path: string, content: string) => {
  mockFileSystem[path] = content;
};
