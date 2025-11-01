// Server-side Supabase client utilities
// For authenticated user operations (uses user's session via cookies)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getServerSupabaseClient() {
  const cookieStore = await cookies();

  // Use ANON_KEY for authenticated operations (respects RLS)
  // SERVICE_ROLE_KEY is only for admin operations in api-supabase.ts
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get admin Supabase client (uses SERVICE_ROLE_KEY)
 * WARNING: This bypasses Row Level Security (RLS)
 * Only use for admin operations that need to bypass RLS
 */
export async function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin operations');
  }
  
  const { createClient } = await import('@supabase/supabase-js');
  
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

export async function getServerUser() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

