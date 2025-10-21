import Link from 'next/link'
import { Shield, Activity, AlertTriangle, CheckCircle2, XCircle, Clock, TrendingUp, FileText, Network, Settings } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-7 h-7 text-brand-cyan icon-ness" />
            </div>
            <div className="flex flex-col">
              <h1 className="ness-wordmark font-medium text-2xl">
                ness<span className="ness-wordmark-dot">.</span>
              </h1>
              <span className="text-gray-400 font-normal text-sm">OT GRC</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-brand-cyan">Dashboard</Link>
            <Link href="/" className="text-gray-400 hover:text-brand-cyan transition-ness">Início</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Visão geral da plataforma OT GRC</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Status Geral</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">Operacional</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Assets</span>
              <Network className="w-5 h-5 text-brand-cyan" />
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-gray-500 mt-1">Aguardando importação</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Conformidade</span>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">0%</div>
            <div className="text-xs text-gray-500 mt-1">ONS + ANEEL</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Documentos</span>
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">0/50</div>
            <div className="text-xs text-gray-500 mt-1">Obrigatórios</div>
          </div>
        </div>

        {/* 3 Frentes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">As 3 Frentes do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Frente 1: Normativa */}
            <Link href="/dashboard/compliance" className="block">
              <div className="surface-1 p-6 rounded-lg border border-gray-800 card-hover-ness h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20">
                    <FileText className="w-6 h-6 text-brand-cyan icon-ness" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">1. Normativa</h3>
                    <p className="text-sm text-gray-400">Compliance</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Gestão de conformidade regulatória ANEEL RN 964/2021 + ONS. 
                  Controle de 50 documentos obrigatórios.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Documentos</span>
                    <span className="text-gray-300">0/50</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Conformidade ONS</span>
                    <span className="text-orange-500">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="text-red-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Não Conforme
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className="text-brand-cyan text-sm font-medium">Acessar Compliance →</span>
                </div>
              </div>
            </Link>

            {/* Frente 2: Análise de Rede */}
            <Link href="/dashboard/network" className="block">
              <div className="surface-1 p-6 rounded-lg border border-gray-800 card-hover-ness h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Activity className="w-6 h-6 text-green-500 icon-ness" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">2. Análise de Rede</h3>
                    <p className="text-sm text-gray-400">Network Intelligence</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Análise profunda de topologia, IP, roteamento, VLANs e segmentação. 
                  Mapeamento completo da infraestrutura.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Assets</span>
                    <span className="text-gray-300">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subnets</span>
                    <span className="text-gray-300">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">VLANs</span>
                    <span className="text-gray-300">0</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className="text-green-500 text-sm font-medium">Acessar Network →</span>
                </div>
              </div>
            </Link>

            {/* Frente 3: Adequação */}
            <Link href="/dashboard/remediation" className="block">
              <div className="surface-1 p-6 rounded-lg border border-gray-800 card-hover-ness h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <AlertTriangle className="w-6 h-6 text-orange-500 icon-ness" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">3. Adequação</h3>
                    <p className="text-sm text-gray-400">Gap Analysis</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Cruzamento de requisitos ONS × dados reais. 
                  Gap analysis e plano de remediação priorizado.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Gaps Identificados</span>
                    <span className="text-gray-300">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Riscos Críticos</span>
                    <span className="text-red-500">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Ações Pendentes</span>
                    <span className="text-orange-500">0</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className="text-orange-500 text-sm font-medium">Acessar Adequação →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="surface-1 p-4 rounded-lg border border-gray-800 hover:border-brand-cyan transition-ness text-left">
              <TrendingUp className="w-5 h-5 text-brand-cyan mb-2" />
              <div className="font-semibold mb-1">Importar Assets</div>
              <div className="text-xs text-gray-500">Carregar dados da rede TBE</div>
            </button>

            <button className="surface-1 p-4 rounded-lg border border-gray-800 hover:border-brand-cyan transition-ness text-left">
              <FileText className="w-5 h-5 text-purple-500 mb-2" />
              <div className="font-semibold mb-1">Gerar Relatório</div>
              <div className="text-xs text-gray-500">Conformidade ONS</div>
            </button>

            <button className="surface-1 p-4 rounded-lg border border-gray-800 hover:border-brand-cyan transition-ness text-left">
              <Network className="w-5 h-5 text-green-500 mb-2" />
              <div className="font-semibold mb-1">Análise de Rede</div>
              <div className="text-xs text-gray-500">Topologia e IPAM</div>
            </button>

            <button className="surface-1 p-4 rounded-lg border border-gray-800 hover:border-brand-cyan transition-ness text-left">
              <Settings className="w-5 h-5 text-gray-400 mb-2" />
              <div className="font-semibold mb-1">Configurações</div>
              <div className="text-xs text-gray-500">Sistema</div>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="surface-1 p-6 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-brand-cyan flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Sistema Operacional</h3>
              <p className="text-sm text-gray-400 mb-3">
                O sistema <span className="ness-wordmark text-white">ness<span className="ness-wordmark-dot">.</span></span> OT GRC está pronto para uso. 
                Para começar, importe os dados da rede TBE e inicie a análise de conformidade.
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <div><span className="text-green-500">●</span> Backend API: Operacional</div>
                <div><span className="text-green-500">●</span> Database: Conectado</div>
                <div><span className="text-green-500">●</span> Redis: Ativo</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>© 2025</span>
              <span className="ness-wordmark">ness<span className="ness-wordmark-dot">.</span></span>
              <span>OT GRC</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="/docs" className="hover:text-brand-cyan transition-ness">Documentação</Link>
              <Link href="/" className="hover:text-brand-cyan transition-ness">Início</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

