import { Network, Wifi, TrendingUp, AlertTriangle, Activity, GitBranch } from 'lucide-react'
import { getNetworkTopology, getAssetsStats } from '@/lib/api'

export default async function RoutingPage() {
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, subnets: 0 }));
  const stats = await getAssetsStats().catch(() => ({ by_type: [] }));
  
  const routerCount = topology.devices?.router || 0;
  const routerData = stats.by_type?.find((t: any) => t.type === 'Router');

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div>
        <h1 className='text-3xl font-bold'>Análise de Roteamento Layer 3</h1>
        <p className='text-muted-foreground'>
          {routerCount} routers identificados | {topology.subnets || 0} subnets | Análise de rotas
        </p>
      </div>

      {/* Stats Principais */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Total de Routers</div>
            <Wifi className='h-5 w-5 text-orange-500' />
          </div>
          <div className='text-3xl font-bold'>{routerCount}</div>
          <div className='text-xs text-muted-foreground mt-1'>Dispositivos Layer 3</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Protocolos</div>
          <div className='text-3xl font-bold text-orange-500'>?</div>
          <div className='text-xs text-muted-foreground mt-1'>OSPF, BGP, Static (a coletar)</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Inter-VLAN Routing</div>
          <div className='text-3xl font-bold'>{topology.vlans || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>VLANs possíveis</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Default Routes</div>
          <div className='text-3xl font-bold text-orange-500'>?</div>
          <div className='text-xs text-muted-foreground mt-1'>A identificar</div>
        </div>
      </div>

      {/* Gap Analysis - Routing */}
      <div className='rounded-lg border border-red-500/20 bg-red-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <AlertTriangle className='w-6 h-6 text-red-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-red-500'>
              Análise de Roteamento Pendente - {routerCount} Routers
            </h3>
            <p className='text-sm text-muted-foreground mb-3'>
              <strong>Dados Disponíveis</strong>: {routerCount} routers identificados nos assets da rede TBE.
            </p>
            <p className='text-sm text-muted-foreground mb-3'>
              <strong>Análise Necessária</strong>: Para cada um dos {routerCount} routers:
            </p>
            <ul className='text-sm text-muted-foreground space-y-1 mb-4 ml-4'>
              <li>• Coletar tabelas de roteamento (show ip route)</li>
              <li>• Identificar protocolos de roteamento (OSPF, BGP, EIGRP, Static)</li>
              <li>• Analisar rotas default e específicas</li>
              <li>• Mapear inter-VLAN routing (59 VLANs)</li>
              <li>• Identificar redundância e failover</li>
              <li>• Trace de caminhos críticos (SCADA → PLCs)</li>
              <li>• Identificar SPOFs (Single Points of Failure)</li>
            </ul>
            <p className='text-sm text-muted-foreground mb-4'>
              <strong>Esforço estimado</strong>: 120 horas (3 semanas) | <strong>Prioridade</strong>: P1 (Alta)
            </p>
            <div className='flex gap-3'>
              <button className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all text-sm font-medium'>
                Iniciar Coleta de Dados de Roteamento
              </button>
              <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-red-500 transition-all text-sm'>
                Gerar Script de Coleta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Routing Analysis Framework */}
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='rounded-lg border bg-card'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <GitBranch className='w-5 h-5 text-brand-cyan' />
              Análise de Protocolos de Roteamento
            </h2>
          </div>
          <div className='p-4'>
            <div className='space-y-3'>
              {[
                { protocol: 'OSPF', expected: '?', collected: 0, status: 'pending' },
                { protocol: 'BGP', expected: '?', collected: 0, status: 'pending' },
                { protocol: 'EIGRP', expected: '?', collected: 0, status: 'pending' },
                { protocol: 'Static Routes', expected: '?', collected: 0, status: 'pending' },
                { protocol: 'Default Routes', expected: '?', collected: 0, status: 'pending' },
              ].map((item) => (
                <div key={item.protocol} className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <div className='font-medium'>{item.protocol}</div>
                    <div className='text-xs text-muted-foreground'>
                      {item.collected}/{item.expected} routers
                    </div>
                  </div>
                  <span className='text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500'>
                    Aguardando coleta
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <Activity className='w-5 h-5 text-green-500' />
              Caminhos Críticos (a mapear)
            </h2>
          </div>
          <div className='p-4'>
            <div className='space-y-3'>
              {[
                { path: 'SCADA → PLCs', hops: '?', latency: '?', status: 'pending' },
                { path: 'Operação → Subestações', hops: '?', latency: '?', status: 'pending' },
                { path: 'IT → OT Boundary', hops: '?', latency: '?', status: 'pending' },
                { path: 'Backup Routes', hops: '?', redundancy: '?', status: 'pending' },
              ].map((item, idx) => (
                <div key={idx} className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <div className='font-medium text-sm'>{item.path}</div>
                    <div className='text-xs text-muted-foreground'>
                      Hops: {item.hops} | Latency: {item.latency}
                    </div>
                  </div>
                  <span className='text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500'>
                    Pendente
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Routing Table Preview (Exemplo) */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Tabela de Roteamento (Exemplo - a coletar de {routerCount} routers)</h2>
        </div>
        <div className='p-4'>
          <div className='bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto'>
            <div className='text-green-500 mb-2'># show ip route (Exemplo)</div>
            <div className='space-y-1 text-gray-300'>
              <div>Codes: C - connected, S - static, R - RIP, O - OSPF, B - BGP</div>
              <div className='mt-2'></div>
              <div>Gateway of last resort is 192.168.1.1 to network 0.0.0.0</div>
              <div className='mt-2'></div>
              <div>S*    0.0.0.0/0 [1/0] via 192.168.1.1</div>
              <div>C     10.1.2.0/24 is directly connected, GigabitEthernet0/1</div>
              <div>C     10.1.3.0/24 is directly connected, GigabitEthernet0/2</div>
              <div>O     10.2.0.0/16 [110/20] via 10.1.2.254, 00:15:23, GigabitEthernet0/1</div>
              <div>B     172.16.0.0/12 [20/0] via 10.1.2.1, 02:30:45</div>
            </div>
            <div className='mt-4 text-orange-500 text-center'>
              ⚠️ Este é um EXEMPLO - Dados reais precisam ser coletados dos {routerCount} routers TBE
            </div>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div className='rounded-lg border border-orange-500/20 bg-orange-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <Network className='w-6 h-6 text-orange-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-orange-500'>Coleta de Dados de Roteamento Necessária</h3>
            <p className='text-sm text-muted-foreground mb-3'>
              Para análise completa de roteamento Layer 3, é necessário coletar configurações dos {routerCount} routers identificados.
            </p>
            <p className='text-sm text-muted-foreground mb-4'>
              <strong>Métodos de coleta</strong>:
            </p>
            <ul className='text-sm text-muted-foreground space-y-1 mb-4 ml-4'>
              <li>• SSH/Telnet: show ip route, show ip protocols</li>
              <li>• SNMP: MIBs de roteamento</li>
              <li>• API de gerenciamento (se disponível)</li>
              <li>• Scripts automatizados (Ansible, Python)</li>
            </ul>
            <div className='flex gap-3'>
              <button className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all text-sm font-medium'>
                Gerar Script de Coleta Ansible
              </button>
              <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-orange-500 transition-all text-sm'>
                Upload Manual de Configs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Routing Metrics (when data available) */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Métricas de Roteamento (Após Coleta)</h2>
        </div>
        <div className='p-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Rotas Estáticas</div>
              <div className='text-2xl font-bold text-gray-500'>-</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Rotas Dinâmicas</div>
              <div className='text-2xl font-bold text-gray-500'>-</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Latência Média</div>
              <div className='text-2xl font-bold text-gray-500'>-</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>SPOFs</div>
              <div className='text-2xl font-bold text-gray-500'>-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
