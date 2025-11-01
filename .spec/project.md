# ness. OT GRC - Especificação do Projeto

## 📋 Visão Geral

**ness. OT GRC** é a primeira plataforma brasileira especializada em **Governance, Risk and Compliance (GRC)** para redes de **Tecnologia Operacional (OT)** do setor elétrico.

### O que é GRC?

- **G**overnance (Governança): Estrutura de políticas, procedimentos e responsabilidades
- **R**isk (Risco): Identificação, avaliação e tratamento de riscos cibernéticos
- **C**ompliance (Conformidade): Aderência a normas regulatórias (ANEEL, ONS, IEC 62443)

### Por que OT?

Redes **OT (Operational Technology)** são fundamentalmente diferentes de redes IT:
- **Tempo Real**: Latência crítica para controle de processos
- **Disponibilidade**: 99.99% uptime obrigatório
- **Legado**: Sistemas com 10-20 anos em operação
- **Segurança**: Impacto direto em infraestrutura crítica nacional

## 🎯 Funcionalidades Principais

### 🏛️ Governance (Governança)
- **Gestão de Políticas**: 6+ políticas obrigatórias ANEEL RN 964/2021
- **Estrutura Organizacional**: CISO, CSIRT, SOC, Comitês
- **Workflow de Aprovação**: Conselho → Diretoria → Operação
- **Dashboard Executivo**: KPIs de maturidade GRC

### ⚠️ Risk (Gestão de Riscos)
- **Análise de Vulnerabilidades**: CVSS scoring + priorização
- **Análise de Topologia OT**: Modelo Purdue, segmentação
- **Detecção de Vazamento**: Caminhos de exfiltração de dados
- **Risk Register**: Inventário completo de riscos

### ✅ Compliance (Conformidade)
- **ANEEL RN 964/2021**: Framework completo implementado
- **ONS Rotina Operacional**: 5 controles mínimos obrigatórios
- **IEC 62443**: Security Levels (SL0-SL4)
- **NIST CSF**: Identify, Protect, Detect, Respond, Recover
- **LGPD**: Proteção de dados pessoais
- **ISO 27001/27019**: Setor de energia

## 📊 Arquitetura

### Stack Tecnológica

#### Frontend
- **Framework**: Next.js 15
- **React**: 19.0
- **TypeScript**: 5.3.3
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4.0
- **Autenticação**: Supabase Auth

#### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL 16 (via Supabase)
- **Cache**: Redis 7
- **API**: RESTful

#### Infraestrutura
- **Deploy**: Vercel (Frontend)
- **Database**: Supabase (PostgreSQL gerenciado)
- **Containerização**: Docker Compose (desenvolvimento)

### Estrutura do Projeto

```
TBE-OT/
├── frontend/          # Next.js 15 + React 19
│   ├── src/
│   │   ├── app/       # App Router (Next.js 15)
│   │   ├── components/
│   │   └── lib/
│   └── public/
├── backend/           # FastAPI (Python)
│   ├── api/
│   ├── main.py
│   └── requirements.txt
├── database/          # PostgreSQL schemas
│   └── init/
├── docs/              # Documentação
├── .spec/             # Especificações (Spec Kit)
└── docker-compose.yml
```

## 🔐 Autenticação e Segurança

- **Autenticação**: Supabase Auth
- **Autorização**: Row Level Security (RLS) no Supabase
- **MFA**: Suportado via Supabase
- **Sessões**: Gerenciadas pelo Supabase

## 📈 Métricas e Monitoramento

- **Uptime**: 99.99% (obrigatório para OT)
- **Latência**: < 100ms para operações críticas
- **Disponibilidade**: 24/7

## 🔗 Integrações

- **Supabase**: Database e Auth
- **Vercel**: Deploy e CDN
- **GitHub**: Versionamento
- **Docker**: Ambiente de desenvolvimento

## 📝 Documentação Adicional

- Ver `README.md` para visão geral
- Ver `SUPABASE-INTEGRATION.md` para integração Supabase
- Ver `VERCEL-SETUP.md` para deploy
- Ver `docs/` para documentação técnica detalhada

