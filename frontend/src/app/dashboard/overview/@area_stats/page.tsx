import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssetsStats, getNetworkTopology } from '@/lib/api';

export default async function NetworkSegmentation() {
  const stats = await getAssetsStats().catch(() => ({ total_vlans: 0, by_type: [] }));
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, subnets: 0, connections: 0 }));
  
  const firewallCount = stats.by_type?.find((t: any) => t.type === 'Firewall')?.count || 0;
  
  const segmentData = [
    { label: 'Subnets mapeados', current: topology.subnets || 0, target: 109 },
    { label: 'VLANs classificadas', current: 0, target: stats.total_vlans || 59 },
    { label: 'Conexões analisadas', current: 0, target: topology.connections || 1345 },
    { label: 'Firewalls implementados', current: firewallCount, target: 15 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Progresso de Segmentação</CardTitle>
          <CardDescription>
            Modelo Purdue - Controle 5 ONS
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="space-y-4">
          {segmentData.map((item) => {
            const percentage = (item.current / item.target) * 100;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">
                    {item.current}/{item.target}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      percentage === 0 ? 'bg-red-500' : 
                      percentage < 50 ? 'bg-orange-500' :
                      percentage < 100 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">0%</div>
              <div className="text-xs text-muted-foreground">Compliance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">560h</div>
              <div className="text-xs text-muted-foreground">Esforço estimado</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
