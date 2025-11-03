import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { getAssetsStats, getNetworkTopology } from '@/lib/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CriticalGaps() {
  const stats = await getAssetsStats().catch(() => ({ total_vlans: 0, by_type: [] }));
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, subnets: 0, connections: 0 }));
  
  const firewallCount = stats.by_type?.find((t: any) => t.type?.toLowerCase().includes('firewall'))?.count || 0;
  const subnetsTarget = topology.subnets || 0;
  const connectionsTarget = topology.connections || 0;
  
  const gaps = [
    { 
      id: 'GAP-SEG-001', 
      description: 'Modelo Purdue não implementado', 
      cvss: 9.1, 
      status: 'critical',
      effort: '300h'
    },
    { 
      id: 'GAP-SEG-002', 
      description: `${subnetsTarget} Subnets não classificados`, 
      cvss: 8.5, 
      status: 'high',
      effort: '80h'
    },
    { 
      id: 'GAP-SEG-003', 
      description: `${stats.total_vlans || 0} VLANs não classificadas`, 
      cvss: 7.8, 
      status: 'high',
      effort: '40h'
    },
    { 
      id: 'GAP-SEG-004', 
      description: `${connectionsTarget.toLocaleString('pt-BR')} Conexões não analisadas`, 
      cvss: 8.2, 
      status: 'high',
      effort: '60h'
    },
    { 
      id: 'GAP-SEG-005', 
      description: `Firewalls insuficientes (${firewallCount} vs 15+)`, 
      cvss: 9.0, 
      status: 'critical',
      effort: '40h'
    },
  ];

  const criticalCount = gaps.filter(g => g.status === 'critical').length;
  const highCount = gaps.filter(g => g.status === 'high').length;

  return (
    <Card className='border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background'>
      <CardHeader className='border-b border-border/50'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <div className='rounded-lg bg-orange-500/10 p-1.5'>
                <AlertTriangle className='h-4 w-4 text-orange-500' />
              </div>
              Gaps Críticos Identificados
            </CardTitle>
            <CardDescription className='mt-1.5'>
              Controle 5 ONS - Segmentação • CVSS médio: 8.5
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-6'>
        <div className='space-y-3'>
          {gaps.slice(0, 5).map((gap) => (
            <div 
              key={gap.id} 
              className='group relative flex items-start justify-between gap-4 rounded-lg border border-border/50 bg-muted/30 p-3 transition-all hover:border-orange-500/30 hover:bg-muted/50'
            >
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-mono font-semibold text-orange-500'>{gap.id}</span>
                  <span className={`inline-flex h-5 items-center rounded px-1.5 text-[10px] font-semibold ${
                    gap.status === 'critical' 
                      ? 'bg-red-500/20 text-red-500' 
                      : 'bg-orange-500/20 text-orange-500'
                  }`}>
                    {gap.status === 'critical' ? 'Crítico' : 'Alto'}
                  </span>
                </div>
                <p className='text-sm font-medium leading-snug'>{gap.description}</p>
                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <TrendingUp className='h-3 w-3' />
                    {gap.effort}
                  </span>
                </div>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg font-bold ${
                gap.cvss >= 9 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'bg-orange-500/20 text-orange-500'
              }`}>
                {gap.cvss}
              </div>
            </div>
          ))}
        </div>
        <div className='mt-6 flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Resumo</p>
            <p className='text-xs text-muted-foreground'>{gaps.length} gaps identificados</p>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-center'>
              <div className='text-lg font-bold text-red-500'>{criticalCount}</div>
              <div className='text-[10px] text-muted-foreground'>Críticos</div>
            </div>
            <div className='h-8 w-px bg-border' />
            <div className='text-center'>
              <div className='text-lg font-bold text-orange-500'>{highCount}</div>
              <div className='text-[10px] text-muted-foreground'>Altos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
