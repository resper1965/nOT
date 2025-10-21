import { redirect } from 'next/navigation';

export default async function Page() {
  // Redirect to dashboard (sem auth por enquanto)
  redirect('/dashboard');
}
