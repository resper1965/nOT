import { redirect } from 'next/navigation';

export default async function Overview() {
  redirect('/dashboard/overview');
}

