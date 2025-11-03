import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssetsStats, getNetworkTopology } from '@/lib/api';
import { Target, TrendingUp } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function NetworkSegmentation() {
  const stats = await getAssetsStats().catch(() => ({ total_vlans: 0, by_type: [] }));
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, subnets: 0, connections: 0 }));
  
  const firewallCount = stats.by_type?.find((t: any) => t.type?.toLowerCase().includes('firewall'))?.count || 0;
  
  // Calculate actual targets from data (use max of current or a reasonable minimum)
  const subnetsTarget = Math.max(topology.subnets || 0, 1);
  const vlansTarget = Math.max(stats.total_vlans || 0, 1);
  const connectionsTarget = Math.max(topology.connections || 0, 1);
  const firewallsTarget = Math.max(firewallCount, 6); // Minimum 6 for Purdue model

  const segmentData = [
    { 
      label: 'Subnets mapeados', 
      current: topology.subnets || 0, 
      target: subnetsTarget,
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'VLANs classificadas', 
      current: 0, 
      target: vlansTarget,
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Conexões analisadas', 
      current: 0, 
      target: connectionsTarget,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Firewalls implementados', 
      current: firewallCount, 
      target: firewallsTarget,
      icon: Target,
      color: 'from-red-500 to-orange-500'
    },
  ];

  const totalProgress = segmentData.reduce((acc, item) => acc + (item.current / item.target), 0) / segmentData.length * 100;
  const overallCompliance = Math.round(totalProgress);

  return (
    <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
      <CardHeader className='border-b border-border/50'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                <Target className='h-4 w-4 text-[#00ade8]' />
              </div>
              Progresso de Segmentação
            </CardTitle>
            <CardDescription className='mt-1.5'>
              Modelo Purdue - Controle 5 ONS • Compliance: {overallCompliance}%
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-6 py-6'>
        <div className='space-y-5'>
          {segmentData.map((item) => {
            const percentage = Math.min((item.current / item.target) * 100, 100);
            const Icon = item.icon;
            
            return (
              <div key={item.label} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Icon className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>{item.label}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold tabular-nums'>{item.current}</span>
                    <span className='text-xs text-muted-foreground'>/</span>
                    <span className='text-sm text-muted-foreground tabular-nums'>{item.target}</span>
                    <span className='ml-2 text-xs font-semibold text-muted-foreground'>
                      ({Math.round(percentage)}%)
                    </span>
                  </div>
                </div>
                <div className='relative h-3 w-full overflow-hidden rounded-full bg-muted'>
                  <div 
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 shadow-sm`}
                    style={{ width: `${percentage}%` }}
                  >
                    {/* Shine effect */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer' />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='mt-8 grid grid-cols-2 gap-4 rounded-lg border border-border/50 bg-muted/30 p-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-red-500'>{overallCompliance}%</div>
            <div className='mt-1 text-xs text-muted-foreground'>Compliance Geral</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-orange-500'>560h</div>
            <div className='mt-1 text-xs text-muted-foreground'>Esforço Estimado</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
