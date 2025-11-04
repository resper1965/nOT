# 📋 Instruções: Cadastrar Controles da ONS RO-CB.BR.01 Rev. 02

Este documento fornece instruções para cadastrar os controles da Resolução Operativa ONS RO-CB.BR.01 Rev. 02 no banco de dados Supabase.

## 🎯 O que será cadastrado

### Framework ONS RO-CB.BR.01 Rev. 02
- **Nome**: ONS RO-CB.BR.01 Rev. 02
- **Versão**: Rev. 02
- **Tipo**: Regulatório
- **Órgão Regulador**: ONS (Operador Nacional do Sistema)
- **Documento**: Resolução Operativa

### Controles Cadastrados (18 controles)

#### 1. Redes e Segmentação (2 controles)
- **ONS-01**: Segmentação de Rede
- **ONS-02**: Proibição de Acesso Direto à Internet

#### 2. Gestão e Políticas (3 controles)
- **ONS-03**: Antimalware Atualizado
- **ONS-04**: Designação de Gestor e Suplente do ARCiber
- **ONS-05**: Política de Segurança do ARCiber

#### 3. Inventário e Ativos (1 controle)
- **ONS-06**: Inventário de Ativos

#### 4. Hardening e Patches (2 controles)
- **ONS-07**: Hardening de Sistemas
- **ONS-08**: Política de Atualização e Correção de Vulnerabilidades

#### 5. Gestão de Acessos (5 controles)
- **ONS-09**: Gestão de Acessos Individuais
- **ONS-10**: Política de Senhas
- **ONS-11**: Desativação de Credenciais
- **ONS-12**: Contas Privilegiadas
- **ONS-13**: Senhas Locais Únicas

#### 6. Monitoramento e Logs (2 controles)
- **ONS-14**: Geração e Retenção de Logs
- **ONS-15**: Tratamento de Alertas

#### 7. Resposta a Incidentes (1 controle)
- **ONS-16**: Plano de Resposta a Incidentes

#### 8. Gestão de Exceções (2 controles)
- **ONS-17**: Registro Formal de Exceções
- **ONS-18**: Controles Complementares para Ativos Externos

## 📝 Passo a Passo: Executar no Supabase Dashboard

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **ngrcot**

### Passo 2: Executar Script SQL

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query** (ou use o atalho `Ctrl+Enter`)
3. Abra o arquivo `supabase-insert-ons-ro-cb-br01-controls.sql` no seu editor
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
7. Aguarde a execução (pode levar alguns segundos)
8. Verifique se apareceu a mensagem de sucesso

**Resultado esperado**: 18 controles inseridos na tabela `compliance.controls`

### Passo 3: Verificar Controles Inseridos

Execute esta query para verificar:

```sql
-- Verificar controles da ONS RO-CB.BR.01 Rev. 02
SELECT 
    c.control_code,
    c.control_title,
    c.metadata->>'category' as category,
    c.metadata->>'domain' as domain,
    c.metadata->>'evidence' as evidence,
    c.metadata->>'responsible' as responsible,
    c.metadata->>'frequency' as frequency
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
ORDER BY c.control_code;
```

Você deve ver 18 controles listados.

### Passo 4: Verificar por Categoria

Execute esta query para verificar por categoria:

```sql
-- Verificar controles por categoria
SELECT 
    c.metadata->>'category' as category,
    COUNT(*) as total_controls
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
GROUP BY c.metadata->>'category'
ORDER BY c.metadata->>'category';
```

**Resultado esperado**:
- Acesso: 5 controles
- Gestão de Ativos: 2 controles
- Governança: 2 controles
- Monitoramento: 2 controles
- Rede: 2 controles
- Resposta a Incidentes: 1 controle
- Segurança: 4 controles

### Passo 5: Verificar por Domínio

Execute esta query para verificar por domínio:

```sql
-- Verificar controles por domínio
SELECT 
    c.metadata->>'domain' as domain,
    COUNT(*) as total_controls
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
GROUP BY c.metadata->>'domain'
ORDER BY c.metadata->>'domain';
```

**Resultado esperado**:
- Gestão de Acessos: 5 controles
- Gestão de Exceções: 2 controles
- Gestão e Políticas: 3 controles
- Hardening e Patches: 2 controles
- Inventário e Ativos: 1 controle
- Monitoramento e Logs: 2 controles
- Redes e Segmentação: 2 controles
- Resposta a Incidentes: 1 controle

## ✅ Verificação Completa

Execute esta query para ver uma visão geral completa:

```sql
-- Resumo completo dos controles da ONS RO-CB.BR.01 Rev. 02
SELECT 
    f.framework_name as "Framework",
    f.version as "Versão",
    COUNT(c.id) as "Total Controles",
    COUNT(DISTINCT c.metadata->>'category') as "Categorias",
    COUNT(DISTINCT c.metadata->>'domain') as "Domínios"
FROM compliance.frameworks f
LEFT JOIN compliance.controls c ON c.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
GROUP BY f.id, f.framework_name, f.version;
```

## 🔍 Consultas Úteis

### Ver controles por responsável

```sql
-- Ver controles por responsável
SELECT 
    c.metadata->>'responsible' as responsible,
    COUNT(*) as total_controls,
    STRING_AGG(c.control_code, ', ' ORDER BY c.control_code) as controls
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
GROUP BY c.metadata->>'responsible'
ORDER BY c.metadata->>'responsible';
```

### Ver controles por frequência

```sql
-- Ver controles por frequência
SELECT 
    c.metadata->>'frequency' as frequency,
    COUNT(*) as total_controls,
    STRING_AGG(c.control_code, ', ' ORDER BY c.control_code) as controls
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
GROUP BY c.metadata->>'frequency'
ORDER BY 
    CASE c.metadata->>'frequency'
        WHEN 'Contínuo' THEN 1
        WHEN 'Semanal' THEN 2
        WHEN 'Mensal' THEN 3
        WHEN 'Trimestral' THEN 4
        WHEN 'Semestral' THEN 5
        WHEN 'Anual' THEN 6
        WHEN '24 meses' THEN 7
        WHEN 'Sob demanda' THEN 8
        ELSE 9
    END;
```

### Ver evidências necessárias

```sql
-- Ver todas as evidências necessárias
SELECT 
    c.control_code,
    c.control_title,
    c.metadata->>'evidence' as evidence,
    c.metadata->>'responsible' as responsible
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
ORDER BY c.control_code;
```

## 🚨 Troubleshooting

### Erro: "Framework not found"
- **Causa**: O framework ONS RO-CB.BR.01 Rev. 02 não foi criado ainda
- **Solução**: O script cria automaticamente o framework se não existir (usando `ON CONFLICT DO UPDATE`)

### Erro: "ON CONFLICT DO UPDATE"
- **Causa**: Alguns controles já existem no banco
- **Solução**: Isso é **normal** - o script usa `ON CONFLICT DO UPDATE` para evitar duplicatas. Os controles existentes serão atualizados com as informações mais recentes.

### Controles não aparecem na interface
- **Causa**: Pode haver um problema com as views do Supabase
- **Solução**: Verifique se a view `public.controls` foi criada (veja `supabase-create-views.sql`)

### Erro de permissão
- **Causa**: Você não tem permissão para inserir dados
- **Solução**: Verifique se você está usando uma conta com permissões de administrador no Supabase

## 📊 Próximos Passos

Após cadastrar os controles da ONS RO-CB.BR.01 Rev. 02:

1. ✅ **Visualizar na Interface**: 
   - Acesse `/dashboard/compliance/frameworks` e verifique se o framework ONS RO-CB.BR.01 Rev. 02 aparece
   - Clique no framework para ver todos os 18 controles em `/dashboard/compliance/frameworks/[id]`

2. ✅ **Criar Avaliações**: 
   - Criar avaliações de conformidade para cada controle
   - Registrar resultados de conformidade
   - Documentar evidências necessárias

3. ✅ **Mapear Documentos**: 
   - Associar documentos existentes aos controles específicos
   - Criar evidências de conformidade
   - Gerenciar versões de documentos

4. ✅ **Monitorar Conformidade**: 
   - Acompanhar o status de conformidade de cada controle
   - Gerar relatórios para auditoria
   - Monitorar frequências de revisão

5. ✅ **Gestão de Exceções**: 
   - Registrar exceções aprovadas (ONS-17)
   - Documentar controles complementares para ativos externos (ONS-18)

## 📱 Visualização na Aplicação

Após cadastrar os controles, eles estarão disponíveis em:

- **`/dashboard/compliance/frameworks`** - Lista de frameworks (incluindo ONS RO-CB.BR.01 Rev. 02)
- **`/dashboard/compliance/frameworks/[id]`** - Detalhes do framework com todos os 18 controles organizados por domínio

## 📚 Notas Importantes

- ⚠️ **Ordem de execução**: Execute este script após criar as views do Supabase (`supabase-create-views.sql`)
- ✅ **Idempotente**: O script pode ser executado múltiplas vezes sem causar problemas
- 📝 **Controles completos**: Todos os 18 controles da ONS RO-CB.BR.01 Rev. 02 estão incluídos
- 🔍 **Metadados ricos**: Cada controle inclui metadados em JSONB com evidências, responsáveis e frequências
- 🎯 **Foco regulatório**: Controles específicos para o ARCiber (Ativo de Rede Crítica)

## 🎉 Conclusão

Após executar o script, você terá:

- ✅ Framework ONS RO-CB.BR.01 Rev. 02 cadastrado
- ✅ 18 controles principais mapeados
- ✅ Controles organizados por 8 domínios
- ✅ Metadados completos (evidências, responsáveis, frequências)
- ✅ Estrutura pronta para avaliações de conformidade
- ✅ Base para associar documentos e evidências aos controles
- ✅ Controles visíveis na interface da aplicação

---

**Data**: 2025-01-04  
**Sistema**: ness. OT GRC  
**Versão**: 1.0

