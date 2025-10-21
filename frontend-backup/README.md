# ness. OT GRC - Governance, Risk & Compliance

> Plataforma de Governança, Risco e Conformidade para Redes OT do Setor Elétrico

![ness. OT GRC](https://img.shields.io/badge/ness.-OT_GRC-00ADE8?style=for-the-badge)
![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwind-css)

---

## 🎯 Sobre o **ness. OT GRC**

**ness. OT GRC** é uma plataforma completa de **Governance, Risk and Compliance (GRC)** específica para redes de Tecnologia Operacional (OT) do setor elétrico brasileiro.

### O que é GRC?

**G**overnance - Governança  
**R**isk - Gestão de Riscos  
**C**ompliance - Conformidade Regulatória  

### Funcionalidades Principais

#### 🏛️ Governance (Governança)
- Gestão de políticas de segurança cibernética
- Estrutura de responsabilidades (CISO, CSIRT, SOC)
- Aprovação e revisão de documentos
- Dashboard executivo de governança

#### ⚠️ Risk (Gestão de Riscos)
- Análise de riscos de segurança cibernética
- Registro e tratamento de riscos (Risk Register)
- Análise de vulnerabilidades com CVSS
- Detecção de caminhos de vazamento de dados
- Análise de topologia de rede OT

#### ✅ Compliance (Conformidade)
- Conformidade ANEEL RN 964/2021
- Conformidade ONS (Rotina Operacional)
- IEC 62443 (Segurança OT/ICS)
- NIST Cybersecurity Framework
- LGPD (Proteção de Dados)
- ISO/IEC 27001 e 27019

### Diferencial

Primeira plataforma **brasileira** focada especificamente em:
- ✅ Setor elétrico nacional
- ✅ Redes OT (Operational Technology)
- ✅ Regulação ANEEL e ONS
- ✅ Gestão de documentação obrigatória
- ✅ Evidências de conformidade

---

## 🚀 Stack Tecnológico

### Core
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript 5.3
- **Styling**: Tailwind CSS v4
- **Componentes**: Shadcn/ui (Radix UI)

### Backend
- **API**: FastAPI (Python)
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: SQLAlchemy

### GRC Específico
- **Documentação**: Sistema de versionamento
- **Compliance**: Tracking automático
- **Workflows**: Aprovação multi-nível
- **Auditoria**: Logs imutáveis

---

## 🎨 Design System ness.

### Cores
```css
/* Brand */
--brand-cyan: #00ADE8

/* Grayscale (Cool Grays) */
--gray-950: #0B0C0E  /* Background */
--gray-900: #111317  /* Surface 1 */
--gray-50:  #EEF1F6  /* Text */
```

### Wordmark
```
ness<span style="color: #00ADE8">.</span> OT GRC
```

---

## 📦 Instalação

```bash
# Clone o repositório
cd frontend

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse <http://localhost:3000>

---

## 📁 Estrutura do Projeto

```
frontend/
├── app/
│   ├── (dashboard)/           # Rotas do dashboard
│   │   ├── governance/        # Módulo de Governança
│   │   ├── risk/             # Módulo de Riscos
│   │   ├── compliance/       # Módulo de Conformidade
│   │   └── documents/        # Gestão de Documentos
│   ├── globals.css           # Design system ness.
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── ui/                   # Componentes Shadcn/ui
│   └── layout/
│       └── ness-grc-logo.tsx # Logo OT GRC
│
├── features/
│   ├── governance/           # Features de Governança
│   ├── risk/                 # Features de Risco
│   ├── compliance/           # Features de Conformidade
│   └── documents/            # Gestão Documental
│
└── lib/                      # Utilitários
```

---

## 🎯 Módulos Principais

### 1. **Governance (Governança)**

#### Dashboard de Governança
- Visão executiva de conformidade
- Status de políticas e procedimentos
- Indicadores de maturidade GRC
- Alertas de revisões pendentes

#### Gestão de Políticas
- Política de Segurança Cibernética
- Políticas específicas (Acesso, Backup, Patches, etc)
- Workflow de aprovação
- Versionamento automático

#### Estrutura Organizacional
- Definição de papéis e responsabilidades
- CISO, CSIRT, SOC, Comitês
- Matriz RACI

### 2. **Risk (Gestão de Riscos)**

#### Análise de Riscos
- Identificação de riscos cibernéticos
- Avaliação qualitativa e quantitativa
- Matriz de riscos (likelihood x impact)
- Heat map de riscos

#### Gestão de Vulnerabilidades
- Scanning de vulnerabilidades
- Classificação por CVSS
- Priorização por criticidade
- Tracking de remediação

#### Análise de Topologia
- Mapeamento de rede OT
- Identificação de zonas de segurança
- Detecção de caminhos de vazamento
- Análise de segmentação

### 3. **Compliance (Conformidade)**

#### Dashboard de Conformidade
- Status geral por framework
- % de conformidade ANEEL RN 964/2021
- % de conformidade ONS
- % de conformidade IEC 62443

#### Gestão de Frameworks
- ANEEL RN 964/2021
- ONS Rotina Operacional
- IEC 62443 (SL0-SL4)
- NIST CSF
- ISO 27001/27019
- LGPD

#### Gestão de Documentação
- 50+ documentos obrigatórios mapeados
- Status de cada documento (missing, draft, approved, expired)
- Alertas de revisão
- Evidências de conformidade

#### Gestão de Incidentes
- Registro de incidentes cibernéticos
- Classificação por severidade
- Notificações ANEEL/ONS/GSI
- Lições aprendidas

### 4. **Documents (Gestão Documental)**

#### Categorias de Documentos
- **POL**: Políticas (6 docs)
- **PROC**: Procedimentos (6 docs)
- **PRI**: Planos de Resposta a Incidentes (4 docs)
- **BCP**: Continuidade e DR (3 docs)
- **TRAIN**: Treinamentos (4 docs)
- **RISK**: Análise de Risco (3 docs)
- **AUD**: Auditorias (4 docs)
- **INC**: Incidentes (4 docs)
- **EVID**: Evidências (5 docs)

#### Features
- Upload e versionamento
- Workflow de aprovação
- Assinaturas digitais
- Controle de acesso por classificação
- Retenção automática
- Busca e filtros

---

## 📊 Conformidade Regulatória

### ANEEL RN 964/2021

**Status**: Framework completo implementado

**Requisitos Cobertos**:
- ✅ Política de Segurança Cibernética
- ✅ Classificação de Dados (5 níveis)
- ✅ Controles Técnicos Obrigatórios
- ✅ Gestão de Incidentes
- ✅ Notificações à ANEEL
- ✅ Programas de Treinamento
- ✅ Cultura de Segurança
- ✅ Auditoria e Evidências

### ONS Rotina Operacional

**Status**: Integrado

**Controles Mínimos**:
- ✅ MFA (Autenticação Multifator)
- ✅ Gestão de Patches
- ✅ VPN para acesso remoto
- ✅ Antimalware
- ✅ Segmentação de rede OT/IT

### IEC 62443

**Status**: Framework de avaliação

**Security Levels**:
- SL0: Sem proteção
- SL1: Proteção contra uso casual
- SL2: Proteção contra violação intencional
- SL3: Proteção contra ataques sofisticados
- SL4: Proteção contra ataques com recursos extensos

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev           # Servidor dev

# Build
pnpm build         # Build produção
pnpm start         # Servidor produção

# Qualidade
pnpm lint          # ESLint
pnpm format        # Prettier
pnpm type-check    # TypeScript
```

---

## 🐳 Docker

```bash
# Subir stack completa (Frontend + Backend + DB)
docker-compose up -d

# Ver logs
docker-compose logs -f frontend

# Parar
docker-compose down
```

---

## 📚 Documentação Adicional

- [Design System ness.](./docs/design-system.md)
- [Guia de Implementação](./IMPLEMENTATION-GUIDE.md)
- [ANEEL RN 964/2021](../docs/security/ANEEL-RN-964-2021.md)
- [ONS Requirements](../docs/security/ONS-REQUIREMENTS.md)

---

## 🤝 Contribuindo

Projeto interno **ness.**

---

## 📝 License

Propriedade **ness.** - Todos os direitos reservados © 2025

---

## 🔗 Links Úteis

- [ANEEL](https://www.aneel.gov.br)
- [ONS](https://www.ons.org.br)
- [IEC 62443](https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards)
- [NIST CSF](https://www.nist.gov/cyberframework)

---

**Desenvolvido com 💙 pela equipe ness.**

<div align="center">
  <strong>ness<span style="color: #00ADE8">.</span> OT GRC</strong><br>
  <em>Governance, Risk & Compliance para Redes OT</em>
</div>
