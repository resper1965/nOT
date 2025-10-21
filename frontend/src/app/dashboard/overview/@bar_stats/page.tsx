import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssetsStats } from '@/lib/api';

export default async function NetworkDistribution() {
  const stats = await getAssetsStats().catch(() => ({ by_type: [], total_assets: 0 }));
  
  // Map device types from API with colors
  const colorMap: Record<string, string> = {
    'Router': 'bg-orange-500',
    'Switch': 'bg-blue-500',
    'Server': 'bg-green-500',
    'Mainframe': 'bg-purple-500',
    'VoIP Device': 'bg-cyan-500',
    'Firewall': 'bg-red-500',
    'Network Device': 'bg-gray-500',
    'Ethernet': 'bg-yellow-500',
    'Hub': 'bg-pink-500',
  };
  
  const deviceTypes = stats.by_type?.slice(0, 10).map((item: any) => ({
    name: item.type,
    count: item.count,
    color: colorMap[item.type] || 'bg-gray-500'
  })) || [];

  const total = stats.total_assets || 0;
  const maxCount = Math.max(...deviceTypes.map(d => d.count), 1);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Distribuição de Assets TBE</CardTitle>
          <CardDescription>
            {total.toLocaleString('pt-BR')} ativos reais importados
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="flex aspect-auto h-[280px] w-full items-end justify-around gap-2 pt-8">
          {deviceTypes.map((device) => (
            <div key={device.name} className="flex flex-col items-center gap-2 flex-1">
              <div className="text-xs font-semibold text-foreground">{device.count.toLocaleString('pt-BR')}</div>
              <div 
                className={`w-full ${device.color} rounded-t transition-all hover:opacity-80`}
                style={{ height: `${(device.count / maxCount) * 100}%` }}
              ></div>
              <div className="text-xs text-muted-foreground rotate-45 origin-top-left whitespace-nowrap">
                {device.name}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-brand-cyan font-medium">
          ✓ Dados reais da rede TBE - {deviceTypes.length} tipos de dispositivos
        </div>
      </CardContent>
    </Card>
  );
}
