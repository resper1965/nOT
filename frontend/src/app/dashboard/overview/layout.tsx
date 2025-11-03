import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Shield, Network, FileText, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { getAssetsStats, getNetworkTopology } from '@/lib/api';
import React from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  // Fetch real data from API
  const stats = await getAssetsStats().catch(() => ({ 
    total_assets: 0, 
    total_vlans: 0, 
    total_ips: 0,
    by_type: [],
    by_criticality: []
  }));
  
  const topology = await getNetworkTopology().catch(() => ({ 
    devices: {}, 
    subnets: 0, 
    connections: 0 
  }));
  
  // Calculate compliance percentage (mock for now, will be replaced with real API)
  const compliancePercent = 0;
  const documentsCount = 0;
  const documentsTotal = 50;
  const gapsCount = 6;
  const criticalGaps = 2;

  // Get asset type breakdown
  const routerCount = stats.by_type?.find((t: any) => t.type?.toLowerCase().includes('router'))?.count || 0;
  const switchCount = stats.by_type?.find((t: any) => t.type?.toLowerCase().includes('switch'))?.count || 0;
  const firewallCount = stats.by_type?.find((t: any) => t.type?.toLowerCase().includes('firewall'))?.count || 0;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header Section */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Visão Geral</h1>
          <p className='text-muted-foreground'>
            Dashboard executivo com métricas principais do ness. OT GRC
          </p>
        </div>

        {/* 4 Cards das Métricas Principais - Design Moderno */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Total de Assets */}
          <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
            <CardHeader className='relative pb-3'>
              <div className='flex items-center justify-between'>
                <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                  <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                    <Network className='h-4 w-4 text-[#00ade8]' />
                  </div>
                  Total de Assets
                </CardDescription>
                <Badge 
                  variant='outline' 
                  className={`text-xs ${stats.total_assets > 0 ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-orange-500/50 text-orange-500 bg-orange-500/10'}`}
                >
                  {stats.total_assets > 0 ? 'Ativo' : 'Aguardando'}
                </Badge>
              </div>
              <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
                {stats.total_assets?.toLocaleString('pt-BR') || '0'}
              </CardTitle>
            </CardHeader>
            <CardFooter className='relative flex items-center gap-4 pt-0 text-xs'>
              <div className='flex items-center gap-1.5'>
                <div className='h-1.5 w-1.5 rounded-full bg-[#00ade8]' />
                <span className='text-muted-foreground'>{routerCount} routers</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='h-1.5 w-1.5 rounded-full bg-blue-500' />
                <span className='text-muted-foreground'>{switchCount} switches</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 2: Conformidade ONS */}
          <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
            <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent' />
            <CardHeader className='relative pb-3'>
              <div className='flex items-center justify-between'>
                <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                  <div className='rounded-lg bg-red-500/10 p-1.5'>
                    <Shield className='h-4 w-4 text-red-500' />
                  </div>
                  Conformidade ONS
                </CardDescription>
                <Badge variant='outline' className='border-red-500/50 text-red-500 bg-red-500/10 text-xs'>
                  Crítico
                </Badge>
              </div>
              <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-red-500'>
                {compliancePercent}%
              </CardTitle>
            </CardHeader>
            <CardFooter className='relative pt-0'>
              <div className='flex items-center gap-2 text-xs'>
                <AlertTriangle className='h-3.5 w-3.5 text-red-500' />
                <span className='text-red-500 font-medium'>5 controles mínimos pendentes</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 3: Documentos */}
          <Card className='relative overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
            <div className='absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent' />
            <CardHeader className='relative pb-3'>
              <div className='flex items-center justify-between'>
                <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                  <div className='rounded-lg bg-orange-500/10 p-1.5'>
                    <FileText className='h-4 w-4 text-orange-500' />
                  </div>
                  Documentos
                </CardDescription>
                <Badge variant='outline' className='border-orange-500/50 text-orange-500 bg-orange-500/10 text-xs'>
                  {Math.round((documentsCount / documentsTotal) * 100)}% completo
                </Badge>
              </div>
              <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
                {documentsCount}<span className='text-lg font-normal text-muted-foreground'>/{documentsTotal}</span>
              </CardTitle>
            </CardHeader>
            <CardFooter className='relative pt-0'>
              <div className='flex items-center gap-2 text-xs'>
                <FileText className='h-3.5 w-3.5 text-orange-500' />
                <span className='text-orange-500 font-medium'>ANEEL RN 964 + ONS</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 4: Gaps Críticos */}
          <Card className='relative overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
            <div className='absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent' />
            <CardHeader className='relative pb-3'>
              <div className='flex items-center justify-between'>
                <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                  <div className='rounded-lg bg-orange-500/10 p-1.5'>
                    <AlertTriangle className='h-4 w-4 text-orange-500' />
                  </div>
                  Gaps Críticos
                </CardDescription>
                <Badge variant='outline' className='border-orange-500/50 text-orange-500 bg-orange-500/10 text-xs'>
                  CVSS 9.1
                </Badge>
              </div>
              <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-orange-500'>
                {gapsCount}
              </CardTitle>
            </CardHeader>
            <CardFooter className='relative pt-0'>
              <div className='flex items-center gap-2 text-xs'>
                <TrendingUp className='h-3.5 w-3.5 text-orange-500' />
                <span className='text-orange-500 font-medium'>{criticalGaps} críticos • 560h estimadas</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Charts Grid - Layout Moderno */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {/* Linha 1: Distribuição de Assets + Gaps Críticos */}
          <div className='lg:col-span-1'>{bar_stats}</div>
          <div className='lg:col-span-1'>{sales}</div>
          
          {/* Linha 2: Segmentação + Compliance */}
          <div className='lg:col-span-1'>{area_stats}</div>
          <div className='lg:col-span-1'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
