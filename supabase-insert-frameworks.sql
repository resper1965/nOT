-- ============================================================================
-- Inserção de Frameworks de Compliance Relevantes
-- Sistema: ness. OT GRC
-- Data: 2025-01-03
-- ============================================================================

-- Inserir frameworks de segurança cibernética relevantes para o setor elétrico

-- NIST Cybersecurity Framework (CSF) 2.0
INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'NIST Cybersecurity Framework',
  '2.0',
  'Framework de cibersegurança do NIST (National Institute of Standards and Technology) - Versão 2.0. Fornece diretrizes para gerenciar e reduzir riscos cibernéticos através de 5 funções: Identify, Protect, Detect, Respond, Recover.',
  jsonb_build_object(
    'category', 'Internacional',
    'regulatory_body', 'NIST',
    'applicable_sectors', ARRAY['Energia', 'Infraestrutura Crítica', 'OT/ICS'],
    'url', 'https://www.nist.gov/cyberframework',
    'functions', ARRAY['Identify', 'Protect', 'Detect', 'Respond', 'Recover']
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- ISO/IEC 27001 - Sistema de Gestão de Segurança da Informação (SGSI)
INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'ISO/IEC 27001',
  '2022',
  'Sistema de Gestão de Segurança da Informação (SGSI). Norma internacional que estabelece requisitos para estabelecer, implementar, manter e melhorar continuamente um sistema de gestão de segurança da informação.',
  jsonb_build_object(
    'category', 'Internacional',
    'regulatory_body', 'ISO/IEC',
    'applicable_sectors', ARRAY['Energia', 'Infraestrutura Crítica', 'Todas as indústrias'],
    'annex_a_controls', 93,
    'url', 'https://www.iso.org/standard/27001',
    'related_standards', ARRAY['ISO/IEC 27002', 'ISO/IEC 27019']
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- ISO/IEC 27002 - Controles de Segurança da Informação
INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'ISO/IEC 27002',
  '2022',
  'Controles de Segurança da Informação - Guia de implementação para controles de segurança da informação baseado no ISO/IEC 27001. Fornece diretrizes para seleção e implementação de controles de segurança.',
  jsonb_build_object(
    'category', 'Internacional',
    'regulatory_body', 'ISO/IEC',
    'applicable_sectors', ARRAY['Energia', 'Infraestrutura Crítica', 'Todas as indústrias'],
    'controls_count', 93,
    'url', 'https://www.iso.org/standard/75652',
    'related_standards', ARRAY['ISO/IEC 27001', 'ISO/IEC 27019']
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- ISO/IEC 27019 - Segurança da Informação para Setor de Energia
INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'ISO/IEC 27019',
  '2017',
  'Sistema de Gestão de Segurança da Informação para processos, sistemas de controle e sistemas de apoio em setores de energia. Extensão do ISO/IEC 27001/27002 especificamente para processos de controle e automação no setor de energia.',
  jsonb_build_object(
    'category', 'Internacional',
    'regulatory_body', 'ISO/IEC',
    'applicable_sectors', ARRAY['Energia', 'Elétrica', 'OT/ICS Energia'],
    'extension_of', 'ISO/IEC 27001/27002',
    'url', 'https://www.iso.org/standard/68090',
    'related_standards', ARRAY['ISO/IEC 27001', 'ISO/IEC 27002', 'IEC 62443'],
    'specific_for_energy', true
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- NIST SP 800-82 - Guia de Segurança para Sistemas de Controle Industrial (ICS)
INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'NIST SP 800-82',
  'Rev. 2',
  'Guia de Segurança para Sistemas de Controle Industrial (ICS) - Práticas recomendadas de segurança cibernética para Sistemas de Controle Industrial (ICS), incluindo SCADA, DCS e outros sistemas de controle. Inclui práticas, architecture patterns e mapeamento para NIST SP 800-53 e NIST CSF.',
  jsonb_build_object(
    'category', 'Internacional',
    'regulatory_body', 'NIST',
    'applicable_sectors', ARRAY['Energia', 'OT/ICS', 'SCADA', 'DCS', 'PLC'],
    'document_type', 'Special Publication',
    'related_documents', ARRAY['NIST SP 800-53', 'NIST CSF'],
    'url', 'https://csrc.nist.gov/publications/detail/sp/800-82/rev-2/final',
    'ics_focus', true,
    'architecture_patterns', true,
    'maps_to_800_53', true,
    'maps_to_csf', true
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- NIST SP 800-53 - Controles de Segurança e Privacidade
INSERT INTO compliance.frameworks (framework_name, version, description, metadata)
VALUES (
  'NIST SP 800-53',
  'Rev. 5',
  'Controles de Segurança e Privacidade para Sistemas de Informação e Organizações. Catálogo de controles de segurança e privacidade que podem ser implementados para proteger sistemas de informação.',
  jsonb_build_object(
    'category', 'Internacional',
    'regulatory_body', 'NIST',
    'applicable_sectors', ARRAY['Energia', 'Infraestrutura Crítica', 'Governo Federal'],
    'document_type', 'Special Publication',
    'control_families', 20,
    'controls_count', '1000+',
    'url', 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final',
    'related_documents', ARRAY['NIST SP 800-82', 'NIST CSF'],
    'security_controls', true,
    'privacy_controls', true
  )
)
ON CONFLICT (framework_name) DO UPDATE
SET version = EXCLUDED.version,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP;

-- Verificar frameworks inseridos
SELECT 
  framework_name,
  version,
  description,
  metadata->>'category' as category,
  metadata->>'regulatory_body' as regulatory_body,
  metadata->>'applicable_sectors' as applicable_sectors
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

