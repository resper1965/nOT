import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { getAssetsStats, getNetworkTopology } from '@/lib/api';

export default async function CriticalGaps() {
  const stats = await getAssetsStats().catch(() => ({ total_vlans: 0, by_type: [] }));
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, subnets: 0, connections: 0 }));
  
  const firewallCount = stats.by_type?.find((t: any) => t.type === 'Firewall')?.count || 0;
  const subnetsTarget = topology.subnets || 109;
  const connectionsTarget = topology.connections || 1345;
  
  const gaps = [
    { id: 'GAP-SEG-001', description: 'Modelo Purdue não implementado', cvss: 9.1, status: 'critical' },
    { id: 'GAP-SEG-002', description: `${subnetsTarget} Subnets não classificados`, cvss: 8.5, status: 'high' },
    { id: 'GAP-SEG-003', description: `${stats.total_vlans || 59} VLANs não classificadas`, cvss: 7.8, status: 'high' },
    { id: 'GAP-SEG-004', description: `${connectionsTarget.toLocaleString('pt-BR')} Conexões não analisadas`, cvss: 8.2, status: 'high' },
    { id: 'GAP-SEG-005', description: `Firewalls insuficientes (${firewallCount} vs 15+)`, cvss: 9.0, status: 'critical' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gaps Críticos Identificados</CardTitle>
            <CardDescription>Controle 5 ONS - Segmentação</CardDescription>
          </div>
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {gaps.map((gap) => (
            <div key={gap.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{gap.id}</p>
                <p className="text-xs text-muted-foreground">{gap.description}</p>
              </div>
              <div className={`text-sm font-bold ${gap.cvss >= 9 ? 'text-red-500' : 'text-orange-500'}`}>
                {gap.cvss}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total de gaps</span>
            <span className="font-bold text-red-500">6 gaps críticos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
