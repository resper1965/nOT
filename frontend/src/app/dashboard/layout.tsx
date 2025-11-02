import { DashboardLayout as NewDashboardLayout } from '@/components/dashboard/dashboard-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ness. OT GRC - Dashboard',
  description: 'Governance, Risk & Compliance para redes OT do setor elétrico'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <NewDashboardLayout>
      {children}
    </NewDashboardLayout>
  );
}
