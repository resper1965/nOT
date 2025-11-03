# 📋 Instruções: Mapear Controles dos Frameworks

Este documento descreve como executar o script SQL para mapear os controles principais de cada framework de segurança no banco de dados.

## 📦 Pré-requisitos

1. **Frameworks já cadastrados**: Certifique-se de que os frameworks foram inseridos no banco de dados executando `supabase-insert-frameworks.sql` primeiro.

2. **Acesso ao Supabase**: Você precisa ter acesso ao SQL Editor do Supabase.

## 🎯 Frameworks que serão mapeados

O script mapeia controles para os seguintes frameworks:

1. **NIST Cybersecurity Framework (CSF) 2.0** - ~17 controles principais
   - Govern (GV)
   - Identify (ID)
   - Protect (PR)
   - Detect (DE)
   - Respond (RS)
   - Recover (RC)

2. **ISO/IEC 27001** - ~21 controles do Anexo A (principais)
   - A.5 - Políticas de Segurança
   - A.6 - Organização da Segurança
   - A.7 - Recursos Humanos
   - A.8 - Gestão de Ativos
   - A.9 - Controles de Acesso
   - A.10 - Criptografia
   - A.12 - Segurança Operacional
   - A.14 - Segurança de Sistemas
   - A.17 - Continuidade
   - A.18 - Conformidade

3. **ISO/IEC 27019** - 4 controles específicos para energia
   - Controles para SCADA e sistemas de controle de processo
   - Backup e recuperação para sistemas OT

4. **NIST SP 800-82** - 5 controles para ICS
   - Arquitetura de segurança ICS
   - Segmentação de rede
   - Controles de acesso para ICS
   - Gerenciamento de patches
   - Monitoramento e detecção

5. **NIST SP 800-53** - 4 controles principais (exemplo)
   - AC-2: Account Management
   - AC-3: Access Enforcement
   - SI-2: Flaw Remediation
   - SI-4: Information System Monitoring

6. **IEC 62443** - 10 controles por zonas e níveis
   - FR-1: Foundation Requirements
   - SR-1.x: Level 1 controls
   - SR-2.x: Level 2 controls
   - SR-3.x: Level 3 controls
   - Controles específicos para segmentação de rede

## 📝 Como Executar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo do arquivo `supabase-map-frameworks-controls.sql`
5. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
6. Verifique as mensagens de sucesso para cada framework

### Opção 2: Via Supabase CLI

```bash
# Se você tem o Supabase CLI configurado
supabase db execute --file supabase-map-frameworks-controls.sql
```

### Opção 3: Via psql

```bash
# Conecte ao banco e execute o script
psql -h <your-supabase-host> -U postgres -d postgres -f supabase-map-frameworks-controls.sql
```

## ✅ Verificação

Após executar o script, verifique se os controles foram inseridos:

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
    'ISO/IEC 27019',
    'NIST SP 800-82',
    'NIST SP 800-53',
    'IEC 62443'
)
GROUP BY f.id, f.framework_name, f.version
ORDER BY f.framework_name;
```

**Resultado esperado:**
- NIST CSF: ~17 controles
- ISO/IEC 27001: ~21 controles
- ISO/IEC 27019: 4 controles
- NIST SP 800-82: 5 controles
- NIST SP 800-53: 4 controles
- IEC 62443: 10 controles

**Total esperado: ~61 controles**

## 🔍 Consultar Controles Específicos

### Ver controles de um framework específico:

```sql
-- Ver controles do NIST CSF
SELECT 
    c.control_code,
    c.control_title,
    c.description,
    c.metadata->>'function' as function
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'NIST Cybersecurity Framework'
ORDER BY c.control_code;
```

### Ver controles por categoria:

```sql
-- Ver controles do ISO 27001 por domínio
SELECT 
    c.control_code,
    c.control_title,
    c.metadata->>'domain_name' as domain
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ISO/IEC 27001'
ORDER BY c.control_code;
```

### Ver controles específicos para energia/OT:

```sql
-- Ver controles específicos para SCADA/OT
SELECT 
    f.framework_name,
    c.control_code,
    c.control_title
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE c.metadata->>'scada' = 'true' 
   OR c.metadata->>'energy_specific' = 'true'
   OR c.metadata->>'ics_specific' = 'true'
ORDER BY f.framework_name, c.control_code;
```

## 🚨 Troubleshooting

### Erro: "Framework not found"
- **Causa**: Os frameworks não foram inseridos no banco ainda
- **Solução**: Execute `supabase-insert-frameworks.sql` primeiro

### Erro: "ON CONFLICT DO NOTHING"
- **Causa**: Alguns controles já existem no banco
- **Solução**: Isso é normal - o script usa `ON CONFLICT DO NOTHING` para evitar duplicatas. Os controles existentes não serão modificados.

### Controles não aparecem na interface
- **Causa**: Pode haver um problema com as views do Supabase
- **Solução**: Verifique se a view `public.controls` foi criada (veja `supabase-create-views.sql`)

## 📊 Próximos Passos

Após mapear os controles:

1. **Verificar na interface**: Acesse `/dashboard/compliance/frameworks` e verifique se os frameworks aparecem com seus controles
2. **Mapear documentos**: Associe documentos existentes aos controles específicos
3. **Criar avaliações**: Crie avaliações de conformidade para cada framework
4. **Expandir controles**: Adicione mais controles conforme necessário (o script é extensível)

## 📚 Notas Importantes

- O script é **idempotente**: pode ser executado múltiplas vezes sem causar problemas
- Os controles são **samples/principais**: você pode adicionar mais controles conforme necessário
- Os metadados em JSONB permitem filtragem e busca avançada por categoria, função, domínio, etc.
- Cada controle inclui:
  - `control_code`: Código único do controle (ex: "GV.OC-1", "A.5.1.1")
  - `control_title`: Título do controle
  - `description`: Descrição do que o controle faz
  - `requirement_text`: Texto do requisito a ser implementado
  - `level`: Nível do controle (Foundational, Level 1-4, etc.)
  - `metadata`: Metadados em JSONB para categorização e filtragem

## 🎉 Conclusão

Após executar este script, você terá:
- ✅ Controles principais mapeados para todos os frameworks relevantes
- ✅ Estrutura pronta para avaliações de conformidade
- ✅ Base para associar documentos e evidências aos controles
- ✅ Metadados ricos para filtragem e busca avançada
