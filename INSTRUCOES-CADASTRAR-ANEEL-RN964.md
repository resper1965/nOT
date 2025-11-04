# 📋 Instruções: Cadastrar Controles da RN ANEEL 964/2021

Este documento fornece instruções para cadastrar os controles da Resolução Normativa ANEEL 964/2021 no banco de dados Supabase.

## 🎯 O que será cadastrado

### Framework ANEEL RN 964/2021
- **Nome**: ANEEL RN 964/2021
- **Versão**: 2021
- **Tipo**: Regulatório
- **Órgão Regulador**: ANEEL
- **Vigência**: Desde 1º de julho de 2022

### Controles Cadastrados (20 controles)

#### 1. Governança e Política (7 controles)
- **GOV-01**: Política Formal
- **GOV-02**: Modelo de Maturidade Anual
- **GOV-03**: Compatibilidade com Criticidade
- **GOV-04**: Aprovação e Patrocínio
- **GOV-05**: Responsável Designado
- **GOV-06**: Divulgação e Revisão
- **GOV-07**: Diretrizes Gerais

#### 2. Gestão de Riscos e Classificação (2 controles)
- **RSK-01**: Processo de Riscos
- **RSK-02**: Classificação da Informação

#### 3. Controles Técnicos e Operacionais (6 controles)
- **OPS-01**: Procedimentos e Controles
- **OPS-02**: Rastreabilidade
- **OPS-03**: Secure by Design
- **OPS-04**: Testes de Resiliência
- **OPS-05**: Continuidade Operacional
- **OPS-06**: Processo de Incidentes

#### 4. Terceiros e Cadeia (2 controles)
- **TPC-01**: Exigências a Terceiros
- **TPC-02**: Incidentes Envolvendo Terceiros

#### 5. Pessoas, Cultura e Capacitação (3 controles)
- **HUM-01**: Programas de Capacitação
- **HUM-02**: Conscientização
- **HUM-03**: Cultura Contínua

#### 6. Monitoramento, Notificação e Compartilhamento (3 controles)
- **MON-01**: Notificação de Incidentes (CRÍTICO)
- **MON-02**: Compartilhamento de Informações
- **MON-03**: Registros e Envio à ANEEL (Regulatório)

#### 7. Responsabilidade e Vigência (3 controles)
- **LEG-01**: Ônus e Responsabilidade
- **LEG-02**: Avaliação Regulatória
- **LEG-03**: Entrada em Vigor

## 📝 Passo a Passo: Executar no Supabase Dashboard

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **ngrcot**

### Passo 2: Executar Script SQL

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query** (ou use o atalho `Ctrl+Enter`)
3. Abra o arquivo `supabase-insert-aneel-rn964-controls.sql` no seu editor
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
7. Aguarde a execução (pode levar alguns segundos)
8. Verifique se apareceu a mensagem de sucesso

**Resultado esperado**: 20 controles inseridos na tabela `compliance.controls`

### Passo 3: Verificar Controles Inseridos

Execute esta query para verificar:

```sql
-- Verificar controles da RN ANEEL 964/2021
SELECT 
    c.control_code,
    c.control_title,
    c.metadata->>'category' as category,
    c.metadata->>'domain' as domain,
    c.description
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ANEEL RN 964/2021'
ORDER BY c.control_code;
```

Você deve ver 20 controles listados.

### Passo 4: Verificar por Categoria

Execute esta query para verificar por categoria:

```sql
-- Verificar controles por categoria
SELECT 
    c.metadata->>'category' as category,
    COUNT(*) as total_controls
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ANEEL RN 964/2021'
GROUP BY c.metadata->>'category'
ORDER BY c.metadata->>'category';
```

**Resultado esperado**:
- Governança: 7 controles
- Gestão de Riscos: 2 controles
- Controles Técnicos: 6 controles
- Terceiros: 2 controles
- Pessoas: 3 controles
- Monitoramento: 3 controles
- Legal: 3 controles

## ✅ Verificação Completa

Execute esta query para ver uma visão geral completa:

```sql
-- Resumo completo dos controles da RN ANEEL 964/2021
SELECT 
    f.framework_name as "Framework",
    f.version as "Versão",
    COUNT(c.id) as "Total Controles",
    COUNT(DISTINCT c.metadata->>'category') as "Categorias",
    COUNT(DISTINCT c.metadata->>'domain') as "Domínios"
FROM compliance.frameworks f
LEFT JOIN compliance.controls c ON c.framework_id = f.id
WHERE f.framework_name = 'ANEEL RN 964/2021'
GROUP BY f.id, f.framework_name, f.version;
```

## 🔍 Consultar Controles Específicos

### Ver controles críticos:

```sql
-- Ver controles críticos (MON-01)
SELECT 
    c.control_code,
    c.control_title,
    c.description
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ANEEL RN 964/2021'
  AND c.metadata->>'critical' = 'true';
```

### Ver controles de um domínio específico:

```sql
-- Exemplo: Ver controles de Governança
SELECT 
    c.control_code,
    c.control_title,
    c.description,
    c.requirement_text
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ANEEL RN 964/2021'
  AND c.metadata->>'domain' = 'Governança e Política'
ORDER BY c.control_code;
```

### Ver controles que requerem notificação regulatória:

```sql
-- Ver controles com requisito de envio à ANEEL
SELECT 
    c.control_code,
    c.control_title,
    c.metadata->>'regulatory_reporting' as regulatory_reporting
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ANEEL RN 964/2021'
  AND c.metadata->>'regulatory_reporting' = 'true';
```

## 🚨 Troubleshooting

### Erro: "Framework not found"
- **Causa**: O framework ANEEL RN 964/2021 não foi criado ainda
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

Após cadastrar os controles da RN ANEEL 964/2021:

1. ✅ **Visualizar na Interface**: 
   - Acesse `/dashboard/compliance/frameworks` e verifique se o framework ANEEL RN 964/2021 aparece
   - Clique no framework para ver todos os 20 controles em `/dashboard/compliance/frameworks/[id]`

2. ✅ **Criar Avaliações**: 
   - Criar avaliações de conformidade para cada controle
   - Registrar resultados de conformidade

3. ✅ **Mapear Documentos**: 
   - Associar documentos existentes aos controles específicos
   - Criar evidências de conformidade

4. ✅ **Monitorar Conformidade**: 
   - Acompanhar o status de conformidade de cada controle
   - Gerar relatórios para envio à ANEEL quando solicitado (MON-03)

## 📱 Visualização na Aplicação

Após cadastrar os controles, eles estarão disponíveis em:

- **`/dashboard/compliance/frameworks`** - Lista de frameworks (incluindo ANEEL RN 964/2021)
- **`/dashboard/compliance/frameworks/[id]`** - Detalhes do framework com todos os 20 controles organizados por domínio

## 📚 Notas Importantes

- ⚠️ **Ordem de execução**: Execute este script após criar as views do Supabase (`supabase-create-views.sql`)
- ✅ **Idempotente**: O script pode ser executado múltiplas vezes sem causar problemas
- 📝 **Controles completos**: Todos os 20 controles da RN ANEEL 964/2021 estão incluídos
- 🔍 **Metadados ricos**: Cada controle inclui metadados em JSONB para categorização e filtragem
- 🎯 **Foco regulatório**: Controles específicos para o setor elétrico brasileiro

## 🎉 Conclusão

Após executar o script, você terá:

- ✅ Framework ANEEL RN 964/2021 cadastrado
- ✅ 20 controles principais mapeados
- ✅ Controles organizados por 7 domínios
- ✅ Estrutura pronta para avaliações de conformidade
- ✅ Base para associar documentos e evidências aos controles
- ✅ Metadados ricos para filtragem e busca avançada
- ✅ Controles visíveis na interface da aplicação

---

**Data**: 2025-01-04  
**Sistema**: ness. OT GRC  
**Versão**: 1.0

