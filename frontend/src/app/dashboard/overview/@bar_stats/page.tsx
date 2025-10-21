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
    'Modem': 'bg-teal-500',
  };
  
  // Filtra e mapeia dados
  const deviceTypes = stats.by_type?.slice(0, 10).map((item: any) => ({
    name: item.type,
    count: item.count,
    color: colorMap[item.type] || 'bg-gray-500'
  })) || [];

  const total = stats.total_assets || 0;
  
  // Usa escala proporcional com altura mínima
  const maxCount = Math.max(...deviceTypes.map(d => d.count), 1);
  
  const getProportionalHeight = (count: number, maxCount: number) => {
    if (count === 0) return 0;
    // Altura mínima de 8% para garantir visibilidade
    const proportional = (count / maxCount) * 92; // 92% do espaço disponível
    return Math.max(proportional, 8); // Mínimo 8%
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Distribuição de Assets</CardTitle>
          <CardDescription>
            {total.toLocaleString('pt-BR')} ativos importados • Escala proporcional
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="flex aspect-auto h-[280px] w-full items-end justify-around gap-1 pt-8">
          {deviceTypes.map((device) => {
            const height = getProportionalHeight(device.count, maxCount);
            const percentage = ((device.count / total) * 100).toFixed(1);
            
            return (
              <div key={device.name} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="text-xs font-bold text-foreground text-center">
                  {device.count.toLocaleString('pt-BR')}
                </div>
                <div className="text-[10px] text-muted-foreground text-center">
                  {percentage}%
                </div>
                <div 
                  className={`w-full ${device.color} rounded-t transition-all hover:opacity-80 hover:scale-105`}
                  style={{ 
                    height: `${height}%`,
                    minHeight: '20px'
                  }}
                ></div>
                <div className="text-[10px] text-muted-foreground text-center leading-tight">
                  {device.name.replace('Network ', 'Net.')}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center text-xs text-brand-cyan font-medium">
          ✓ Dados reais da rede - {deviceTypes.length} tipos • Escala proporcional
        </div>
      </CardContent>
    </Card>
  );
}
