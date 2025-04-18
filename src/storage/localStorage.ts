import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom UUID generator for React Native environments without crypto
export const generateUUID = (): string => {
  // Simple implementation that works without crypto
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Entry type definition
export interface Entry {
  id: string;
  content: string;
  date: string; // ISO string format
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  syncedWithServer: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  ENTRIES: 'gratis_entries',
  USER_SETTINGS: 'gratis_user_settings',
};

/**
 * Saves a gratitude entry to local storage
 */
export const saveEntry = async (entry: Entry): Promise<void> => {
  try {
    // Get existing entries
    const existingEntries = await getEntries();
    
    // Check if entry already exists (for updates)
    const entryIndex = existingEntries.findIndex(e => e.id === entry.id);
    
    if (entryIndex >= 0) {
      // Update existing entry
      existingEntries[entryIndex] = {
        ...entry,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new entry
      existingEntries.push({
        ...entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    // Save entries back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.ENTRIES,
      JSON.stringify(existingEntries)
    );
  } catch (error) {
    console.error('Error saving entry:', error);
    throw error;
  }
};

/**
 * Gets all gratitude entries from local storage
 */
export const getEntries = async (): Promise<Entry[]> => {
  try {
    const entriesJson = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Error getting entries:', error);
    return [];
  }
};

/**
 * Gets a single entry by ID
 */
export const getEntryById = async (id: string): Promise<Entry | null> => {
  try {
    const entries = await getEntries();
    return entries.find(entry => entry.id === id) || null;
  } catch (error) {
    console.error('Error getting entry by id:', error);
    return null;
  }
};

/**
 * Deletes an entry from local storage
 */
export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const entries = await getEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.ENTRIES,
      JSON.stringify(filteredEntries)
    );
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};

/**
 * Gets entries for a specific month
 */
export const getEntriesByMonth = async (month: number, year: number): Promise<Entry[]> => {
  try {
    const entries = await getEntries();
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === month && entryDate.getFullYear() === year;
    });
  } catch (error) {
    console.error('Error getting entries by month:', error);
    return [];
  }
};

// User settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  notificationTime?: string;
}

// Default user settings
const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  notifications: true,
  notificationTime: '20:00', // 8 PM
};

/**
 * Gets user settings from local storage
 */
export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return settingsJson ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Saves user settings to local storage
 */
export const saveUserSettings = async (settings: Partial<UserSettings>): Promise<void> => {
  try {
    const currentSettings = await getUserSettings();
    const newSettings = { ...currentSettings, ...settings };
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_SETTINGS,
      JSON.stringify(newSettings)
    );
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};
