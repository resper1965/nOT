import Link from 'next/link'
import { Shield, AlertTriangle, CheckCircle2, Clock, ArrowLeft, TrendingUp } from 'lucide-react'

export default function RemediationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-brand-cyan icon-ness" />
            <div className="flex flex-col">
              <h1 className="ness-wordmark font-medium text-2xl">
                ness<span className="ness-wordmark-dot">.</span>
              </h1>
              <span className="text-gray-400 font-normal text-sm">OT GRC</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-brand-cyan transition-ness flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/dashboard" className="hover:text-brand-cyan transition-ness">Dashboard</Link>
          <span>/</span>
          <span className="text-orange-500">Frente 3: Adequação</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle className="w-8 h-8 text-orange-500 icon-ness" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Frente 3: Adequação</h1>
              <p className="text-gray-400">Gap Analysis & Remediation Plan</p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Gaps Identificados</div>
            <div className="text-3xl font-bold mb-1 text-red-500">6</div>
            <div className="text-xs text-gray-500">Controle 5 ONS (Purdue)</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Risco Agregado</div>
            <div className="text-3xl font-bold mb-1 text-red-500">CVSS 9.1</div>
            <div className="text-xs text-red-500">Crítico</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Esforço Total</div>
            <div className="text-3xl font-bold mb-1">560h</div>
            <div className="text-xs text-gray-500">14 semanas-pessoa</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Investimento</div>
            <div className="text-3xl font-bold mb-1">R$ 250k</div>
            <div className="text-xs text-gray-500">R$ 250k - R$ 400k</div>
          </div>
        </div>

        {/* 6 Gaps do Controle 5 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6 Gaps Identificados - Controle 5 ONS (Segmentação)</h2>
          <div className="space-y-3">
            {[
              { 
                id: 'GAP-SEG-001', 
                name: 'Modelo Purdue não implementado', 
                status: 'critical',
                cvss: 9.1,
                effort: '300h',
                details: '0/6 níveis implementados'
              },
              { 
                id: 'GAP-SEG-002', 
                name: '109 Subnets não mapeados para níveis Purdue', 
                status: 'high',
                cvss: 8.5,
                effort: '80h',
                details: '0/109 subnets (0%)'
              },
              { 
                id: 'GAP-SEG-003', 
                name: '59 VLANs não classificadas por zona', 
                status: 'high',
                cvss: 7.8,
                effort: '40h',
                details: '0/59 VLANs (0%)'
              },
              { 
                id: 'GAP-SEG-004', 
                name: '1.345 Conexões não analisadas (cross-zone)', 
                status: 'high',
                cvss: 8.2,
                effort: '60h',
                details: '0/1.345 conexões (0%)'
              },
              { 
                id: 'GAP-SEG-005', 
                name: 'Firewalls insuficientes', 
                status: 'critical',
                cvss: 9.0,
                effort: '40h',
                details: '9 existentes vs [N] necessários'
              },
              { 
                id: 'GAP-SEG-006', 
                name: 'Documentação de segmentação ausente', 
                status: 'medium',
                cvss: 6.5,
                effort: '40h',
                details: '0/6 documentos (0%)'
              },
            ].map((gap) => (
              <div key={gap.id} className="surface-1 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-mono text-gray-600">{gap.id}</div>
                    <div>
                      <div className="font-semibold">{gap.name}</div>
                      <div className="text-xs text-gray-500">{gap.details}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">CVSS</div>
                      <div className={`text-lg font-bold ${gap.cvss >= 9 ? 'text-red-500' : gap.cvss >= 7 ? 'text-orange-500' : 'text-yellow-500'}`}>
                        {gap.cvss}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Esforço</div>
                      <div className="text-sm font-semibold">{gap.effort}</div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plano de Adequação - 90 dias */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Plano de Adequação (90 dias)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="surface-1 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-brand-cyan">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Fase 1: Assessment</h3>
                  <p className="text-xs text-gray-400">Dias 1-30</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>230 horas</span>
                </div>
                <div className="text-gray-400">
                  • Mapear 109 subnets → Purdue<br/>
                  • Classificar 59 VLANs → Zonas<br/>
                  • Analisar 1.345 conexões<br/>
                  • Inventariar 9 firewalls
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="text-orange-500">Pendente</span>
                </div>
              </div>
            </div>

            <div className="surface-1 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-500">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Fase 2: Design</h3>
                  <p className="text-xs text-gray-400">Dias 30-60</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>180 horas</span>
                </div>
                <div className="text-gray-400">
                  • Desenhar Modelo Purdue TO-BE<br/>
                  • Especificar firewalls<br/>
                  • Redesign VLANs<br/>
                  • Criar 6 documentos
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="text-gray-600">Bloqueado</span>
                </div>
              </div>
            </div>

            <div className="surface-1 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-500">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Fase 3: Implementação</h3>
                  <p className="text-xs text-gray-400">Dias 60-90</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>150 horas</span>
                </div>
                <div className="text-gray-400">
                  • Deploy firewalls<br/>
                  • Implementar segmentação<br/>
                  • Migrar VLANs<br/>
                  • Validação e testes
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="text-gray-600">Bloqueado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de Progresso */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Métricas de Progresso</h2>
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="space-y-4">
              {[
                { name: 'Subnets mapeados Purdue', current: 0, target: 109, unit: 'subnets' },
                { name: 'VLANs classificadas', current: 0, target: 59, unit: 'VLANs' },
                { name: 'Conexões analisadas', current: 0, target: 1345, unit: 'conexões' },
                { name: 'Firewalls implementados', current: 9, target: 15, unit: 'firewalls' },
                { name: 'Documentos aprovados', current: 0, target: 6, unit: 'docs' },
                { name: 'Conformidade Controle 5', current: 0, target: 100, unit: '%' },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="font-medium">{metric.name}</span>
                    <span className="text-gray-400">
                      {metric.current}/{metric.target} {metric.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        metric.current === 0 ? 'bg-red-500' : 
                        metric.current < metric.target * 0.5 ? 'bg-orange-500' :
                        metric.current < metric.target ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(metric.current / metric.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Timeline de Implementação</h2>
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800"></div>
              <div className="space-y-6">
                {[
                  { week: 'Semanas 1-2', task: 'Mapping de subnets e VLANs', status: 'pending' },
                  { week: 'Semanas 3-4', task: 'Análise de conexões e firewalls', status: 'pending' },
                  { week: 'Semanas 5-6', task: 'Design do Modelo Purdue TO-BE', status: 'pending' },
                  { week: 'Semanas 7-8', task: 'Especificação e documentação', status: 'pending' },
                  { week: 'Semanas 9-10', task: 'Aquisição e instalação de firewalls', status: 'pending' },
                  { week: 'Semanas 11-12', task: 'Implementação de segmentação', status: 'pending' },
                  { week: 'Semana 13', task: 'Validação e testes', status: 'pending' },
                ].map((item, idx) => (
                  <div key={idx} className="relative flex items-center gap-4 pl-12">
                    <div className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                      item.status === 'completed' ? 'bg-green-500 border-green-500' :
                      item.status === 'in_progress' ? 'bg-brand-cyan border-brand-cyan' :
                      'bg-gray-900 border-gray-700'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.week}</div>
                      <div className="text-sm text-gray-400">{item.task}</div>
                    </div>
                    <div>
                      {item.status === 'pending' && (
                        <span className="text-sm text-gray-500">Pendente</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 surface-1 p-6 rounded-lg border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2 text-orange-500">Pronto para Iniciar Gap Analysis</h3>
              <p className="text-sm text-gray-400 mb-4">
                O sistema identificou automaticamente 6 gaps críticos baseado nos dados da rede TBE (3.907 ativos, 109 subnets, 59 VLANs) 
                cruzados com os requisitos ONS. Esforço total estimado: <strong>560 horas</strong> (14 semanas-pessoa).
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-ness text-sm font-medium">
                  Iniciar Fase 1: Assessment
                </button>
                <button className="px-4 py-2 border border-gray-700 rounded-md hover:border-orange-500 transition-ness text-sm">
                  Ver Relatório Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <span className="ness-wordmark">ness<span className="ness-wordmark-dot">.</span></span> OT GRC - Gap Analysis & Remediation
          </div>
        </div>
      </footer>
    </div>
  )
}

