-- ============================================================================
-- EVIDENCE PACKAGES & ATTESTATIONS
-- ============================================================================
-- Script para criar sistema de pacotes de evidência e attestations digitais
-- Fase 0.1: Evidence Packages & Attestation (P0 - Crítico)
-- Data: 2025-01-04
-- Versão: 1.0
-- ============================================================================

-- ============================================================================
-- 1. EVIDENCE PACKAGES
-- ============================================================================

-- Tabela: Pacotes de Evidência
-- Agrupa múltiplos artefatos (PDF, logs, prints, export SIEM) sob um evidence_package
-- Vinculado ao controle/avaliação, com hash e carimbo de tempo
CREATE TABLE IF NOT EXISTS compliance.evidence_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_id UUID REFERENCES compliance.controls(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES compliance.assessments(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    description TEXT,
    hash VARCHAR(128) NOT NULL, -- SHA-256
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved', 'locked')),
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    locked_at TIMESTAMP,
    submitted_by UUID REFERENCES auth.users(id),
    reviewed_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_evidence_packages_control ON compliance.evidence_packages(control_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_assessment ON compliance.evidence_packages(assessment_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_status ON compliance.evidence_packages(status);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_hash ON compliance.evidence_packages(hash);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_submitted_by ON compliance.evidence_packages(submitted_by);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_created_at ON compliance.evidence_packages(created_at);

-- Tabela: Artefatos de Evidência
-- Armazena os arquivos individuais que compõem um pacote de evidência
CREATE TABLE IF NOT EXISTS compliance.evidence_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES compliance.evidence_packages(id) ON DELETE CASCADE,
    artifact_name VARCHAR(255) NOT NULL,
    artifact_type VARCHAR(50) NOT NULL, -- pdf, log, image, siem_export, config, etc
    file_path VARCHAR(500), -- Path no Supabase Storage
    file_size BIGINT, -- Tamanho em bytes
    mime_type VARCHAR(100),
    hash VARCHAR(128) NOT NULL, -- SHA-256 do arquivo
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_evidence_artifacts_package ON compliance.evidence_artifacts(package_id);
CREATE INDEX IF NOT EXISTS idx_evidence_artifacts_type ON compliance.evidence_artifacts(artifact_type);
CREATE INDEX IF NOT EXISTS idx_evidence_artifacts_hash ON compliance.evidence_artifacts(hash);

-- Trigger: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION compliance.update_evidence_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_evidence_packages_updated_at
    BEFORE UPDATE ON compliance.evidence_packages
    FOR EACH ROW
    EXECUTE FUNCTION compliance.update_evidence_packages_updated_at();

-- Função: Calcular hash SHA-256 do pacote
-- O hash é calculado baseado na concatenação dos hashes dos artefatos
CREATE OR REPLACE FUNCTION compliance.calculate_evidence_package_hash(package_id UUID)
RETURNS VARCHAR(128) AS $$
DECLARE
    artifact_hashes TEXT;
    package_hash VARCHAR(128);
BEGIN
    -- Concatena todos os hashes dos artefatos ordenados
    SELECT string_agg(hash, '' ORDER BY hash)
    INTO artifact_hashes
    FROM compliance.evidence_artifacts
    WHERE package_id = calculate_evidence_package_hash.package_id;
    
    -- Calcula SHA-256 da concatenação
    -- Nota: Em produção, isso deve ser feito no backend, não no banco
    -- Este é apenas um placeholder - o hash real deve ser calculado no backend
    SELECT encode(digest(COALESCE(artifact_hashes, ''), 'sha256'), 'hex')
    INTO package_hash;
    
    RETURN package_hash;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. ATTESTATIONS (ASSINATURAS DIGITAIS)
-- ============================================================================

-- Tabela: Attestations Digitais
-- Termo assinado por responsável do controle/instalação a cada avaliação
CREATE TABLE IF NOT EXISTS compliance.attestations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scope VARCHAR(100) NOT NULL CHECK (scope IN ('control', 'assessment', 'installation', 'framework')),
    scope_id UUID NOT NULL, -- ID do controle, avaliação, instalação ou framework
    statement TEXT NOT NULL, -- Texto do termo de attestation
    signed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    signature_hash VARCHAR(128) NOT NULL, -- SHA-256 da assinatura
    ip_address INET, -- IP de origem da assinatura
    user_agent TEXT, -- User agent do navegador
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_attestations_owner ON compliance.attestations(owner_id);
CREATE INDEX IF NOT EXISTS idx_attestations_scope ON compliance.attestations(scope, scope_id);
CREATE INDEX IF NOT EXISTS idx_attestations_signed_at ON compliance.attestations(signed_at);
CREATE INDEX IF NOT EXISTS idx_attestations_hash ON compliance.attestations(signature_hash);

-- Tabela: Histórico de Attestations
-- Mantém histórico de todas as assinaturas (imutável)
CREATE TABLE IF NOT EXISTS compliance.attestation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attestation_id UUID REFERENCES compliance.attestations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES auth.users(id),
    scope VARCHAR(100) NOT NULL,
    scope_id UUID NOT NULL,
    statement TEXT NOT NULL,
    signed_at TIMESTAMP NOT NULL,
    signature_hash VARCHAR(128) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('created', 'revoked', 'renewed')),
    reason TEXT, -- Motivo da revogação/renovação
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_attestation_history_attestation ON compliance.attestation_history(attestation_id);
CREATE INDEX IF NOT EXISTS idx_attestation_history_owner ON compliance.attestation_history(owner_id);
CREATE INDEX IF NOT EXISTS idx_attestation_history_scope ON compliance.attestation_history(scope, scope_id);

-- Função: Criar attestation
-- Cria uma nova attestation e registra no histórico
CREATE OR REPLACE FUNCTION compliance.create_attestation(
    p_owner_id UUID,
    p_scope VARCHAR(100),
    p_scope_id UUID,
    p_statement TEXT,
    p_signature_hash VARCHAR(128),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_attestation_id UUID;
BEGIN
    -- Insere attestation
    INSERT INTO compliance.attestations (
        owner_id,
        scope,
        scope_id,
        statement,
        signature_hash,
        ip_address,
        user_agent
    )
    VALUES (
        p_owner_id,
        p_scope,
        p_scope_id,
        p_statement,
        p_signature_hash,
        p_ip_address,
        p_user_agent
    )
    RETURNING id INTO v_attestation_id;
    
    -- Registra no histórico
    INSERT INTO compliance.attestation_history (
        attestation_id,
        owner_id,
        scope,
        scope_id,
        statement,
        signed_at,
        signature_hash,
        action
    )
    SELECT
        v_attestation_id,
        owner_id,
        scope,
        scope_id,
        statement,
        signed_at,
        signature_hash,
        'created'
    FROM compliance.attestations
    WHERE id = v_attestation_id;
    
    RETURN v_attestation_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. RELAÇÕES E VINCULAÇÕES
-- ============================================================================

-- Tabela: Vinculação Evidence Package x Attestation
-- Vincula um pacote de evidência a uma attestation
CREATE TABLE IF NOT EXISTS compliance.evidence_package_attestations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES compliance.evidence_packages(id) ON DELETE CASCADE,
    attestation_id UUID REFERENCES compliance.attestations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(package_id, attestation_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_evidence_package_attestations_package ON compliance.evidence_package_attestations(package_id);
CREATE INDEX IF NOT EXISTS idx_evidence_package_attestations_attestation ON compliance.evidence_package_attestations(attestation_id);

-- ============================================================================
-- 4. VIEWS PARA DASHBOARDS E RELATÓRIOS
-- ============================================================================

-- View: Evidence Packages com Detalhes
CREATE OR REPLACE VIEW compliance.v_evidence_packages_detail AS
SELECT
    ep.id,
    ep.package_name,
    ep.description,
    ep.hash,
    ep.status,
    ep.submitted_at,
    ep.reviewed_at,
    ep.approved_at,
    ep.locked_at,
    ep.submitted_by,
    ep.reviewed_by,
    ep.approved_by,
    ep.rejection_reason,
    ep.metadata,
    ep.created_at,
    ep.updated_at,
    c.id AS control_id,
    c.control_code,
    c.control_title AS control_name,
    a.id AS assessment_id,
    f.framework_name || ' - ' || TO_CHAR(a.assessment_date, 'DD/MM/YYYY') AS assessment_name,
    a.assessment_date,
    COUNT(DISTINCT ea.id) AS artifact_count,
    COALESCE(SUM(ea.file_size), 0) AS total_size_bytes,
    COUNT(DISTINCT epa.attestation_id) AS attestation_count,
    -- Status details
    CASE
        WHEN ep.status = 'draft' THEN 'Rascunho'
        WHEN ep.status = 'submitted' THEN 'Enviado'
        WHEN ep.status = 'reviewed' THEN 'Revisado'
        WHEN ep.status = 'approved' THEN 'Aprovado'
        WHEN ep.status = 'locked' THEN 'Bloqueado'
    END AS status_label,
    -- Submitted by
    su.email AS submitted_by_email,
    su.raw_user_meta_data->>'name' AS submitted_by_name,
    -- Reviewed by
    ru.email AS reviewed_by_email,
    ru.raw_user_meta_data->>'name' AS reviewed_by_name,
    -- Approved by
    au.email AS approved_by_email,
    au.raw_user_meta_data->>'name' AS approved_by_name
FROM compliance.evidence_packages ep
LEFT JOIN compliance.controls c ON ep.control_id = c.id
LEFT JOIN compliance.assessments a ON ep.assessment_id = a.id
LEFT JOIN compliance.frameworks f ON a.framework_id = f.id
LEFT JOIN compliance.evidence_artifacts ea ON ep.id = ea.package_id
LEFT JOIN compliance.evidence_package_attestations epa ON ep.id = epa.package_id
LEFT JOIN auth.users su ON ep.submitted_by = su.id
LEFT JOIN auth.users ru ON ep.reviewed_by = ru.id
LEFT JOIN auth.users au ON ep.approved_by = au.id
GROUP BY
    ep.id,
    ep.package_name,
    ep.description,
    ep.hash,
    ep.status,
    ep.submitted_at,
    ep.reviewed_at,
    ep.approved_at,
    ep.locked_at,
    ep.submitted_by,
    ep.reviewed_by,
    ep.approved_by,
    ep.rejection_reason,
    ep.metadata,
    ep.created_at,
    ep.updated_at,
    c.id,
    c.control_code,
    c.control_title,
    a.id,
    f.framework_name,
    a.assessment_date,
    su.email,
    su.raw_user_meta_data,
    ru.email,
    ru.raw_user_meta_data,
    au.email,
    au.raw_user_meta_data;

-- View: Attestations com Detalhes
CREATE OR REPLACE VIEW compliance.v_attestations_detail AS
SELECT
    a.id,
    a.owner_id,
    a.scope,
    a.scope_id,
    a.statement,
    a.signed_at,
    a.signature_hash,
    a.ip_address,
    a.user_agent,
    a.metadata,
    a.created_at,
    -- Owner details
    u.email AS owner_email,
    u.raw_user_meta_data->>'name' AS owner_name,
    -- Scope details
    CASE
        WHEN a.scope = 'control' THEN c.control_code || ' - ' || c.control_title
        WHEN a.scope = 'assessment' THEN f2.framework_name || ' - ' || TO_CHAR(a2.assessment_date, 'DD/MM/YYYY')
        WHEN a.scope = 'installation' THEN 'Instalação ' || a.scope_id::TEXT
        WHEN a.scope = 'framework' THEN f.framework_name
        ELSE a.scope || ' ' || a.scope_id::TEXT
    END AS scope_label,
    -- Validity
    CASE
        WHEN a.scope = 'control' THEN
            (SELECT COUNT(*) > 0 FROM compliance.attestation_history ah 
             WHERE ah.attestation_id = a.id AND ah.action = 'revoked') = FALSE
        ELSE TRUE
    END AS is_valid
FROM compliance.attestations a
LEFT JOIN auth.users u ON a.owner_id = u.id
LEFT JOIN compliance.controls c ON a.scope = 'control' AND a.scope_id = c.id
LEFT JOIN compliance.assessments a2 ON a.scope = 'assessment' AND a.scope_id = a2.id
LEFT JOIN compliance.frameworks f2 ON a2.framework_id = f2.id
LEFT JOIN compliance.frameworks f ON a.scope = 'framework' AND a.scope_id = f.id;

-- View: Evidence Packages por Status
CREATE OR REPLACE VIEW compliance.v_evidence_packages_by_status AS
SELECT
    status,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') AS last_30_days,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') AS last_7_days,
    AVG(EXTRACT(EPOCH FROM (COALESCE(approved_at, CURRENT_TIMESTAMP) - created_at)) / 3600) AS avg_approval_hours
FROM compliance.evidence_packages
GROUP BY status;

-- View: Attestations por Scope
CREATE OR REPLACE VIEW compliance.v_attestations_by_scope AS
SELECT
    scope,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE signed_at >= CURRENT_DATE - INTERVAL '30 days') AS last_30_days,
    COUNT(*) FILTER (WHERE signed_at >= CURRENT_DATE - INTERVAL '7 days') AS last_7_days,
    COUNT(DISTINCT owner_id) AS unique_signers
FROM compliance.attestations
GROUP BY scope;

-- ============================================================================
-- 5. FUNÇÕES DE WORKFLOW
-- ============================================================================

-- Função: Submeter Evidence Package para Revisão
CREATE OR REPLACE FUNCTION compliance.submit_evidence_package(
    p_package_id UUID,
    p_submitted_by UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE compliance.evidence_packages
    SET
        status = 'submitted',
        submitted_at = CURRENT_TIMESTAMP,
        submitted_by = p_submitted_by,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_package_id
    AND status = 'draft';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função: Revisar Evidence Package
CREATE OR REPLACE FUNCTION compliance.review_evidence_package(
    p_package_id UUID,
    p_reviewed_by UUID,
    p_approved BOOLEAN,
    p_rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    IF p_approved THEN
        UPDATE compliance.evidence_packages
        SET
            status = 'reviewed',
            reviewed_at = CURRENT_TIMESTAMP,
            reviewed_by = p_reviewed_by,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_package_id
        AND status = 'submitted';
    ELSE
        UPDATE compliance.evidence_packages
        SET
            status = 'draft',
            reviewed_at = CURRENT_TIMESTAMP,
            reviewed_by = p_reviewed_by,
            rejection_reason = p_rejection_reason,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_package_id
        AND status = 'submitted';
    END IF;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função: Aprovar Evidence Package
CREATE OR REPLACE FUNCTION compliance.approve_evidence_package(
    p_package_id UUID,
    p_approved_by UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE compliance.evidence_packages
    SET
        status = 'approved',
        approved_at = CURRENT_TIMESTAMP,
        approved_by = p_approved_by,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_package_id
    AND status = 'reviewed';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função: Bloquear Evidence Package (final)
CREATE OR REPLACE FUNCTION compliance.lock_evidence_package(
    p_package_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE compliance.evidence_packages
    SET
        status = 'locked',
        locked_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_package_id
    AND status = 'approved';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE compliance.evidence_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.evidence_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.attestation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.evidence_package_attestations ENABLE ROW LEVEL SECURITY;

-- Políticas para evidence_packages
-- Usuários autenticados podem ver todos os pacotes
CREATE POLICY "Users can view evidence packages"
    ON compliance.evidence_packages
    FOR SELECT
    TO authenticated
    USING (true);

-- Usuários autenticados podem criar pacotes
CREATE POLICY "Users can create evidence packages"
    ON compliance.evidence_packages
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Usuários autenticados podem atualizar seus próprios pacotes (draft)
CREATE POLICY "Users can update own draft evidence packages"
    ON compliance.evidence_packages
    FOR UPDATE
    TO authenticated
    USING (
        status = 'draft' AND
        (submitted_by = auth.uid() OR submitted_by IS NULL)
    );

-- Políticas para evidence_artifacts
-- Usuários autenticados podem ver todos os artefatos
CREATE POLICY "Users can view evidence artifacts"
    ON compliance.evidence_artifacts
    FOR SELECT
    TO authenticated
    USING (true);

-- Usuários autenticados podem criar artefatos
CREATE POLICY "Users can create evidence artifacts"
    ON compliance.evidence_artifacts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Usuários autenticados podem deletar artefatos de pacotes draft
CREATE POLICY "Users can delete artifacts from draft packages"
    ON compliance.evidence_artifacts
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM compliance.evidence_packages ep
            WHERE ep.id = evidence_artifacts.package_id
            AND ep.status = 'draft'
        )
    );

-- Políticas para attestations
-- Usuários autenticados podem ver todas as attestations
CREATE POLICY "Users can view attestations"
    ON compliance.attestations
    FOR SELECT
    TO authenticated
    USING (true);

-- Usuários autenticados podem criar suas próprias attestations
CREATE POLICY "Users can create own attestations"
    ON compliance.attestations
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

-- Políticas para attestation_history
-- Usuários autenticados podem ver todo o histórico
CREATE POLICY "Users can view attestation history"
    ON compliance.attestation_history
    FOR SELECT
    TO authenticated
    USING (true);

-- Políticas para evidence_package_attestations
-- Usuários autenticados podem ver todas as vinculações
CREATE POLICY "Users can view evidence package attestations"
    ON compliance.evidence_package_attestations
    FOR SELECT
    TO authenticated
    USING (true);

-- Usuários autenticados podem criar vinculações
CREATE POLICY "Users can create evidence package attestations"
    ON compliance.evidence_package_attestations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================================================
-- 7. COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE compliance.evidence_packages IS 'Pacotes de evidência que agrupam múltiplos artefatos para um controle/avaliação';
COMMENT ON TABLE compliance.evidence_artifacts IS 'Artefatos individuais (PDF, logs, prints) que compõem um pacote de evidência';
COMMENT ON TABLE compliance.attestations IS 'Assinaturas digitais de responsáveis por controles/avaliações/instalações';
COMMENT ON TABLE compliance.attestation_history IS 'Histórico imutável de todas as assinaturas';
COMMENT ON TABLE compliance.evidence_package_attestations IS 'Vinculação entre pacotes de evidência e attestations';

COMMENT ON COLUMN compliance.evidence_packages.hash IS 'SHA-256 do pacote (calculado baseado nos hashes dos artefatos)';
COMMENT ON COLUMN compliance.evidence_packages.status IS 'Status do pacote: draft, submitted, reviewed, approved, locked';
COMMENT ON COLUMN compliance.attestations.signature_hash IS 'SHA-256 da assinatura digital';
COMMENT ON COLUMN compliance.attestations.scope IS 'Escopo da attestation: control, assessment, installation, framework';

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

