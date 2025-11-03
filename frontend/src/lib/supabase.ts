// Supabase client configuration for ness. OT GRC
// Optimized based on ness-theme framework
// Supports both client-side and server-side rendering
// IMPORTANTE: Usa @supabase/ssr para garantir cookies HTTP (compatível com middleware)

import { createBrowserClient } from '@supabase/ssr';
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
// Usa createBrowserClient do @supabase/ssr para garantir cookies HTTP
// Isso permite que o middleware leia a sessão corretamente
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    getAll() {
      return document.cookie.split(';').map((cookie) => {
        const [name, value] = cookie.trim().split('=');
        return { name, value };
      });
    },
    set(name: string, value: string, options?: { path?: string; domain?: string; maxAge?: number; sameSite?: string; secure?: boolean }) {
      let cookieString = `${name}=${value}`;
      if (options?.path) cookieString += `; path=${options.path}`;
      if (options?.domain) cookieString += `; domain=${options.domain}`;
      if (options?.maxAge !== undefined) cookieString += `; max-age=${options.maxAge}`;
      if (options?.sameSite) cookieString += `; samesite=${options.sameSite}`;
      if (options?.secure) cookieString += `; secure`;
      document.cookie = cookieString;
    },
    remove(name: string, options?: { path?: string; domain?: string }) {
      let cookieString = `${name}=; max-age=0`;
      if (options?.path) cookieString += `; path=${options.path}`;
      if (options?.domain) cookieString += `; domain=${options.domain}`;
      document.cookie = cookieString;
    },
  },
});

// Server-side Supabase client (for use in API routes and Server Components)
// Optimized for server-side rendering
// Uses SERVICE_ROLE_KEY for elevated privileges (bypasses RLS)
export function createServerClient() {
  // Use dynamic import to avoid client-side bundling
  if (typeof window !== 'undefined') {
    return supabase; // Return client-side client
  }

  // Server-side: use SERVICE_ROLE_KEY for elevated privileges
  // WARNING: SERVICE_ROLE_KEY bypasses Row Level Security (RLS)
  // Only use for server-side operations that need admin access
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Use SERVICE_ROLE_KEY if available, otherwise fallback to anon key
  const key = serviceRoleKey || anonKey;
  
  if (!key) {
    throw new Error('Missing Supabase credentials: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      // Service role key bypasses RLS - use with caution
      flowType: 'pkce',
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
