# 📋 Plano de Migração: Template ness-theme

## 🎯 Objetivo

Adotar o visual e tecnologia do template **ness-theme** mantendo **100% das funcionalidades** da aplicação **ness. OT GRC**.

**Template:** [ness-theme](https://github.com/resper1965/ness-theme/tree/cursor/ajuste-o-repositorio-d654)

---

## 📊 Análise Comparativa

### Tecnologias

| Aspecto | Aplicação Atual | Template ness-theme | Decisão |
|---------|----------------|---------------------|---------|
| **Next.js** | 15.1.0 | 14.2.0 | ✅ **Manter 15.1.0** (mais recente) |
| **React** | 19.0.0 | 18.3.1 | ✅ **Manter 19.0.0** (mais recente) |
| **TypeScript** | 5.3.3 | 5.5.0 | ✅ **Atualizar para 5.5.0** |
| **Tailwind CSS** | v4 | v3.4 | ⚠️ **Manter v4** (já em uso, mais moderno) |
| **shadcn/ui** | ✅ | ✅ | ✅ **Manter compatibilidade** |
| **Supabase** | ✅ | ✅ | ✅ **Já integrado** |
| **i18n (next-intl)** | ❌ | ✅ | 🔄 **Opcional: Adicionar** |

### Estrutura de Pastas

**Template:**
```
app/[locale]/          # Multiidiomas
  ├── layout.tsx
  ├── page.tsx
  └── [rotas]/
components/
  ├── dashboard/
  │   ├── sidebar.tsx
  │   ├── header.tsx
  │   └── dashboard-layout.tsx
  └── ui/
lib/
  ├── branding/       # Sistema de branding
  ├── supabase/
  └── utils/
i18n/                 # Configuração i18n
middleware.ts         # i18n + Supabase
```

**Aplicação Atual:**
```
src/app/
  ├── layout.tsx
  ├── dashboard/
  │   ├── compliance/
  │   ├── network/
  │   └── ...
src/components/
  ├── layout/
  │   └── app-sidebar.tsx  # Shadcn/ui Sidebar
  └── ui/
src/lib/
  └── supabase/
```

---

## 🚀 Estratégia de Migração

### Abordagem: **Migração Incremental Híbrida**

1. **Manter versões mais recentes** (Next.js 15, React 19)
2. **Adotar estrutura do template** (componentes, layout)
3. **Manter funcionalidades existentes** (páginas, lógica)
4. **Adaptar design system ness.** (cores, tipografia)
5. **i18n opcional** (pode ser adicionado depois)

---

## 📝 Plano de Execução Detalhado

### FASE 1: Preparação (1 dia)

#### 1.1 Criar Branch e Backup
```bash
cd /home/resper/TBE-OT/frontend
git checkout -b feature/ness-theme-migration
# Backup já feito em /home/resper/backups/
```

#### 1.2 Atualizar Dependências Base
- [ ] Atualizar TypeScript para 5.5.0
- [ ] Manter Next.js 15 e React 19
- [ ] Adicionar next-intl (opcional - para i18n futuro)
- [ ] Verificar compatibilidade de dependências

#### 1.3 Copiar Arquivos Base do Template
- [ ] Copiar `lib/branding/` (sistema de branding)
- [ ] Copiar estrutura `i18n/` (opcional)
- [ ] Copiar componentes base úteis
- [ ] Copiar configurações (se relevante)

**Status:** ⏳ Aguardando início

---

### FASE 2: Migração do Layout Base (2-3 dias)

#### 2.1 Adaptar Estrutura de Layout

**Opção Recomendada:** Manter estrutura atual (`app/dashboard/`) sem i18n por enquanto

**Decisões:**
- ✅ Manter `app/dashboard/` (sem `[locale]` inicialmente)
- ✅ Migrar para layout do template (`DashboardLayout`)
- ✅ Adotar sidebar do template (mais simples)
- ✅ Manter header do template

#### 2.2 Migrar Sidebar

**Template tem:**
```typescript
// components/dashboard/sidebar.tsx
// Sidebar simples com menu fixo
```

**Aplicação atual tem:**
```typescript
// src/components/layout/app-sidebar.tsx
// Shadcn/ui Sidebar complexa com menu TBE-OT
```

**Ação:**
1. Copiar sidebar do template
2. Adaptar menu para TBE-OT (compliance, network, remediation)
3. Manter funcionalidades (badges, submenus, etc.)
4. Aplicar design system ness.

#### 2.3 Migrar Dashboard Layout

**Template:**
```typescript
// components/dashboard/dashboard-layout.tsx
// Layout simples: Sidebar + Header + Main
```

**Aplicação atual:**
```typescript
// src/app/dashboard/layout.tsx
// Layout com Shadcn/ui Sidebar
```

**Ação:**
1. Adotar `DashboardLayout` do template
2. Integrar sidebar adaptada
3. Adicionar header (se necessário)
4. Manter todas as rotas funcionando

**Checklist:**
- [ ] Layout base migrado
- [ ] Sidebar funcionando com menu TBE-OT
- [ ] Navegação preservada
- [ ] Design system ness. aplicado
- [ ] Todas as rotas acessíveis

**Status:** ⏳ Aguardando início

---

### FASE 3: Adaptação do Design System (1-2 dias)

#### 3.1 Cores ness.

**Aplicação atual usa:**
```css
--brand-cyan: #00ADE8
--gray-950: #0B0C0E
--gray-900: #111317
```

**Template usa:**
```css
--background: oklch(...)
--foreground: oklch(...)
```

**Ação:**
1. Adicionar cores ness. ao Tailwind config
2. Adaptar globals.css do template
3. Garantir que todas as cores ness. estejam disponíveis
4. Manter compatibilidade com shadcn/ui

#### 3.2 Tipografia

**Manter:**
- Montserrat como fonte principal
- Tamanhos e pesos atuais

#### 3.3 Componentes UI

**Manter compatibilidade:**
- Shadcn/ui continua funcionando
- Apenas adaptar estilos visuais
- Manter APIs dos componentes

**Checklist:**
- [ ] Cores ness. configuradas
- [ ] Tipografia mantida
- [ ] Componentes shadcn/ui funcionando
- [ ] Design system aplicado

**Status:** ⏳ Aguardando início

---

### FASE 4: Migração de Componentes (2-3 dias)

#### 4.1 Componentes do Template

**Template tem:**
- `components/dashboard/sidebar.tsx`
- `components/dashboard/header.tsx`
- `components/dashboard/dashboard-layout.tsx`
- `components/ui/` (shadcn/ui)

**Ação:**
1. Adotar componentes dashboard do template
2. Adaptar para funcionalidades TBE-OT
3. Manter componentes UI atuais (já são shadcn/ui)

#### 4.2 Componentes Existentes

**Manter:**
- Todos os componentes específicos de TBE-OT
- Componentes de Compliance, Network, Remediation
- Componentes de formulários e tabelas

**Checklist:**
- [ ] Componentes do template adotados
- [ ] Componentes existentes preservados
- [ ] Integração funcionando
- [ ] Estilos aplicados

**Status:** ⏳ Aguardando início

---

### FASE 5: Migração de Páginas (3-5 dias)

#### 5.1 Estrutura de Páginas

**Manter estrutura atual:**
```
app/dashboard/
  ├── overview/
  ├── compliance/
  ├── network/
  ├── remediation/
  ├── reports/
  └── settings/
```

**Não migrar para `app/[locale]/` ainda** (pode ser feito depois)

#### 5.2 Páginas a Migrar

**Módulo Compliance:**
- [ ] `/dashboard/compliance/documents`
- [ ] `/dashboard/compliance/ons`
- [ ] `/dashboard/compliance/aneel`
- [ ] `/dashboard/compliance/frameworks`

**Módulo Network:**
- [ ] `/dashboard/network/assets`
- [ ] `/dashboard/network/ipam`
- [ ] `/dashboard/network/vlans`
- [ ] `/dashboard/network/routing`
- [ ] `/dashboard/network/topology`
- [ ] `/dashboard/network/health`

**Módulo Remediation:**
- [ ] `/dashboard/remediation/gaps`
- [ ] `/dashboard/remediation/risks`
- [ ] `/dashboard/remediation/plan`
- [ ] `/dashboard/remediation/timeline`

**Outros:**
- [ ] `/dashboard/overview`
- [ ] `/dashboard/reports`
- [ ] `/dashboard/settings`

**Estratégia por Página:**
1. Copiar estrutura visual do template (se houver páginas similares)
2. Manter lógica de negócio atual
3. Adaptar para funcionalidades TBE-OT
4. Aplicar design system ness.
5. Testar todas as funcionalidades

**Checklist:**
- [ ] Todas as páginas migradas
- [ ] Funcionalidades preservadas
- [ ] Visual novo aplicado
- [ ] Navegação funcionando
- [ ] Testes passando

**Status:** ⏳ Aguardando início

---

### FASE 6: Integrações e Configurações (1-2 dias)

#### 6.1 Autenticação Supabase

**Manter:**
- Supabase Auth (já está integrado)
- Middleware atual (sem i18n por enquanto)
- Páginas de login/signup atuais

**Template tem:**
- Middleware com i18n + Supabase
- Páginas de login em `app/[locale]/login/`

**Decisão:** Manter autenticação atual, pode adaptar UI depois

#### 6.2 API Routes e Integrações

**Manter:**
- Todas as integrações atuais
- API routes existentes
- Supabase client
- Backend FastAPI (se houver)

#### 6.3 Variáveis de Ambiente

**Manter:**
- Todas as variáveis atuais
- Configurações do Supabase
- Outras configurações

**Checklist:**
- [ ] Autenticação funcionando
- [ ] Integrações preservadas
- [ ] Variáveis de ambiente mantidas
- [ ] API routes funcionando

**Status:** ⏳ Aguardando início

---

### FASE 7: Validação e Testes (2-3 dias)

#### 7.1 Testes Funcionais

**Todas as Funcionalidades:**
- [ ] Dashboard Overview funcionando
- [ ] Compliance - todas as páginas
- [ ] Network - todas as páginas
- [ ] Remediation - todas as páginas
- [ ] Reports funcionando
- [ ] Settings funcionando
- [ ] Navegação completa
- [ ] Autenticação funcionando

#### 7.2 Testes Visuais

- [ ] Design system ness. aplicado
- [ ] Cores corretas
- [ ] Tipografia correta
- [ ] Responsividade mantida
- [ ] Componentes renderizando corretamente

#### 7.3 Testes Técnicos

- [ ] Build sem erros (`npm run build`)
- [ ] TypeScript sem erros (`npm run type-check`)
- [ ] Lint sem erros (`npm run lint`)
- [ ] Performance mantida
- [ ] Sem warnings críticos

**Status:** ⏳ Aguardando início

---

## 🎨 Design System ness.

### Cores a Manter

```css
/* Brand */
--brand-cyan: #00ADE8
--brand-cyan-dark: #0090C4
--brand-cyan-light: #33BDEF

/* Grayscale (Cool Grays) */
--gray-950: #0B0C0E  /* Background */
--gray-900: #111317  /* Surface 1 */
--gray-850: #151820  /* Surface 2 */
--gray-800: #1B2030  /* Surface 3 */
--gray-50:  #EEF1F6  /* Text */
```

### Tipografia

- **Primária**: Montserrat (300-700)
- **Monospace**: JetBrains Mono (400-600)

### Wordmark

```
ness<span style="color: #00ADE8">.</span>
```

---

## ⚠️ Pontos de Atenção

### 1. Next.js 15 vs 14
- Template usa Next.js 14
- Aplicação atual usa Next.js 15
- **Decisão:** Manter Next.js 15 (mais recente, compatível)

### 2. React 19 vs 18
- Template usa React 18
- Aplicação atual usa React 19
- **Decisão:** Manter React 19 (mais recente, compatível)

### 3. Tailwind CSS v4 vs v3
- Template usa Tailwind v3
- Aplicação atual usa Tailwind v4
- **Decisão:** Manter Tailwind v4 (mais moderno)

### 4. i18n (next-intl)
- Template tem i18n configurado
- Aplicação atual não tem i18n
- **Decisão:** **Opcional** - pode ser adicionado depois
- Por enquanto: manter estrutura sem `[locale]`

### 5. Sidebar
- Template tem sidebar simples
- Aplicação atual tem Shadcn/ui Sidebar complexa
- **Decisão:** Adotar sidebar do template, adaptar menu TBE-OT

---

## 📋 Checklist Final

### Antes de Começar
- [x] Template clonado e analisado
- [x] Plano de migração criado
- [ ] Branch de desenvolvimento criada
- [ ] Backup verificado

### Durante a Migração
- [ ] Layout base migrado
- [ ] Sidebar adaptada
- [ ] Design system ness. aplicado
- [ ] Componentes migrados
- [ ] Páginas migradas
- [ ] Funcionalidades preservadas
- [ ] Integrações mantidas

### Antes de Deploy
- [ ] Todos os testes passando
- [ ] Build sem erros
- [ ] TypeScript sem erros
- [ ] Lint sem erros
- [ ] Performance mantida
- [ ] Visual final validado

---

## 🚀 Próximos Passos

1. **Revisar este plano** com você
2. **Iniciar FASE 1** (Preparação)
3. **Migrar incrementalmente** (FASE 2-6)
4. **Validar** (FASE 7)

---

**Pronto para começar a migração?**

Posso iniciar agora, ou você prefere revisar o plano primeiro?

---

**Criado em:** 2025-11-02  
**Template:** ness-theme  
**Projeto:** ness. OT GRC

