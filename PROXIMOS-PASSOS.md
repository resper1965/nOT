# 🎯 Próximos Passos - ness. OT GRC

**Data**: 2025-01-04  
**Status Atual**: Fase 0 - Blocos 1-5 Implementados ✅  
**Próxima Prioridade**: Refinamentos da Fase 0 + Início Fase 1

---

## ✅ Fase 0 - Status Atual

### Blocos Implementados:
- ✅ **Bloco 1**: Evidência & Attestation (4 semanas)
  - Evidence Packages
  - Workflow de aprovação
  - Attestations digitais

- ✅ **Bloco 2**: Exceções & Crosswalk (3 semanas)
  - Control Mappings (Crosswalk)
  - Control Exceptions

- ✅ **Bloco 3**: Mudanças OT & Backups (3 semanas)
  - OT Changes (Change Control)
  - OT Backups

- ✅ **Bloco 4**: Relatórios 1-clique (2 semanas)
  - Relatórios ANEEL/ONS
  - Export PDF/CSV/JSON

- ✅ **Bloco 5**: KPIs/SLOs (2 semanas)
  - Views de KPIs
  - Dashboard de métricas

**Total Implementado**: 14 semanas de funcionalidades

---

## 🔧 Refinamentos Pendentes da Fase 0

### 1. Corrigir Frameworks não aparecendo ✅ (JUST COMPLETADO)
- **Status**: ✅ Corrigido
- **Problema**: Frameworks não apareciam na aplicação
- **Solução**: API corrigida para usar `getServerSupabaseClient()`

### 2. Corrigir Routing hardcoded ✅ (JUST COMPLETADO)
- **Status**: ✅ Corrigido
- **Problema**: Dados de routing eram hardcoded
- **Solução**: API criada para buscar dados reais do banco

### 3. Melhorar Relatórios PDF/CSV
- **Status**: ⏳ Pendente
- **O que fazer**:
  - Melhorar template PDF com branding ness.
  - Adicionar gráficos nos relatórios
  - Melhorar formatação CSV
- **Esforço**: 1 semana

### 4. Melhorar KPIs Dashboard
- **Status**: ⏳ Pendente
- **O que fazer**:
  - Adicionar gráficos de tendência
  - Adicionar filtros por planta/instalação
  - Adicionar comparação temporal
- **Esforço**: 1 semana

---

## 🚀 Próximos Passos - Fase 1

### Prioridade: P1 (Alto)
**Duração**: 4 semanas  
**Dependências**: Fase 0 completa ✅

### Bloco 1.1: Recertificação Periódica
**O que implementar**:
- Tarefas automáticas para revalidar controles/documentos
- Exemplo: ONS-06 inventário a cada 24 meses
- Alertas e notificações

**Entregas**:
- SQL: Tabela `compliance.recertification_tasks`
- Backend: Cron jobs / Scheduled tasks (Supabase Edge Functions)
- Frontend: Interface de recertificação
- Notificações: Alertas automáticos

**Esforço**: 2 semanas

### Bloco 1.2: Linha do Tempo de Conformidade
**O que implementar**:
- Evolução trimestral por instalação e por domínio
- Histórico de conformidade
- Gráficos de tendência

**Entregas**:
- SQL: Views de histórico
- API: Endpoints de histórico
- Frontend: Visualização de linha do tempo
- Gráficos: Recharts para visualização

**Esforço**: 1 semana

### Bloco 1.3: Heatmap: Controles x Plantas
**O que implementar**:
- Visualização: controles x plantas (verde/amarelo/vermelho)
- Filtros por framework, domínio, planta
- Export de heatmap

**Entregas**:
- API: Endpoint de dados de heatmap
- Frontend: Componente de heatmap
- Interatividade: Tooltips e detalhes

**Esforço**: 1 semana

**Total Fase 1**: 4 semanas

---

## 📋 Recomendação de Próximos Passos

### Opção A: Refinar Fase 0 (Recomendado)
**Prioridade**: P0 (Crítico)  
**Duração**: 2 semanas

1. ✅ Corrigir frameworks não aparecendo (JUST COMPLETADO)
2. ✅ Corrigir routing hardcoded (JUST COMPLETADO)
3. ⏳ Melhorar relatórios PDF/CSV (1 semana)
4. ⏳ Melhorar KPIs dashboard (1 semana)

**Benefício**: Sistema mais robusto e polido antes de adicionar novas funcionalidades

### Opção B: Iniciar Fase 1
**Prioridade**: P1 (Alto)  
**Duração**: 4 semanas

1. ⏳ Recertificação Periódica (2 semanas)
2. ⏳ Linha do Tempo de Conformidade (1 semana)
3. ⏳ Heatmap Controles x Plantas (1 semana)

**Benefício**: Funcionalidades novas importantes para compliance

---

## 🎯 Recomendação Final

**Ordem sugerida**:
1. **Agora**: Refinar Fase 0 (melhorar relatórios e KPIs)
2. **Depois**: Iniciar Fase 1 (Recertificação, Timeline, Heatmap)
3. **Em seguida**: Fase 2 (Risco OT "de Verdade")

**Próxima Ação Imediata**:
- Melhorar template de relatórios PDF/CSV
- Adicionar gráficos no dashboard de KPIs

---

**Versão**: 1.0  
**Última atualização**: 2025-01-04
