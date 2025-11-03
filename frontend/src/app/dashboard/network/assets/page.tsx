import { Network, Server, Wifi, HardDrive, Shield, AlertTriangle, Activity } from 'lucide-react'
import { getAssetsStats, getAssetsList, getNetworkTopology } from '@/lib/api'

export default async function AssetsPage() {
  const stats = await getAssetsStats().catch(() => ({ 
    total_assets: 0, 
    by_type: [], 
    by_criticality: [] 
  }));
  
  const topology = await getNetworkTopology().catch(() => ({ 
    devices: {}, 
    vlans: 0, 
    ips: 0 
  }));
  
  const assets = await getAssetsList(20, 0).catch(() => ({ assets: [] }));

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Assets & Inventário da Rede</h1>
          <p className='text-muted-foreground'>
            {stats.total_assets?.toLocaleString('pt-BR') || 0} ativos importados e analisados
          </p>
        </div>
      </div>

      {/* Stats Detalhados */}
      <div className='grid gap-4 md:grid-cols-5'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Routers</div>
            <Wifi className='h-5 w-5 text-orange-500' />
          </div>
          <div className='text-3xl font-bold'>{topology.devices?.router || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Layer 3 devices</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Switches</div>
            <Network className='h-5 w-5 text-blue-500' />
          </div>
          <div className='text-3xl font-bold'>{topology.devices?.switch || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Layer 2 devices</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Servers</div>
            <Server className='h-5 w-5 text-green-500' />
          </div>
          <div className='text-3xl font-bold'>{topology.devices?.server || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Application servers</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Firewalls</div>
            <Shield className='h-5 w-5 text-red-500' />
          </div>
          <div className='text-3xl font-bold text-orange-500'>{topology.devices?.firewall || 0}</div>
          <div className='text-xs text-red-500 mt-1'>Insuficiente (mín 15)</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Total</div>
            <HardDrive className='h-5 w-5 text-brand-cyan' />
          </div>
          <div className='text-3xl font-bold'>{stats.total_assets?.toLocaleString('pt-BR') || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Assets</div>
        </div>
      </div>

      {/* Network Summary */}
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-3'>Segmentação Layer 2</div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>VLANs Identificadas</span>
              <span className='font-bold'>{topology.vlans || 0}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>VLANs Classificadas</span>
              <span className='text-orange-500 font-bold'>0</span>
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-3'>Endereçamento IP</div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Subnets Identificados</span>
              <span className='font-bold'>{topology.subnets || 0}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>IPs Ativos</span>
              <span className='font-bold'>{topology.ips || 0}</span>
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-3'>Conectividade</div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Conexões Mapeadas</span>
              <span className='font-bold'>{topology.connections || 0}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Cross-Zone</span>
              <span className='text-orange-500 font-bold'>Não analisadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution by Type */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Distribuição por Tipo de Dispositivo</h2>
        </div>
        <div className='p-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {stats.by_type?.slice(0, 8).map((item: any) => (
              <div key={item.type} className='p-3 rounded-lg border'>
                <div className='text-xs text-muted-foreground mb-1'>{item.type}</div>
                <div className='text-2xl font-bold'>{item.count?.toLocaleString('pt-BR')}</div>
                <div className='text-xs text-muted-foreground'>
                  {((item.count / stats.total_assets) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution by Criticality */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Distribuição por Criticidade</h2>
          <Activity className='w-5 h-5 text-muted-foreground' />
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {stats.by_criticality?.map((item: any) => {
              const colors = {
                'critical': { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
                'high': { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
                'medium': { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
                'low': { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
              };
              const color = colors[item.criticality as keyof typeof colors] || colors.low;
              
              return (
                <div key={item.criticality} className={`p-4 rounded-lg border ${color.border} ${color.bg}`}>
                  <div className='text-sm font-medium text-muted-foreground mb-2 capitalize'>
                    {item.criticality}
                  </div>
                  <div className={`text-3xl font-bold ${color.text}`}>
                    {item.count?.toLocaleString('pt-BR')}
                  </div>
                  <div className='text-xs text-muted-foreground mt-1'>
                    {((item.count / stats.total_assets) * 100).toFixed(1)}% do total
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Assets Table */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Assets Recentes (Top 20)</h2>
        </div>
        <div className='p-4'>
          <div className='space-y-2'>
            {assets.assets?.slice(0, 20).map((asset: any, idx: number) => (
              <div key={idx} className='flex items-center justify-between p-3 rounded-lg border hover:border-brand-cyan/50 transition-all'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className='text-xs text-muted-foreground w-8'>{idx + 1}</div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium truncate'>{asset.name}</div>
                    <div className='text-xs text-muted-foreground'>{asset.type}</div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-xs font-mono text-muted-foreground'>
                    {asset.ip || 'Sem IP'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${
                    asset.criticality === 'high' ? 'bg-orange-500/10 text-orange-500' :
                    asset.criticality === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {asset.criticality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
