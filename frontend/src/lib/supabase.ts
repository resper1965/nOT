// Supabase client configuration for ness. OT GRC
// Optimized based on ness-theme framework
// Supports both client-side and server-side rendering

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

// Supabase connection configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey)) {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️ Supabase environment variables not configured. ' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client for browser/client-side usage
// Optimized configuration with better defaults
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Enhanced security with PKCE flow
  },
  db: {
    schema: 'public', // Default schema, can be overridden per query
  },
  global: {
    headers: {
      'x-client-info': 'ness-ot-grc@1.0.0',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Server-side Supabase client (for use in API routes and Server Components)
// Optimized for server-side rendering
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
    global: {
      headers: {
        'x-client-info': 'ness-ot-grc-server@1.0.0',
      },
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

// Type-safe database helper
export type SupabaseClient = SupabaseClientType<any>;

// Helper for common queries
export const supabaseHelpers = {
  /**
   * Safe error handling for Supabase queries
   */
  handleError(error: any, context: string) {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(`[Supabase ${context}]`, error.message || error);
      throw new Error(error.message || `Failed to ${context}`);
    }
  },
  
  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return false;
    return !!user;
  },
};

