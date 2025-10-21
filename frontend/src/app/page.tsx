import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LandingContent from '@/components/landing/landing-content';

export default async function LandingPage() {
  const { userId } = await auth();
  
  // Se já autenticado, redireciona para dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return <LandingContent />;
}
