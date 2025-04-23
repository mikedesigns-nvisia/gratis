import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// Supabase URL and anon key
const supabaseUrl = 'https://qfngomisykdiyhsznzts.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbmdvbWlzeWtkaXloc3puenRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTkyMjQsImV4cCI6MjA2MDQ5NTIyNH0.ADvCDlEC7No99xfOXdLz-LGxo-yORK0wT4JrItQgnFg';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
