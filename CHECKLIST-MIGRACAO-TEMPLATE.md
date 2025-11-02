# ✅ Checklist Prático: Migração de Template

## 📌 ANTES DE COMEÇAR - Informações Necessárias

**Você precisa me informar:**

### 1. Template Alvo
- [ ] Nome do template: _____________________
- [ ] Link/URL: _____________________
- [ ] Repositório GitHub (se tiver): _____________________
- [ ] Versão do template: _____________________

### 2. Objetivos da Migração
- [ ] Melhorar visual/UI
- [ ] Adotar novas tecnologias
- [ ] Melhorar performance
- [ ] Adotar componentes mais modernos
- [ ] Outro: _____________________

### 3. Tecnologias do Template
- [ ] Framework (Next.js, React, etc.): _____________________
- [ ] Versões: _____________________
- [ ] UI Components (Shadcn, MUI, etc.): _____________________
- [ ] Sistema de autenticação: _____________________

---

## 🚀 PASSO A PASSO IMEDIATO

### Etapa 1: Preparação (Fazer AGORA)

```bash
# 1. Criar branch para migração
cd /home/resper/TBE-OT/frontend
git checkout -b feature/template-migration
git status

# 2. Verificar backup (já feito)
ls /home/resper/backups/

# 3. Documentar estrutura atual
cd /home/resper/TBE-OT/frontend
tree -L 3 src/app/dashboard > estrutura-atual.txt
```

**Status:**
- [ ] Branch criada
- [ ] Backup verificado
- [ ] Estrutura documentada

---

### Etapa 2: Análise do Template (Você precisa fazer)

**Depois que você me informar o template, vou:**

1. **Clonar template em pasta separada**
   ```bash
   cd /home/resper/TBE-OT
   mkdir template-reference
   # Clonar template aqui
   ```

2. **Analisar estrutura**
   - Comparar estruturas de pastas
   - Comparar dependências
   - Identificar componentes principais

3. **Criar plano de migração específico**

---

### Etapa 3: Migração Incremental (Vou fazer após sua confirmação)

#### 3.1 Layout Base
- [ ] Copiar layout do template
- [ ] Adaptar para manter Sidebar atual
- [ ] Manter design system ness.
- [ ] Testar navegação

#### 3.2 Componentes UI
- [ ] Migrar componentes Shadcn/ui (ou adotar novos)
- [ ] Adaptar cores para design system ness.
- [ ] Manter APIs compatíveis

#### 3.3 Páginas/Funcionalidades
- [ ] Dashboard Overview
- [ ] Compliance (Normativa)
- [ ] Network (Análise de Rede)
- [ ] Remediation (Adequação)
- [ ] Reports (Relatórios)
- [ ] Settings (Configurações)

#### 3.4 Integrações
- [ ] Manter Supabase Auth
- [ ] Manter APIs atuais
- [ ] Manter variáveis de ambiente

---

### Etapa 4: Validação (Final)

- [ ] Todas as rotas funcionando
- [ ] Todas as funcionalidades preservadas
- [ ] Visual novo aplicado
- [ ] Design system ness. mantido
- [ ] Build sem erros
- [ ] Testes passando
- [ ] Performance mantida

---

## 💬 Próxima Ação

**Me informe qual template deseja adotar e eu começo a migração!**

Exemplos de informações úteis:
- Link do template
- Nome do template
- Repositório GitHub
- Screenshots (se tiver)

Depois disso, vou:
1. Analisar o template
2. Criar plano específico
3. Começar migração incremental
4. Manter todas as funcionalidades

---

**Criado em**: 2025-11-02  
**Projeto**: ness. OT GRC

