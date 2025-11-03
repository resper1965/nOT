# Intenções e Planos Futuros - ness. OT GRC

**Última Atualização**: 2025-01-03

## 🎯 Próximas Features (Priorizadas)

### 1. Editor Markdown Completo ⏳
**Prioridade**: P0 (Crítico)  
**Prazo**: Jan 2025  
**Status**: ⏳ Planejado  
**Spec**: `.spec/document-upload-conversion.md`

**O que queremos:**
- Editor de Markdown com preview em tempo real (split view)
- Auto-save a cada 30 segundos
- Save manual (Ctrl+S)
- Histórico de versões visual
- Suporte a frontmatter YAML
- Diff de versões

**Por quê:**
- Usuários precisam editar documentos convertidos após upload
- Markdown é editável e versionável
- Preview em tempo real melhora significativamente a UX
- Auto-save previne perda de dados

**Como:**
- Usar biblioteca `@uiw/react-md-editor` ou `react-markdown` + `react-syntax-highlighter`
- Implementar auto-save com `useDebounce` e `useEffect`
- Criar API para versionamento (`GET /api/documents/[id]/versions`)
- Adicionar componente `VersionHistory.tsx`
- Integrar com Supabase Storage para persistência

**Dependências:**
- [x] Upload de documentos ✅
- [x] Conversão para Markdown ✅
- [ ] Editor Markdown (este item)
- [ ] Histórico de versões visual

### 2. Geração de Relatórios PDF 📄
**Prioridade**: P1 (Alto)  
**Prazo**: Fev 2025  
**Status**: 📋 Planejado

**O que queremos:**
- Geração de relatórios em PDF
- Templates customizáveis (Markdown/HTML)
- Exportação de dados para CSV/Excel
- Agendamento de relatórios (opcional)
- Preview antes de gerar

**Por quê:**
- Clientes precisam de relatórios para auditorias e compliance
- PDF é padrão para documentos formais
- Exportação CSV/Excel facilita análise de dados
- Templates customizáveis permitem branding

**Como:**
- Usar `react-pdf` ou `@react-pdf/renderer` para geração
- Criar templates em Markdown/HTML
- Implementar exportação CSV com `papaparse`
- Implementar exportação Excel com `xlsx`
- Adicionar página `/dashboard/reports/generate/pdf` para preview

**Dependências:**
- [ ] Editor Markdown (para editar templates)
- [ ] Sistema de templates
- [ ] Biblioteca de geração PDF

### 3. Monitoramento Real de Network Health 🔴
**Prioridade**: P2 (Médio)  
**Prazo**: Q2 2025  
**Status**: 📋 Planejado

**O que queremos:**
- SNMP polling: routers, switches, firewalls
- NetFlow/sFlow: análise de tráfego
- ICMP ping: latência e disponibilidade
- Syslog: eventos de rede
- Time-series database (InfluxDB ou Prometheus)
- Dashboard em tempo real com WebSocket

**Por quê:**
- Atualmente mostramos dados estáticos do inventário
- Monitoramento real é essencial para OT
- Alertas em tempo real podem prevenir incidentes
- Métricas históricas permitem análise de tendências

**Como:**
- Implementar coletor SNMP (Python ou Node.js)
- Integrar com NetFlow/sFlow collectors
- Configurar InfluxDB ou Prometheus para time-series
- Criar API para WebSocket (real-time updates)
- Atualizar página `/dashboard/network/health` com dados reais

**Dependências:**
- [ ] Infraestrutura de coleta (SNMP, NetFlow)
- [ ] Time-series database
- [ ] WebSocket implementation
- [ ] Integração com SIEM (opcional)

### 4. AI-Powered Gap Analysis 🤖
**Prioridade**: P3 (Baixo)  
**Prazo**: Q3 2025  
**Status**: 📋 Planejado

**O que queremos:**
- Análise automática de gaps usando IA
- Sugestões automáticas de remediação
- Scoring de compliance automático
- Análise preditiva de riscos

**Por quê:**
- Reduz tempo de análise manual
- Melhora precisão de identificação de gaps
- Fornece insights acionáveis
- Escala para múltiplos frameworks

**Como:**
- Integrar com OpenAI API ou Claude API
- Criar prompts estruturados para análise de gaps
- Implementar scoring algorithm
- Adicionar página `/dashboard/compliance/ai-analysis`

**Dependências:**
- [ ] API de IA (OpenAI, Claude, etc.)
- [ ] Sistema de prompts estruturados
- [ ] Algoritmo de scoring

## 🔄 Melhorias Planejadas

### Performance
**Prioridade**: P1 (Alto)

- [ ] Implementar cache de queries Supabase (React Query ou SWR)
- [ ] Otimizar bundle size (code splitting, dynamic imports)
- [ ] Adicionar lazy loading de componentes pesados
- [ ] Implementar service worker para offline (opcional)

**Por quê:**
- Melhora tempo de carregamento
- Reduz uso de banda
- Melhora experiência do usuário

### UX/UI
**Prioridade**: P1 (Alto)

- [ ] Melhorar feedback de upload (progress bar, toast notifications)
- [ ] Adicionar loading states consistentes
- [ ] Implementar toast notifications (shadcn/ui toast)
- [ ] Melhorar acessibilidade (WCAG AA)

**Por quê:**
- Melhora experiência do usuário
- Reduz confusão e erros
- Aumenta acessibilidade

### Segurança
**Prioridade**: P1 (Alto)

- [ ] Adicionar validação de arquivos no upload (tipo, tamanho, conteúdo)
- [ ] Implementar rate limiting nas APIs
- [ ] Adicionar verificação de integridade (SHA-256)
- [ ] Implementar 2FA (MFA) via Supabase

**Por quê:**
- Previne upload de arquivos maliciosos
- Protege contra ataques DDoS
- Garante integridade de dados
- Melhora segurança de autenticação

### Testes
**Prioridade**: P2 (Médio)

- [ ] Implementar testes unitários (Jest + React Testing Library)
- [ ] Implementar testes de integração (API Routes)
- [ ] Implementar testes E2E (Playwright ou Cypress)
- [ ] Configurar CI/CD com testes automáticos

**Por quê:**
- Garante qualidade do código
- Previne regressões
- Facilita refatoração

## 📊 Roadmap Visual

```
Q1 2025 (Jan-Mar)
├── Editor Markdown ⏳
├── Relatórios PDF 📄
└── Melhorias UX/UI 🔄

Q2 2025 (Abr-Jun)
├── Monitoramento Real 🔴
├── Alertas e Notificações 🔔
└── Performance Optimization ⚡

Q3 2025 (Jul-Set)
├── AI Gap Analysis 🤖
├── Compliance Scoring 📊
└── Testes Automatizados 🧪
```

## 🎯 Decisões de Priorização

### Critérios de Priorização

1. **P0 (Crítico)**: Bloqueia outras features ou é requisito fundamental
2. **P1 (Alto)**: Melhora significativamente a experiência do usuário
3. **P2 (Médio)**: Nice to have, mas não bloqueia outras features
4. **P3 (Baixo)**: Futuro, pode ser reconsiderado

### Ordem de Implementação

1. **Editor Markdown** (P0) - Bloqueia uso completo da feature de upload
2. **Relatórios PDF** (P1) - Requisito de clientes para auditorias
3. **Melhorias UX/UI** (P1) - Melhora experiência geral
4. **Monitoramento Real** (P2) - Diferencial competitivo
5. **AI Gap Analysis** (P3) - Inovação futura

## 💡 Ideias Futuras (Não Priorizadas)

### Multi-tenancy
- Suporte a múltiplos clientes/organizações
- Isolamento de dados por tenant
- White-labeling

### Integrações
- Integração com SIEM (Splunk, QRadar)
- Integração com ticketing (Jira, ServiceNow)
- Integração com IAM (Okta, Azure AD)

### Mobile
- App mobile (React Native)
- Notificações push
- Dashboard mobile

### Advanced Analytics
- Machine Learning para detecção de anomalias
- Análise preditiva de riscos
- Dashboards executivos avançados

## 📝 Notas

- Todas as features planejadas devem ser documentadas em `.spec/`
- Decisões arquiteturais importantes devem ser registradas em `.spec/decisions.md`
- Roadmap deve ser atualizado mensalmente
- Prioridades podem mudar baseadas em feedback de clientes

---

**Como usar este arquivo:**
1. Consulte este arquivo antes de planejar novas features
2. Atualize este arquivo quando novas ideias surgirem
3. Mova itens de "Planejado" para "Em Implementação" quando começar
4. Mova itens de "Em Implementação" para "Implementado" quando concluir

