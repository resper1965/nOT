-- ============================================================================
-- Inserção de Controles da RN ANEEL 964/2021
-- Sistema: ness. OT GRC
-- Data: 2025-01-04
-- ============================================================================

-- Este script insere os controles da Resolução Normativa ANEEL 964/2021
-- que estabelece requisitos de segurança cibernética para o setor elétrico

-- ============================================================================
-- 1. Verificar/Criar Framework ANEEL RN 964/2021
-- ============================================================================

INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'ANEEL RN 964/2021',
  '2021',
  'Resolução Normativa ANEEL 964/2021 - Requisitos de Segurança Cibernética para o Setor Elétrico. Estabelece requisitos mínimos de segurança cibernética para agentes do setor elétrico, incluindo governança, gestão de riscos, controles técnicos e operacionais, gestão de terceiros, pessoas e monitoramento.',
  jsonb_build_object(
    'category', 'Regulatório',
    'regulatory_body', 'ANEEL',
    'applicable_sectors', ARRAY['Energia', 'Setor Elétrico', 'SIN'],
    'url', 'https://www.aneel.gov.br/resolucoes-normativas',
    'effective_date', '2022-07-01',
    'regulatory_review', 'ARR após 7 anos de vigência',
    'document_type', 'Resolução Normativa'
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- 2. Criar Constraint UNIQUE se não existir
-- ============================================================================

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
-- 3. Inserir Controles da RN ANEEL 964/2021
-- ============================================================================

DO $$
DECLARE
    v_aneel_rn964_id UUID;
BEGIN
    -- Get ANEEL RN 964/2021 framework ID
    SELECT id INTO v_aneel_rn964_id
    FROM compliance.frameworks
    WHERE framework_name = 'ANEEL RN 964/2021';

    IF v_aneel_rn964_id IS NULL THEN
        RAISE NOTICE 'ANEEL RN 964/2021 framework not found. Please run framework insertion first.';
        RETURN;
    END IF;

    -- ========================================================================
    -- GOVERNANÇA E POLÍTICA (GOV-01 a GOV-07)
    -- ========================================================================

    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_aneel_rn964_id, 'GOV-01', 'Política Formal',
     'Manter política de segurança cibernética com objetivos claros de prevenir, detectar, responder e reduzir vulnerabilidades.',
     'Estabelecer e manter política formal de segurança cibernética que defina claramente os objetivos de prevenir, detectar, responder e reduzir vulnerabilidades cibernéticas.',
     'Foundational',
     '{"category": "Governança", "domain": "Governança e Política", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'GOV-02', 'Modelo de Maturidade Anual',
     'Aplicar ao menos um modelo de maturidade em segurança cibernética anualmente.',
     'Implementar e aplicar anualmente ao menos um modelo de maturidade em segurança cibernética para avaliar e melhorar continuamente a postura de segurança.',
     'Foundational',
     '{"category": "Governança", "domain": "Governança e Política", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'GOV-03', 'Compatibilidade com Criticidade',
     'Dimensionar a política conforme relevância no SIN, complexidade dos serviços e sensibilidade dos dados.',
     'Dimensionar e adequar a política de segurança cibernética conforme a relevância no Sistema Interligado Nacional (SIN), a complexidade dos serviços prestados e a sensibilidade dos dados tratados.',
     'Foundational',
     '{"category": "Governança", "domain": "Governança e Política", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'GOV-04', 'Aprovação e Patrocínio',
     'Aprovar a política pelo Conselho de Administração/órgão colegiado e garantir comprometimento da alta administração.',
     'Aprovar a política de segurança cibernética pelo Conselho de Administração ou órgão colegiado equivalente e garantir o comprometimento e patrocínio da alta administração.',
     'Foundational',
     '{"category": "Governança", "domain": "Governança e Política", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'GOV-05', 'Responsável Designado',
     'Nomear dirigente responsável pela política (sem conflito de interesses) e definir ponto focal e responsabilidades.',
     'Nomear um dirigente responsável pela política de segurança cibernética, garantindo que não haja conflito de interesses, e definir ponto focal e responsabilidades claras.',
     'Foundational',
     '{"category": "Governança", "domain": "Governança e Política", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'GOV-06', 'Divulgação e Revisão',
     'Divulgar a política aos públicos internos relevantes, revisá-la periodicamente e mantê-la disponível à ANEEL quando solicitada.',
     'Divulgar a política de segurança cibernética aos públicos internos relevantes, revisá-la periodicamente e mantê-la disponível à ANEEL quando solicitada.',
     'Foundational',
     '{"category": "Governança", "domain": "Governança e Política", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'GOV-07', 'Diretrizes Gerais',
     'Adotar normas/padrões de mercado, atuar com responsabilidade/transparência, disseminar cultura, uso seguro de redes e cobrir o ciclo identificar-proteger-diagnosticar-responder-recuperar.',
     'Adotar normas e padrões de mercado reconhecidos, atuar com responsabilidade e transparência, disseminar cultura de segurança cibernética, garantir uso seguro de redes e cobrir o ciclo completo de segurança: identificar, proteger, diagnosticar, responder e recuperar.',
     'Foundational',
     '{"category": "Governança", "domain": "Governança e Política", "url": "https://www2.aneel.gov.br"}'),

    -- ========================================================================
    -- GESTÃO DE RISCOS E CLASSIFICAÇÃO (RSK-01 a RSK-02)
    -- ========================================================================

    (v_aneel_rn964_id, 'RSK-01', 'Processo de Riscos',
     'Identificar, avaliar, classificar e tratar riscos cibernéticos; definir parâmetros de relevância dos incidentes.',
     'Estabelecer processo formal de gestão de riscos cibernéticos que inclua identificação, avaliação, classificação e tratamento de riscos, além de definir parâmetros de relevância dos incidentes cibernéticos.',
     'Foundational',
     '{"category": "Gestão de Riscos", "domain": "Gestão de Riscos e Classificação", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'RSK-02', 'Classificação da Informação',
     'Classificar dados/informações quanto à relevância; definir informações críticas.',
     'Implementar sistema de classificação de dados e informações quanto à relevância para o negócio e definir claramente quais informações são consideradas críticas.',
     'Foundational',
     '{"category": "Gestão de Riscos", "domain": "Gestão de Riscos e Classificação", "url": "https://www2.aneel.gov.br"}'),

    -- ========================================================================
    -- CONTROLES TÉCNICOS E OPERACIONAIS (OPS-01 a OPS-06)
    -- ========================================================================

    (v_aneel_rn964_id, 'OPS-01', 'Procedimentos e Controles',
     'Estabelecer procedimentos/controles para reduzir vulnerabilidades e cumprir objetivos de segurança.',
     'Estabelecer procedimentos e controles técnicos e operacionais para reduzir vulnerabilidades e cumprir os objetivos de segurança cibernética definidos na política.',
     'Foundational',
     '{"category": "Controles Técnicos", "domain": "Controles Técnicos e Operacionais", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'OPS-02', 'Rastreabilidade',
     'Implementar medidas técnicas, inclusive rastreabilidade, para proteger informações críticas.',
     'Implementar medidas técnicas, incluindo mecanismos de rastreabilidade, para proteger informações críticas contra acesso não autorizado, modificação, divulgação ou destruição.',
     'Foundational',
     '{"category": "Controles Técnicos", "domain": "Controles Técnicos e Operacionais", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'OPS-03', 'Secure by Design',
     'Aplicar controles no desenvolvimento seguro e ao adotar novas tecnologias.',
     'Aplicar princípios de segurança desde o design (secure by design) no desenvolvimento de sistemas e na adoção de novas tecnologias, garantindo que controles de segurança sejam incorporados desde o início.',
     'Foundational',
     '{"category": "Controles Técnicos", "domain": "Controles Técnicos e Operacionais", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'OPS-04', 'Testes de Resiliência',
     'Realizar simulações de cenários e ameaças para testar resiliência, ferramentas e capacidade/tempo de resposta.',
     'Realizar periodicamente simulações de cenários e ameaças cibernéticas para testar a resiliência dos sistemas, as ferramentas de segurança e a capacidade e tempo de resposta da equipe.',
     'Foundational',
     '{"category": "Controles Técnicos", "domain": "Controles Técnicos e Operacionais", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'OPS-05', 'Continuidade Operacional',
     'Manter mecanismos para prevenir, mitigar e recuperar incidentes na rede corporativa e redes de instalações, evitando impacto na operação.',
     'Manter mecanismos e processos para prevenir, mitigar e recuperar de incidentes cibernéticos tanto na rede corporativa quanto nas redes de instalações, evitando impacto na operação do sistema elétrico.',
     'Foundational',
     '{"category": "Controles Técnicos", "domain": "Controles Técnicos e Operacionais", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'OPS-06', 'Processo de Incidentes',
     'Ter procedimentos para prevenção, tratamento e resposta a incidentes (inclui registro, análise de causa/impacto e controle de efeitos para incidentes de maior impacto).',
     'Estabelecer e manter procedimentos formais para prevenção, tratamento e resposta a incidentes cibernéticos, incluindo registro detalhado, análise de causa raiz e impacto, e controle de efeitos para incidentes de maior impacto.',
     'Foundational',
     '{"category": "Controles Técnicos", "domain": "Controles Técnicos e Operacionais", "url": "https://www2.aneel.gov.br"}'),

    -- ========================================================================
    -- TERCEIROS E CADEIA (TPC-01 a TPC-02)
    -- ========================================================================

    (v_aneel_rn964_id, 'TPC-01', 'Exigências a Terceiros',
     'Definir procedimentos/controles a serem adotados por terceiros que manuseiem dados críticos ou sejam relevantes às operações, em nível equivalente ao do agente.',
     'Definir procedimentos e controles de segurança cibernética que devem ser adotados por terceiros que manuseiem dados críticos ou sejam relevantes às operações do agente, exigindo nível de segurança equivalente ao do agente.',
     'Foundational',
     '{"category": "Terceiros", "domain": "Terceiros e Cadeia", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'TPC-02', 'Incidentes Envolvendo Terceiros',
     'Registrar e analisar incidentes de maior impacto inclusive com informações recebidas de prestadores.',
     'Estabelecer processo para registrar e analisar incidentes cibernéticos de maior impacto que envolvam terceiros, incluindo informações recebidas de prestadores de serviços.',
     'Foundational',
     '{"category": "Terceiros", "domain": "Terceiros e Cadeia", "url": "https://www2.aneel.gov.br"}'),

    -- ========================================================================
    -- PESSOAS, CULTURA E CAPACITAÇÃO (HUM-01 a HUM-03)
    -- ========================================================================

    (v_aneel_rn964_id, 'HUM-01', 'Programas de Capacitação',
     'Implementar programas de capacitação e avaliação periódica de pessoal.',
     'Implementar programas de capacitação em segurança cibernética para o pessoal e realizar avaliação periódica do conhecimento e habilidades adquiridas.',
     'Foundational',
     '{"category": "Pessoas", "domain": "Pessoas, Cultura e Capacitação", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'HUM-02', 'Conscientização',
     'Manter plano de ação para conscientização e educação de usuários.',
     'Manter e executar plano de ação contínuo para conscientização e educação de usuários sobre segurança cibernética, incluindo boas práticas e ameaças comuns.',
     'Foundational',
     '{"category": "Pessoas", "domain": "Pessoas, Cultura e Capacitação", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'HUM-03', 'Cultura Contínua',
     'Disseminar cultura de segurança cibernética em toda a organização.',
     'Disseminar e promover cultura de segurança cibernética em toda a organização, garantindo que a segurança seja uma responsabilidade de todos e não apenas do departamento de TI.',
     'Foundational',
     '{"category": "Pessoas", "domain": "Pessoas, Cultura e Capacitação", "url": "https://www2.aneel.gov.br"}'),

    -- ========================================================================
    -- MONITORAMENTO, NOTIFICAÇÃO E COMPARTILHAMENTO (MON-01 a MON-03)
    -- ========================================================================

    (v_aneel_rn964_id, 'MON-01', 'Notificação de Incidentes',
     'Notificar a equipe de coordenação setorial designada sobre incidentes cibernéticos de maior impacto que afetem substancialmente a segurança das instalações, a operação, os serviços aos usuários ou dados — assim que houver ciência do incidente e sua dimensão; incluir análise de causa/impacto e medidas de mitigação.',
     'Estabelecer processo para notificar imediatamente a equipe de coordenação setorial designada sobre incidentes cibernéticos de maior impacto que afetem substancialmente a segurança das instalações, a operação, os serviços aos usuários ou dados. A notificação deve incluir análise de causa raiz, impacto e medidas de mitigação implementadas.',
     'Foundational',
     '{"category": "Monitoramento", "domain": "Monitoramento, Notificação e Compartilhamento", "url": "https://www2.aneel.gov.br", "critical": true}'),

    (v_aneel_rn964_id, 'MON-02', 'Compartilhamento de Informações',
     'Manter procedimento de compartilhamento (sigiloso e não discriminatório, não restrito ao grupo societário), excetuando-se informações críticas ou que comprometam a própria segurança.',
     'Estabelecer e manter procedimento de compartilhamento de informações sobre segurança cibernética de forma sigilosa e não discriminatória, não restrito ao grupo societário, excetuando-se informações críticas ou que comprometam a própria segurança do agente.',
     'Foundational',
     '{"category": "Monitoramento", "domain": "Monitoramento, Notificação e Compartilhamento", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'MON-03', 'Registros e Envio à ANEEL',
     'Manter e, quando solicitado, enviar: (i) resultados dos modelos de maturidade; (ii) riscos identificados e tratamentos; (iii) dados das equipes de prevenção/tratamento/resposta a incidentes. (A ANEEL também publica instruções práticas de comunicação de registros.)',
     'Manter registros documentados e, quando solicitado pela ANEEL, enviar: (i) resultados dos modelos de maturidade aplicados; (ii) riscos cibernéticos identificados e tratamentos implementados; (iii) dados das equipes de prevenção, tratamento e resposta a incidentes cibernéticos.',
     'Foundational',
     '{"category": "Monitoramento", "domain": "Monitoramento, Notificação e Compartilhamento", "url": "https://www2.aneel.gov.br", "regulatory_reporting": true}'),

    -- ========================================================================
    -- RESPONSABILIDADE E VIGÊNCIA (LEG-01 a LEG-03)
    -- ========================================================================

    (v_aneel_rn964_id, 'LEG-01', 'Ônus e Responsabilidade',
     'A segurança das instalações e a continuidade do serviço são responsabilidade dos agentes, que arcam com o ônus da implementação.',
     'Reconhecer que a segurança das instalações e a continuidade do serviço são responsabilidade exclusiva dos agentes do setor elétrico, que devem arcar com todos os custos e ônus da implementação dos controles de segurança cibernética.',
     'Foundational',
     '{"category": "Legal", "domain": "Responsabilidade e Vigência", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'LEG-02', 'Avaliação Regulatória',
     'A norma será objeto de Avaliação de Resultado Regulatório (ARR) após 7 anos de vigência.',
     'A norma será objeto de Avaliação de Resultado Regulatório (ARR) pela ANEEL após 7 anos de vigência, para avaliar a efetividade e necessidade de ajustes.',
     'Foundational',
     '{"category": "Legal", "domain": "Responsabilidade e Vigência", "url": "https://www2.aneel.gov.br"}'),

    (v_aneel_rn964_id, 'LEG-03', 'Entrada em Vigor',
     'Vigente desde 1º de julho de 2022 (texto oficial no DOU de 22/12/2021).',
     'A Resolução Normativa ANEEL 964/2021 entrou em vigor em 1º de julho de 2022, conforme publicado no Diário Oficial da União em 22/12/2021.',
     'Foundational',
     '{"category": "Legal", "domain": "Responsabilidade e Vigência", "effective_date": "2022-07-01", "publication_date": "2021-12-22", "url": "https://www2.aneel.gov.br"}')

    ON CONFLICT (framework_id, control_code) DO UPDATE
    SET control_title = EXCLUDED.control_title,
        description = EXCLUDED.description,
        requirement_text = EXCLUDED.requirement_text,
        level = EXCLUDED.level,
        metadata = EXCLUDED.metadata,
        updated_at = CURRENT_TIMESTAMP;

    RAISE NOTICE 'Controles da RN ANEEL 964/2021 inseridos com sucesso!';
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
    c.metadata->>'domain' as domain
FROM compliance.controls c
JOIN compliance.frameworks f ON c.framework_id = f.id
WHERE f.framework_name = 'ANEEL RN 964/2021'
ORDER BY c.control_code;

