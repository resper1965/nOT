import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Shield, Network, FileText, AlertTriangle } from 'lucide-react';
import { getAssetsStats, getNetworkTopology } from '@/lib/api';
import React from 'react';

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
  const stats = await getAssetsStats().catch(() => ({ total_assets: 0, total_vlans: 0, total_ips: 0 }));
  const topology = await getNetworkTopology().catch(() => ({ devices: {}, vlans: 0, ips: 0 }));
  
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-3'>
        {/* 4 Cards das Métricas Principais - mais compactos */}
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                Total de Assets
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums'>
                {stats.total_assets?.toLocaleString('pt-BR') || '0'}
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className={stats.total_assets > 0 ? "text-green-500" : "text-orange-500"}>
                  {stats.total_assets > 0 ? 'Importado' : 'Aguardando'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='pt-0 pb-3 text-xs text-muted-foreground'>
              {topology.devices?.router || 0} routers • {topology.devices?.switch || 0} switches
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Conformidade ONS
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums text-red-500'>
                0%
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className="text-red-500">
                  Não Conforme
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='pt-0 pb-3 text-xs text-red-500 font-medium'>
              5 controles mínimos pendentes
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documentos
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums'>
                0<span className="text-muted-foreground">/50</span>
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className="text-red-500">
                  96% faltando
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='pt-0 pb-3 text-xs text-muted-foreground'>
              ANEEL RN 964 + ONS
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Gaps Críticos
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums text-orange-500'>
                6
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className="text-orange-500">
                  CVSS 9.1
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='pt-0 pb-3 text-xs text-orange-500 font-medium'>
              560h de adequação necessária
            </CardFooter>
          </Card>
        </div>

        {/* Parallel Routes (charts) - Layout otimizado sem espaços vazios */}
        <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
          {/* Linha 1: Distribuição de Assets + Gaps Críticos */}
          <div className="lg:col-span-1">{bar_stats}</div>
          <div className="lg:col-span-1">{sales}</div>
          
          {/* Linha 2: Segmentação + Pie Chart */}
          <div className="lg:col-span-1">{area_stats}</div>
          <div className="lg:col-span-1">{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}

