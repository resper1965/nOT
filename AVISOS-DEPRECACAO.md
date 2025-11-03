# ⚠️ Avisos de Deprecação - ness. OT GRC

**Data**: 2025-01-03  
**Status**: ⚠️ Não críticos - Aplicação funciona normalmente

## 📋 Avisos Identificados

### 1. ESLint 8.57.1
**Status**: ⚠️ Deprecado  
**Aviso**: `eslint@8.57.1: This version is no longer supported`  
**Impacto**: Baixo - ESLint 8 ainda funciona, mas não recebe mais atualizações

**Solução Futura**:
- Aguardar Next.js 15.2+ com suporte a ESLint 9
- Ou atualizar manualmente quando compatível

**Versão Atual**: `eslint@^8.56.0`  
**Versão Recomendada**: `eslint@^9.0.0` (ainda não compatível com Next.js 15.1.0)

---

### 2. Dependências Transitivas Deprecadas

Estes avisos vêm de dependências transitivas (dependências de dependências) e não temos controle direto:

#### 2.1. `inflight@1.0.6`
- **Aviso**: "This module is not supported, and leaks memory"
- **Origem**: Dependência transitiva de algum pacote antigo
- **Impacto**: Baixo - Apenas aviso, não afeta funcionalidade
- **Solução**: Aguardar atualização das dependências principais

#### 2.2. `glob@7.2.3`
- **Aviso**: "Glob versions prior to v9 are no longer supported"
- **Origem**: Dependência transitiva
- **Impacto**: Baixo
- **Solução**: Aguardar atualização das dependências principais

#### 2.3. `rimraf@3.0.2`
- **Aviso**: "Rimraf versions prior to v4 are no longer supported"
- **Origem**: Dependência transitiva
- **Impacto**: Baixo
- **Solução**: Aguardar atualização das dependências principais

#### 2.4. `@humanwhocodes/object-schema@2.0.3`
- **Aviso**: "Use @eslint/object-schema instead"
- **Origem**: Dependência transitiva do ESLint 8
- **Impacto**: Baixo
- **Solução**: Atualizar ESLint para v9 quando compatível

#### 2.5. `@humanwhocodes/config-array@0.13.0`
- **Aviso**: "Use @eslint/config-array instead"
- **Origem**: Dependência transitiva do ESLint 8
- **Impacto**: Baixo
- **Solução**: Atualizar ESLint para v9 quando compatível

---

## ✅ Ação Recomendada

**Agora**: Nenhuma ação necessária
- Os avisos não afetam a funcionalidade
- A aplicação funciona normalmente
- Build e deploy funcionam sem problemas

**Futuro** (quando Next.js suportar ESLint 9):
1. Atualizar `eslint` para `^9.0.0`
2. Atualizar `eslint-config-next` para versão compatível
3. Atualizar `@typescript-eslint/*` para versões compatíveis
4. Executar `npm audit fix` para atualizar dependências transitivas

---

## 📊 Resumo

| Dependência | Status | Impacto | Ação |
|------------|--------|---------|------|
| `eslint@8.56.0` | ⚠️ Deprecado | Baixo | Aguardar compatibilidade |
| `inflight@1.0.6` | ⚠️ Transitiva | Baixo | Aguardar atualização |
| `glob@7.2.3` | ⚠️ Transitiva | Baixo | Aguardar atualização |
| `rimraf@3.0.2` | ⚠️ Transitiva | Baixo | Aguardar atualização |
| `@humanwhocodes/*` | ⚠️ Transitiva | Baixo | Aguardar atualização |

**Conclusão**: Avisos não críticos. Aplicação funciona normalmente. Manter monitoramento para futuras atualizações.

