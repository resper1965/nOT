import { Calendar, Clock, CheckCircle2, AlertTriangle, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getTimelineData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/remediation/plan`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return {
      phases: [],
      timeline: [],
      metrics: [],
      summary: {
        total_phases: 0,
        total_effort_hours: 0,
        total_effort_weeks: 0,
        estimated_duration_days: 0,
        total_gaps: 0,
        critical_gaps: 0,
      },
    };
  }
}

export default async function TimelinePage() {
  const data = await getTimelineData();
  const { phases, timeline, metrics, summary } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'in_progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'pending': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Clock;
      case 'pending': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Progresso';
      case 'pending': return 'Pendente';
      default: return 'Pendente';
    }
  };

  // Organizar timeline por fases
  const timelineByPhase = phases.map((phase: any, phaseIndex: number) => {
    // Filtrar timeline items que pertencem a esta fase
    const phaseTimeline = timeline.filter((item: any, index: number) => {
      // Mapear timeline items para fases baseado no índice
      if (phaseIndex === 0) {
        // Fase 1: Semanas 1-4
        return index < 2;
      } else if (phaseIndex === 1) {
        // Fase 2: Semanas 5-8
        return index >= 2 && index < 4;
      } else {
        // Fase 3: Semanas 9-13
        return index >= 4;
      }
    });

    return {
      phase,
      timeline: phaseTimeline,
    };
  });

  // Calcular progresso geral
  const totalTimelineItems = timeline.length;
  const completedItems = timeline.filter((item: any) => item.status === 'completed').length;
  const inProgressItems = timeline.filter((item: any) => item.status === 'in_progress').length;
  const pendingItems = timeline.filter((item: any) => item.status === 'pending').length;
  const progressPercentage = totalTimelineItems > 0 ? (completedItems / totalTimelineItems) * 100 : 0;

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Timeline de Implementação</h1>
          <p className='text-muted-foreground'>
            Cronograma detalhado de 90 dias para adequação aos requisitos ONS
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
            <div className='text-sm font-medium text-muted-foreground'>Progresso Geral</div>
            <TrendingUp className='h-4 w-4 text-blue-500' />
          </div>
          <div className='text-2xl font-bold'>{Math.round(progressPercentage)}%</div>
          <div className='text-xs text-muted-foreground'>
            {completedItems} de {totalTimelineItems} tarefas concluídas
          </div>
          <div className='mt-2 w-full bg-gray-800 rounded-full h-2'>
            <div
              className='bg-blue-500 h-2 rounded-full transition-all'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Tarefas Concluídas</div>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          </div>
          <div className='text-2xl font-bold text-green-500'>{completedItems}</div>
          <div className='text-xs text-muted-foreground'>Finalizadas</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Em Progresso</div>
            <Clock className='h-4 w-4 text-blue-500' />
          </div>
          <div className='text-2xl font-bold text-blue-500'>{inProgressItems}</div>
          <div className='text-xs text-muted-foreground'>Executando</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Pendentes</div>
            <AlertTriangle className='h-4 w-4 text-orange-500' />
          </div>
          <div className='text-2xl font-bold text-orange-500'>{pendingItems}</div>
          <div className='text-xs text-muted-foreground'>Aguardando</div>
        </div>
      </div>

      {/* Timeline por Fase */}
      <div className='space-y-8'>
        {timelineByPhase.map((phaseData: any, phaseIndex: number) => {
          const { phase, timeline: phaseTimeline } = phaseData;
          const phaseColors = {
            'phase-1': { bg: 'bg-brand-cyan/10', border: 'border-brand-cyan/20', text: 'text-brand-cyan', dot: 'bg-brand-cyan' },
            'phase-2': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', dot: 'bg-purple-500' },
            'phase-3': { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', dot: 'bg-green-500' },
          }[phase.id as string] || { bg: 'bg-gray-900', border: 'border-gray-800', text: 'text-gray-400', dot: 'bg-gray-500' };

          return (
            <div key={phase.id} className='rounded-lg border bg-card p-6'>
              <div className='flex items-center gap-4 mb-6'>
                <div className={`w-12 h-12 rounded-lg ${phaseColors.bg} border ${phaseColors.border} flex items-center justify-center`}>
                  <span className={`text-xl font-bold ${phaseColors.text}`}>
                    {phaseIndex + 1}
                  </span>
                </div>
                <div className='flex-1'>
                  <h2 className='text-xl font-semibold'>{phase.name}</h2>
                  <p className='text-sm text-muted-foreground'>{phase.duration_text}</p>
                </div>
                <div className='text-right'>
                  <div className='text-sm text-muted-foreground'>Esforço</div>
                  <div className='text-lg font-bold'>{phase.effort_hours}h</div>
                </div>
              </div>

              {/* Timeline Visual */}
              <div className='relative'>
                <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${phaseColors.dot}/30`} />
                <div className='space-y-6 pl-12'>
                  {phaseTimeline.length > 0 ? (
                    phaseTimeline.map((item: any, index: number) => {
                      const StatusIcon = getStatusIcon(item.status);
                      const statusColors = getStatusColor(item.status);

                      return (
                        <div key={index} className='relative flex items-start gap-4'>
                          <div
                            className={`absolute -left-6 top-2 w-3 h-3 rounded-full border-2 ${
                              item.status === 'completed' ? `${phaseColors.dot} border-${phaseColors.dot.split('-')[0]}-500` :
                              item.status === 'in_progress' ? `bg-blue-500 border-blue-500` :
                              `${phaseColors.dot}/30 border-gray-700`
                            }`}
                          />
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${statusColors}`}>
                                <StatusIcon className='w-3 h-3' />
                                <span>{getStatusText(item.status)}</span>
                              </div>
                              <span className='text-sm font-semibold text-muted-foreground'>{item.week}</span>
                            </div>
                            <p className='text-sm text-foreground'>{item.task}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='text-sm text-muted-foreground'>
                      Nenhuma tarefa definida para esta fase
                    </div>
                  )}
                </div>
              </div>

              {/* Tarefas da Fase */}
              {phase.tasks && phase.tasks.length > 0 && (
                <div className='mt-6 pt-6 border-t border-gray-800'>
                  <h3 className='text-sm font-semibold mb-3'>Tarefas da Fase</h3>
                  <div className='grid gap-2'>
                    {phase.tasks.map((task: any, taskIndex: number) => (
                      <div key={taskIndex} className='flex items-center justify-between p-2 rounded bg-gray-900'>
                        <div className='flex items-center gap-2'>
                          <Clock className='w-3 h-3 text-muted-foreground' />
                          <span className='text-xs'>{task.name}</span>
                        </div>
                        <span className='text-xs text-muted-foreground'>{task.effort_hours}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline Completo (Visualização Linear) */}
      <div className='rounded-lg border bg-card p-6'>
        <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
          <Calendar className='w-5 h-5' />
          Timeline Completo (90 dias)
        </h2>
        <div className='relative'>
          <div className='absolute left-6 top-0 bottom-0 w-px bg-gray-800' />
          <div className='space-y-4'>
            {timeline.map((item: any, index: number) => {
              const StatusIcon = getStatusIcon(item.status);
              const statusColors = getStatusColor(item.status);

              return (
                <div key={index} className='relative flex items-center gap-4 pl-12'>
                  <div
                    className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                      item.status === 'completed' ? 'bg-green-500 border-green-500' :
                      item.status === 'in_progress' ? 'bg-blue-500 border-blue-500' :
                      'bg-gray-900 border-gray-700'
                    }`}
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-1'>
                      <span className='text-sm font-semibold'>{item.week}</span>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${statusColors}`}>
                        <StatusIcon className='w-3 h-3' />
                        <span>{getStatusText(item.status)}</span>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>{item.task}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Métricas de Progresso */}
      {metrics && metrics.length > 0 && (
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
      )}

      {/* Summary */}
      <div className='rounded-lg border border-blue-500/20 bg-blue-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <Calendar className='w-6 h-6 text-blue-500 flex-shrink-0 mt-1' />
          <div className='flex-1'>
            <h3 className='font-semibold mb-2 text-blue-500'>Resumo do Timeline</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4'>
              <div>
                <div className='text-muted-foreground mb-1'>Duração Total</div>
                <div className='font-bold'>{summary.estimated_duration_days || 90} dias</div>
              </div>
              <div>
                <div className='text-muted-foreground mb-1'>Esforço Total</div>
                <div className='font-bold'>{summary.total_effort_hours || 0}h ({summary.total_effort_weeks || 0} semanas-pessoa)</div>
              </div>
              <div>
                <div className='text-muted-foreground mb-1'>Investimento Estimado</div>
                <div className='font-bold'>
                  {summary.estimated_investment_min ? formatCurrency(summary.estimated_investment_min) : 'N/A'}
                  {summary.estimated_investment_max ? ` - ${formatCurrency(summary.estimated_investment_max)}` : ''}
                </div>
              </div>
            </div>
            <div className='text-xs text-muted-foreground'>
              <strong>{summary.total_gaps || 0} gaps</strong> identificados ({summary.critical_gaps || 0} críticos) 
              requerem ação ao longo de <strong>{summary.total_effort_weeks || 0} semanas</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
