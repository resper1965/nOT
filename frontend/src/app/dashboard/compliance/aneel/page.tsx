import { AlertTriangle, FileText, DollarSign, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { getAneelRequirements } from '@/lib/api'

export default async function AneelPage() {
  const aneelData = await getAneelRequirements().catch(() => ({ 
    requirements: [], 
    total_penalties: "R$ 0,00",
    critical_requirements: 0
  }));
  
  const { requirements, total_penalties, critical_requirements } = aneelData;

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>ANEEL RN 964/2021</h1>
          <p className='text-muted-foreground'>
            Resolução Normativa 964/2021 - Segurança Cibernética no Setor Elétrico
          </p>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <FileText className='w-4 h-4' />
          <span>Regulamentação obrigatória</span>
        </div>
      </div>

      {/* Penalty Alert */}
      <div className='rounded-lg border border-red-500/20 bg-red-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <DollarSign className='w-6 h-6 text-red-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-red-500'>
              Penalidades por Não Conformidade: {total_penalties}
            </h3>
            <p className='text-sm text-muted-foreground mb-3'>
              <strong>ANEEL RN 964/2021</strong> estabelece multas de até R$ 100.000,00 por requisito não atendido.
              Total de {critical_requirements} requisitos críticos pendentes.
            </p>
            <div className='bg-gray-900 rounded-lg p-4 mb-3 font-mono text-xs'>
              <div className='text-red-500'>Art. 4º - Requisitos Obrigatórios:</div>
              <div className='mt-2 space-y-1'>
                <div>• <span className='text-brand-cyan'>I</span> - Política de Segurança Cibernética</div>
                <div>• <span className='text-brand-cyan'>II</span> - Plano de Resposta a Incidentes</div>
                <div>• <span className='text-brand-cyan'>III</span> - Gestão de Vulnerabilidades</div>
                <div>• <span className='text-brand-cyan'>IV</span> - Controle de Acesso</div>
                <div>• <span className='text-brand-cyan'>V</span> - Backup e Recuperação</div>
                <div>• <span className='text-brand-cyan'>VI</span> - Continuidade de Negócio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Total</div>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold'>{requirements.length}</div>
          <div className='text-xs text-muted-foreground'>Requisitos obrigatórios</div>
        </div>
        
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Críticos</div>
            <XCircle className='h-4 w-4 text-red-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-red-500'>{critical_requirements}</div>
          <div className='text-xs text-muted-foreground'>Pendentes</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Penalidades</div>
            <DollarSign className='h-4 w-4 text-red-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-red-500'>{total_penalties}</div>
          <div className='text-xs text-muted-foreground'>Multas potenciais</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Prazo</div>
            <Calendar className='h-4 w-4 text-orange-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-orange-500'>Imediato</div>
          <div className='text-xs text-muted-foreground'>Implementação</div>
        </div>
      </div>

      {/* Requirements List */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Requisitos ANEEL RN 964/2021</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Todos os requisitos são obrigatórios e têm prazo imediato
          </p>
        </div>
        <div className='p-4'>
          <div className='space-y-3'>
            {requirements.map((req: any) => (
              <div key={req.id} className='flex items-center justify-between p-4 rounded-lg border hover:border-brand-cyan/50 transition-all'>
                <div className='flex items-center gap-4 flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono text-sm text-brand-cyan'>{req.article}</span>
                    <XCircle className='w-4 h-4 text-red-500' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>{req.requirement}</div>
                    <div className='text-sm text-muted-foreground mt-1'>{req.description}</div>
                    <div className='text-xs text-muted-foreground mt-2'>
                      <strong>Prazo:</strong> {req.deadline} | <strong>Penalidade:</strong> {req.penalty}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-xs px-2 py-1 rounded bg-red-500/10 text-red-500 uppercase font-medium'>
                    {req.status}
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
