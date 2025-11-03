import { AlertTriangle, Clock, ArrowLeft, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic'

async function getPlanData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/remediation/plan`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch plan');
    return res.json();
  } catch (error) {
    console.error('Error fetching plan:', error);
    return {
      phases: [],
      timeline: [],
      metrics: [],
      summary: {
        total_phases: 0,
        total_effort_hours: 0,
        total_effort_weeks: 0,
        total_effort_person_weeks: 0,
        estimated_investment_min: 0,
        estimated_investment_max: 0,
        estimated_duration_days: 0,
        total_gaps: 0,
        critical_gaps: 0,
      },
    };
  }
}

export default async function RemediationPlanPage() {
  const data = await getPlanData();
  const { phases, timeline, metrics, summary } = data;

  const getPhaseColor = (phaseId: string) => {
    switch (phaseId) {
      case 'phase-1': return { bg: 'bg-brand-cyan/10', border: 'border-brand-cyan/20', text: 'text-brand-cyan' };
      case 'phase-2': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500' };
      case 'phase-3': return { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500' };
      default: return { bg: 'bg-gray-900', border: 'border-gray-800', text: 'text-gray-400' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in_progress': return 'text-blue-500';
      case 'blocked': return 'text-gray-500';
      case 'pending': return 'text-orange-500';
      default: return 'text-gray-400';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Plano de Adequação</h1>
          <p className='text-muted-foreground'>
            Plano de ação priorizado para adequação aos requisitos ONS
          </p>
        </div>
        <Link
          href='/dashboard/remediation'
          className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Voltar
        </Link>
      </div>

      {/* Summary Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Fases</div>
            <AlertTriangle className='h-4 w-4 text-blue-500' />
          </div>
          <div className='text-2xl font-bold'>{summary.total_phases}</div>
          <div className='text-xs text-muted-foreground'>Plano completo</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Esforço Total</div>
            <Clock className='h-4 w-4 text-orange-500' />
          </div>
          <div className='text-2xl font-bold'>{summary.total_effort_hours}h</div>
          <div className='text-xs text-muted-foreground'>{summary.total_effort_weeks} semanas-pessoa</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Duração</div>
            <Clock className='h-4 w-4 text-purple-500' />
          </div>
          <div className='text-2xl font-bold'>{summary.estimated_duration_days} dias</div>
          <div className='text-xs text-muted-foreground'>~{Math.ceil(summary.estimated_duration_days / 7)} semanas</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Investimento</div>
            <TrendingUp className='h-4 w-4 text-green-500' />
          </div>
          <div className='text-lg font-bold'>{formatCurrency(summary.estimated_investment_min)}</div>
          <div className='text-xs text-muted-foreground'>
            até {formatCurrency(summary.estimated_investment_max)}
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className='rounded-lg border bg-card p-6'>
        <h2 className='text-xl font-semibold mb-4'>Fases do Plano de Adequação</h2>
        <div className='grid gap-4 md:grid-cols-3'>
          {phases.map((phase: any) => {
            const colors = getPhaseColor(phase.id);
            return (
              <div
                key={phase.id}
                className={`rounded-lg border ${colors.border} ${colors.bg} p-6`}
              >
                <div className='flex items-center gap-3 mb-4'>
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <span className={`text-xl font-bold ${colors.text}`}>
                      {phase.id === 'phase-1' ? '1' : phase.id === 'phase-2' ? '2' : '3'}
                    </span>
                  </div>
                  <div>
                    <h3 className='font-semibold'>{phase.name}</h3>
                    <p className='text-xs text-muted-foreground'>{phase.duration_text}</p>
                  </div>
                </div>

                <div className='space-y-2 text-sm mb-4'>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-muted-foreground' />
                    <span className='font-medium'>{phase.effort_hours} horas</span>
                  </div>
                  {phase.tasks.length > 0 && (
                    <div className='mt-3 space-y-1'>
                      {phase.tasks.map((task: any, idx: number) => (
                        <div key={idx} className='text-xs text-muted-foreground'>
                          • {task.name} ({task.effort_hours}h)
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='mt-4 pt-4 border-t border-gray-800'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Status</span>
                    <span className={getStatusColor(phase.status)}>
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

      {/* Progress Metrics */}
      <div className='rounded-lg border bg-card p-6'>
        <h2 className='text-xl font-semibold mb-4'>Métricas de Progresso</h2>
        <div className='space-y-4'>
          {metrics.map((metric: any, idx: number) => (
            <div key={idx}>
              <div className='flex items-center justify-between mb-2 text-sm'>
                <span className='font-medium'>{metric.name}</span>
                <span className='text-muted-foreground'>
                  {metric.current.toLocaleString('pt-BR')} / {metric.target.toLocaleString('pt-BR')} {metric.unit}
                </span>
              </div>
              <div className='w-full bg-gray-800 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all ${
                    metric.current === 0 ? 'bg-red-500' :
                    metric.current < metric.target * 0.5 ? 'bg-orange-500' :
                    metric.current < metric.target ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{
                    width: `${metric.target > 0 ? (metric.current / metric.target) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className='rounded-lg border bg-card p-6'>
        <h2 className='text-xl font-semibold mb-4'>Timeline de Implementação</h2>
        <div className='relative'>
          <div className='absolute left-6 top-0 bottom-0 w-px bg-gray-800' />
          <div className='space-y-6'>
            {timeline.map((item: any, idx: number) => (
              <div key={idx} className='relative flex items-center gap-4 pl-12'>
                <div
                  className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                    item.status === 'completed' ? 'bg-green-500 border-green-500' :
                    item.status === 'in_progress' ? 'bg-blue-500 border-blue-500' :
                    'bg-gray-900 border-gray-700'
                  }`}
                />
                <div className='flex-1'>
                  <div className='font-semibold'>{item.week}</div>
                  <div className='text-sm text-muted-foreground'>{item.task}</div>
                </div>
                <div>
                  {item.status === 'pending' && (
                    <span className='text-sm text-muted-foreground'>Pendente</span>
                  )}
                  {item.status === 'in_progress' && (
                    <span className='text-sm text-blue-500'>Em Progresso</span>
                  )}
                  {item.status === 'completed' && (
                    <span className='text-sm text-green-500'>Concluído</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {summary.total_gaps > 0 && (
        <div className='rounded-lg border border-orange-500/20 bg-orange-500/5 p-6'>
          <div className='flex items-start gap-4'>
            <TrendingUp className='w-6 h-6 text-orange-500 flex-shrink-0 mt-1' />
            <div className='flex-1'>
              <h3 className='font-semibold mb-2 text-orange-500'>Pronto para Iniciar</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                O plano identifica <strong>{summary.total_gaps} gaps</strong> ({summary.critical_gaps} críticos) 
                que requerem ação. Esforço total estimado: <strong>{summary.total_effort_hours} horas</strong> 
                ({summary.total_effort_weeks} semanas-pessoa).
              </p>
              <div className='flex gap-3'>
                <button className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all text-sm font-medium'>
                  Iniciar Fase 1: Assessment
                </button>
                <Link href='/dashboard/remediation/gaps'>
                  <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-orange-500 transition-all text-sm'>
                    Ver Gap Analysis Completo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
