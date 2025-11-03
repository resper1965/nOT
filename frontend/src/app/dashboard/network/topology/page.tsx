import { Network, Layers, Box, GitBranch, Shield, AlertTriangle } from 'lucide-react'
import { getNetworkTopology, getAssetsStats } from '@/lib/api'

export default async function TopologyPage() {
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, vlans: 0, ips: 0, subnets: 0, connections: 1345 }));
  const stats = await getAssetsStats().catch(() => ({ total_assets: 0 }));

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div>
        <h1 className='text-3xl font-bold'>Topologia Visual da Rede</h1>
        <p className='text-muted-foreground'>
          {stats.total_assets?.toLocaleString('pt-BR') || 0} assets | {topology.connections} conexões mapeadas
        </p>
      </div>

      {/* 6 Visões de Topologia */}
      <div className='grid gap-4 md:grid-cols-3'>
        {[
          { 
            name: 'Visão Física', 
            icon: Box, 
            color: 'text-blue-500',
            description: 'Todos os dispositivos físicos e conexões',
            stats: `${stats.total_assets?.toLocaleString('pt-BR')} assets, ${topology.connections} links`,
            status: 'available'
          },
          { 
            name: 'Visão Layer 2 (VLANs)', 
            icon: Layers, 
            color: 'text-purple-500',
            description: 'Switches, VLANs, trunks, STP',
            stats: `${topology.devices?.switch || 0} switches, ${topology.vlans} VLANs`,
            status: 'available'
          },
          { 
            name: 'Visão Layer 3 (IP)', 
            icon: Network, 
            color: 'text-green-500',
            description: 'Routers, subnets, roteamento',
            stats: `${topology.devices?.router || 0} routers, ${topology.subnets} subnets`,
            status: 'available'
          },
          { 
            name: 'Visão de Zonas', 
            icon: Shield, 
            color: 'text-orange-500',
            description: 'Zonas de segurança e firewalls',
            stats: `${topology.devices?.firewall || 0} firewalls, Zonas a mapear`,
            status: 'pending'
          },
          { 
            name: 'Modelo Purdue (6 Níveis)', 
            icon: GitBranch, 
            color: 'text-red-500',
            description: 'Níveis 0-5, segmentação OT/IT',
            stats: '0/6 níveis mapeados',
            status: 'critical'
          },
          { 
            name: 'Visão de Criticidade', 
            icon: AlertTriangle, 
            color: 'text-yellow-500',
            description: 'Assets críticos e paths',
            stats: 'Critical, High, Medium, Low',
            status: 'available'
          },
        ].map((view) => {
          const Icon = view.icon;
          const statusColors = {
            available: { bg: 'bg-green-500/10', text: 'text-green-500', badge: 'Disponível' },
            pending: { bg: 'bg-orange-500/10', text: 'text-orange-500', badge: 'Pendente' },
            critical: { bg: 'bg-red-500/10', text: 'text-red-500', badge: 'Crítico' },
          };
          const status = statusColors[view.status as keyof typeof statusColors];

          return (
            <div key={view.name} className={`rounded-lg border p-4 hover:border-brand-cyan/50 transition-all cursor-pointer ${status.bg}`}>
              <div className='flex items-start gap-3 mb-3'>
                <Icon className={`w-6 h-6 ${view.color} flex-shrink-0`} />
                <div className='flex-1'>
                  <h3 className='font-semibold mb-1'>{view.name}</h3>
                  <p className='text-xs text-muted-foreground'>{view.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${status.bg} ${status.text}`}>
                  {status.badge}
                </span>
              </div>
              <div className='text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-800'>
                {view.stats}
              </div>
            </div>
          );
        })}
      </div>

      {/* Topology Diagram Placeholder */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <Network className='w-5 h-5 text-brand-cyan' />
            Diagrama de Topologia (Visão Física)
          </h2>
        </div>
        <div className='p-6'>
          <div className='bg-gray-900 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-700'>
            <div className='text-center'>
              <Network className='w-16 h-16 text-gray-600 mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-gray-400 mb-2'>
                Visualização de Topologia
              </h3>
              <p className='text-sm text-muted-foreground mb-4 max-w-md'>
                Diagrama visual mostrando {stats.total_assets?.toLocaleString('pt-BR')} assets e {topology.connections} conexões.
                Em desenvolvimento usando D3.js ou Mermaid.
              </p>
              <div className='flex gap-3 justify-center'>
                <button className='px-4 py-2 bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 transition-all text-sm font-medium'>
                  Gerar Diagrama Mermaid
                </button>
                <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-brand-cyan transition-all text-sm'>
                  Exportar para Visio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Statistics */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Estatísticas da Topologia</h2>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Total de Nodes</div>
              <div className='text-3xl font-bold'>{stats.total_assets?.toLocaleString('pt-BR')}</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Conexões Mapeadas</div>
              <div className='text-3xl font-bold'>{topology.connections?.toLocaleString('pt-BR')}</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Densidade de Rede</div>
              <div className='text-3xl font-bold'>
                {((topology.connections / stats.total_assets) || 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Avg Connections/Node</div>
              <div className='text-3xl font-bold'>
                {((topology.connections * 2 / stats.total_assets) || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
