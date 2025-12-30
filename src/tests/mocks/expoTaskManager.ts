/**
 * Mock for expo-task-manager
 */

const registeredTasks: Map<string, any> = new Map();

export const defineTask = jest.fn((taskName: string, task: any) => {
  registeredTasks.set(taskName, task);
});

export const isTaskRegisteredAsync = jest.fn((taskName: string) => {
  return Promise.resolve(registeredTasks.has(taskName));
});

export const unregisterTaskAsync = jest.fn((taskName: string) => {
  registeredTasks.delete(taskName);
  return Promise.resolve();
});

export const unregisterAllTasksAsync = jest.fn(() => {
  registeredTasks.clear();
  return Promise.resolve();
});

export const getRegisteredTasksAsync = jest.fn(() => {
  return Promise.resolve(Array.from(registeredTasks.keys()));
});

// Helper to reset tasks
export const __reset = () => {
  registeredTasks.clear();
};
