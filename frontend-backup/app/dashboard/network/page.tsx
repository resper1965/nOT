import Link from 'next/link'
import { Shield, Activity, Network, ArrowLeft, Server, Wifi, Globe } from 'lucide-react'

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-brand-cyan icon-ness" />
            <div className="flex flex-col">
              <h1 className="ness-wordmark font-medium text-2xl">
                ness<span className="ness-wordmark-dot">.</span>
              </h1>
              <span className="text-gray-400 font-normal text-sm">OT GRC</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-brand-cyan transition-ness flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/dashboard" className="hover:text-brand-cyan transition-ness">Dashboard</Link>
          <span>/</span>
          <span className="text-green-500">Frente 2: Análise de Rede</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Activity className="w-8 h-8 text-green-500 icon-ness" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Frente 2: Análise de Rede</h1>
              <p className="text-gray-400">Network Intelligence & Topology</p>
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Total de Assets</div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-xs text-gray-500">Aguardando importação</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Subnets</div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-xs text-gray-500">IPAM Analysis</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">VLANs</div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-xs text-gray-500">Layer 2 Segmentation</div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Conexões</div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-xs text-gray-500">Network Paths</div>
          </div>
        </div>

        {/* 5 Relatórios de Rede */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5 Relatórios de Análise de Rede</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="surface-1 p-5 rounded-lg border border-gray-800 card-hover-ness">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-6 h-6 text-brand-cyan" />
                <div className="font-semibold">R4. Análise IPAM</div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Endereçamento IP completo: 109 subnets esperados, 951 IPs.
              </p>
              <div className="text-xs text-gray-500">
                Status: <span className="text-orange-500">Aguardando dados</span>
              </div>
            </div>

            <div className="surface-1 p-5 rounded-lg border border-gray-800 card-hover-ness">
              <div className="flex items-center gap-3 mb-3">
                <Wifi className="w-6 h-6 text-purple-500" />
                <div className="font-semibold">R5. Análise VLANs</div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Layer 2 segmentation: 59 VLANs esperadas, classificação por zona.
              </p>
              <div className="text-xs text-gray-500">
                Status: <span className="text-orange-500">Aguardando dados</span>
              </div>
            </div>

            <div className="surface-1 p-5 rounded-lg border border-gray-800 card-hover-ness">
              <div className="flex items-center gap-3 mb-3">
                <Network className="w-6 h-6 text-green-500" />
                <div className="font-semibold">R6. Análise Routing</div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Layer 3 routing: 249 routers, tabelas de roteamento, paths críticos.
              </p>
              <div className="text-xs text-gray-500">
                Status: <span className="text-orange-500">Aguardando dados</span>
              </div>
            </div>

            <div className="surface-1 p-5 rounded-lg border border-gray-800 card-hover-ness">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-6 h-6 text-blue-500" />
                <div className="font-semibold">R7. Topologia Visual</div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Mapas: Física, Layer 2, Layer 3, Zonas, Purdue (6 níveis).
              </p>
              <div className="text-xs text-gray-500">
                Status: <span className="text-orange-500">Aguardando dados</span>
              </div>
            </div>

            <div className="surface-1 p-5 rounded-lg border border-gray-800 card-hover-ness">
              <div className="flex items-center gap-3 mb-3">
                <Server className="w-6 h-6 text-cyan-500" />
                <div className="font-semibold">R8. Network Health</div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Dashboard real-time: uptime, latência, bandwidth, alertas.
              </p>
              <div className="text-xs text-gray-500">
                Status: <span className="text-orange-500">Aguardando dados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Topology Preview (quando tiver dados) */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Dados Esperados (TBE)</h2>
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Routers</div>
                <div className="text-2xl font-bold">249</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Switches</div>
                <div className="text-2xl font-bold">244</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Servers</div>
                <div className="text-2xl font-bold">177</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Firewalls</div>
                <div className="text-2xl font-bold text-orange-500">9</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
              📊 Total: <span className="text-white font-semibold">3.907 ativos</span> | 
              109 subnets | 59 VLANs | 1.345 conexões
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <span className="ness-wordmark">ness<span className="ness-wordmark-dot">.</span></span> OT GRC - Network Intelligence
          </div>
        </div>
      </footer>
    </div>
  )
}

