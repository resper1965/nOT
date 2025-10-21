import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // Redirect para overview
  redirect('/dashboard/overview');
}
