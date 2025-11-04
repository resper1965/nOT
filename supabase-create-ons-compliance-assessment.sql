-- ============================================================================
-- Criação de Avaliação de Conformidade para ONS RO-CB.BR.01 Rev. 02
-- Sistema: ness. OT GRC
-- Data: 2025-01-04
-- ============================================================================

-- Este script cria uma estrutura de avaliação de conformidade para o framework
-- ONS RO-CB.BR.01 Rev. 02, incluindo todos os 18 controles com resultados

-- ============================================================================
-- 1. Criar Avaliação de Conformidade
-- ============================================================================

DO $$
DECLARE
    v_ons_framework_id UUID;
    v_assessment_id UUID;
    v_control_id UUID;
    v_compliant_count INTEGER := 0;
    v_partially_compliant_count INTEGER := 0;
    v_non_compliant_count INTEGER := 0;
    v_not_applicable_count INTEGER := 0;
    v_total_controls INTEGER := 0;
    v_compliance_percentage DECIMAL(5,2);
BEGIN
    -- Get ONS RO-CB.BR.01 Rev. 02 framework ID
    SELECT id INTO v_ons_framework_id
    FROM compliance.frameworks
    WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02';

    IF v_ons_framework_id IS NULL THEN
        RAISE NOTICE 'Framework ONS RO-CB.BR.01 Rev. 02 não encontrado. Execute o script de inserção de controles primeiro.';
        RETURN;
    END IF;

    -- Criar avaliação de conformidade
    INSERT INTO compliance.assessments (
        framework_id,
        assessment_date,
        status,
        compliance_percentage,
        gaps_identified,
        notes,
        assessed_by,
        metadata
    )
    VALUES (
        v_ons_framework_id,
        CURRENT_TIMESTAMP,
        'not_applicable', -- Status inicial, será atualizado após inserir os resultados
        0.00, -- Será calculado após inserir os resultados
        0, -- Será calculado após inserir os resultados
        'Avaliação de conformidade inicial para ONS RO-CB.BR.01 Rev. 02. Status dos controles deve ser atualizado conforme avaliação.',
        'Sistema',
        jsonb_build_object(
            'assessment_type', 'Initial',
            'regulatory_framework', 'ONS RO-CB.BR.01 Rev. 02',
            'scope', 'ARCiber - Ativo de Rede Crítica',
            'created_by_system', true
        )
    )
    RETURNING id INTO v_assessment_id;

    RAISE NOTICE 'Avaliação de conformidade criada com ID: %', v_assessment_id;

    -- ========================================================================
    -- 2. Criar Resultados de Conformidade para cada Controle
    -- ========================================================================

    -- Inserir resultados iniciais para todos os controles (status: not_applicable)
    -- O status deve ser atualizado manualmente conforme a avaliação

    FOR v_control_id IN
        SELECT id FROM compliance.controls
        WHERE framework_id = v_ons_framework_id
        ORDER BY control_code
    LOOP
        INSERT INTO compliance.control_results (
            assessment_id,
            control_id,
            status,
            evidence,
            gap_description,
            remediation_plan,
            target_date,
            metadata
        )
        SELECT
            v_assessment_id,
            c.id,
            'not_applicable'::VARCHAR, -- Status inicial, deve ser atualizado
            c.metadata->>'evidence' as evidence, -- Evidência necessária do controle
            NULL, -- gap_description será preenchido se houver não conformidade
            NULL, -- remediation_plan será preenchido se houver não conformidade
            NULL, -- target_date será definido no plano de remediação
            jsonb_build_object(
                'responsible', c.metadata->>'responsible',
                'frequency', c.metadata->>'frequency',
                'evidence_required', c.metadata->>'evidence',
                'control_code', c.control_code,
                'control_title', c.control_title
            )
        FROM compliance.controls c
        WHERE c.id = v_control_id;

        v_total_controls := v_total_controls + 1;
    END LOOP;

    RAISE NOTICE 'Resultados de conformidade criados para % controles', v_total_controls;

    -- ========================================================================
    -- 3. Query para Atualizar Status de Conformidade
    -- ========================================================================

    RAISE NOTICE '';
    RAISE NOTICE '======================================================================';
    RAISE NOTICE 'Para atualizar o status de conformidade de um controle, execute:';
    RAISE NOTICE '======================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '-- Exemplo: Marcar controle ONS-01 como conforme';
    RAISE NOTICE 'UPDATE compliance.control_results cr';
    RAISE NOTICE 'SET status = ''compliant'',';
    RAISE NOTICE '    evidence = ''Diagrama de rede atualizado, ACLs configuradas, VLANs segmentadas''';
    RAISE NOTICE 'WHERE cr.assessment_id = ''%''', v_assessment_id;
    RAISE NOTICE '  AND cr.control_id = (';
    RAISE NOTICE '    SELECT id FROM compliance.controls';
    RAISE NOTICE '    WHERE framework_id = ''%''', v_ons_framework_id;
    RAISE NOTICE '      AND control_code = ''ONS-01''';
    RAISE NOTICE '  );';
    RAISE NOTICE '';
    RAISE NOTICE '-- Exemplo: Marcar controle ONS-02 como parcialmente conforme';
    RAISE NOTICE 'UPDATE compliance.control_results cr';
    RAISE NOTICE 'SET status = ''partially_compliant'',';
    RAISE NOTICE '    evidence = ''Políticas de firewall implementadas, logs VPN parciais''';
    RAISE NOTICE 'WHERE cr.assessment_id = ''%''', v_assessment_id;
    RAISE NOTICE '  AND cr.control_id = (';
    RAISE NOTICE '    SELECT id FROM compliance.controls';
    RAISE NOTICE '    WHERE framework_id = ''%''', v_ons_framework_id;
    RAISE NOTICE '      AND control_code = ''ONS-02''';
    RAISE NOTICE '  );';
    RAISE NOTICE '';
    RAISE NOTICE '-- Exemplo: Marcar controle ONS-03 como não conforme com plano de remediação';
    RAISE NOTICE 'UPDATE compliance.control_results cr';
    RAISE NOTICE 'SET status = ''non_compliant'',';
    RAISE NOTICE '    evidence = ''Relatórios de antivírus incompletos''';
    RAISE NOTICE '    gap_description = ''Falta inventário completo de assinaturas de antivírus''';
    RAISE NOTICE '    remediation_plan = ''Implementar sistema de inventário automatizado de assinaturas''';
    RAISE NOTICE '    target_date = CURRENT_DATE + INTERVAL ''30 days''';
    RAISE NOTICE 'WHERE cr.assessment_id = ''%''', v_assessment_id;
    RAISE NOTICE '  AND cr.control_id = (';
    RAISE NOTICE '    SELECT id FROM compliance.controls';
    RAISE NOTICE '    WHERE framework_id = ''%''', v_ons_framework_id;
    RAISE NOTICE '      AND control_code = ''ONS-03''';
    RAISE NOTICE '  );';
    RAISE NOTICE '';
    RAISE NOTICE '======================================================================';
    RAISE NOTICE 'Após atualizar os status, execute a função de cálculo de conformidade';
    RAISE NOTICE '======================================================================';
    RAISE NOTICE '';

END $$;

-- ============================================================================
-- 4. Função para Calcular Percentual de Conformidade
-- ============================================================================

CREATE OR REPLACE FUNCTION compliance.calculate_compliance_percentage(
    p_assessment_id UUID
)
RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_controls INTEGER;
    v_compliant_count INTEGER;
    v_partially_compliant_count INTEGER;
    v_compliance_percentage DECIMAL(5,2);
BEGIN
    -- Contar total de controles (excluindo not_applicable)
    SELECT COUNT(*) INTO v_total_controls
    FROM compliance.control_results
    WHERE assessment_id = p_assessment_id
      AND status != 'not_applicable';

    IF v_total_controls = 0 THEN
        RETURN 0.00;
    END IF;

    -- Contar controles conformes
    SELECT COUNT(*) INTO v_compliant_count
    FROM compliance.control_results
    WHERE assessment_id = p_assessment_id
      AND status = 'compliant';

    -- Contar controles parcialmente conformes (contam como 0.5)
    SELECT COUNT(*) INTO v_partially_compliant_count
    FROM compliance.control_results
    WHERE assessment_id = p_assessment_id
      AND status = 'partially_compliant';

    -- Calcular percentual: (conformes + parcialmente_conformes * 0.5) / total * 100
    v_compliance_percentage := (
        (v_compliant_count::DECIMAL + (v_partially_compliant_count::DECIMAL * 0.5)) / 
        v_total_controls::DECIMAL * 100
    );

    RETURN ROUND(v_compliance_percentage, 2);
END;
$$;

-- ============================================================================
-- 5. Função para Atualizar Status da Avaliação
-- ============================================================================

CREATE OR REPLACE FUNCTION compliance.update_assessment_status(
    p_assessment_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_compliance_percentage DECIMAL(5,2);
    v_gaps_identified INTEGER;
    v_status VARCHAR(20);
BEGIN
    -- Calcular percentual de conformidade
    SELECT compliance.calculate_compliance_percentage(p_assessment_id)
    INTO v_compliance_percentage;

    -- Contar gaps (não conformidades)
    SELECT COUNT(*) INTO v_gaps_identified
    FROM compliance.control_results
    WHERE assessment_id = p_assessment_id
      AND status = 'non_compliant';

    -- Determinar status geral
    IF v_compliance_percentage >= 95 THEN
        v_status := 'compliant';
    ELSIF v_compliance_percentage >= 70 THEN
        v_status := 'partially_compliant';
    ELSE
        v_status := 'non_compliant';
    END IF;

    -- Atualizar avaliação
    UPDATE compliance.assessments
    SET compliance_percentage = v_compliance_percentage,
        gaps_identified = v_gaps_identified,
        status = v_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_assessment_id;

    RAISE NOTICE 'Avaliação atualizada: Status = %, Conformidade = %, Gaps = %',
        v_status, v_compliance_percentage, v_gaps_identified;
END;
$$;

-- ============================================================================
-- 6. Query para Visualizar Status Atual
-- ============================================================================

-- Query para ver o status atual de todos os controles
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

-- ============================================================================
-- 7. Query para Resumo de Conformidade
-- ============================================================================

-- Query para ver resumo de conformidade
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

