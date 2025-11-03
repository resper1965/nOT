import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssetsStats } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function NetworkDistribution() {
  const stats = await getAssetsStats().catch(() => ({ by_type: [], total_assets: 0 }));
  
  // Map device types from API with modern gradient colors
  const colorMap: Record<string, { gradient: string; bg: string }> = {
    'Router': { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500' },
    'Switch': { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500' },
    'Server': { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500' },
    'Mainframe': { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500' },
    'VoIP Device': { gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500' },
    'Firewall': { gradient: 'from-red-500 to-orange-500', bg: 'bg-red-500' },
    'Network Device': { gradient: 'from-gray-500 to-slate-500', bg: 'bg-gray-500' },
    'Ethernet': { gradient: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-500' },
    'Hub': { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-500' },
    'Modem': { gradient: 'from-teal-500 to-green-500', bg: 'bg-teal-500' },
  };
  
  // Filter and map data
  const deviceTypes = stats.by_type?.slice(0, 10).map((item: any) => ({
    name: item.type,
    count: item.count,
    color: colorMap[item.type] || { gradient: 'from-gray-500 to-slate-500', bg: 'bg-gray-500' }
  })) || [];

  const total = stats.total_assets || 0;
  const maxCount = Math.max(...deviceTypes.map((d: any) => d.count), 1);
  
  // Enhanced logarithmic scale for better visualization
  const getLogarithmicHeight = (count: number, maxCount: number) => {
    if (count === 0) return 0;
    const logValue = Math.log10(count + 1);
    const logMax = Math.log10(maxCount + 1);
    const normalized = (logValue / logMax) * 85; // 85% do espaço
    return Math.max(normalized, 15); // Mínimo 15% para visibilidade
  };

  return (
    <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
      <CardHeader className='border-b border-border/50'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                <TrendingUp className='h-4 w-4 text-[#00ade8]' />
              </div>
              Distribuição de Assets
            </CardTitle>
            <CardDescription className='mt-1.5'>
              {total.toLocaleString('pt-BR')} ativos importados • Escala logarítmica
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-6 py-6'>
        <div className='flex aspect-auto h-[280px] w-full items-end justify-around gap-2 pt-8'>
          {deviceTypes.map((device: any) => {
            const height = getLogarithmicHeight(device.count, maxCount);
            const percentage = ((device.count / total) * 100).toFixed(1);
            
            return (
              <div key={device.name} className='group relative flex flex-1 min-w-0 flex-col items-center gap-2'>
                <div className='text-xs font-bold text-foreground text-center'>
                  {device.count.toLocaleString('pt-BR')}
                </div>
                <div className='text-[10px] text-muted-foreground text-center'>
                  {percentage}%
                </div>
                <div 
                  className={`relative w-full rounded-t-lg bg-gradient-to-t ${device.color.gradient} transition-all hover:scale-105 hover:opacity-90 cursor-pointer shadow-lg`}
                  style={{ 
                    height: `${height}%`,
                    minHeight: '20px'
                  }}
                  title={`${device.name}: ${device.count.toLocaleString('pt-BR')} (${percentage}%)`}
                >
                  {/* Shine effect on hover */}
                  <div className='absolute inset-0 rounded-t-lg bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                </div>
                <div className='text-[10px] text-muted-foreground text-center leading-tight'>
                  {device.name.replace('Network ', 'Net.')}
                </div>
              </div>
            );
          })}
        </div>
        <div className='mt-6 text-center text-xs text-[#00ade8] font-medium'>
          ✓ Dados reais da rede • {deviceTypes.length} tipos • Escala logarítmica otimizada
        </div>
      </CardContent>
    </Card>
  );
}
