# 📋 Instruções para Cadastrar Frameworks de Compliance

## 🎯 Frameworks a Cadastrar

Os seguintes frameworks de segurança cibernética relevantes para o setor elétrico serão cadastrados:

1. **NIST Cybersecurity Framework (CSF) 2.0**
2. **ISO/IEC 27001** - Sistema de Gestão de Segurança da Informação (SGSI)
3. **ISO/IEC 27002** - Controles de Segurança da Informação
4. **ISO/IEC 27019** - Segurança da Informação para Setor de Energia
5. **NIST SP 800-82** - Guia de Segurança para Sistemas de Controle Industrial (ICS)
6. **NIST SP 800-53** - Controles de Segurança e Privacidade

## 📝 Como Executar

### Opção 1: Executar Script SQL no Supabase Dashboard

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Navegue até o projeto: **ngrcot**
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo do arquivo `supabase-insert-frameworks.sql`
5. Clique em **Run** para executar

### Opção 2: Via Supabase CLI (se configurado)

```bash
cd /home/resper/TBE-OT
supabase db execute --file supabase-insert-frameworks.sql
```

## ✅ Verificação

Após executar o script, verifique se os frameworks foram inseridos corretamente:

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
  'NIST SP 800-53'
)
ORDER BY framework_name;
```

## 📊 Frameworks Cadastrados

### NIST Cybersecurity Framework (CSF) 2.0
- **Versão**: 2.0
- **Categoria**: Internacional
- **Órgão Regulador**: NIST
- **Setores Aplicáveis**: Energia, Infraestrutura Crítica, OT/ICS
- **5 Funções**: Identify, Protect, Detect, Respond, Recover

### ISO/IEC 27001
- **Versão**: 2022
- **Categoria**: Internacional
- **Órgão Regulador**: ISO/IEC
- **Setores Aplicáveis**: Energia, Infraestrutura Crítica, Todas as indústrias
- **Anexo A**: 93 controles
- **Relacionado**: ISO/IEC 27002, ISO/IEC 27019

### ISO/IEC 27002
- **Versão**: 2022
- **Categoria**: Internacional
- **Órgão Regulador**: ISO/IEC
- **Setores Aplicáveis**: Energia, Infraestrutura Crítica, Todas as indústrias
- **Controles**: 93 controles
- **Relacionado**: ISO/IEC 27001, ISO/IEC 27019

### ISO/IEC 27019
- **Versão**: 2017
- **Categoria**: Internacional
- **Órgão Regulador**: ISO/IEC
- **Setores Aplicáveis**: Energia, Elétrica, OT/ICS Energia
- **Específico para Energia**: Sim
- **Extensão de**: ISO/IEC 27001/27002
- **Relacionado**: ISO/IEC 27001, ISO/IEC 27002, IEC 62443

### NIST SP 800-82
- **Versão**: Rev. 2
- **Categoria**: Internacional
- **Órgão Regulador**: NIST
- **Setores Aplicáveis**: Energia, OT/ICS, SCADA, DCS, PLC
- **Foco ICS**: Sim
- **Padrões de Arquitetura**: Sim
- **Mapeia para**: NIST SP 800-53, NIST CSF

### NIST SP 800-53
- **Versão**: Rev. 5
- **Categoria**: Internacional
- **Órgão Regulador**: NIST
- **Setores Aplicáveis**: Energia, Infraestrutura Crítica, Governo Federal
- **Famílias de Controles**: 20
- **Controles**: 1000+
- **Relacionado**: NIST SP 800-82, NIST CSF

## 🔄 Atualização Automática

O script usa `ON CONFLICT DO UPDATE`, então se você executar novamente, os frameworks serão atualizados com as informações mais recentes, sem duplicar.

## 📱 Visualização na Aplicação

Após cadastrar os frameworks, eles estarão disponíveis em:
- `/dashboard/compliance/frameworks` - Lista de todos os frameworks
- Os frameworks serão exibidos automaticamente com seus dados do banco

