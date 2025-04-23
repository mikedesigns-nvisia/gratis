import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { saveEntryToSupabase, syncEntries, deleteEntryFromSupabase } from '../services/supabaseStorage';

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
 * Checks if the user is currently authenticated
 */
const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

/**
 * Saves a gratitude entry to local storage and syncs with Supabase if possible
 */
export const saveEntry = async (entry: Entry): Promise<void> => {
  try {
    // Get existing entries
    const existingEntries = await getEntries();
    
    // Check if entry already exists (for updates)
    const entryIndex = existingEntries.findIndex(e => e.id === entry.id);
    
    const now = new Date().toISOString();
    let entryToSave: Entry;
    
    if (entryIndex >= 0) {
      // Update existing entry
      entryToSave = {
        ...entry,
        updatedAt: now,
        // Preserve syncedWithServer status if it's explicitly set in the entry
        syncedWithServer: entry.syncedWithServer !== undefined ? entry.syncedWithServer : false,
      };
      existingEntries[entryIndex] = entryToSave;
    } else {
      // Add new entry
      entryToSave = {
        ...entry,
        createdAt: now,
        updatedAt: now,
        // New entries aren't synced by default unless explicitly set
        syncedWithServer: entry.syncedWithServer !== undefined ? entry.syncedWithServer : false,
      };
      existingEntries.push(entryToSave);
    }
    
    // Save entries back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.ENTRIES,
      JSON.stringify(existingEntries)
    );
    
    // Try to sync with Supabase if authenticated
    try {
      const authenticated = await isAuthenticated();
      if (authenticated && !entryToSave.syncedWithServer) {
        // Attempt to save to Supabase
        await saveEntryToSupabase(entryToSave);
        
        // Update the entry to mark as synced
        entryToSave.syncedWithServer = true;
        
        // Save the updated entry back to local storage
        const updatedEntries = existingEntries.map(e => 
          e.id === entryToSave.id ? entryToSave : e
        );
        
        await AsyncStorage.setItem(
          STORAGE_KEYS.ENTRIES,
          JSON.stringify(updatedEntries)
        );
      }
    } catch (syncError) {
      // Log the error but don't fail the save operation
      console.warn('Failed to sync entry with Supabase:', syncError);
    }
  } catch (error) {
    console.error('Error saving entry:', error);
    throw error;
  }
};

/**
 * Gets all gratitude entries from local storage
 * Can optionally sync with Supabase first
 */
export const getEntries = async (syncWithServer = false): Promise<Entry[]> => {
  try {
    // If syncWithServer is true and user is authenticated, sync first
    if (syncWithServer) {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          await syncEntries();
        }
      } catch (syncError) {
        console.warn('Failed to sync entries with Supabase:', syncError);
      }
    }
    
    // Get entries from local storage
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
 * Deletes an entry from local storage and from Supabase if authenticated
 */
export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const entries = await getEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.ENTRIES,
      JSON.stringify(filteredEntries)
    );
    
    // Try to delete from Supabase if authenticated
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        await deleteEntryFromSupabase(id);
      }
    } catch (syncError) {
      // Log the error but don't fail the delete operation
      console.warn('Failed to delete entry from Supabase:', syncError);
    }
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
    // First sync with server if authenticated
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        await syncEntries();
      }
    } catch (syncError) {
      console.warn('Failed to sync entries with Supabase:', syncError);
    }
    
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
