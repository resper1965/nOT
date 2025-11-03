import { AlertTriangle, FileText, DollarSign, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { getAneelRequirements } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AneelPage() {
  const aneelData = await getAneelRequirements().catch(() => ({ 
    requirements: [], 
    total_penalties: "R$ 0,00",
    critical_requirements: 0
  }));
  
  const { requirements, total_penalties, critical_requirements } = aneelData;

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>ANEEL RN 964/2021</h1>
        <p className='text-muted-foreground'>
          Resolução Normativa 964/2021 - Segurança Cibernética no Setor Elétrico
        </p>
      </div>

      {/* Penalty Alert - Design Moderno */}
      <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background'>
        <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent' />
        <CardHeader className='relative pb-3'>
          <div className='flex items-start gap-4'>
            <div className='rounded-lg bg-red-500/10 p-2'>
              <DollarSign className='w-6 h-6 text-red-500' />
            </div>
            <div className='flex-1'>
              <CardTitle className='text-red-500 mb-2'>
                Penalidades por Não Conformidade: {total_penalties}
              </CardTitle>
              <CardDescription className='mb-3'>
                <strong>ANEEL RN 964/2021</strong> estabelece multas de até R$ 100.000,00 por requisito não atendido.
                Total de {critical_requirements} requisitos críticos pendentes.
              </CardDescription>
              <div className='rounded-lg border border-border/50 bg-muted/30 p-4 font-mono text-xs'>
                <div className='text-red-500 mb-2'>Art. 4º - Requisitos Obrigatórios:</div>
                <div className='space-y-1 text-muted-foreground'>
                  <div>• <span className='text-[#00ade8]'>I</span> - Política de Segurança Cibernética</div>
                  <div>• <span className='text-[#00ade8]'>II</span> - Plano de Resposta a Incidentes</div>
                  <div>• <span className='text-[#00ade8]'>III</span> - Gestão de Vulnerabilidades</div>
                  <div>• <span className='text-[#00ade8]'>IV</span> - Controle de Acesso</div>
                  <div>• <span className='text-[#00ade8]'>V</span> - Backup e Recuperação</div>
                  <div>• <span className='text-[#00ade8]'>VI</span> - Continuidade de Negócio</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards - Design Moderno */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                  <FileText className='h-4 w-4 text-[#00ade8]' />
                </div>
                Total
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {requirements.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Requisitos obrigatórios</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-red-500/10 p-1.5'>
                  <XCircle className='h-4 w-4 text-red-500' />
                </div>
                Críticos
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-red-500'>
              {critical_requirements}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-red-500 font-medium'>Pendentes</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-red-500/10 p-1.5'>
                  <DollarSign className='h-4 w-4 text-red-500' />
                </div>
                Penalidades
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-red-500'>
              {total_penalties}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-red-500 font-medium'>Multas potenciais</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-orange-500/10 p-1.5'>
                  <Calendar className='h-4 w-4 text-orange-500' />
                </div>
                Prazo
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-orange-500'>
              Imediato
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-orange-500 font-medium'>Implementação</span>
          </CardFooter>
        </Card>
      </div>

      {/* Requirements List - Design Moderno */}
      <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
        <CardHeader className='border-b border-border/50'>
          <CardTitle className='flex items-center gap-2'>
            <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
              <FileText className='h-4 w-4 text-[#00ade8]' />
            </div>
            Requisitos ANEEL RN 964/2021
          </CardTitle>
          <CardDescription className='mt-1.5'>
            Todos os requisitos são obrigatórios e têm prazo imediato
          </CardDescription>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-3'>
            {requirements.map((req: any) => (
              <div 
                key={req.id} 
                className='group flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-all hover:border-[#00ade8]/50 hover:bg-muted/50'
              >
                <div className='flex items-center gap-4 flex-1'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline' className='border-[#00ade8]/50 text-[#00ade8] bg-[#00ade8]/10 font-mono text-xs'>
                      {req.article}
                    </Badge>
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
                  <Badge 
                    variant='outline' 
                    className='border-red-500/50 text-red-500 bg-red-500/10 text-xs uppercase font-medium'
                  >
                    {req.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
