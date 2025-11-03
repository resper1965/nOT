# Gestão de Frameworks de Segurança - Especificação

**Data**: 2025-01-03  
**Versão**: 1.0.0  
**Status**: ⏳ Em Refinamento

---

## 📋 Visão Geral

Sistema de gestão de frameworks de segurança cibernética aplicáveis ao setor elétrico (OT - Operational Technology) que permite:

1. **Cadastro de frameworks** regulatórios e internacionais
2. **Mapeamento de controles** específicos por framework
3. **Avaliação de conformidade** por framework
4. **Tracking de implementação** (status, compliance percentage)
5. **Visualização consolidada** de todos os frameworks

## 🎯 Objetivos

### Objetivo Principal
Centralizar e padronizar a gestão de múltiplos frameworks de segurança aplicáveis ao setor elétrico, permitindo rastreamento de conformidade e identificação de gaps.

### Benefícios
- ✅ Visão consolidada de conformidade
- ✅ Identificação de sobreposições entre frameworks
- ✅ Rastreamento de progresso de implementação
- ✅ Priorização de controles por criticidade
- ✅ Relatórios de conformidade por framework

---

## ✅ Requisitos Funcionais

### RF01: Cadastro de Frameworks

**Descrição**: Sistema deve permitir cadastro de frameworks regulatórios e internacionais.

**Frameworks Obrigatórios**:
1. **ANEEL RN 964/2021** - Regulamentação brasileira (setor elétrico)
2. **ONS Rotina Operacional** - 5 controles mínimos
3. **IEC 62443** - Segurança para sistemas de automação industrial
4. **NIST CSF 2.0** - Cybersecurity Framework
5. **ISO/IEC 27001** - Sistema de gestão de segurança da informação
6. **ISO/IEC 27002** - Código de prática para controles de segurança
7. **ISO/IEC 27019** - Segurança para processos de energia e utilidades
8. **NIST SP 800-82** - Guia de segurança para ICS (Industrial Control Systems)
9. **NIST SP 800-53** - Controles de segurança e privacidade
10. **LGPD** - Lei Geral de Proteção de Dados

**Campos Obrigatórios**:
- `framework_name` (VARCHAR 255) - Nome do framework
- `framework_code` (VARCHAR 50) - Código único (ex: "NIST_CSF", "ISO27001")
- `description` (TEXT) - Descrição do framework
- `version` (VARCHAR 50) - Versão do framework
- `category` (VARCHAR 100) - Categoria (Regulatório, Internacional, Setorial)
- `metadata` (JSONB) - Metadados adicionais (URL oficial, data de publicação, etc.)

**Restrições**:
- `framework_code` deve ser único
- `framework_name` deve ser único
- Versão obrigatória para frameworks versionados

### RF02: Mapeamento de Controles

**Descrição**: Sistema deve permitir mapeamento de controles específicos por framework.

**Estrutura de Controles**:
- Cada framework pode ter múltiplos controles
- Cada controle pertence a um único framework (`framework_id`)
- Controles podem ter categorias e prioridades

**Campos de Controle**:
- `framework_id` (UUID) - Referência ao framework
- `control_id` (VARCHAR 50) - ID único do controle (ex: "NIST-CSF-1.1")
- `control_name` (VARCHAR 500) - Nome do controle
- `description` (TEXT) - Descrição detalhada
- `category` (VARCHAR 100) - Categoria do controle
- `priority` (VARCHAR 20) - Prioridade (P0, P1, P2, P3)
- `metadata` (JSONB) - Metadados (mapping para outros frameworks, referências, etc.)

**Exemplo de Controles**:
- **NIST CSF 2.0**: Govern, Identify, Protect, Detect, Respond, Recover
- **ISO 27001**: 114 controles organizados em 14 domínios
- **IEC 62443**: Controles por zonas e níveis (Foundation, Level 1-4)

### RF03: Avaliação de Conformidade

**Descrição**: Sistema deve permitir avaliação de conformidade por framework.

**Campos de Avaliação**:
- `framework_id` (UUID) - Framework avaliado
- `compliance_percentage` (NUMERIC) - Percentual de conformidade (0-100)
- `status` (VARCHAR 20) - Status (missing, partial, approved)
- `assessed_at` (TIMESTAMP) - Data da avaliação
- `assessed_by` (UUID) - Usuário que fez a avaliação
- `evidence` (TEXT) - Evidências de conformidade
- `gap_analysis` (JSONB) - Análise de gaps identificados

**Cálculo de Conformidade**:
- Baseado em controles implementados vs. total de controles
- Considera status de cada controle (implemented, partial, missing)
- Pode considerar pesos por criticidade dos controles

**Status**:
- `missing` (0%): Framework não implementado
- `partial` (1-99%): Implementação parcial
- `approved` (100%): Framework totalmente implementado

### RF04: Visualização de Frameworks

**Descrição**: Sistema deve exibir frameworks de forma clara e organizada.

**Página**: `/dashboard/compliance/frameworks`

**Elementos de Visualização**:
1. **Cards de Métricas**:
   - Total de frameworks cadastrados
   - Frameworks implementados (100%)
   - Frameworks parciais (1-99%)
   - Frameworks não implementados (0%)

2. **Grid de Frameworks**:
   - Card por framework com:
     - Nome e versão
     - Categoria (badge)
     - Percentual de conformidade (círculo de progresso)
     - Status (badge colorido)
     - Número de controles
     - Botão de ação (Ver Detalhes, Implementar, Continuar)

3. **Filtros e Busca**:
   - Filtrar por categoria
   - Filtrar por status
   - Buscar por nome ou código

### RF05: Comparação de Frameworks

**Descrição**: Sistema deve permitir comparação entre frameworks (identificar sobreposições).

**Funcionalidades**:
- Mapeamento de controles equivalentes entre frameworks
- Visualização de sobreposições
- Identificação de gaps únicos por framework
- Matriz de mapeamento

**Exemplo**:
- Controle "Gestão de Identidades" aparece em:
  - NIST CSF 2.0 (PR.AC-1)
  - ISO 27001 (A.9.2)
  - IEC 62443 (SR 1.1)

---

## 🔒 Requisitos Não-Funcionais

### RNF01: Performance
- Carregamento de frameworks < 500ms
- Paginação para frameworks (se > 20)
- Cache de estatísticas de conformidade

### RNF02: Segurança
- Apenas usuários autenticados podem ver frameworks
- Apenas admins podem cadastrar/editar frameworks
- Histórico de mudanças (audit log)

### RNF03: Usabilidade
- Interface responsiva (mobile-first)
- Visualizações claras (cards, progress bars)
- Feedback visual de status (cores contextuais)

---

## 📊 Estrutura de Dados

### Tabela: `compliance.frameworks`

```sql
CREATE TABLE compliance.frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_name VARCHAR(255) NOT NULL UNIQUE,
    framework_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    version VARCHAR(50),
    category VARCHAR(100), -- Regulatório, Internacional, Setorial
    metadata JSONB, -- {url, published_date, scope, industry_focus}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `compliance.controls`

```sql
CREATE TABLE compliance.controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
    control_id VARCHAR(50) NOT NULL, -- Ex: "NIST-CSF-1.1", "ISO-A.9.2"
    control_name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- Governança, Identidade, Proteção, etc.
    priority VARCHAR(20), -- P0, P1, P2, P3
    status VARCHAR(20) DEFAULT 'missing', -- missing, partial, implemented
    metadata JSONB, -- {mapping_to_other_frameworks, references, evidence_requirements}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(framework_id, control_id)
);
```

### Tabela: `compliance.assessments`

```sql
CREATE TABLE compliance.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
    compliance_percentage NUMERIC(5,2) DEFAULT 0, -- 0.00 a 100.00
    status VARCHAR(20) DEFAULT 'missing', -- missing, partial, approved
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessed_by UUID REFERENCES auth.users(id),
    evidence TEXT,
    gap_analysis JSONB, -- {gaps: [{control_id, severity, description}]}
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 Interface do Usuário

### Página Principal: `/dashboard/compliance/frameworks`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Frameworks de Segurança                                │
│  Padrões internacionais e frameworks de segurança        │
├─────────────────────────────────────────────────────────┤
│  [Total] [Implementados] [Parciais] [Não Implementados] │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ NIST CSF 2.0 │  │ ISO 27001    │  │ IEC 62443    │  │
│  │ 45%          │  │ 0%           │  │ 0%           │  │
│  │ [Parcial]    │  │ [Não Impl.]  │  │ [Não Impl.]  │  │
│  │ [Continuar]  │  │ [Implementar]│  │ [Implementar]│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ ISO 27019    │  │ NIST 800-82  │  │ LGPD         │  │
│  │ ...          │  │ ...          │  │ ...          │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Design System**:
- Cards com gradientes sutis
- Badges contextuais (verde=implementado, amarelo=parcial, vermelho=não implementado)
- Círculo de progresso com gradiente
- Ícones por framework (Shield, Globe, CheckCircle2, etc.)
- Cores contextuais por categoria

---

## 🔄 Fluxo de Trabalho

### 1. Cadastro de Framework
1. Admin acessa página de frameworks
2. Clica em "Adicionar Framework"
3. Preenche formulário (nome, código, versão, descrição, categoria)
4. Salva framework
5. Framework aparece na lista com status "missing"

### 2. Mapeamento de Controles
1. Admin seleciona framework
2. Clica em "Gerenciar Controles"
3. Importa controles (via CSV, JSON, ou manual)
4. Sistema valida e salva controles
5. Controles aparecem na lista do framework

### 3. Avaliação de Conformidade
1. Usuário acessa framework
2. Clica em "Avaliar Conformidade"
3. Para cada controle, marca status (implemented, partial, missing)
4. Adiciona evidências quando necessário
5. Sistema calcula percentual de conformidade automaticamente
6. Status é atualizado baseado no percentual

### 4. Visualização de Progresso
1. Usuário acessa página de frameworks
2. Visualiza cards de métricas (overview)
3. Navega pelos frameworks (grid)
4. Clica em framework para ver detalhes
5. Visualiza progresso de implementação

---

## 📋 Frameworks Prioritários

### Tier 1: Obrigatórios (Regulatórios)
1. **ANEEL RN 964/2021** - P0 (Crítico)
2. **ONS Rotina Operacional** - P0 (Crítico)
3. **LGPD** - P0 (Crítico)

### Tier 2: Recomendados (Setoriais)
4. **IEC 62443** - P1 (Alto) - Foco OT
5. **ISO/IEC 27019** - P1 (Alto) - Energia e utilidades
6. **NIST SP 800-82** - P1 (Alto) - ICS

### Tier 3: Complementares (Internacionais)
7. **NIST CSF 2.0** - P2 (Médio)
8. **ISO/IEC 27001** - P2 (Médio)
9. **ISO/IEC 27002** - P2 (Médio)
10. **NIST SP 800-53** - P2 (Médio)

---

## 🎯 Próximos Passos

### Fase 1: Cadastro Básico (Atual)
- ✅ Estrutura de dados (tabelas)
- ✅ API de listagem de frameworks
- ✅ Interface básica de visualização
- ⏳ Refinamento de UI/UX

### Fase 2: Mapeamento de Controles
- ⏳ Importação de controles por framework
- ⏳ Interface de gerenciamento de controles
- ⏳ Validação de controles

### Fase 3: Avaliação de Conformidade
- ⏳ Interface de avaliação
- ⏳ Cálculo automático de conformidade
- ⏳ Tracking de evidências

### Fase 4: Comparação e Análise
- ⏳ Mapeamento de controles equivalentes
- ⏳ Matriz de comparação
- ⏳ Relatórios de conformidade

---

## 📝 Notas de Implementação

### Estado Atual
- ✅ Tabela `compliance.frameworks` criada
- ✅ 9 frameworks cadastrados no banco
- ✅ API `/api/compliance/frameworks` funcionando
- ✅ Interface básica implementada
- ⏳ Mapeamento de controles pendente
- ⏳ Avaliação de conformidade pendente

### Melhorias Necessárias
1. **UI/UX**: Aplicar estilo moderno consistente (já feito parcialmente)
2. **Funcionalidade**: Adicionar mapeamento de controles
3. **Funcionalidade**: Adicionar avaliação de conformidade
4. **Dados**: Preencher controles para frameworks prioritários
5. **Visualização**: Adicionar gráficos de progresso por framework

---

## 🔗 Referências

- [NIST CSF 2.0](https://www.nist.gov/cyberframework)
- [ISO/IEC 27001:2022](https://www.iso.org/standard/27001)
- [IEC 62443](https://www.iec.ch/security)
- [ANEEL RN 964/2021](https://www.aneel.gov.br)

---

**Última Atualização**: 2025-01-03

