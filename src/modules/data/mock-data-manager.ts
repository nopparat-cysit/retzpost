/**
 * RETZPOST MOCK DATA & CLEAN STATE MANAGER
 * 
 * Controls whether the application operates in a Clean State (Zero Data / Production Ready)
 * or Demo Mode (Pre-populated sample dispatches, calendar events, queue jobs, and channels).
 * 
 * Default: Cleared (Zero State) as requested by user.
 */

export const MOCK_CLEARED_STORAGE_KEY = 'retzpost_mock_cleared';
export const MOCK_DATA_CHANGE_EVENT = 'retzpost:mock-data-change';

let inMemoryCleared = true;

/**
 * Check if mock data is currently cleared (Default: true)
 */
export function isMockDataCleared(): boolean {
  if (typeof window === 'undefined') return inMemoryCleared;
  try {
    const val = window.localStorage.getItem(MOCK_CLEARED_STORAGE_KEY);
    // If not set yet, default to inMemoryCleared (Clean / Zero state)
    if (val === null) {
      window.localStorage.setItem(MOCK_CLEARED_STORAGE_KEY, inMemoryCleared ? 'true' : 'false');
      return inMemoryCleared;
    }
    return val === 'true';
  } catch {
    return inMemoryCleared;
  }
}

/**
 * Set mock data state and broadcast change to all pages
 */
export function setMockDataCleared(cleared: boolean): void {
  inMemoryCleared = cleared;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(MOCK_CLEARED_STORAGE_KEY, cleared ? 'true' : 'false');
      window.dispatchEvent(
        new CustomEvent(MOCK_DATA_CHANGE_EVENT, { detail: { cleared } })
      );
    } catch (err) {
      console.error('Failed to set mock data state:', err);
    }
  }
}

/**
 * Clear all mock data (Reset to Zero State)
 */
export function clearAllMockData(): void {
  setMockDataCleared(true);
}

/**
 * Load demo sample data for preview
 */
export function loadSampleMockData(): void {
  setMockDataCleared(false);
}

/**
 * Subscribe to mock data toggle events
 */
export function subscribeToMockDataChange(
  callback: (cleared: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const custom = event as CustomEvent<{ cleared: boolean }>;
    if (custom.detail !== undefined) {
      callback(custom.detail.cleared);
    } else {
      callback(isMockDataCleared());
    }
  };

  window.addEventListener(MOCK_DATA_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener(MOCK_DATA_CHANGE_EVENT, handler);
  };
}
