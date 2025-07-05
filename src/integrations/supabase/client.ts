import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrlFromEnv = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKeyFromEnv = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrlFromEnv) {
  console.error(
    'CRITICAL_CONFIG_ERROR: VITE_SUPABASE_URL is not defined in your .env file. Client-side Supabase calls will fail.'
  );
}
if (!supabaseAnonKeyFromEnv) {
  console.error(
    'CRITICAL_CONFIG_ERROR: VITE_SUPABASE_ANON_KEY is not defined in your .env file. Client-side Supabase calls will fail.'
  );
}

// It's good practice to type the client, though `any` is used here if Database types are complex or cause issues initially.
// Ideally, replace `any` with `Database` once everything is stable.
let supabaseInstance: SupabaseClient<Database>;

if (supabaseUrlFromEnv && supabaseAnonKeyFromEnv) {
  supabaseInstance = createClient<Database>(supabaseUrlFromEnv, supabaseAnonKeyFromEnv, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} else {
  // Fallback to a dummy client if env vars are missing to prevent crashes,
  // though operations will fail. Errors are already logged above.
  console.error("Supabase client could not be initialized due to missing environment variables. Using a non-functional dummy client.");
  supabaseInstance = {
    from: () => {
      throw new Error('Supabase client is not initialized. Check environment variables.');
    },
    // Add other methods as needed to satisfy type checks if you don't want to use `any`
  } as any; // Cast to `any` to simplify dummy object, or properly type a dummy.
}

export const supabase = supabaseInstance;