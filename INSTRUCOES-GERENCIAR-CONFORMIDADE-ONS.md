# 📋 Instruções: Gerenciar Conformidade dos Controles ONS RO-CB.BR.01 Rev. 02

Este documento fornece instruções para gerenciar a conformidade dos 18 controles da ONS RO-CB.BR.01 Rev. 02.

## 🎯 O que será criado

### Avaliação de Conformidade
- **Framework**: ONS RO-CB.BR.01 Rev. 02
- **Total de controles**: 18 controles
- **Status inicial**: Todos os controles marcados como `not_applicable`
- **Ação necessária**: Atualizar o status de cada controle conforme a avaliação

## 📝 Passo a Passo: Executar no Supabase Dashboard

### Passo 1: Criar Avaliação de Conformidade

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **ngrcot**
4. No menu lateral, clique em **SQL Editor**
5. Clique em **New Query** (ou use o atalho `Ctrl+Enter`)
6. Abra o arquivo `supabase-create-ons-compliance-assessment.sql`
7. Copie **TODO** o conteúdo do arquivo
8. Cole no SQL Editor do Supabase
9. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
10. Aguarde a execução (pode levar alguns segundos)
11. Verifique se apareceu a mensagem de sucesso

**Resultado esperado**: 
- 1 avaliação de conformidade criada
- 18 resultados de conformidade criados (um para cada controle)
- 2 funções criadas para calcular conformidade

### Passo 2: Atualizar Status de Conformidade dos Controles

Após criar a avaliação, você precisa atualizar o status de cada controle. Execute estas queries para atualizar:

#### Marcar Controle como Conforme (Compliant)

```sql
-- Exemplo: Marcar controle ONS-01 como conforme
UPDATE compliance.control_results cr
SET 
    status = 'compliant',
    evidence = 'Diagrama de rede atualizado, ACLs configuradas, VLANs segmentadas',
    updated_at = CURRENT_TIMESTAMP
WHERE cr.assessment_id = (
    SELECT id FROM compliance.assessments
    WHERE framework_id = (
        SELECT id FROM compliance.frameworks
        WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02'
    )
    ORDER BY assessment_date DESC
    LIMIT 1
)
AND cr.control_id = (
    SELECT id FROM compliance.controls
    WHERE framework_id = (
        SELECT id FROM compliance.frameworks
        WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02'
    )
    AND control_code = 'ONS-01'
);
```

#### Marcar Controle como Parcialmente Conforme (Partially Compliant)

```sql
-- Exemplo: Marcar controle ONS-02 como parcialmente conforme
UPDATE compliance.control_results cr
SET 
    status = 'partially_compliant',
    evidence = 'Políticas de firewall implementadas, logs VPN parciais',
    gap_description = 'Falta configuração completa de logs VPN',
    updated_at = CURRENT_TIMESTAMP
WHERE cr.assessment_id = (
    SELECT id FROM compliance.assessments
    WHERE framework_id = (
        SELECT id FROM compliance.frameworks
        WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02'
    )
    ORDER BY assessment_date DESC
    LIMIT 1
)
AND cr.control_id = (
    SELECT id FROM compliance.controls
    WHERE framework_id = (
        SELECT id FROM compliance.frameworks
        WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02'
    )
    AND control_code = 'ONS-02'
);
```

#### Marcar Controle como Não Conforme (Non-Compliant)

```sql
-- Exemplo: Marcar controle ONS-03 como não conforme com plano de remediação
UPDATE compliance.control_results cr
SET 
    status = 'non_compliant',
    evidence = 'Relatórios de antivírus incompletos',
    gap_description = 'Falta inventário completo de assinaturas de antivírus',
    remediation_plan = 'Implementar sistema de inventário automatizado de assinaturas de antivírus',
    target_date = CURRENT_DATE + INTERVAL '30 days',
    updated_at = CURRENT_TIMESTAMP
WHERE cr.assessment_id = (
    SELECT id FROM compliance.assessments
    WHERE framework_id = (
        SELECT id FROM compliance.frameworks
        WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02'
    )
    ORDER BY assessment_date DESC
    LIMIT 1
)
AND cr.control_id = (
    SELECT id FROM compliance.controls
    WHERE framework_id = (
        SELECT id FROM compliance.frameworks
        WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02'
    )
    AND control_code = 'ONS-03'
);
```

### Passo 3: Atualizar Percentual de Conformidade

Após atualizar os status dos controles, execute esta query para calcular e atualizar o percentual de conformidade:

```sql
-- Atualizar percentual de conformidade da avaliação
SELECT compliance.update_assessment_status(
    (SELECT id FROM compliance.assessments
     WHERE framework_id = (
         SELECT id FROM compliance.frameworks
         WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02'
     )
     ORDER BY assessment_date DESC
     LIMIT 1)
);
```

### Passo 4: Visualizar Status Atual

Execute esta query para ver o status atual de todos os controles:

```sql
-- Ver status atual de todos os controles
SELECT 
    c.control_code,
    c.control_title,
    cr.status as compliance_status,
    cr.evidence,
    cr.gap_description,
    cr.remediation_plan,
    cr.target_date,
    cr.metadata->>'responsible' as responsible,
    cr.metadata->>'frequency' as frequency
FROM compliance.control_results cr
JOIN compliance.controls c ON cr.control_id = c.id
JOIN compliance.assessments a ON cr.assessment_id = a.id
JOIN compliance.frameworks f ON a.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
  AND a.assessment_date = (
      SELECT MAX(assessment_date)
      FROM compliance.assessments
      WHERE framework_id = f.id
  )
ORDER BY c.control_code;
```

### Passo 5: Ver Resumo de Conformidade

Execute esta query para ver o resumo de conformidade:

```sql
-- Ver resumo de conformidade
SELECT 
    cr.status as compliance_status,
    COUNT(*) as total_controls,
    STRING_AGG(c.control_code, ', ' ORDER BY c.control_code) as controls
FROM compliance.control_results cr
JOIN compliance.controls c ON cr.control_id = c.id
JOIN compliance.assessments a ON cr.assessment_id = a.id
JOIN compliance.frameworks f ON a.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
  AND a.assessment_date = (
      SELECT MAX(assessment_date)
      FROM compliance.assessments
      WHERE framework_id = f.id
  )
GROUP BY cr.status
ORDER BY 
    CASE cr.status
        WHEN 'compliant' THEN 1
        WHEN 'partially_compliant' THEN 2
        WHEN 'non_compliant' THEN 3
        WHEN 'not_applicable' THEN 4
    END;
```

### Passo 6: Ver Percentual de Conformidade

Execute esta query para ver o percentual de conformidade geral:

```sql
-- Ver percentual de conformidade
SELECT 
    f.framework_name,
    a.assessment_date,
    a.status as overall_status,
    a.compliance_percentage,
    a.gaps_identified,
    a.notes
FROM compliance.assessments a
JOIN compliance.frameworks f ON a.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
ORDER BY a.assessment_date DESC
LIMIT 1;
```

## 📊 Status de Conformidade

### Tipos de Status

- **`compliant`**: Controle totalmente conforme
- **`partially_compliant`**: Controle parcialmente conforme (conta como 50% no cálculo)
- **`non_compliant`**: Controle não conforme (requer plano de remediação)
- **`not_applicable`**: Controle não aplicável (não conta no cálculo)

### Cálculo de Percentual

O percentual de conformidade é calculado como:
- **Conformes**: 100% do peso
- **Parcialmente conformes**: 50% do peso
- **Não conformes**: 0% do peso
- **Não aplicáveis**: Não contam no cálculo

**Fórmula**: `(Conformes + Parcialmente_Conformes * 0.5) / Total_Aplicáveis * 100`

### Status Geral da Avaliação

- **`compliant`**: Percentual >= 95%
- **`partially_compliant`**: Percentual >= 70%
- **`non_compliant`**: Percentual < 70%

## 🔍 Queries Úteis

### Ver Controles Não Conformes

```sql
-- Ver controles não conformes com planos de remediação
SELECT 
    c.control_code,
    c.control_title,
    cr.gap_description,
    cr.remediation_plan,
    cr.target_date,
    cr.metadata->>'responsible' as responsible
FROM compliance.control_results cr
JOIN compliance.controls c ON cr.control_id = c.id
JOIN compliance.assessments a ON cr.assessment_id = a.id
JOIN compliance.frameworks f ON a.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
  AND cr.status = 'non_compliant'
  AND a.assessment_date = (
      SELECT MAX(assessment_date)
      FROM compliance.assessments
      WHERE framework_id = f.id
  )
ORDER BY cr.target_date NULLS LAST, c.control_code;
```

### Ver Controles por Responsável

```sql
-- Ver controles agrupados por responsável
SELECT 
    cr.metadata->>'responsible' as responsible,
    COUNT(*) as total_controls,
    COUNT(CASE WHEN cr.status = 'compliant' THEN 1 END) as compliant,
    COUNT(CASE WHEN cr.status = 'partially_compliant' THEN 1 END) as partially_compliant,
    COUNT(CASE WHEN cr.status = 'non_compliant' THEN 1 END) as non_compliant,
    COUNT(CASE WHEN cr.status = 'not_applicable' THEN 1 END) as not_applicable
FROM compliance.control_results cr
JOIN compliance.assessments a ON cr.assessment_id = a.id
JOIN compliance.frameworks f ON a.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
  AND a.assessment_date = (
      SELECT MAX(assessment_date)
      FROM compliance.assessments
      WHERE framework_id = f.id
  )
GROUP BY cr.metadata->>'responsible'
ORDER BY cr.metadata->>'responsible';
```

### Ver Controles Vencidos (Target Date)

```sql
-- Ver controles com planos de remediação vencidos
SELECT 
    c.control_code,
    c.control_title,
    cr.remediation_plan,
    cr.target_date,
    CURRENT_DATE - cr.target_date as days_overdue,
    cr.metadata->>'responsible' as responsible
FROM compliance.control_results cr
JOIN compliance.controls c ON cr.control_id = c.id
JOIN compliance.assessments a ON cr.assessment_id = a.id
JOIN compliance.frameworks f ON a.framework_id = f.id
WHERE f.framework_name = 'ONS RO-CB.BR.01 Rev. 02'
  AND cr.status = 'non_compliant'
  AND cr.target_date IS NOT NULL
  AND cr.target_date < CURRENT_DATE
  AND a.assessment_date = (
      SELECT MAX(assessment_date)
      FROM compliance.assessments
      WHERE framework_id = f.id
  )
ORDER BY cr.target_date;
```

## ✅ Checklist de Conformidade

- [x] Avaliação de conformidade criada
- [x] 18 resultados de conformidade criados
- [x] Funções de cálculo de conformidade criadas
- [ ] Status de cada controle atualizado
- [ ] Evidências documentadas
- [ ] Gaps identificados para controles não conformes
- [ ] Planos de remediação criados
- [ ] Percentual de conformidade calculado
- [ ] Status geral da avaliação atualizado

## 📚 Próximos Passos

1. **Atualizar Status**: Atualizar o status de cada um dos 18 controles conforme a avaliação
2. **Documentar Evidências**: Incluir evidências de conformidade para cada controle
3. **Criar Planos de Remediação**: Para controles não conformes, criar planos de remediação com datas
4. **Calcular Conformidade**: Executar função para calcular percentual de conformidade
5. **Monitorar**: Acompanhar planos de remediação e atualizar status conforme progresso

## 🎉 Conclusão

Após executar o script e atualizar os status dos controles, você terá:

- ✅ Avaliação de conformidade completa para ONS RO-CB.BR.01 Rev. 02
- ✅ Status de cada um dos 18 controles
- ✅ Evidências documentadas
- ✅ Planos de remediação para não conformidades
- ✅ Percentual de conformidade calculado automaticamente
- ✅ Status geral da avaliação

---

**Data**: 2025-01-04  
**Sistema**: ness. OT GRC  
**Versão**: 1.0

