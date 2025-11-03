import Link from 'next/link'
import { Shield, AlertTriangle, Clock, ArrowLeft, TrendingUp } from 'lucide-react'

async function getRemediationData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Fetch gaps data
    const gapsRes = await fetch(`${baseUrl}/api/remediation/gaps`, { cache: 'no-store' });
    const gapsData = gapsRes.ok ? await gapsRes.json() : { gaps: [], stats: {}, network_data: {} };
    
    // Fetch plan data
    const planRes = await fetch(`${baseUrl}/api/remediation/plan`, { cache: 'no-store' });
    const planData = planRes.ok ? await planRes.json() : { phases: [], metrics: [], timeline: [], summary: {} };
    
    return {
      gaps: gapsData.gaps || [],
      stats: gapsData.stats || {
        total_gaps: 0,
        critical_gaps: 0,
        high_gaps: 0,
        avg_cvss: 0,
        total_effort_hours: 0,
        total_effort_weeks: 0,
        risk_level: 'low',
      },
      network_data: gapsData.network_data || {},
      phases: planData.phases || [],
      metrics: planData.metrics || [],
      timeline: planData.timeline || [],
      summary: planData.summary || {
        total_effort_hours: 0,
        total_effort_weeks: 0,
        estimated_investment_min: 0,
        estimated_investment_max: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching remediation data:', error);
    return {
      gaps: [],
      stats: {
        total_gaps: 0,
        critical_gaps: 0,
        high_gaps: 0,
        avg_cvss: 0,
        total_effort_hours: 0,
        total_effort_weeks: 0,
        risk_level: 'low',
      },
      network_data: {},
      phases: [],
      metrics: [],
      timeline: [],
      summary: {
        total_effort_hours: 0,
        total_effort_weeks: 0,
        estimated_investment_min: 0,
        estimated_investment_max: 0,
      },
    };
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default async function RemediationPage() {
  const data = await getRemediationData();
  const { gaps, stats, network_data, phases, metrics, timeline, summary } = data;

  const getCvssColor = (cvss: number) => {
    if (cvss >= 9.0) return 'text-red-500';
    if (cvss >= 7.0) return 'text-orange-500';
    if (cvss >= 4.0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

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
            <div className="text-3xl font-bold mb-1 text-red-500">{stats.total_gaps}</div>
            <div className="text-xs text-gray-500">
              {stats.critical_gaps} críticos, {stats.high_gaps} altos
            </div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Risco Agregado</div>
            <div className={`text-3xl font-bold mb-1 ${getCvssColor(stats.avg_cvss)}`}>
              CVSS {stats.avg_cvss.toFixed(1)}
            </div>
            <div className={`text-xs ${getCvssColor(stats.avg_cvss)}`}>
              {stats.risk_level === 'critical' ? 'Crítico' :
               stats.risk_level === 'high' ? 'Alto' :
               stats.risk_level === 'medium' ? 'Médio' : 'Baixo'}
            </div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Esforço Total</div>
            <div className="text-3xl font-bold mb-1">{summary.total_effort_hours || stats.total_effort_hours}h</div>
            <div className="text-xs text-gray-500">
              {summary.total_effort_weeks || stats.total_effort_weeks} semanas-pessoa
            </div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Investimento</div>
            <div className="text-3xl font-bold mb-1">
              {summary.estimated_investment_min ? formatCurrency(summary.estimated_investment_min) : 'N/A'}
            </div>
            <div className="text-xs text-gray-500">
              {summary.estimated_investment_max ? `até ${formatCurrency(summary.estimated_investment_max)}` : ''}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/remediation/gaps">
            <div className="surface-1 p-6 rounded-lg border border-gray-800 hover:border-orange-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold">Gap Analysis ONS</h3>
              </div>
              <p className="text-sm text-gray-400">
                Análise detalhada de gaps entre requisitos ONS e realidade da rede
              </p>
            </div>
          </Link>

          <Link href="/dashboard/remediation/risks">
            <div className="surface-1 p-6 rounded-lg border border-gray-800 hover:border-red-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold">Matriz de Riscos</h3>
              </div>
              <p className="text-sm text-gray-400">
                Visualização de riscos por impacto e probabilidade
              </p>
            </div>
          </Link>

          <Link href="/dashboard/remediation/plan">
            <div className="surface-1 p-6 rounded-lg border border-gray-800 hover:border-blue-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold">Plano de Adequação</h3>
              </div>
              <p className="text-sm text-gray-400">
                Plano de ação priorizado para adequação aos requisitos ONS
              </p>
            </div>
          </Link>
        </div>

        {/* Summary Gaps (first 3) */}
        {gaps.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Gaps Identificados - Controle 5 ONS (Segmentação)</h2>
              <Link href="/dashboard/remediation/gaps" className="text-sm text-orange-500 hover:text-orange-400">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-3">
              {gaps.slice(0, 3).map((gap: any) => (
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
                        <div className={`text-lg font-bold ${getCvssColor(gap.cvss)}`}>
                          {gap.cvss}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Esforço</div>
                        <div className="text-sm font-semibold">{gap.effort_hours}h</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        gap.status === 'critical' ? 'bg-red-500' :
                        gap.status === 'high' ? 'bg-orange-500' :
                        gap.status === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{
                        width: `${gap.target_value > 0 ? ((gap.current_value || 0) / gap.target_value) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Phases (first phase) */}
        {phases.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Plano de Adequação (90 dias)</h2>
              <Link href="/dashboard/remediation/plan" className="text-sm text-orange-500 hover:text-orange-400">
                Ver plano completo →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {phases.slice(0, 3).map((phase: any) => {
                const phaseColorsMap: Record<string, { bg: string; border: string; text: string }> = {
                  'phase-1': { bg: 'bg-brand-cyan/10', border: 'border-brand-cyan/20', text: 'text-brand-cyan' },
                  'phase-2': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500' },
                  'phase-3': { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500' },
                };
                const phaseColors = phaseColorsMap[phase.id as string] || { bg: 'bg-gray-900', border: 'border-gray-800', text: 'text-gray-400' };
                
                return (
                  <div key={phase.id} className={`surface-1 p-6 rounded-lg border ${phaseColors.border}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg ${phaseColors.bg} border ${phaseColors.border} flex items-center justify-center`}>
                        <span className={`text-xl font-bold ${phaseColors.text}`}>
                          {phase.id === 'phase-1' ? '1' : phase.id === 'phase-2' ? '2' : '3'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{phase.name}</h3>
                        <p className="text-xs text-gray-400">{phase.duration_text}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{phase.effort_hours} horas</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={phase.status === 'pending' ? 'text-orange-500' : 'text-gray-600'}>
                          {phase.status === 'completed' ? 'Concluído' :
                           phase.status === 'in_progress' ? 'Em Progresso' :
                           phase.status === 'blocked' ? 'Bloqueado' :
                           'Pendente'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary Metrics (first 3) */}
        {metrics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Métricas de Progresso</h2>
            <div className="surface-1 p-6 rounded-lg border border-gray-800">
              <div className="space-y-4">
                {metrics.slice(0, 3).map((metric: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-medium">{metric.name}</span>
                      <span className="text-gray-400">
                        {metric.current.toLocaleString('pt-BR')} / {metric.target.toLocaleString('pt-BR')} {metric.unit}
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
                        style={{ width: `${metric.target > 0 ? (metric.current / metric.target) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {stats.total_gaps > 0 && (
          <div className="mt-8 surface-1 p-6 rounded-lg border border-orange-500/20 bg-orange-500/5">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-orange-500">Pronto para Iniciar Gap Analysis</h3>
                <p className="text-sm text-gray-400 mb-4">
                  O sistema identificou automaticamente <strong>{stats.total_gaps} gaps</strong> baseado nos dados da rede 
                  ({network_data.total_assets?.toLocaleString('pt-BR') || 0} assets, {network_data.total_subnets || 0} subnets, {network_data.total_vlans || 0} VLANs) 
                  cruzados com os requisitos ONS. Esforço total estimado: <strong>{summary.total_effort_hours || stats.total_effort_hours} horas</strong> 
                  ({summary.total_effort_weeks || stats.total_effort_weeks} semanas-pessoa).
                </p>
                <div className="flex gap-3">
                  <Link href="/dashboard/remediation/gaps">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-ness text-sm font-medium">
                      Ver Gap Analysis Completo
                    </button>
                  </Link>
                  <Link href="/dashboard/remediation/plan">
                    <button className="px-4 py-2 border border-gray-700 rounded-md hover:border-orange-500 transition-ness text-sm">
                      Ver Plano de Adequação
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
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
