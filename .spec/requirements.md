# Requisitos do Projeto - ness. OT GRC

## ✅ Requisitos Funcionais

### RF01: Gestão de Documentação ✅ **PARCIALMENTE IMPLEMENTADO**
- ✅ Sistema permite rastreamento de documentos de compliance
- ✅ Sistema versiona documentos automaticamente (via `document_status`)
- ✅ Sistema alerta sobre documentos próximos ao vencimento (via `next_review_date`)
- ✅ Sistema rastreia aprovações de documentos (via `document_status` e `document_approvals`)
- ✅ **50+ documentos obrigatórios** mapeados em `required_documents`
- ✅ **9 categorias** de documentos configuradas
- ✅ Status tracking: missing, draft, under_review, approved, published, expired
- ⏳ **Upload de Documentos** - Implementação em andamento (ver `.spec/document-upload-conversion.md`)
  - Upload de documentos em múltiplos formatos (PDF, DOC, DOCX, TXT, MD)
  - Preservação do documento original no Supabase Storage
  - Conversão automática para Markdown (formato editável)
  - Edição de documentos Markdown na plataforma

### RF02: Análise de Rede OT ✅ **IMPLEMENTADO**
- ✅ Sistema mapeia topologia de rede OT (`network_zones`, `network_connections`)
- ✅ Sistema classifica dispositivos por Modelo Purdue (`network_segments.purdue_level`)
- ✅ Sistema identifica VLANs e subnets (`vlans`, `ip_subnets`, `ip_addresses`)
- ✅ Sistema analisa rotas e conexões (`routing_tables`, `network_paths`)
- ✅ **6 páginas do dashboard** para análise de rede:
  - Assets (inventário)
  - Topology (topologia)
  - VLANs (gestão de VLANs)
  - IPAM (IP Address Management)
  - Routing (análise de roteamento)
  - Health (monitoramento)

### RF03: Gestão de Riscos ✅ **IMPLEMENTADO**
- ✅ Sistema identifica vulnerabilidades (`security.vulnerabilities`)
- ✅ Sistema calcula CVSS scores (`cvss_score`, `cvss_vector`)
- ✅ Sistema prioriza riscos (`severity`: critical, high, medium, low)
- ✅ Sistema gera visualizações de risco (via dashboards)
- ✅ **4 páginas do dashboard** para remediação:
  - Risks (gestão de riscos)
  - Gaps (análise de gaps)
  - Plan (plano de adequação)
  - Timeline (timeline de remediação)

### RF04: Conformidade Regulatória ✅ **PARCIALMENTE IMPLEMENTADO**
- ✅ Sistema verifica conformidade ANEEL RN 964/2021 (`compliance.frameworks`, `compliance.documents`)
- ✅ Sistema verifica 5 controles mínimos ONS (`compliance.ons_controls`)
- ✅ Sistema gera evidências de conformidade (`compliance.documents`, `compliance.assessments`)
- ✅ Sistema rastreia status de conformidade (`compliance.control_results`, `compliance.assessments`)
- ✅ **5 páginas do dashboard** para compliance:
  - ANEEL (conformidade ANEEL RN 964/2021)
  - ONS (5 controles mínimos)
  - Frameworks (IEC, NIST, ISO, LGPD)
  - Documents (gestão documental)
- ✅ **7 pilares ANEEL** mapeados
- ✅ **50+ documentos obrigatórios** rastreáveis
- ⏳ **Gestão de Frameworks** - Em refinamento (ver `.spec/frameworks-management.md`)
  - Cadastro de frameworks regulatórios e internacionais
  - Mapeamento de controles por framework
  - Avaliação de conformidade por framework
  - Visualização consolidada de todos os frameworks

### RF05: Dashboards e Relatórios ✅ **PARCIALMENTE IMPLEMENTADO**
- ✅ Sistema exibe dashboards executivos (24 páginas implementadas)
- ✅ Dashboard overview com 4 slots paralelos
- ✅ Visualizações com Recharts (gráficos, charts)
- ⏳ Sistema gerar relatórios em PDF (planejado)
- ⏳ Sistema exportar dados em CSV/Excel (planejado)
- ✅ Sistema fornece visualizações (via Supabase queries)
- ✅ **3 páginas de relatórios**:
  - Reports (principal)
  - Generate (gerar relatórios)
  - History (histórico)

## 🔒 Requisitos Não-Funcionais

### RNF01: Performance
- Tempo de resposta < 200ms para operações CRUD
- Suporte a 100+ usuários simultâneos
- Cache de queries frequentes

### RNF02: Segurança ✅ **IMPLEMENTADO**
- ✅ Autenticação obrigatória para todas as rotas protegidas (middleware implementado)
- ✅ Supabase Auth com PKCE flow (enhanced security)
- ✅ Row Level Security (RLS) configurado no Supabase
- ✅ Service role key nunca exposto no cliente (apenas server-side)
- ✅ Criptografia de dados sensíveis (via Supabase)
- ✅ Logs de auditoria completos (`audit.activity_log`)
- ✅ Backups automáticos diários (via Supabase)
- ✅ HTTPS obrigatório em produção (Vercel)

### RNF03: Disponibilidade
- Uptime de 99.99% (OT crítico)
- Redundância de banco de dados
- Failover automático

### RNF04: Escalabilidade
- Suporte a múltiplos clientes (multi-tenancy)
- Arquitetura horizontalmente escalável
- Otimização de queries

### RNF05: Usabilidade
- Interface responsiva (mobile-first)
- Acessibilidade WCAG AA
- Design system consistente (ness.)

## 📋 Requisitos Regulatórios

### RR01: ANEEL RN 964/2021
- Implementação dos 7 pilares
- Gestão de 50+ documentos obrigatórios
- Evidências de conformidade

### RR02: ONS Rotina Operacional
- 5 controles mínimos implementados:
  1. MFA (Autenticação Multifator)
  2. Gestão de Patches
  3. VPN para acesso remoto
  4. Antimalware atualizado
  5. Segmentação de rede OT/IT

### RR03: LGPD
- Proteção de dados pessoais
- Consentimento explícito
- Direito ao esquecimento

