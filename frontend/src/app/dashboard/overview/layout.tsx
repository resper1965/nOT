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
      <div className='flex flex-1 flex-col space-y-2'>
        {/* 4 Cards das Métricas Principais */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                Total de Assets
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.total_assets?.toLocaleString('pt-BR') || '0'}
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className={stats.total_assets > 0 ? "text-green-500" : "text-orange-500"}>
                  {stats.total_assets > 0 ? 'Importado' : 'Aguardando'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>
                Rede TBE - {topology.devices?.router || 0} routers, {topology.devices?.switch || 0} switches
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Conformidade ONS
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-500'>
                0%
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className="text-red-500">
                  Não Conforme
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-red-500'>
                5 controles mínimos pendentes
              </div>
              <div className='text-muted-foreground'>
                Requer ação imediata
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documentos
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                0<span className="text-muted-foreground">/50</span>
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className="text-red-500">
                  96% faltando
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>
                ANEEL RN 964 + ONS obrigatórios
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Gaps Críticos
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-500'>
                6
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className="text-orange-500">
                  CVSS 9.1
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-orange-500'>
                Modelo Purdue não implementado
              </div>
              <div className='text-muted-foreground'>
                560h de adequação necessária
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Parallel Routes (charts) */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}

