'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Shield, FileCheck, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'

interface KPIData {
  summary: any
  framework_compliance: any[]
  evidence_validity: any
  baseline_coverage: any
  cyber_analysis: any
  exceptions: any
  mttr: any
}

export function KPIDashboard() {
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKPIs()
  }, [])

  const loadKPIs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/kpis/dashboard')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setKpis(data)
    } catch (error) {
      console.error('Error loading KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-muted-foreground'>Carregando KPIs...</div>
      </div>
    )
  }

  if (!kpis) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-muted-foreground'>Nenhum dado disponível</div>
      </div>
    )
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500'
    if (percentage >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getComplianceBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className='bg-green-500/10 text-green-500'>Excelente</Badge>
    if (percentage >= 70) return <Badge className='bg-yellow-500/10 text-yellow-500'>Bom</Badge>
    return <Badge className='bg-red-500/10 text-red-500'>Atenção</Badge>
  }

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      {/* Conformidade Geral */}
      <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
        <CardHeader className='relative pb-3'>
          <CardDescription className='flex items-center gap-2 text-xs font-medium'>
            <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
              <CheckCircle2 className='h-4 w-4 text-[#00ade8]' />
            </div>
            Conformidade Geral
          </CardDescription>
          <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
            {kpis.summary?.top_framework_compliance?.toFixed(1) || '0'}%
          </CardTitle>
        </CardHeader>
        <CardContent className='relative'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>
              {kpis.summary?.top_framework || 'N/A'}
            </span>
            {kpis.summary?.top_framework_compliance && 
              getComplianceBadge(kpis.summary.top_framework_compliance)
            }
          </div>
        </CardContent>
      </Card>

      {/* Validade de Evidências */}
      <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
        <CardHeader className='relative pb-3'>
          <CardDescription className='flex items-center gap-2 text-xs font-medium'>
            <div className='rounded-lg bg-blue-500/10 p-1.5'>
              <FileCheck className='h-4 w-4 text-blue-500' />
            </div>
            Evidências Válidas
          </CardDescription>
          <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
            {kpis.evidence_validity?.validity_percentage?.toFixed(1) || '0'}%
          </CardTitle>
        </CardHeader>
        <CardContent className='relative'>
          <div className='space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Total:</span>
              <span className='font-medium'>{kpis.evidence_validity?.total_evidence_packages || 0}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Vencidas:</span>
              <span className='font-medium text-red-500'>
                {kpis.evidence_validity?.expired_evidence || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Baseline de Ativos Críticos */}
      <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
        <CardHeader className='relative pb-3'>
          <CardDescription className='flex items-center gap-2 text-xs font-medium'>
            <div className='rounded-lg bg-purple-500/10 p-1.5'>
              <Shield className='h-4 w-4 text-purple-500' />
            </div>
            Baseline Críticos
          </CardDescription>
          <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
            {kpis.baseline_coverage?.baseline_coverage_percentage?.toFixed(1) || '0'}%
          </CardTitle>
        </CardHeader>
        <CardContent className='relative'>
          <div className='space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Com baseline:</span>
              <span className='font-medium text-green-500'>
                {kpis.baseline_coverage?.assets_with_baseline || 0}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Sem baseline:</span>
              <span className='font-medium text-red-500'>
                {kpis.baseline_coverage?.assets_without_baseline || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise Cyber em Mudanças */}
      <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
        <CardHeader className='relative pb-3'>
          <CardDescription className='flex items-center gap-2 text-xs font-medium'>
            <div className='rounded-lg bg-orange-500/10 p-1.5'>
              <Activity className='h-4 w-4 text-orange-500' />
            </div>
            Análise Cyber
          </CardDescription>
          <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
            {kpis.cyber_analysis?.cyber_analysis_percentage?.toFixed(1) || '0'}%
          </CardTitle>
        </CardHeader>
        <CardContent className='relative'>
          <div className='space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Com análise:</span>
              <span className='font-medium text-green-500'>
                {kpis.cyber_analysis?.changes_with_cyber_analysis || 0}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Total mudanças:</span>
              <span className='font-medium'>{kpis.cyber_analysis?.total_changes || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status de Exceções */}
      <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
        <CardHeader className='relative pb-3'>
          <CardDescription className='flex items-center gap-2 text-xs font-medium'>
            <div className='rounded-lg bg-yellow-500/10 p-1.5'>
              <AlertTriangle className='h-4 w-4 text-yellow-500' />
            </div>
            Exceções Válidas
          </CardDescription>
          <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
            {kpis.exceptions?.valid_exceptions_percentage?.toFixed(1) || '0'}%
          </CardTitle>
        </CardHeader>
        <CardContent className='relative'>
          <div className='space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Válidas:</span>
              <span className='font-medium text-green-500'>
                {kpis.exceptions?.valid_exceptions || 0}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Vencidas:</span>
              <span className='font-medium text-red-500'>
                {kpis.exceptions?.expired_exceptions || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MTTR */}
      <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
        <CardHeader className='relative pb-3'>
          <CardDescription className='flex items-center gap-2 text-xs font-medium'>
            <div className='rounded-lg bg-indigo-500/10 p-1.5'>
              <Clock className='h-4 w-4 text-indigo-500' />
            </div>
            MTTR (horas)
          </CardDescription>
          <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
            {kpis.mttr?.avg_time_to_resolve_hours?.toFixed(1) || '0'}h
          </CardTitle>
        </CardHeader>
        <CardContent className='relative'>
          <div className='space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Mínimo:</span>
              <span className='font-medium'>
                {kpis.mttr?.min_time_to_resolve_hours?.toFixed(1) || '0'}h
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Máximo:</span>
              <span className='font-medium'>
                {kpis.mttr?.max_time_to_resolve_hours?.toFixed(1) || '0'}h
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conformidade por Framework - Gráfico de Barras */}
      {kpis.framework_compliance && kpis.framework_compliance.length > 0 && (
        <>
          <Card className='md:col-span-2 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Conformidade por Framework</CardTitle>
              <CardDescription>
                Percentual de conformidade por framework regulatório
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  compliance: {
                    label: 'Conformidade',
                    color: '#00ade8',
                  },
                }}
                className='h-[300px] w-full'
              >
                <BarChart data={kpis.framework_compliance.map((f: any) => ({
                  name: f.framework_name?.substring(0, 20) || 'N/A',
                  compliance: parseFloat(f.compliance_percentage || 0),
                  conforme: f.compliant_controls || 0,
                  parcial: f.partially_compliant_controls || 0,
                  naoConforme: f.non_compliant_controls || 0,
                }))}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis 
                    dataKey='name' 
                    angle={-45}
                    textAnchor='end'
                    height={80}
                    className='text-xs'
                  />
                  <YAxis 
                    domain={[0, 100]}
                    className='text-xs'
                    label={{ value: 'Conformidade (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey='compliance' 
                    fill='#00ade8'
                    radius={[4, 4, 0, 0]}
                    name='Conformidade (%)'
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Status - Gráfico de Pizza */}
          <Card className='md:col-span-2 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Distribuição de Status de Controles</CardTitle>
              <CardDescription>
                Visão geral dos status de conformidade dos controles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {kpis.framework_compliance.map((framework: any) => {
                  const pieData = [
                    { name: 'Conforme', value: framework.compliant_controls || 0, color: '#10b981' },
                    { name: 'Parcial', value: framework.partially_compliant_controls || 0, color: '#f59e0b' },
                    { name: 'Não Conforme', value: framework.non_compliant_controls || 0, color: '#ef4444' },
                    { name: 'N/A', value: framework.not_applicable_controls || 0, color: '#6b7280' },
                  ].filter(item => item.value > 0);

                  return (
                    <div key={framework.framework_id} className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-semibold text-sm'>{framework.framework_name}</h3>
                        <Badge variant='outline'>{framework.framework_code}</Badge>
                      </div>
                      <ChartContainer
                        config={{
                          conforme: { label: 'Conforme', color: '#10b981' },
                          parcial: { label: 'Parcial', color: '#f59e0b' },
                          naoConforme: { label: 'Não Conforme', color: '#ef4444' },
                          na: { label: 'N/A', color: '#6b7280' },
                        }}
                        className='h-[250px] w-full'
                      >
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx='50%'
                            cy='50%'
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill='#8884d8'
                            dataKey='value'
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ChartContainer>
                      <div className='grid grid-cols-2 gap-2 text-xs'>
                        <div className='flex items-center gap-2'>
                          <div className='w-3 h-3 rounded-full bg-green-500' />
                          <span>Conforme: {framework.compliant_controls || 0}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='w-3 h-3 rounded-full bg-yellow-500' />
                          <span>Parcial: {framework.partially_compliant_controls || 0}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='w-3 h-3 rounded-full bg-red-500' />
                          <span>Não Conforme: {framework.non_compliant_controls || 0}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='w-3 h-3 rounded-full bg-gray-500' />
                          <span>N/A: {framework.not_applicable_controls || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

