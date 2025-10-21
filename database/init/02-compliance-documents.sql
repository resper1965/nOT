-- ============================================================================
-- COMPLIANCE DOCUMENTS MANAGEMENT SCHEMA
-- Gestão de Documentação Regulatória ANEEL RN 964/2021 e ONS
-- ============================================================================

-- Document Categories
CREATE TABLE compliance.document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    regulatory_source VARCHAR(100),
    mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert main categories
INSERT INTO compliance.document_categories (category_code, category_name, description, regulatory_source, mandatory) VALUES
    ('POL', 'Políticas', 'Políticas de Segurança Cibernética', 'ANEEL RN 964/2021', true),
    ('PROC', 'Procedimentos', 'Procedimentos Operacionais', 'ANEEL RN 964/2021 + ONS', true),
    ('PRI', 'Planos de Resposta', 'Planos de Resposta a Incidentes', 'ANEEL RN 964/2021', true),
    ('TRAIN', 'Treinamentos', 'Programas e Evidências de Treinamento', 'ANEEL RN 964/2021', true),
    ('AUD', 'Auditorias', 'Relatórios de Auditoria', 'ANEEL RN 964/2021', true),
    ('CERT', 'Certificações', 'Certificados e Conformidades', 'ANEEL + ONS', false),
    ('INC', 'Incidentes', 'Relatórios de Incidentes', 'ANEEL RN 964/2021', true),
    ('RISK', 'Análise de Risco', 'Avaliações de Risco', 'ANEEL RN 964/2021', true),
    ('BCP', 'Continuidade', 'Planos de Continuidade e DR', 'ANEEL RN 964/2021', true),
    ('EVID', 'Evidências', 'Evidências de Conformidade', 'ANEEL + ONS', true);

-- Required Documents Registry
CREATE TABLE compliance.required_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES compliance.document_categories(id),
    document_code VARCHAR(50) NOT NULL UNIQUE,
    document_name VARCHAR(500) NOT NULL,
    description TEXT,
    regulatory_reference VARCHAR(500),
    mandatory BOOLEAN DEFAULT true,
    frequency VARCHAR(50), -- 'once', 'annual', 'biannual', 'quarterly', 'monthly', 'continuous'
    responsible_role VARCHAR(100),
    template_available BOOLEAN DEFAULT false,
    template_path VARCHAR(500),
    estimated_effort_hours INTEGER,
    dependencies TEXT[],
    approval_required_by VARCHAR(100),
    retention_years INTEGER DEFAULT 5,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Status Tracking
CREATE TABLE compliance.document_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    required_document_id UUID REFERENCES compliance.required_documents(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('missing', 'draft', 'under_review', 'approved', 'published', 'expired', 'archived')),
    current_version VARCHAR(20),
    file_path VARCHAR(500),
    file_hash VARCHAR(128),
    file_size_bytes BIGINT,
    created_by VARCHAR(255),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    valid_from DATE,
    valid_until DATE,
    next_review_date DATE,
    last_review_date DATE,
    review_status VARCHAR(50),
    comments TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_status_required ON compliance.document_status(required_document_id);
CREATE INDEX idx_document_status_status ON compliance.document_status(status);
CREATE INDEX idx_document_status_next_review ON compliance.document_status(next_review_date);

-- Document Versions History
CREATE TABLE compliance.document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_status_id UUID REFERENCES compliance.document_status(id),
    version VARCHAR(20) NOT NULL,
    file_path VARCHAR(500),
    file_hash VARCHAR(128),
    changes_description TEXT,
    created_by VARCHAR(255),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Approval Workflow
CREATE TABLE compliance.document_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_status_id UUID REFERENCES compliance.document_status(id),
    approver_role VARCHAR(100) NOT NULL,
    approver_name VARCHAR(255),
    approval_status VARCHAR(50) CHECK (approval_status IN ('pending', 'approved', 'rejected', 'returned')),
    approval_date TIMESTAMP,
    comments TEXT,
    sequence_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Review Schedule
CREATE TABLE compliance.document_review_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    required_document_id UUID REFERENCES compliance.required_documents(id),
    scheduled_date DATE NOT NULL,
    review_type VARCHAR(50) CHECK (review_type IN ('periodic', 'ad_hoc', 'regulatory', 'incident_driven')),
    assigned_to VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    completion_date DATE,
    findings TEXT,
    actions_required JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERT REQUIRED DOCUMENTS (ANEEL RN 964/2021 + ONS)
-- ============================================================================

-- CATEGORY: POLÍTICAS
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description, 
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
-- Política Principal
((SELECT id FROM compliance.document_categories WHERE category_code = 'POL'),
 'POL-001', 'Política de Segurança Cibernética', 
 'Política corporativa de segurança cibernética conforme ANEEL RN 964/2021',
 'ANEEL RN 964/2021 Art. 3º', true, 'annual', 'CISO',
 'Conselho de Administração', 10),

-- Políticas Específicas
((SELECT id FROM compliance.document_categories WHERE category_code = 'POL'),
 'POL-002', 'Política de Classificação de Dados',
 'Critérios e procedimentos para classificação de dados e informações',
 'ANEEL RN 964/2021 Art. 4º', true, 'annual', 'CISO',
 'Diretoria', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'POL'),
 'POL-003', 'Política de Controle de Acesso',
 'Normas de controle de acesso lógico e físico',
 'ANEEL RN 964/2021 + ONS', true, 'annual', 'CISO',
 'Diretoria', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'POL'),
 'POL-004', 'Política de Uso Aceitável',
 'Diretrizes de uso aceitável de recursos de TI/OT',
 'ANEEL RN 964/2021', true, 'annual', 'CISO',
 'Diretoria', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'POL'),
 'POL-005', 'Política de Gestão de Patches',
 'Procedimentos de atualização e gestão de patches',
 'ONS Rotina Operacional', true, 'biannual', 'TI Manager',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'POL'),
 'POL-006', 'Política de Backup e Recuperação',
 'Diretrizes de backup, retenção e recuperação',
 'ANEEL RN 964/2021', true, 'annual', 'TI Manager',
 'CISO', 10);

-- CATEGORY: PROCEDIMENTOS
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'PROC'),
 'PROC-001', 'Procedimento de Gestão de Vulnerabilidades',
 'Processo de identificação, avaliação e correção de vulnerabilidades',
 'ANEEL RN 964/2021 + IEC 62443', true, 'annual', 'Security Team',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PROC'),
 'PROC-002', 'Procedimento de Controle de Mudanças',
 'Processo de gestão de mudanças em sistemas críticos',
 'ONS + ANEEL', true, 'annual', 'Change Manager',
 'Diretoria Operacional', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PROC'),
 'PROC-003', 'Procedimento de Hardening de Sistemas',
 'Padrões de configuração segura para sistemas OT/IT',
 'IEC 62443 + CIS Benchmarks', true, 'annual', 'Security Team',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PROC'),
 'PROC-004', 'Procedimento de Gestão de Logs',
 'Coleta, armazenamento e análise de logs de segurança',
 'ANEEL RN 964/2021 Art. 5º', true, 'annual', 'SOC Team',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PROC'),
 'PROC-005', 'Procedimento de Segmentação de Rede',
 'Implementação e manutenção de segmentação OT/IT',
 'ONS + IEC 62443', true, 'annual', 'Network Team',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PROC'),
 'PROC-006', 'Procedimento de Acesso Remoto',
 'Normas para acesso remoto via VPN',
 'ONS Rotina Operacional', true, 'annual', 'Network Team',
 'CISO', 5);

-- CATEGORY: PLANOS DE RESPOSTA A INCIDENTES
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'PRI'),
 'PRI-001', 'Plano de Resposta a Incidentes Cibernéticos',
 'Plano master de resposta a incidentes',
 'ANEEL RN 964/2021 Art. 6º', true, 'annual', 'CSIRT Lead',
 'Conselho de Administração', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PRI'),
 'PRI-002', 'Playbook de Resposta a Ransomware',
 'Procedimentos específicos para ransomware',
 'ANEEL RN 964/2021', true, 'annual', 'CSIRT Lead',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PRI'),
 'PRI-003', 'Playbook de Resposta a Vazamento de Dados',
 'Procedimentos para data breach',
 'LGPD + ANEEL RN 964/2021', true, 'annual', 'CSIRT Lead + DPO',
 'CISO', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'PRI'),
 'PRI-004', 'Procedimento de Notificação de Incidentes',
 'Fluxo de notificação ANEEL/ONS/GSI',
 'ANEEL RN 964/2021 Art. 7º', true, 'annual', 'CSIRT Lead',
 'CISO', 10);

-- CATEGORY: CONTINUIDADE
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'BCP'),
 'BCP-001', 'Plano de Continuidade de Negócios',
 'Plano de continuidade operacional',
 'ANEEL RN 964/2021', true, 'annual', 'BCM Manager',
 'Conselho de Administração', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'BCP'),
 'BCP-002', 'Plano de Recuperação de Desastres (DRP)',
 'Procedimentos de recuperação de sistemas críticos',
 'ANEEL RN 964/2021', true, 'annual', 'TI Manager',
 'Diretoria', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'BCP'),
 'BCP-003', 'Análise de Impacto no Negócio (BIA)',
 'Identificação de processos críticos e RTO/RPO',
 'ANEEL RN 964/2021', true, 'biannual', 'BCM Manager',
 'Diretoria', 5);

-- CATEGORY: TREINAMENTOS
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'TRAIN'),
 'TRAIN-001', 'Programa de Conscientização em Segurança',
 'Programa anual de treinamento para todos colaboradores',
 'ANEEL RN 964/2021 Art. 8º', true, 'annual', 'CISO',
 'Diretoria RH', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'TRAIN'),
 'TRAIN-002', 'Treinamento Técnico OT Security',
 'Capacitação técnica para equipes OT',
 'ANEEL RN 964/2021 + IEC 62443', true, 'biannual', 'Security Team Lead',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'TRAIN'),
 'TRAIN-003', 'Simulação de Resposta a Incidentes',
 'Exercícios de table-top e simulações práticas',
 'ANEEL RN 964/2021', true, 'quarterly', 'CSIRT Lead',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'TRAIN'),
 'TRAIN-004', 'Evidências de Treinamento',
 'Registros de participação, avaliações, certificados',
 'ANEEL RN 964/2021', true, 'continuous', 'RH/Training',
 'CISO', 5);

-- CATEGORY: ANÁLISE DE RISCO
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'RISK'),
 'RISK-001', 'Análise de Risco de Segurança Cibernética',
 'Avaliação anual de riscos cibernéticos',
 'ANEEL RN 964/2021', true, 'annual', 'Risk Manager',
 'Diretoria', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'RISK'),
 'RISK-002', 'Registro de Riscos (Risk Register)',
 'Inventário de riscos identificados',
 'ANEEL RN 964/2021', true, 'continuous', 'Risk Manager',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'RISK'),
 'RISK-003', 'Plano de Tratamento de Riscos',
 'Ações de mitigação, aceitação, transferência',
 'ANEEL RN 964/2021', true, 'annual', 'Risk Manager',
 'Diretoria', 5);

-- CATEGORY: AUDITORIAS
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'AUD'),
 'AUD-001', 'Plano Anual de Auditoria',
 'Cronograma de auditorias de segurança',
 'ANEEL RN 964/2021', true, 'annual', 'Audit Manager',
 'Conselho de Administração', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'AUD'),
 'AUD-002', 'Relatórios de Auditoria Interna',
 'Resultados de auditorias internas',
 'ANEEL RN 964/2021', true, 'continuous', 'Audit Team',
 'Audit Manager', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'AUD'),
 'AUD-003', 'Relatórios de Auditoria Externa',
 'Resultados de auditorias independentes',
 'ANEEL RN 964/2021', true, 'annual', 'External Auditor',
 'Conselho de Administração', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'AUD'),
 'AUD-004', 'Plano de Ações Corretivas',
 'Remediações de não conformidades identificadas',
 'ANEEL RN 964/2021', true, 'continuous', 'Process Owner',
 'CISO', 5);

-- CATEGORY: INCIDENTES
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'INC'),
 'INC-001', 'Relatórios de Incidentes Cibernéticos',
 'Documentação de todos incidentes de segurança',
 'ANEEL RN 964/2021 Art. 7º', true, 'continuous', 'CSIRT',
 'CISO', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'INC'),
 'INC-002', 'Notificações à ANEEL',
 'Comunicações oficiais de incidentes críticos',
 'ANEEL RN 964/2021 Art. 7º', true, 'continuous', 'CISO',
 'CEO', 10),

((SELECT id FROM compliance.document_categories WHERE category_code = 'INC'),
 'INC-003', 'Análise de Causa Raiz',
 'RCA de incidentes significativos',
 'ANEEL RN 964/2021', true, 'continuous', 'CSIRT Lead',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'INC'),
 'INC-004', 'Lições Aprendidas',
 'Documentação de melhorias pós-incidente',
 'ANEEL RN 964/2021', true, 'continuous', 'CSIRT Lead',
 'CISO', 5);

-- CATEGORY: EVIDÊNCIAS
INSERT INTO compliance.required_documents (
    category_id, document_code, document_name, description,
    regulatory_reference, mandatory, frequency, responsible_role,
    approval_required_by, retention_years
) VALUES
((SELECT id FROM compliance.document_categories WHERE category_code = 'EVID'),
 'EVID-001', 'Inventário de Ativos',
 'Catálogo completo de ativos OT/IT',
 'ANEEL RN 964/2021 + ONS', true, 'continuous', 'Asset Manager',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'EVID'),
 'EVID-002', 'Relatórios de Varredura de Vulnerabilidades',
 'Resultados de scans de segurança',
 'ANEEL RN 964/2021', true, 'monthly', 'Security Team',
 'CISO', 3),

((SELECT id FROM compliance.document_categories WHERE category_code = 'EVID'),
 'EVID-003', 'Logs de Controle de Acesso',
 'Registros de autenticação e autorização',
 'ANEEL RN 964/2021 Art. 5º', true, 'continuous', 'SOC Team',
 'CISO', 5),

((SELECT id FROM compliance.document_categories WHERE category_code = 'EVID'),
 'EVID-004', 'Evidências de Patches Aplicados',
 'Histórico de atualizações de segurança',
 'ONS + ANEEL', true, 'continuous', 'TI Team',
 'TI Manager', 3),

((SELECT id FROM compliance.document_categories WHERE category_code = 'EVID'),
 'EVID-005', 'Testes de Backup e Restauração',
 'Resultados de testes de DR',
 'ANEEL RN 964/2021', true, 'quarterly', 'TI Team',
 'TI Manager', 5);

-- ============================================================================
-- VIEWS FOR REPORTING
-- ============================================================================

-- Compliance Dashboard View
CREATE VIEW compliance.compliance_dashboard AS
SELECT 
    dc.category_name,
    COUNT(rd.id) as total_documents,
    COUNT(CASE WHEN ds.status = 'approved' OR ds.status = 'published' THEN 1 END) as documents_compliant,
    COUNT(CASE WHEN ds.status = 'missing' OR ds.status IS NULL THEN 1 END) as documents_missing,
    COUNT(CASE WHEN ds.status = 'draft' OR ds.status = 'under_review' THEN 1 END) as documents_in_progress,
    COUNT(CASE WHEN ds.status = 'expired' THEN 1 END) as documents_expired,
    COUNT(CASE WHEN ds.next_review_date < CURRENT_DATE THEN 1 END) as documents_needing_review,
    ROUND(100.0 * COUNT(CASE WHEN ds.status = 'approved' OR ds.status = 'published' THEN 1 END) / NULLIF(COUNT(rd.id), 0), 2) as compliance_percentage
FROM compliance.document_categories dc
LEFT JOIN compliance.required_documents rd ON dc.id = rd.category_id
LEFT JOIN compliance.document_status ds ON rd.id = ds.required_document_id
WHERE rd.mandatory = true
GROUP BY dc.id, dc.category_name
ORDER BY compliance_percentage ASC;

-- Missing Documents View
CREATE VIEW compliance.missing_documents AS
SELECT 
    dc.category_name,
    rd.document_code,
    rd.document_name,
    rd.regulatory_reference,
    rd.responsible_role,
    rd.frequency,
    rd.estimated_effort_hours,
    CASE 
        WHEN ds.status IS NULL THEN 'Never Created'
        ELSE ds.status
    END as current_status
FROM compliance.required_documents rd
JOIN compliance.document_categories dc ON rd.category_id = dc.id
LEFT JOIN compliance.document_status ds ON rd.id = ds.required_document_id
WHERE rd.mandatory = true
  AND (ds.status IS NULL OR ds.status = 'missing' OR ds.status = 'expired')
ORDER BY dc.category_name, rd.document_code;

-- Documents Needing Review View
CREATE VIEW compliance.documents_needing_review AS
SELECT 
    dc.category_name,
    rd.document_code,
    rd.document_name,
    ds.next_review_date,
    ds.last_review_date,
    rd.responsible_role,
    CURRENT_DATE - ds.next_review_date as days_overdue
FROM compliance.document_status ds
JOIN compliance.required_documents rd ON ds.required_document_id = rd.id
JOIN compliance.document_categories dc ON rd.category_id = dc.id
WHERE ds.next_review_date < CURRENT_DATE
  AND ds.status IN ('approved', 'published')
ORDER BY days_overdue DESC;

-- Compliance Summary by Regulatory Source
CREATE VIEW compliance.compliance_by_regulation AS
SELECT 
    rd.regulatory_reference,
    COUNT(rd.id) as total_requirements,
    COUNT(CASE WHEN ds.status = 'approved' OR ds.status = 'published' THEN 1 END) as requirements_met,
    ROUND(100.0 * COUNT(CASE WHEN ds.status = 'approved' OR ds.status = 'published' THEN 1 END) / NULLIF(COUNT(rd.id), 0), 2) as compliance_percentage
FROM compliance.required_documents rd
LEFT JOIN compliance.document_status ds ON rd.id = ds.required_document_id
WHERE rd.mandatory = true
GROUP BY rd.regulatory_reference
ORDER BY compliance_percentage ASC;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA compliance TO ness_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA compliance TO ness_admin;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Compliance documents management schema initialized!';
    RAISE NOTICE '📋 Total required documents: %', (SELECT COUNT(*) FROM compliance.required_documents WHERE mandatory = true);
END $$;
