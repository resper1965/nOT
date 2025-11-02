# 📋 Guia de Migração: Adotar Novo Template Mantendo Funcionalidades

## 🎯 Objetivo

Adotar o visual e tecnologia de um novo template mantendo **100% das funcionalidades** atuais da aplicação **ness. OT GRC**.

---

## 📊 Situação Atual

### Template Base Atual
- **Template**: Next.js Admin Dashboard Starter (Shadcn-ui)
- **Framework**: Next.js 15 + React 19
- **UI Components**: Shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS v4
- **Auth**: Supabase Auth

### Funcionalidades Implementadas
✅ Dashboard Overview  
✅ Módulo Normativa (Compliance)  
✅ Análise de Rede (Network)  
✅ Módulo de Adequação (Remediation)  
✅ Relatórios  
✅ Configurações  
✅ Sidebar customizada com menu TBE-OT  
✅ Design system ness.  

---

## 🔄 Estratégia de Migração

### Abordagem Recomendada: **Migração Incremental**

Ao invés de substituir tudo de uma vez, vamos migrar componente por componente, preservando as funcionalidades existentes.

---

## 📝 Passo a Passo Detalhado

### FASE 1: Preparação e Análise (1-2 dias)

#### 1.1 Identificar o Template Alvo
**Você precisa informar:**
- Qual template deseja adotar?
- Qual é o link/URL do template?
- O template tem GitHub? Qual o repositório?

**Exemplo de informações necessárias:**
```
Template: [Nome do Template]
Link: [URL do template]
GitHub: [Link do repositório]
Tecnologias: [Lista de tecnologias]
```

#### 1.2 Comparar Tecnologias
Compare o stack atual vs. template novo:

**Stack Atual:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/ui
- Supabase Auth

**Template Novo:**
- [Preencher após identificar o template]

#### 1.3 Criar Branch de Desenvolvimento
```bash
cd /home/resper/TBE-OT/frontend
git checkout -b feature/template-migration
```

#### 1.4 Backup da Estrutura Atual
```bash
# Já feito anteriormente
# Backup em: /home/resper/backups/TBE-OT_backup_20251102_153823
```

---

### FASE 2: Análise de Compatibilidade (2-3 dias)

#### 2.1 Mapear Componentes Atuais
Criar um inventário completo:

**Componentes de Layout:**
- `app-sidebar.tsx` - Menu lateral
- `app-header.tsx` - Cabeçalho (se existir)
- `app-layout.tsx` - Layout principal

**Componentes de Funcionalidades:**
- Compliance: `/dashboard/compliance/*`
- Network: `/dashboard/network/*`
- Remediation: `/dashboard/remediation/*`
- Reports: `/dashboard/reports/*`

**Configurações:**
- `globals.css` - Design system ness.
- `tailwind.config.js` - Cores customizadas
- Variáveis de ambiente

#### 2.2 Identificar Dependências Críticas
Listar todas as dependências que suportam funcionalidades:

```json
{
  "auth": "@supabase/supabase-js",
  "tables": "@tanstack/react-table",
  "forms": "react-hook-form + zod",
  "charts": "recharts",
  "state": "zustand"
}
```

#### 2.3 Verificar Compatibilidade de Versões
Comparar versões das dependências:
- Next.js 15 vs. template
- React 19 vs. template
- TypeScript 5.3 vs. template

---

### FASE 3: Migração do Layout Base (3-5 dias)

#### 3.1 Migrar Estrutura de Pastas
Se o template tiver estrutura diferente, adaptar:

**Estrutura Atual:**
```
src/
├── app/
│   ├── dashboard/
│   │   ├── compliance/
│   │   ├── network/
│   │   └── ...
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── layout/
└── lib/
```

**Estrutura do Template:**
```
[Preencher após identificar]
```

#### 3.2 Migrar Layout Principal
1. Copiar layout do template
2. Integrar Sidebar atual
3. Manter design system ness.
4. Testar todas as rotas

**Checklist:**
- [ ] Layout base funcionando
- [ ] Sidebar mantida
- [ ] Navegação preservada
- [ ] Design system ness. aplicado
- [ ] Todas as rotas acessíveis

#### 3.3 Adaptar Design System
Se o template tiver cores/estilos diferentes:

1. **Manter cores ness.:**
   ```css
   --brand-cyan: #00ADE8
   --gray-950: #0B0C0E
   --gray-900: #111317
   ```

2. **Adaptar componentes do template** para usar cores ness.

3. **Manter tipografia Montserrat**

---

### FASE 4: Migração de Componentes UI (5-7 dias)

#### 4.1 Componentes Shadcn/ui
Se o template usar outros componentes:

**Opções:**
1. **Manter Shadcn/ui atual** e usar apenas visual do template
2. **Migrar para componentes do template** adaptando APIs

#### 4.2 Migração Incremental
Para cada componente:

```typescript
// 1. Copiar componente do template
// 2. Adaptar para funcionalidades atuais
// 3. Testar em contexto real
// 4. Manter compatibilidade com código existente
```

**Exemplo - Migração de Card:**
```typescript
// ANTES (Shadcn/ui)
import { Card } from "@/components/ui/card"

// DEPOIS (Template novo - adaptado)
import { Card } from "@/components/ui/card" // Mesma API, novo visual
```

---

### FASE 5: Migração de Páginas/Funcionalidades (7-10 dias)

#### 5.1 Estratégia por Módulo

Para cada módulo (Compliance, Network, Remediation):

1. **Copiar estrutura do template** (se tiver páginas similares)
2. **Integrar funcionalidades atuais**
3. **Manter APIs e lógica de negócio**
4. **Adaptar visual para template novo**

#### 5.2 Exemplo: Página de Compliance

```typescript
// Estrutura do template
// + Lógica de negócio atual
// = Nova página com visual template + funcionalidades atuais
```

#### 5.3 Checklist por Página

Para cada página (`/dashboard/compliance/documents`, etc.):

- [ ] Visual migrado para template
- [ ] Funcionalidades preservadas
- [ ] Integrações mantidas (Supabase, etc.)
- [ ] Formulários funcionando
- [ ] Tabelas funcionando
- [ ] Gráficos funcionando
- [ ] Navegação funcionando
- [ ] Testado em produção

---

### FASE 6: Integrações e Configurações (2-3 dias)

#### 6.1 Autenticação
Manter Supabase Auth independente do template:

```typescript
// Template pode ter Clerk/NextAuth
// Nós mantemos Supabase Auth
// Apenas adaptamos a UI de login
```

#### 6.2 API Routes
Manter todas as integrações atuais:
- Supabase client
- Backend FastAPI
- Database queries

#### 6.3 Variáveis de Ambiente
```bash
# Manter todas as variáveis atuais
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# etc.
```

---

### FASE 7: Testes e Validação (3-5 dias)

#### 7.1 Testes Funcionais
- [ ] Todas as rotas acessíveis
- [ ] Todas as funcionalidades preservadas
- [ ] Formulários funcionando
- [ ] Tabelas funcionando
- [ ] Gráficos renderizando
- [ ] Autenticação funcionando
- [ ] Navegação funcionando

#### 7.2 Testes Visuais
- [ ] Design system ness. aplicado
- [ ] Responsividade mantida
- [ ] Acessibilidade preservada
- [ ] Performance mantida

#### 7.3 Testes de Integração
- [ ] Supabase funcionando
- [ ] Backend API funcionando
- [ ] Database queries funcionando

---

## 🔧 Ferramentas e Comandos Úteis

### Análise de Dependências
```bash
cd frontend
npm ls --depth=0  # Ver dependências instaladas
npm outdated     # Ver dependências desatualizadas
```

### Comparação de Arquivos
```bash
# Comparar estrutura de pastas
diff -r template-original/ frontend/src/app/
```

### Testes de Build
```bash
npm run build    # Testar build
npm run lint     # Verificar erros
npm run type-check  # Verificar TypeScript
```

---

## ⚠️ Pontos de Atenção

### 1. Breaking Changes
- Versões diferentes do Next.js podem ter breaking changes
- React 19 pode ter incompatibilidades
- TypeScript 5.3 pode ter mudanças

### 2. Dependências Conflitantes
- Template pode usar versões diferentes
- Pode haver conflitos de peer dependencies
- Resolver com `npm install --legacy-peer-deps` se necessário

### 3. Estrutura de Pastas
- Template pode ter estrutura diferente
- Manter compatibilidade com código existente
- Migrar gradualmente

### 4. Autenticação
- Template pode usar outro provider
- Manter Supabase Auth
- Apenas adaptar UI

---

## 📋 Checklist Final

### Antes de Começar
- [ ] Template identificado e acessível
- [ ] Backup completo realizado
- [ ] Branch de desenvolvimento criada
- [ ] Análise de compatibilidade feita

### Durante a Migração
- [ ] Layout base migrado
- [ ] Componentes UI adaptados
- [ ] Páginas migradas
- [ ] Funcionalidades preservadas
- [ ] Design system ness. mantido

### Antes de Deploy
- [ ] Todos os testes passando
- [ ] Build sem erros
- [ ] TypeScript sem erros
- [ ] Lint sem erros
- [ ] Performance mantida
- [ ] Visual final validado

---

## 🚀 Próximos Passos

**Para começar a migração, você precisa:**

1. **Informar qual template deseja adotar:**
   - Nome do template
   - Link/URL
   - Repositório GitHub (se tiver)

2. **Após identificar o template, vou:**
   - Analisar a estrutura
   - Criar plano detalhado de migração
   - Começar a implementação incremental

---

## 💡 Dicas Importantes

1. **Migração Incremental**: Não tente migrar tudo de uma vez
2. **Testes Constantes**: Teste cada mudança antes de continuar
3. **Git Branches**: Use branches para testar sem afetar produção
4. **Documentação**: Documente cada mudança significativa
5. **Backup**: Mantenha backups regulares durante a migração

---

**Desenvolvido pela equipe ness.**  
**Projeto**: ness. OT GRC

