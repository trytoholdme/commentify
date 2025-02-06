import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

// Initialize in a function to avoid top-level await
export async function initSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'x-my-custom-header': 'commentify'
      }
    }
  });

  return supabaseInstance;
}

// Export types
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];