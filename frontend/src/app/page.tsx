import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  
  // Se autenticado, vai para dashboard
  // Se não, vai para login
  if (userId) {
    redirect('/dashboard');
  } else {
    redirect('/sign-in');
  }
}
