import { Shield, Globe, CheckCircle2, AlertTriangle, ArrowLeft, ExternalLink, FileText, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const dynamic = 'force-dynamic';

async function getFrameworkDetails(frameworkId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/compliance/frameworks/${frameworkId}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch framework details');
    return res.json();
  } catch (error) {
    console.error('Error fetching framework details:', error);
    return {
      framework: null,
      controls: [],
      controls_by_category: {},
      statistics: {
        total: 0,
        assessed: 0,
        compliant: 0,
        partially_compliant: 0,
        non_compliant: 0,
        compliance_rate: 0,
      },
    };
  }
}

// Map framework names to icons
const getFrameworkIcon = (name: string) => {
  if (name.includes('IEC')) return Globe;
  if (name.includes('NIST')) return Shield;
  if (name.includes('ISO')) return CheckCircle2;
  if (name.includes('CIS')) return AlertTriangle;
  return Shield;
};

// Get status badge color
const getStatusColor = (status: string | null) => {
  if (!status) return 'border-gray-500/50 text-gray-500 bg-gray-500/10';
  switch (status) {
    case 'compliant': return 'border-green-500/50 text-green-500 bg-green-500/10';
    case 'partially_compliant': return 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10';
    case 'non_compliant': return 'border-red-500/50 text-red-500 bg-red-500/10';
    case 'not_applicable': return 'border-gray-500/50 text-gray-500 bg-gray-500/10';
    default: return 'border-gray-500/50 text-gray-500 bg-gray-500/10';
  }
};

const getStatusText = (status: string | null) => {
  if (!status) return 'Não avaliado';
  switch (status) {
    case 'compliant': return 'Conforme';
    case 'partially_compliant': return 'Parcialmente Conforme';
    case 'non_compliant': return 'Não Conforme';
    case 'not_applicable': return 'Não Aplicável';
    default: return 'Não Avaliado';
  }
};

export default async function FrameworkDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getFrameworkDetails(id);
  const { framework, controls, controls_by_category, statistics } = data;

  if (!framework) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-6'>
        <AlertTriangle className='w-12 h-12 text-orange-500 mb-4' />
        <h2 className='text-2xl font-bold mb-2'>Framework não encontrado</h2>
        <Link href='/dashboard/compliance/frameworks'>
          <Button variant='outline'>Voltar para Frameworks</Button>
        </Link>
      </div>
    );
  }

  const Icon = getFrameworkIcon(framework.framework_name);

  return (
    <div className='flex flex-1 flex-col gap-6 p-6 pt-0'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/dashboard/compliance/frameworks'>
            <Button variant='ghost' size='icon'>
              <ArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-brand-cyan/10 p-2'>
              <Icon className='w-6 h-6 text-brand-cyan' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>{framework.framework_name}</h1>
              <p className='text-muted-foreground'>
                {framework.version} • {framework.description}
              </p>
            </div>
          </div>
        </div>
        <Badge variant='outline' className='border-brand-cyan/50 text-brand-cyan bg-brand-cyan/10'>
          {statistics.total} controles
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card className='relative overflow-hidden border-muted-foreground/20 bg-gradient-to-br from-background to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-muted-foreground/10 p-1.5'>
                <FileText className='h-4 w-4 text-muted-foreground' />
              </div>
              Total de Controles
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {statistics.total}
            </CardTitle>
          </CardHeader>
          <CardContent className='relative pt-0'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span>Controles mapeados</span>
            </div>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-green-500/10 p-1.5'>
                <CheckCircle2 className='h-4 w-4 text-green-500' />
              </div>
              Conformes
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-green-500'>
              {statistics.compliant}
            </CardTitle>
          </CardHeader>
          <CardContent className='relative pt-0'>
            <div className='flex items-center gap-2 text-xs text-green-500 font-medium'>
              <span>{statistics.compliance_rate}% compliance</span>
            </div>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-yellow-500/10 p-1.5'>
                <Clock className='h-4 w-4 text-yellow-500' />
              </div>
              Parcialmente Conformes
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-yellow-500'>
              {statistics.partially_compliant}
            </CardTitle>
          </CardHeader>
          <CardContent className='relative pt-0'>
            <div className='flex items-center gap-2 text-xs text-yellow-500 font-medium'>
              <span>Requerem atenção</span>
            </div>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-red-500/10 p-1.5'>
                <XCircle className='h-4 w-4 text-red-500' />
              </div>
              Não Conformes
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-red-500'>
              {statistics.non_compliant}
            </CardTitle>
          </CardHeader>
          <CardContent className='relative pt-0'>
            <div className='flex items-center gap-2 text-xs text-red-500 font-medium'>
              <span>Ação necessária</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Progress */}
      <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
        <CardHeader>
          <CardTitle>Progresso de Conformidade</CardTitle>
          <CardDescription>
            Status geral de conformidade com este framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Taxa de Conformidade</span>
              <span className='text-sm font-bold'>{statistics.compliance_rate}%</span>
            </div>
            <Progress value={statistics.compliance_rate} className='h-3' />
            <div className='grid grid-cols-3 gap-4 text-xs text-muted-foreground'>
              <div>
                <span className='font-medium'>Avaliados:</span> {statistics.assessed}/{statistics.total}
              </div>
              <div>
                <span className='font-medium'>Pendentes:</span> {statistics.total - statistics.assessed}
              </div>
              <div>
                <span className='font-medium'>Não Aplicáveis:</span> {statistics.not_applicable}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls by Category */}
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>Controles por Categoria</h2>
          <p className='text-muted-foreground'>
            Todos os controles mapeados para este framework
          </p>
        </div>

        {Object.keys(controls_by_category).length === 0 ? (
          <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
            <CardContent className='p-12 text-center'>
              <AlertTriangle className='w-12 h-12 mx-auto mb-4 text-orange-500' />
              <p className='text-lg font-medium text-muted-foreground mb-2'>
                Nenhum controle encontrado
              </p>
              <p className='text-sm text-muted-foreground'>
                Execute o script de mapeamento de controles para adicionar controles a este framework.
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(controls_by_category).map(([category, categoryControls]) => {
            const controls = Array.isArray(categoryControls) ? categoryControls : [];
            return (
            <Card key={category} className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='w-5 h-5 text-brand-cyan' />
                  {category}
                </CardTitle>
                <CardDescription>
                  {controls.length} controle{controls.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
                <CardContent>
                <div className='space-y-4'>
                  {controls.map((control: any) => (
                    <div
                      key={control.id}
                      className='p-4 rounded-lg border bg-background hover:border-brand-cyan/50 transition-all'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-3 mb-2'>
                            <Badge variant='outline' className='font-mono text-xs'>
                              {control.control_code}
                            </Badge>
                            <Badge className={getStatusColor(control.assessment_status)}>
                              {getStatusText(control.assessment_status)}
                            </Badge>
                          </div>
                          <h3 className='font-semibold text-lg mb-2'>{control.control_title}</h3>
                          <p className='text-sm text-muted-foreground mb-3'>
                            {control.description}
                          </p>
                          {control.requirement_text && (
                            <div className='mt-3 p-3 bg-muted/50 rounded-md'>
                              <p className='text-xs font-medium text-muted-foreground mb-1'>
                                Requisito:
                              </p>
                              <p className='text-sm'>{control.requirement_text}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {control.gap_description && (
                        <div className='mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md'>
                          <p className='text-xs font-medium text-yellow-500 mb-1'>Gap Identificado:</p>
                          <p className='text-sm text-yellow-500/90'>{control.gap_description}</p>
                        </div>
                      )}
                      {control.remediation_plan && (
                        <div className='mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md'>
                          <p className='text-xs font-medium text-blue-500 mb-1'>Plano de Remediação:</p>
                          <p className='text-sm text-blue-500/90'>{control.remediation_plan}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                </CardContent>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
