# 📋 Instruções: Cadastrar Standards/Frameworks no Supabase

Este documento fornece instruções passo a passo para executar os scripts SQL no Supabase e cadastrar os frameworks de compliance (standards) e seus controles.

## 🎯 O que será cadastrado

### 1. Frameworks (Standards) - `supabase-insert-frameworks.sql`
Os seguintes frameworks de segurança cibernética serão cadastrados:

1. **NIST Cybersecurity Framework (CSF) 2.0**
2. **ISO/IEC 27001** - Sistema de Gestão de Segurança da Informação (SGSI)
3. **ISO/IEC 27002** - Controles de Segurança da Informação
4. **ISO/IEC 27019** - Segurança da Informação para Setor de Energia
5. **NIST SP 800-82** - Guia de Segurança para Sistemas de Controle Industrial (ICS)
6. **NIST SP 800-53** - Controles de Segurança e Privacidade
7. **IEC 62443** - Segurança para Sistemas de Automação Industrial

### 2. Controles dos Frameworks - `supabase-map-frameworks-controls.sql`
Mapeamento de controles principais para cada framework (~61 controles no total):

- **NIST CSF**: ~17 controles (Govern, Identify, Protect, Detect, Respond, Recover)
- **ISO/IEC 27001**: ~21 controles do Anexo A
- **ISO/IEC 27019**: 4 controles específicos para energia/SCADA
- **NIST SP 800-82**: 5 controles para ICS
- **NIST SP 800-53**: 4 controles principais
- **IEC 62443**: 10 controles por zonas e níveis

## 📝 Passo a Passo: Executar no Supabase Dashboard

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **ngrcot**

### Passo 2: Executar Script 1 - Inserir Frameworks

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query** (ou use o atalho `Ctrl+Enter`)
3. Abra o arquivo `supabase-insert-frameworks.sql` no seu editor
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
7. Aguarde a execução (pode levar alguns segundos)
8. Verifique se apareceu a mensagem de sucesso

**Resultado esperado**: 6-7 frameworks inseridos na tabela `compliance.frameworks`

### Passo 3: Verificar Frameworks Inseridos

Execute esta query para verificar:

```sql
SELECT 
  framework_name,
  version,
  description,
  metadata->>'category' as category,
  metadata->>'regulatory_body' as regulatory_body
FROM compliance.frameworks
WHERE framework_name IN (
  'NIST Cybersecurity Framework',
  'ISO/IEC 27001',
  'ISO/IEC 27002',
  'ISO/IEC 27019',
  'NIST SP 800-82',
  'NIST SP 800-53',
  'IEC 62443'
)
ORDER BY framework_name;
```

Você deve ver 6-7 frameworks listados.

### Passo 4: Executar Script 2 - Mapear Controles

1. No SQL Editor, clique em **New Query** novamente (ou limpe a query anterior)
2. Abra o arquivo `supabase-map-frameworks-controls.sql`
3. Copie **TODO** o conteúdo do arquivo
4. Cole no SQL Editor do Supabase
5. Clique em **Run** ou pressione `Ctrl+Enter`
6. Aguarde a execução (pode levar mais tempo, ~30-60 segundos)
7. Verifique as mensagens de sucesso para cada framework

**Resultado esperado**: ~61 controles inseridos na tabela `compliance.controls`

### Passo 5: Verificar Controles Mapeados

Execute esta query para verificar:

```sql
-- Verificar quantidade de controles por framework
SELECT 
    f.framework_name,
    f.version,
    COUNT(c.id) as total_controls
FROM compliance.frameworks f
LEFT JOIN compliance.controls c ON c.framework_id = f.id
WHERE f.framework_name IN (
    'NIST Cybersecurity Framework',
    'ISO/IEC 27001',
    'ISO/IEC 27002',
    'ISO/IEC 27019',
    'NIST SP 800-82',
    'NIST SP 800-53',
    'IEC 62443'
)
GROUP BY f.id, f.framework_name, f.version
ORDER BY f.framework_name;
```

**Resultado esperado:**
- NIST Cybersecurity Framework: ~17 controles
- ISO/IEC 27001: ~21 controles
- ISO/IEC 27019: 4 controles
- NIST SP 800-82: 5 controles
- NIST SP 800-53: 4 controles
- IEC 62443: 10 controles

**Total esperado: ~61 controles**

## ✅ Verificação Completa

Execute esta query para ver uma visão geral completa:

```sql
-- Resumo completo dos frameworks e controles
SELECT 
    f.framework_name as "Framework",
    f.version as "Versão",
    COUNT(DISTINCT c.id) as "Total Controles",
    COUNT(DISTINCT CASE WHEN c.metadata->>'scada' = 'true' THEN c.id END) as "Controles SCADA",
    COUNT(DISTINCT CASE WHEN c.metadata->>'energy_specific' = 'true' THEN c.id END) as "Específicos Energia",
    COUNT(DISTINCT CASE WHEN c.metadata->>'ics_specific' = 'true' THEN c.id END) as "Específicos ICS"
FROM compliance.frameworks f
LEFT JOIN compliance.controls c ON c.framework_id = f.id
WHERE f.framework_name IN (
    'NIST Cybersecurity Framework',
    'ISO/IEC 27001',
    'ISO/IEC 27002',
    'ISO/IEC 27019',
    'NIST SP 800-82',
    'NIST SP 800-53',
    'IEC 62443'
)
GROUP BY f.id, f.framework_name, f.version
ORDER BY f.framework_name;
```

## 🔍 Consultar Controles Específicos

### Ver controles de um framework específico:

```sql
-- Exemplo: Ver controles do NIST CSF
SELECT 
    c.control_code as "Código",
    c.control_title as "Título",
    c.description as "Descrição",
    c.metadata->>'function' as "Função"
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'NIST Cybersecurity Framework'
ORDER BY c.control_code;
```

### Ver controles específicos para energia/OT:

```sql
-- Ver controles específicos para SCADA/OT/Energia
SELECT 
    f.framework_name as "Framework",
    c.control_code as "Código",
    c.control_title as "Título"
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE c.metadata->>'scada' = 'true' 
   OR c.metadata->>'energy_specific' = 'true'
   OR c.metadata->>'ics_specific' = 'true'
ORDER BY f.framework_name, c.control_code;
```

## 🚨 Troubleshooting

### Erro: "Framework not found"
- **Causa**: Os frameworks não foram inseridos ainda
- **Solução**: Execute `supabase-insert-frameworks.sql` primeiro (Passo 2)

### Erro: "ON CONFLICT DO NOTHING" ou "ON CONFLICT DO UPDATE"
- **Causa**: Alguns frameworks/controles já existem no banco
- **Solução**: Isso é **normal** - o script usa `ON CONFLICT` para evitar duplicatas. Os dados existentes serão atualizados ou mantidos.

### Controles não aparecem na interface
- **Causa**: Pode haver um problema com as views do Supabase
- **Solução**: Verifique se a view `public.controls` foi criada. Execute o script `supabase-create-views.sql` se necessário.

### Erro de permissão
- **Causa**: Você não tem permissão para inserir dados
- **Solução**: Verifique se você está usando uma conta com permissões de administrador no Supabase

## 📊 Próximos Passos

Após cadastrar os frameworks e controles:

1. ✅ **Verificar na interface**: Acesse `/dashboard/compliance/frameworks` e verifique se os frameworks aparecem
2. ✅ **Visualizar controles**: Clique em um framework para ver seus controles em `/dashboard/compliance/frameworks/[id]`
3. ✅ **Mapear documentos**: Associe documentos existentes aos controles específicos
4. ✅ **Criar avaliações**: Crie avaliações de conformidade para cada framework
5. ✅ **Expandir controles**: Adicione mais controles conforme necessário (os scripts são extensíveis)

## 📱 Visualização na Aplicação

Após cadastrar os frameworks e controles, eles estarão disponíveis em:

- **`/dashboard/compliance/frameworks`** - Lista de todos os frameworks
- **`/dashboard/compliance/frameworks/[id]`** - Detalhes de um framework com todos os seus controles
- Os frameworks serão exibidos automaticamente com seus dados do banco

## 📚 Notas Importantes

- ⚠️ **Ordem de execução**: Execute primeiro `supabase-insert-frameworks.sql`, depois `supabase-map-frameworks-controls.sql`
- ✅ **Idempotente**: Os scripts podem ser executados múltiplas vezes sem causar problemas
- 📝 **Controles são samples**: Os controles incluídos são os principais de cada framework. Você pode adicionar mais conforme necessário
- 🔍 **Metadados JSONB**: Cada controle inclui metadados em JSONB para categorização e filtragem avançada
- 🎯 **Foco OT/Energia**: Os frameworks e controles foram selecionados especificamente para o setor elétrico e OT

## 🎉 Conclusão

Após executar ambos os scripts, você terá:

- ✅ 6-7 frameworks de compliance cadastrados
- ✅ ~61 controles principais mapeados
- ✅ Estrutura pronta para avaliações de conformidade
- ✅ Base para associar documentos e evidências aos controles
- ✅ Metadados ricos para filtragem e busca avançada
- ✅ Frameworks e controles visíveis na interface da aplicação

---

**Data**: 2025-01-03  
**Sistema**: ness. OT GRC  
**Versão**: 1.0

