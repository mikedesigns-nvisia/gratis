import { supabase } from './supabase';
import { Entry } from '../storage/localStorage';
import { PostgrestError } from '@supabase/supabase-js';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys - duplicated from localStorage to avoid circular dependencies
const STORAGE_KEYS = {
  ENTRIES: 'gratis_entries',
};

// Helper functions to directly access AsyncStorage (avoiding circular dependencies)
const getLocalEntries = async (): Promise<Entry[]> => {
  try {
    const entriesJson = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Error getting entries from AsyncStorage:', error);
    return [];
  }
};

const saveLocalEntry = async (entry: Entry): Promise<void> => {
  try {
    // Get existing entries
    const existingEntries = await getLocalEntries();
    
    // Check if entry already exists (for updates)
    const entryIndex = existingEntries.findIndex(e => e.id === entry.id);
    
    if (entryIndex >= 0) {
      // Update existing entry
      existingEntries[entryIndex] = entry;
    } else {
      // Add new entry
      existingEntries.push(entry);
    }
    
    // Save entries back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.ENTRIES,
      JSON.stringify(existingEntries)
    );
  } catch (error) {
    console.error('Error saving entry to AsyncStorage:', error);
    throw error;
  }
};

// Type for Supabase Entry (matches database structure)
export interface SupabaseEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// Interface for sync result
interface SyncResult {
  success: boolean;
  error?: PostgrestError | Error | null;
  syncedEntries?: number;
}

/**
 * Converts a local Entry to Supabase format
 */
const toSupabaseEntry = (entry: Entry, userId: string): Omit<SupabaseEntry, 'created_at' | 'updated_at'> => {
  return {
    id: entry.id,
    user_id: userId,
    content: entry.content,
    date: entry.date,
  };
};

/**
 * Converts a Supabase Entry to local format
 */
const toLocalEntry = (entry: SupabaseEntry): Entry => {
  return {
    id: entry.id,
    content: entry.content,
    date: entry.date,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    syncedWithServer: true,
  };
};

/**
 * Check if network is connected
 */
const isNetworkConnected = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected === true;
};

/**
 * Fetch all entries for the current user from Supabase
 */
export const fetchEntriesFromSupabase = async (): Promise<Entry[]> => {
  if (!supabase.auth.getUser) {
    throw new Error('User not authenticated');
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch entries from Supabase
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching entries from Supabase:', error);
    throw error;
  }

  // Convert to local Entry format
  return (data as SupabaseEntry[]).map(toLocalEntry);
};

/**
 * Create or update an entry in Supabase
 */
export const saveEntryToSupabase = async (entry: Entry): Promise<Entry> => {
  if (!supabase.auth.getUser) {
    throw new Error('User not authenticated');
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Convert to Supabase format
  const supabaseEntry = toSupabaseEntry(entry, user.id);

  // Upsert entry in Supabase
  const { data, error } = await supabase
    .from('entries')
    .upsert(supabaseEntry)
    .select()
    .single();

  if (error) {
    console.error('Error saving entry to Supabase:', error);
    throw error;
  }

  // Convert back to local Entry format with syncedWithServer flag
  return {
    ...toLocalEntry(data as SupabaseEntry),
    syncedWithServer: true,
  };
};

/**
 * Delete an entry from Supabase
 */
export const deleteEntryFromSupabase = async (id: string): Promise<void> => {
  if (!supabase.auth.getUser) {
    throw new Error('User not authenticated');
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Delete entry from Supabase
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting entry from Supabase:', error);
    throw error;
  }
};

/**
 * Sync local entries with Supabase
 * This performs a two-way sync:
 * 1. Push local entries to Supabase
 * 2. Pull remote entries to local storage
 */
export const syncEntries = async (): Promise<SyncResult> => {
  try {
    // Check network connectivity
    const isConnected = await isNetworkConnected();
    if (!isConnected) {
      return { 
        success: false, 
        error: new Error('No network connection') 
      };
    }

    if (!supabase.auth.getUser) {
      return { 
        success: false, 
        error: new Error('User not authenticated') 
      };
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { 
        success: false, 
        error: new Error('User not authenticated') 
      };
    }

    // 1. Get all local entries
    const localEntries = await getLocalEntries();
    
    // 2. Get all remote entries
    const { data: remoteEntries, error: fetchError } = await supabase
      .from('entries')
      .select('*')
      .order('updated_at', { ascending: false });

    if (fetchError) {
      return { 
        success: false, 
        error: fetchError 
      };
    }

    // 3. Push local entries that need syncing to Supabase
    const entriesToSync = localEntries.filter(entry => !entry.syncedWithServer);
    
    for (const entry of entriesToSync) {
      const supabaseEntry = toSupabaseEntry(entry, user.id);
      
      const { error: upsertError } = await supabase
        .from('entries')
        .upsert(supabaseEntry);
      
      if (upsertError) {
        console.error('Error syncing entry to Supabase:', upsertError);
        // Continue with next entry despite error
      } else {
        // Update local entry to mark as synced
        await saveLocalEntry({
          ...entry,
          syncedWithServer: true,
        });
      }
    }

    // 4. Pull remote entries that don't exist locally or have newer updates
    if (remoteEntries) {
      const remoteEntriesMapped = (remoteEntries as SupabaseEntry[]).map(toLocalEntry);
      
      for (const remoteEntry of remoteEntriesMapped) {
        const localEntry = localEntries.find(e => e.id === remoteEntry.id);
        
        // If entry doesn't exist locally or remote is newer, save it locally
        if (!localEntry || new Date(remoteEntry.updatedAt) > new Date(localEntry.updatedAt)) {
          await saveLocalEntry({
            ...remoteEntry,
            syncedWithServer: true,
          });
        }
      }
    }

    return { 
      success: true, 
      syncedEntries: entriesToSync.length + (remoteEntries?.length || 0)
    };
  } catch (error) {
    console.error('Error during sync:', error);
    return { 
      success: false, 
      error: error as Error 
    };
  }
};

// Setup background sync (simplified)
let syncInterval: ReturnType<typeof setInterval> | null = null;

export const startBackgroundSync = (intervalMs = 30000): void => {
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  // Start new interval
  syncInterval = setInterval(async () => {
    try {
      // Only attempt sync if user is authenticated
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await syncEntries();
      }
    } catch (error) {
      console.error('Background sync error:', error);
    }
  }, intervalMs);
};

export const stopBackgroundSync = (): void => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};
