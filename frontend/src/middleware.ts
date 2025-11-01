// ness. OT GRC - Authentication Middleware
// Suporte para Clerk (opcional) e Supabase

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define rotas públicas (landing page + autenticação)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
]);

// Verifica se o Clerk está configurado
const isClerkConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.CLERK_SECRET_KEY
  );
};

// Middleware condicional: usa Clerk se configurado, senão permite acesso público
export default async function middleware(request: NextRequest) {
  // Se Clerk estiver configurado, usa o middleware do Clerk
  if (isClerkConfigured()) {
    return clerkMiddleware(async (auth) => {
      // Protege todas as rotas exceto as públicas
      if (!isPublicRoute(request)) {
        try {
          await auth.protect();
        } catch (error) {
          // Se houver erro na proteção, permite acesso (modo keyless)
          console.error('Clerk protection error:', error);
        }
      }
    })(request);
  }

  // Se Clerk não estiver configurado, permite acesso a todas as rotas
  // (aplicação funcionará com Supabase ou sem autenticação)
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Para rotas protegidas sem Clerk, você pode implementar verificação Supabase aqui
  // Por enquanto, permite acesso (pode ser protegido no nível de página/componente)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
