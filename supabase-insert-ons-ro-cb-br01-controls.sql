-- ============================================================================
-- Inserção de Controles da ONS RO-CB.BR.01 Rev. 02
-- Sistema: ness. OT GRC
-- Data: 2025-01-04
-- ============================================================================

-- Este script insere os controles da Resolução Operativa ONS RO-CB.BR.01 Rev. 02
-- que estabelece requisitos de segurança cibernética para o setor elétrico brasileiro

-- ============================================================================
-- 1. Verificar/Criar Framework ONS RO-CB.BR.01 Rev. 02
-- ============================================================================

INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'ONS RO-CB.BR.01 Rev. 02',
  'Rev. 02',
  'Resolução Operativa ONS RO-CB.BR.01 Rev. 02 - Requisitos de Segurança Cibernética para o Setor Elétrico Brasileiro. Estabelece requisitos para o ARCiber (Ativo de Rede Crítica) incluindo segmentação de rede, gestão de acessos, monitoramento, resposta a incidentes e gestão de exceções.',
  jsonb_build_object(
    'category', 'Regulatório',
    'regulatory_body', 'ONS',
    'applicable_sectors', ARRAY['Energia', 'Setor Elétrico', 'ARCiber'],
    'url', 'https://www.ons.org.br',
    'document_type', 'Resolução Operativa',
    'revision', 'Rev. 02',
    'document_code', 'RO-CB.BR.01'
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- 2. Limpar Duplicados e Criar Constraint UNIQUE
-- ============================================================================

-- Primeiro, remover registros duplicados mantendo apenas o mais recente
DO $$
DECLARE
    v_duplicates_count INTEGER;
BEGIN
    -- Contar duplicados
    SELECT COUNT(*) INTO v_duplicates_count
    FROM (
        SELECT framework_id, control_code, COUNT(*) as cnt
        FROM compliance.controls
        GROUP BY framework_id, control_code
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF v_duplicates_count > 0 THEN
        RAISE NOTICE 'Encontrados % grupos de duplicados. Removendo duplicados...', v_duplicates_count;
        
        -- Remover duplicados mantendo apenas o registro mais recente
        DELETE FROM compliance.controls
        WHERE id IN (
            SELECT id
            FROM (
                SELECT 
                    id,
                    ROW_NUMBER() OVER (
                        PARTITION BY framework_id, control_code 
                        ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
                    ) as rn
                FROM compliance.controls
            ) ranked
            WHERE rn > 1
        );
        
        RAISE NOTICE 'Duplicados removidos com sucesso!';
    ELSE
        RAISE NOTICE 'Nenhum duplicado encontrado.';
    END IF;
END $$;

-- Criar constraint UNIQUE para (framework_id, control_code) se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'controls_framework_control_code_unique'
        AND conrelid = 'compliance.controls'::regclass
    ) THEN
        ALTER TABLE compliance.controls
        ADD CONSTRAINT controls_framework_control_code_unique
        UNIQUE (framework_id, control_code);
        
        RAISE NOTICE 'Constraint UNIQUE criada em (framework_id, control_code)';
    ELSE
        RAISE NOTICE 'Constraint UNIQUE já existe em (framework_id, control_code)';
    END IF;
END $$;

-- ============================================================================
-- 3. Inserir Controles da ONS RO-CB.BR.01 Rev. 02
-- ============================================================================

DO $$
DECLARE
    v_ons_ro_cb_br01_id UUID;
BEGIN
    -- Get ONS RO-CB.BR.01 Rev. 02 framework ID
    SELECT id INTO v_ons_ro_cb_br01_id
    FROM compliance.frameworks
    WHERE framework_name = 'ONS RO-CB.BR.01 Rev. 02';

    IF v_ons_ro_cb_br01_id IS NULL THEN
        RAISE NOTICE 'ONS RO-CB.BR.01 Rev. 02 framework not found. Please run framework insertion first.';
        RETURN;
    END IF;

    -- ========================================================================
    -- REDES E SEGMENTAÇÃO (ONS-01 a ONS-02)
    -- ========================================================================

    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_ons_ro_cb_br01_id, 'ONS-01', 'Segmentação de Rede',
     'Segmentação de rede entre Zona de Supervisão, DMZ Operativa e Zona Corporativa.',
     'Implementar segmentação de rede entre Zona de Supervisão, DMZ Operativa e Zona Corporativa para isolamento de tráfego e proteção de sistemas críticos.',
     'Foundational',
     jsonb_build_object(
         'category', 'Rede',
         'domain', 'Redes e Segmentação',
         'evidence', 'Diagrama de rede, ACLs, configuração de VLANs',
         'responsible', 'Infraestrutura / Segurança',
         'frequency', 'Revisão anual',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-02', 'Proibição de Acesso Direto à Internet',
     'Proibição de acesso direto à Internet; conexões externas apenas via VPN segura.',
     'Proibir acesso direto à Internet de sistemas críticos. Todas as conexões externas devem ser realizadas exclusivamente através de VPN segura com autenticação forte.',
     'Foundational',
     jsonb_build_object(
         'category', 'Rede',
         'domain', 'Redes e Segmentação',
         'evidence', 'Políticas de firewall, logs VPN',
         'responsible', 'Infraestrutura',
         'frequency', 'Contínuo',
         'url', 'https://www.ons.org.br'
     )),

    -- ========================================================================
    -- GESTÃO E POLÍTICAS (ONS-03 a ONS-05)
    -- ========================================================================

    (v_ons_ro_cb_br01_id, 'ONS-03', 'Antimalware Atualizado',
     'Antimalware atualizado ou whitelisting equivalente.',
     'Manter antimalware atualizado em todos os sistemas ou implementar whitelisting equivalente para proteção contra malware.',
     'Foundational',
     jsonb_build_object(
         'category', 'Segurança',
         'domain', 'Gestão e Políticas',
         'evidence', 'Relatórios de antivírus e inventário de assinaturas',
         'responsible', 'TI Operacional',
         'frequency', 'Semanal',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-04', 'Designação de Gestor e Suplente do ARCiber',
     'Designação de Gestor e Suplente do ARCiber.',
     'Designar formalmente Gestor e Suplente do ARCiber (Ativo de Rede Crítica) com responsabilidades claramente definidas.',
     'Foundational',
     jsonb_build_object(
         'category', 'Governança',
         'domain', 'Gestão e Políticas',
         'evidence', 'Portaria ou comunicado formal',
         'responsible', 'Direção Técnica',
         'frequency', 'Revisão anual',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-05', 'Política de Segurança do ARCiber',
     'Política de Segurança do ARCiber com papéis e responsabilidades.',
     'Estabelecer e manter política formal de segurança do ARCiber que defina claramente papéis, responsabilidades e requisitos de segurança.',
     'Foundational',
     jsonb_build_object(
         'category', 'Governança',
         'domain', 'Gestão e Políticas',
         'evidence', 'Política assinada e divulgada',
         'responsible', 'Segurança da Informação',
         'frequency', 'Revisão anual',
         'url', 'https://www.ons.org.br'
     )),

    -- ========================================================================
    -- INVENTÁRIO E ATIVOS (ONS-06)
    -- ========================================================================

    (v_ons_ro_cb_br01_id, 'ONS-06', 'Inventário de Ativos',
     'Inventário de ativos (HW/SW) completo e revisto a cada 24 meses.',
     'Manter inventário completo e atualizado de todos os ativos de hardware e software do ARCiber, revisando e atualizando a cada 24 meses.',
     'Foundational',
     jsonb_build_object(
         'category', 'Gestão de Ativos',
         'domain', 'Inventário e Ativos',
         'evidence', 'Relatório de inventário e controle de mudanças',
         'responsible', 'TI Operacional',
         'frequency', '24 meses',
         'url', 'https://www.ons.org.br'
     )),

    -- ========================================================================
    -- HARDENING E PATCHES (ONS-07 a ONS-08)
    -- ========================================================================

    (v_ons_ro_cb_br01_id, 'ONS-07', 'Hardening de Sistemas',
     'Hardening de SO, firmware e bancos; verificação de conformidade.',
     'Aplicar hardening em sistemas operacionais, firmware e bancos de dados, e realizar verificação periódica de conformidade.',
     'Foundational',
     jsonb_build_object(
         'category', 'Segurança',
         'domain', 'Hardening e Patches',
         'evidence', 'Checklist de hardening e resultados de scan',
         'responsible', 'Segurança / Infra',
         'frequency', 'Trimestral',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-08', 'Política de Atualização e Correção de Vulnerabilidades',
     'Política de atualização e correção de vulnerabilidades (patches).',
     'Estabelecer e manter política formal de atualização e correção de vulnerabilidades (patches) com processos definidos para aplicação e verificação.',
     'Foundational',
     jsonb_build_object(
         'category', 'Segurança',
         'domain', 'Hardening e Patches',
         'evidence', 'Plano de patching + logs de aplicação',
         'responsible', 'Segurança da Informação',
         'frequency', 'Mensal',
         'url', 'https://www.ons.org.br'
     )),

    -- ========================================================================
    -- GESTÃO DE ACESSOS (ONS-09 a ONS-13)
    -- ========================================================================

    (v_ons_ro_cb_br01_id, 'ONS-09', 'Gestão de Acessos Individuais',
     'Gestão de acessos individuais e registro de aprovações.',
     'Implementar processo formal de gestão de acessos individuais com registro de todas as aprovações e revisões periódicas.',
     'Foundational',
     jsonb_build_object(
         'category', 'Acesso',
         'domain', 'Gestão de Acessos',
         'evidence', 'Solicitações e auditoria de acessos',
         'responsible', 'RH / TI',
         'frequency', 'Contínuo',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-10', 'Política de Senhas',
     'Política de senhas (complexidade, expiração, bloqueio).',
     'Estabelecer e aplicar política de senhas que inclua requisitos de complexidade, expiração e bloqueio após tentativas falhas.',
     'Foundational',
     jsonb_build_object(
         'category', 'Acesso',
         'domain', 'Gestão de Acessos',
         'evidence', 'Política + validação em sistemas',
         'responsible', 'Segurança da Informação',
         'frequency', 'Revisão anual',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-11', 'Desativação de Credenciais',
     'Desativação de credenciais de ex-colaboradores e contas inativas.',
     'Implementar processo para desativação imediata de credenciais de ex-colaboradores e identificação/desativação periódica de contas inativas.',
     'Foundational',
     jsonb_build_object(
         'category', 'Acesso',
         'domain', 'Gestão de Acessos',
         'evidence', 'Relatórios de offboarding e auditorias',
         'responsible', 'RH / TI',
         'frequency', 'Mensal',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-12', 'Contas Privilegiadas',
     'Contas privilegiadas com aprovação, MFA e trilha de auditoria.',
     'Gerenciar contas privilegiadas com processo de aprovação formal, autenticação multifator (MFA) obrigatória e trilha completa de auditoria.',
     'Foundational',
     jsonb_build_object(
         'category', 'Acesso',
         'domain', 'Gestão de Acessos',
         'evidence', 'Logs de acesso administrativo',
         'responsible', 'Segurança da Informação',
         'frequency', 'Contínuo',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-13', 'Senhas Locais Únicas',
     'Senhas locais únicas por ativo (não reutilizadas).',
     'Garantir que cada ativo tenha senha local única que não seja reutilizada em outros ativos.',
     'Foundational',
     jsonb_build_object(
         'category', 'Acesso',
         'domain', 'Gestão de Acessos',
         'evidence', 'Checklist de configuração por ativo',
         'responsible', 'TI Operacional',
         'frequency', 'Anual',
         'url', 'https://www.ons.org.br'
     )),

    -- ========================================================================
    -- MONITORAMENTO E LOGS (ONS-14 a ONS-15)
    -- ========================================================================

    (v_ons_ro_cb_br01_id, 'ONS-14', 'Geração e Retenção de Logs',
     'Geração e retenção de logs para investigação e forense.',
     'Implementar geração e retenção de logs em todos os sistemas críticos com período de retenção adequado para investigação e análise forense.',
     'Foundational',
     jsonb_build_object(
         'category', 'Monitoramento',
         'domain', 'Monitoramento e Logs',
         'evidence', 'Configuração de SIEM e retention policy',
         'responsible', 'SOC / Segurança',
         'frequency', 'Contínuo',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-15', 'Tratamento de Alertas',
     'Firewalls, IDS/IPS e antimalware com alertas tratados no prazo previsto.',
     'Configurar firewalls, IDS/IPS e antimalware para gerar alertas e garantir que todos os alertas sejam tratados dentro do prazo estabelecido.',
     'Foundational',
     jsonb_build_object(
         'category', 'Monitoramento',
         'domain', 'Monitoramento e Logs',
         'evidence', 'Registros de alertas e tempo de resposta',
         'responsible', 'SOC / Infra',
         'frequency', 'Contínuo',
         'url', 'https://www.ons.org.br'
     )),

    -- ========================================================================
    -- RESPOSTA A INCIDENTES (ONS-16)
    -- ========================================================================

    (v_ons_ro_cb_br01_id, 'ONS-16', 'Plano de Resposta a Incidentes',
     'Plano de Resposta a Incidentes com exercícios periódicos.',
     'Estabelecer e manter plano formal de resposta a incidentes cibernéticos e realizar exercícios periódicos para validação e melhoria contínua.',
     'Foundational',
     jsonb_build_object(
         'category', 'Resposta a Incidentes',
         'domain', 'Resposta a Incidentes',
         'evidence', 'Relatórios de exercício e planos de melhoria',
         'responsible', 'Segurança da Informação',
         'frequency', 'Semestral',
         'url', 'https://www.ons.org.br'
     )),

    -- ========================================================================
    -- GESTÃO DE EXCEÇÕES (ONS-17 a ONS-18)
    -- ========================================================================

    (v_ons_ro_cb_br01_id, 'ONS-17', 'Registro Formal de Exceções',
     'Registro formal de exceções aprovado pelo Gestor do ARCiber.',
     'Estabelecer processo formal para registro e aprovação de exceções aos requisitos de segurança pelo Gestor do ARCiber.',
     'Foundational',
     jsonb_build_object(
         'category', 'Governança',
         'domain', 'Gestão de Exceções',
         'evidence', 'Formulário de exceções e aprovação',
         'responsible', 'CISO / Gestor ARCiber',
         'frequency', 'Sob demanda',
         'url', 'https://www.ons.org.br'
     )),

    (v_ons_ro_cb_br01_id, 'ONS-18', 'Controles Complementares para Ativos Externos',
     'Controles complementares para ativos fora do ARCiber.',
     'Estabelecer controles complementares de segurança para ativos que não estão dentro do ARCiber, incluindo planos de risco e auditorias periódicas.',
     'Foundational',
     jsonb_build_object(
         'category', 'Gestão de Ativos',
         'domain', 'Gestão de Exceções',
         'evidence', 'Planos de risco e auditoria de ativos externos',
         'responsible', 'Segurança / Infra',
         'frequency', 'Anual',
         'url', 'https://www.ons.org.br'
     ))

    ON CONFLICT (framework_id, control_code) DO UPDATE
    SET control_title = EXCLUDED.control_title,
        description = EXCLUDED.description,
        requirement_text = EXCLUDED.requirement_text,
        level = EXCLUDED.level,
        metadata = EXCLUDED.metadata,
        updated_at = CURRENT_TIMESTAMP;

    RAISE NOTICE 'Controles da ONS RO-CB.BR.01 Rev. 02 inseridos com sucesso!';
END $$;

-- ============================================================================
-- Verificação Final
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Verificando controles inseridos...';
END $$;

-- Query para verificar controles inseridos
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

