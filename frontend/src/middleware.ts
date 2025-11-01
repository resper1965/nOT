// ness. OT GRC - Authentication Middleware com Supabase
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define rotas públicas (landing page + autenticação)
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/auth(.*)',
  '/api(.*)',
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '');
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });
}

export async function middleware(request: NextRequest) {
  // Permitir acesso a rotas públicas
  if (isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  // Criar cliente Supabase para verificar autenticação
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Verificar autenticação do usuário
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Debug: Log para entender o que está acontecendo
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 [MIDDLEWARE DEBUG]', {
      pathname: request.nextUrl.pathname,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError ? {
        message: authError.message,
        status: authError.status,
      } : null,
      cookies: {
        hasSbCookie: request.cookies.toString().includes('sb-'),
        cookieNames: request.cookies.getAll().map(c => c.name),
      },
    });
  }

  // Se não estiver autenticado, redirecionar para sign-in
  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ [MIDDLEWARE DEBUG] Usuário não autenticado, redirecionando para /sign-in');
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/sign-in';
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ [MIDDLEWARE DEBUG] Usuário autenticado, permitindo acesso');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
