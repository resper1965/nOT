# Roadmap - ness. OT GRC

**Última Atualização**: 2025-01-03  
**Versão**: 1.0.0

## 📅 Q1 2025 (Jan - Mar)

### Janeiro 2025

#### ✅ Semana 1-2: Completar Editor Markdown
**Prioridade**: P0 (Crítico)  
**Status**: ⏳ Planejado

**Tarefas:**
- [ ] Criar componente `DocumentMarkdownEditor.tsx`
- [ ] Implementar preview em tempo real (split view)
- [ ] Implementar auto-save (a cada 30 segundos)
- [ ] Implementar save manual (Ctrl+S)
- [ ] Criar página `/dashboard/compliance/documents/[id]/edit`
- [ ] Integrar com API `PUT /api/documents/[id]/markdown`

**Dependências:**
- [x] Upload de documentos ✅
- [x] Conversão para Markdown ✅

**Estimativa**: 40 horas (2 semanas)

#### ✅ Semana 3-4: Histórico de Versões
**Prioridade**: P0 (Crítico)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Criar componente `VersionHistory.tsx`
- [ ] Implementar API `GET /api/documents/[id]/versions`
- [ ] Implementar visualização de versões
- [ ] Implementar diff de versões
- [ ] Implementar recuperação de versões anteriores
- [ ] Adicionar link para histórico na página de edição

**Dependências:**
- [ ] Editor Markdown (semana 1-2)

**Estimativa**: 20 horas (1 semana)

### Fevereiro 2025

#### ✅ Semana 1-2: Geração de Relatórios PDF
**Prioridade**: P1 (Alto)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Pesquisar biblioteca de geração PDF (`react-pdf` ou `@react-pdf/renderer`)
- [ ] Criar sistema de templates (Markdown/HTML)
- [ ] Implementar API `POST /api/reports/generate/pdf`
- [ ] Criar página `/dashboard/reports/generate/pdf`
- [ ] Implementar preview antes de gerar
- [ ] Implementar download de PDF gerado

**Dependências:**
- [ ] Editor Markdown (para editar templates)

**Estimativa**: 40 horas (2 semanas)

#### ✅ Semana 3-4: Exportação CSV/Excel
**Prioridade**: P1 (Alto)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Implementar exportação CSV (`papaparse`)
- [ ] Implementar exportação Excel (`xlsx`)
- [ ] Criar API `POST /api/reports/export/csv`
- [ ] Criar API `POST /api/reports/export/excel`
- [ ] Adicionar botões de exportação nas páginas relevantes
- [ ] Implementar filtros para exportação

**Dependências:**
- [ ] Geração de relatórios PDF (semana 1-2)

**Estimativa**: 20 horas (1 semana)

### Março 2025

#### ✅ Melhorias UX/UI
**Prioridade**: P1 (Alto)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Implementar toast notifications (shadcn/ui toast)
- [ ] Melhorar feedback de upload (progress bar)
- [ ] Adicionar loading states consistentes
- [ ] Melhorar acessibilidade (WCAG AA)
- [ ] Implementar skeleton loaders
- [ ] Adicionar tooltips e ajuda contextual

**Estimativa**: 30 horas (1.5 semanas)

#### ✅ Performance Optimization
**Prioridade**: P1 (Alto)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Implementar cache de queries (React Query ou SWR)
- [ ] Otimizar bundle size (code splitting)
- [ ] Adicionar lazy loading de componentes
- [ ] Otimizar imagens (next/image)
- [ ] Implementar service worker (opcional)

**Estimativa**: 30 horas (1.5 semanas)

## 📅 Q2 2025 (Abr - Jun)

### Abril 2025

#### ✅ SNMP Polling Implementation
**Prioridade**: P2 (Médio)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Pesquisar biblioteca SNMP (Python `pysnmp` ou Node.js `net-snmp`)
- [ ] Criar coletor SNMP (separado ou API Route)
- [ ] Implementar polling de routers, switches, firewalls
- [ ] Criar API `POST /api/network/snmp/poll`
- [ ] Armazenar métricas em time-series database
- [ ] Criar dashboard de métricas SNMP

**Estimativa**: 60 horas (3 semanas)

### Maio 2025

#### ✅ NetFlow/sFlow Integration
**Prioridade**: P2 (Médio)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Pesquisar coletor NetFlow/sFlow
- [ ] Implementar coleta de tráfego
- [ ] Criar análise de tráfego
- [ ] Integrar com time-series database
- [ ] Criar visualizações de tráfego

**Estimativa**: 40 horas (2 semanas)

#### ✅ Time-Series Database
**Prioridade**: P2 (Médio)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Escolher database (InfluxDB ou Prometheus)
- [ ] Configurar time-series database
- [ ] Criar schema para métricas de rede
- [ ] Implementar agregação de métricas (1min, 5min, 1h)
- [ ] Criar API para consulta de métricas

**Estimativa**: 40 horas (2 semanas)

### Junho 2025

#### ✅ Network Health em Tempo Real
**Prioridade**: P2 (Médio)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Implementar WebSocket para real-time updates
- [ ] Atualizar página `/dashboard/network/health` com dados reais
- [ ] Criar gráficos de séries temporais (Recharts)
- [ ] Implementar alertas e notificações
- [ ] Criar dashboard executivo em tempo real

**Dependências:**
- [ ] SNMP Polling
- [ ] NetFlow/sFlow
- [ ] Time-Series Database

**Estimativa**: 60 horas (3 semanas)

## 📅 Q3 2025 (Jul - Set)

### Julho 2025

#### ✅ AI-Powered Gap Analysis
**Prioridade**: P3 (Baixo)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Pesquisar API de IA (OpenAI, Claude, etc.)
- [ ] Criar prompts estruturados para análise de gaps
- [ ] Implementar API `POST /api/compliance/ai/gap-analysis`
- [ ] Criar página `/dashboard/compliance/ai-analysis`
- [ ] Implementar scoring automático

**Estimativa**: 60 horas (3 semanas)

### Agosto 2025

#### ✅ Compliance Scoring
**Prioridade**: P3 (Baixo)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Criar algoritmo de scoring
- [ ] Implementar cálculo de compliance score
- [ ] Criar visualizações de scoring
- [ ] Implementar comparação entre frameworks
- [ ] Criar relatórios de scoring

**Estimativa**: 40 horas (2 semanas)

### Setembro 2025

#### ✅ Testes Automatizados
**Prioridade**: P2 (Médio)  
**Status**: 📋 Planejado

**Tarefas:**
- [ ] Configurar Jest + React Testing Library
- [ ] Implementar testes unitários (componentes críticos)
- [ ] Implementar testes de integração (API Routes)
- [ ] Configurar Playwright ou Cypress
- [ ] Implementar testes E2E (fluxos críticos)
- [ ] Configurar CI/CD com testes automáticos

**Estimativa**: 60 horas (3 semanas)

## 📊 Métricas de Progresso

### Q1 2025
- **Features Planejadas**: 6
- **Horas Estimadas**: 180 horas
- **Semanas**: 9 semanas

### Q2 2025
- **Features Planejadas**: 4
- **Horas Estimadas**: 200 horas
- **Semanas**: 10 semanas

### Q3 2025
- **Features Planejadas**: 3
- **Horas Estimadas**: 160 horas
- **Semanas**: 8 semanas

### Total 2025
- **Features Planejadas**: 13
- **Horas Estimadas**: 540 horas
- **Semanas**: 27 semanas (~6.75 meses)

## 🎯 Prioridades por Trimestre

### Q1 2025: Core Features
- Editor Markdown (P0)
- Relatórios PDF (P1)
- Melhorias UX/UI (P1)

### Q2 2025: Real-time Monitoring
- SNMP Polling (P2)
- NetFlow/sFlow (P2)
- Network Health Real-time (P2)

### Q3 2025: Advanced Features
- AI Gap Analysis (P3)
- Compliance Scoring (P3)
- Testes Automatizados (P2)

## 📝 Notas

- Roadmap pode ser ajustado baseado em feedback de clientes
- Prioridades podem mudar conforme necessidade
- Estimativas são aproximadas e podem variar
- Features podem ser adicionadas ou removidas conforme necessário

---

**Como usar este roadmap:**
1. Atualize este arquivo mensalmente
2. Marque features como concluídas quando implementadas
3. Ajuste estimativas baseado em velocidade real
4. Priorize features baseado em feedback de clientes

