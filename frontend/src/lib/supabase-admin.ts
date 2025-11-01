// Admin Supabase client using SERVICE_ROLE_KEY
// WARNING: This bypasses Row Level Security (RLS)
// Only use for admin operations that need elevated privileges

import { createClient } from '@supabase/supabase-js';

/**
 * Get admin Supabase client with SERVICE_ROLE_KEY
 * WARNING: Bypasses RLS - use only for admin operations
 * 
 * This should ONLY be used in:
 * - API routes (Server-side)
 * - Server Components that need admin access
 * - Server Actions that need to bypass RLS
 * 
 * NEVER expose SERVICE_ROLE_KEY in client-side code!
 */
export function getAdminSupabaseClient() {
  // Only works server-side
  if (typeof window !== 'undefined') {
    throw new Error('Admin client cannot be used in client-side code');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin credentials: ' +
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      // Service role bypasses RLS
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'ness-ot-grc-admin@1.0.0',
      },
    },
  });
}

