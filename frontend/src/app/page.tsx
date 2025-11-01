import { redirect } from 'next/navigation';
import LandingContent from '@/components/landing/landing-content';
import { getServerUser } from '@/lib/supabase-server';

export default async function LandingPage() {
  const user = await getServerUser();
  
  // Se já autenticado, redireciona para dashboard
  if (user) {
    redirect('/dashboard');
  }

  return <LandingContent />;
}
