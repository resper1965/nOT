// Supabase client configuration for ness. OT GRC
// Supports both client-side and server-side rendering

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase connection configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    '⚠️ Supabase environment variables not configured. ' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client for browser/client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public', // Default schema, can be overridden per query
  },
  global: {
    headers: {
      'x-client-info': 'ness-ot-grc@1.0.0',
    },
  },
});

// Server-side Supabase client (for use in API routes and Server Components)
export function createServerClient() {
  // Use dynamic import to avoid client-side bundling
  if (typeof window !== 'undefined') {
    return supabase; // Return client-side client
  }

  // Server-side: use environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
  });
}

// Helper function to get Supabase client based on context
export function getSupabaseClient() {
  // Server-side
  if (typeof window === 'undefined') {
    return createServerClient();
  }
  // Client-side
  return supabase;
}

// Database helper types
export type SupabaseClient = ReturnType<typeof createClient>;

