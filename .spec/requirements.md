# Requisitos do Projeto - ness. OT GRC

## ✅ Requisitos Funcionais

### RF01: Gestão de Documentação
- Sistema deve permitir upload de documentos de compliance
- Sistema deve versionar documentos automaticamente
- Sistema deve alertar sobre documentos próximos ao vencimento
- Sistema deve rastrear aprovações de documentos

### RF02: Análise de Rede OT
- Sistema deve mapear topologia de rede OT
- Sistema deve classificar dispositivos por Modelo Purdue
- Sistema deve identificar VLANs e subnets
- Sistema deve analisar rotas e conexões

### RF03: Gestão de Riscos
- Sistema deve identificar vulnerabilidades
- Sistema deve calcular CVSS scores
- Sistema deve priorizar riscos
- Sistema deve gerar relatórios de risco

### RF04: Conformidade Regulatória
- Sistema deve verificar conformidade ANEEL RN 964/2021
- Sistema deve verificar 5 controles mínimos ONS
- Sistema deve gerar evidências de conformidade
- Sistema deve rastrear status de conformidade

### RF05: Dashboards e Relatórios
- Sistema deve exibir dashboards executivos
- Sistema deve gerar relatórios em PDF
- Sistema deve exportar dados em CSV/Excel
- Sistema deve fornecer visualizações em tempo real

## 🔒 Requisitos Não-Funcionais

### RNF01: Performance
- Tempo de resposta < 200ms para operações CRUD
- Suporte a 100+ usuários simultâneos
- Cache de queries frequentes

### RNF02: Segurança
- Autenticação obrigatória para todas as rotas protegidas
- Criptografia de dados sensíveis
- Logs de auditoria completos
- Backups automáticos diários

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

