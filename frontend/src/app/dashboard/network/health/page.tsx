import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Wifi, Network, Shield, Server } from 'lucide-react'
import { getNetworkTopology, getAssetsStats } from '@/lib/api'

export default async function NetworkHealthPage() {
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, vlans: 0, ips: 0, subnets: 0 }));
  const stats = await getAssetsStats().catch(() => ({ total_assets: 0, by_type: [] }));

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div>
        <h1 className='text-3xl font-bold'>Network Health - Saúde da Rede TBE</h1>
        <p className='text-muted-foreground'>
          Monitoramento de {stats.total_assets?.toLocaleString('pt-BR') || 0} assets | Status atual da rede
        </p>
      </div>

      {/* Overall Health Score */}
      <div className='rounded-lg border-2 border-orange-500/30 bg-orange-500/5 p-6'>
        <div className='flex items-center gap-6'>
          <div className='flex items-center justify-center w-24 h-24 rounded-full bg-orange-500/20 border-4 border-orange-500'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-orange-500'>?</div>
              <div className='text-xs text-orange-500'>Score</div>
            </div>
          </div>
          <div className='flex-1'>
            <h2 className='text-2xl font-semibold mb-2 flex items-center gap-2'>
              <Activity className='w-6 h-6 text-orange-500' />
              Network Health Score
            </h2>
            <p className='text-muted-foreground mb-3'>
              Score geral de saúde da rede baseado em disponibilidade, performance, segurança e conformidade.
            </p>
            <div className='flex gap-2 items-center text-sm'>
              <AlertTriangle className='w-4 h-4 text-orange-500' />
              <span className='text-orange-500 font-medium'>
                Monitoramento em tempo real não implementado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Health Metrics (4 Cards) */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-muted-foreground'>IP Address Management</div>
            <Wifi className='h-5 w-5 text-green-500' />
          </div>
          <div className='space-y-2'>
            <div className='flex items-baseline gap-2'>
              <div className='text-3xl font-bold'>106</div>
              <div className='text-sm text-muted-foreground'>IPs alocados</div>
            </div>
            <div className='text-xs text-muted-foreground'>
              Utilização: ~9% (109 subnets)
            </div>
            <div className='flex items-center gap-1 text-xs text-green-500'>
              <CheckCircle2 className='w-3 h-3' />
              0 conflitos detectados
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-muted-foreground'>VLAN Health</div>
            <Network className='h-5 w-5 text-purple-500' />
          </div>
          <div className='space-y-2'>
            <div className='flex items-baseline gap-2'>
              <div className='text-3xl font-bold'>59</div>
              <div className='text-sm text-muted-foreground'>VLANs ativas</div>
            </div>
            <div className='text-xs text-muted-foreground'>
              Faixa 1-10: 2 | 11-99: 6 | 100+: 51
            </div>
            <div className='flex items-center gap-1 text-xs text-orange-500'>
              <AlertTriangle className='w-3 h-3' />
              0 classificadas por zona
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-muted-foreground'>Routing Health</div>
            <Server className='h-5 w-5 text-blue-500' />
          </div>
          <div className='space-y-2'>
            <div className='flex items-baseline gap-2'>
              <div className='text-3xl font-bold text-gray-500'>?</div>
              <div className='text-sm text-muted-foreground'>/ 544</div>
            </div>
            <div className='text-xs text-muted-foreground'>
              544 routers identificados
            </div>
            <div className='flex items-center gap-1 text-xs text-orange-500'>
              <AlertTriangle className='w-3 h-3' />
              Status não monitorado
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-muted-foreground'>Segmentation Score</div>
            <Shield className='h-5 w-5 text-red-500' />
          </div>
          <div className='space-y-2'>
            <div className='flex items-baseline gap-2'>
              <div className='text-3xl font-bold text-red-500'>0%</div>
              <div className='text-sm text-muted-foreground'>Purdue</div>
            </div>
            <div className='text-xs text-muted-foreground'>
              0/6 níveis implementados
            </div>
            <div className='flex items-center gap-1 text-xs text-red-500'>
              <AlertTriangle className='w-3 h-3' />
              GAP-SEG-001 (CVSS 9.1)
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Health Sections */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* IP & Subnet Health */}
        <div className='rounded-lg border bg-card'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <Wifi className='w-5 h-5 text-green-500' />
              IP Address Management
            </h2>
          </div>
          <div className='p-4'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>IPs Alocados</span>
                <span className='font-semibold'>106</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Subnets Identificados</span>
                <span className='font-semibold'>109</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Utilização Média</span>
                <span className='font-semibold text-green-500'>~9%</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Conflitos de IP</span>
                <span className='font-semibold text-green-500'>0</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>DHCP Pool Usage</span>
                <span className='font-semibold text-gray-500'>? (não coletado)</span>
              </div>
            </div>
          </div>
        </div>

        {/* VLAN Health */}
        <div className='rounded-lg border bg-card'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <Network className='w-5 h-5 text-purple-500' />
              VLAN Health
            </h2>
          </div>
          <div className='p-4'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>VLANs Ativas</span>
                <span className='font-semibold'>59</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>VLANs Sem Uso</span>
                <span className='font-semibold text-gray-500'>? (não analisado)</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>VLANs Classificadas</span>
                <span className='font-semibold text-orange-500'>0</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>STP Convergence</span>
                <span className='font-semibold text-gray-500'>? (não monitorado)</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>VLAN Spanning Issues</span>
                <span className='font-semibold text-gray-500'>? (não monitorado)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Routing Health */}
        <div className='rounded-lg border bg-card'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <Server className='w-5 h-5 text-blue-500' />
              Routing Health
            </h2>
          </div>
          <div className='p-4'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Routers Identificados</span>
                <span className='font-semibold'>544</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Routers Up/Down</span>
                <span className='font-semibold text-gray-500'>? (não monitorado)</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Rotas Ativas</span>
                <span className='font-semibold text-gray-500'>? (não coletado)</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Route Flaps (24h)</span>
                <span className='font-semibold text-gray-500'>? (não monitorado)</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Convergence Time</span>
                <span className='font-semibold text-gray-500'>? (não medido)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segmentation Score */}
        <div className='rounded-lg border bg-card'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <Shield className='w-5 h-5 text-red-500' />
              Segmentation Score
            </h2>
          </div>
          <div className='p-4'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Purdue Level Compliance</span>
                <span className='font-semibold text-red-500'>0%</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Zone Isolation</span>
                <span className='font-semibold text-red-500'>0%</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Firewalls Identificados</span>
                <span className='font-semibold'>36</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>Firewall Coverage</span>
                <span className='font-semibold text-gray-500'>? (localização desconhecida)</span>
              </div>
              <div className='flex justify-between items-center p-3 rounded-lg bg-gray-900'>
                <span className='text-sm'>ACL Compliance</span>
                <span className='font-semibold text-gray-500'>? (não auditado)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Performance (Placeholder for Real Monitoring) */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-brand-cyan' />
            Network Performance (Monitoramento Real Necessário)
          </h2>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-6 text-center'>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Latência Média</div>
              <div className='text-2xl font-bold text-gray-500'>?</div>
              <div className='text-xs text-muted-foreground mt-1'>ms</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Packet Loss</div>
              <div className='text-2xl font-bold text-gray-500'>?</div>
              <div className='text-xs text-muted-foreground mt-1'>%</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Bandwidth Util</div>
              <div className='text-2xl font-bold text-gray-500'>?</div>
              <div className='text-xs text-muted-foreground mt-1'>%</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Bottlenecks</div>
              <div className='text-2xl font-bold text-gray-500'>?</div>
              <div className='text-xs text-muted-foreground mt-1'>detectados</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground mb-1'>Uptime</div>
              <div className='text-2xl font-bold text-gray-500'>?</div>
              <div className='text-xs text-muted-foreground mt-1'>%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className='rounded-lg border border-blue-500/20 bg-blue-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <Activity className='w-6 h-6 text-blue-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-blue-500'>
              Implementar Monitoramento Real de Network Health
            </h3>
            <p className='text-sm text-muted-foreground mb-3'>
              Esta página atualmente mostra dados <strong>estáticos</strong> do inventário. Para monitoramento <strong>em tempo real</strong>, é necessário implementar:
            </p>
            
            <div className='mb-4'>
              <h4 className='text-sm font-semibold mb-2'>Fase 1: Coleta de Dados (40h)</h4>
              <ul className='text-sm text-muted-foreground space-y-1 ml-4'>
                <li>• SNMP polling: routers, switches, firewalls</li>
                <li>• NetFlow/sFlow: análise de tráfego</li>
                <li>• ICMP ping: latência e disponibilidade</li>
                <li>• Syslog: eventos de rede</li>
                <li>• Port mirroring: análise profunda (opcional)</li>
              </ul>
            </div>

            <div className='mb-4'>
              <h4 className='text-sm font-semibold mb-2'>Fase 2: Processamento (40h)</h4>
              <ul className='text-sm text-muted-foreground space-y-1 ml-4'>
                <li>• Time-series database: InfluxDB ou Prometheus</li>
                <li>• Agregação de métricas (1min, 5min, 1h)</li>
                <li>• Cálculo de KPIs e health scores</li>
                <li>• Detecção de anomalias</li>
              </ul>
            </div>

            <div className='mb-4'>
              <h4 className='text-sm font-semibold mb-2'>Fase 3: Visualização (40h)</h4>
              <ul className='text-sm text-muted-foreground space-y-1 ml-4'>
                <li>• Dashboard real-time (WebSocket)</li>
                <li>• Gráficos de séries temporais (Recharts)</li>
                <li>• Alertas (Email/SMS/Webhook)</li>
                <li>• Integração com SIEM (opcional)</li>
              </ul>
            </div>

            <p className='text-sm text-muted-foreground mb-4'>
              <strong>Esforço Total</strong>: 120 horas (3 semanas) | <strong>Prioridade</strong>: P2
            </p>

            <div className='flex gap-3'>
              <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all text-sm font-medium'>
                Planejar Implementação
              </button>
              <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-blue-500 transition-all text-sm'>
                Integrar com Zabbix/Nagios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Data Status */}
      <div className='rounded-lg border bg-card p-6'>
        <h3 className='font-semibold mb-3'>Status Atual dos Dados (Estáticos do Inventário)</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center p-3 rounded-lg bg-green-500/10'>
            <CheckCircle2 className='w-5 h-5 text-green-500 mx-auto mb-1' />
            <div className='text-sm font-medium'>Assets Inventariados</div>
            <div className='text-2xl font-bold text-green-500'>14.606</div>
          </div>
          <div className='text-center p-3 rounded-lg bg-green-500/10'>
            <CheckCircle2 className='w-5 h-5 text-green-500 mx-auto mb-1' />
            <div className='text-sm font-medium'>VLANs Identificadas</div>
            <div className='text-2xl font-bold text-green-500'>59</div>
          </div>
          <div className='text-center p-3 rounded-lg bg-green-500/10'>
            <CheckCircle2 className='w-5 h-5 text-green-500 mx-auto mb-1' />
            <div className='text-sm font-medium'>IPs Alocados</div>
            <div className='text-2xl font-bold text-green-500'>106</div>
          </div>
          <div className='text-center p-3 rounded-lg bg-orange-500/10'>
            <AlertTriangle className='w-5 h-5 text-orange-500 mx-auto mb-1' />
            <div className='text-sm font-medium'>Monitoramento Real</div>
            <div className='text-2xl font-bold text-orange-500'>0%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
