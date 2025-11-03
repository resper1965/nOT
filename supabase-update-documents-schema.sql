-- ============================================================================
-- Atualização do Schema para Upload e Conversão de Documentos
-- Sistema: ness. OT GRC
-- Data: 2025-01-03
-- ============================================================================

-- Adicionar colunas necessárias para upload e conversão de documentos
ALTER TABLE compliance.documents 
ADD COLUMN IF NOT EXISTS original_filename VARCHAR(500),
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_hash VARCHAR(64),  -- SHA-256
ADD COLUMN IF NOT EXISTS markdown_content TEXT,
ADD COLUMN IF NOT EXISTS markdown_path TEXT,
ADD COLUMN IF NOT EXISTS conversion_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS conversion_error TEXT,
ADD COLUMN IF NOT EXISTS converted_at TIMESTAMP;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_documents_conversion_status 
  ON compliance.documents(conversion_status);

CREATE INDEX IF NOT EXISTS idx_documents_file_hash 
  ON compliance.documents(file_hash);

CREATE INDEX IF NOT EXISTS idx_documents_file_type 
  ON compliance.documents(file_type);

-- Criar tabela de versionamento de documentos
CREATE TABLE IF NOT EXISTS compliance.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES compliance.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'original' | 'markdown'
  storage_path TEXT NOT NULL,
  content_hash VARCHAR(64), -- SHA-256
  content_size BIGINT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB,
  CONSTRAINT unique_document_version UNIQUE(document_id, version_number, content_type)
);

-- Criar índices para versionamento
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id 
  ON compliance.document_versions(document_id);

CREATE INDEX IF NOT EXISTS idx_document_versions_version_number 
  ON compliance.document_versions(version_number);

-- Criar função para obter próxima versão
CREATE OR REPLACE FUNCTION compliance.get_next_version(
  p_document_id UUID,
  p_content_type VARCHAR
) RETURNS INTEGER AS $$
DECLARE
  v_next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM compliance.document_versions
  WHERE document_id = p_document_id
    AND content_type = p_content_type;
  
  RETURN v_next_version;
END;
$$ LANGUAGE plpgsql;

-- Comentários nas colunas
COMMENT ON COLUMN compliance.documents.original_filename IS 'Nome original do arquivo enviado pelo usuário';
COMMENT ON COLUMN compliance.documents.file_type IS 'Tipo MIME do arquivo (application/pdf, application/msword, etc)';
COMMENT ON COLUMN compliance.documents.file_size IS 'Tamanho do arquivo em bytes';
COMMENT ON COLUMN compliance.documents.file_hash IS 'Hash SHA-256 do arquivo original para verificação de integridade';
COMMENT ON COLUMN compliance.documents.markdown_content IS 'Conteúdo do documento convertido para Markdown';
COMMENT ON COLUMN compliance.documents.markdown_path IS 'Caminho do arquivo Markdown no Supabase Storage';
COMMENT ON COLUMN compliance.documents.conversion_status IS 'Status da conversão: pending, processing, completed, failed';
COMMENT ON COLUMN compliance.documents.conversion_error IS 'Mensagem de erro em caso de falha na conversão';
COMMENT ON COLUMN compliance.documents.converted_at IS 'Data e hora da conversão para Markdown';

-- Verificar atualizações
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'compliance'
  AND table_name = 'documents'
  AND column_name IN (
    'original_filename',
    'file_type',
    'file_size',
    'file_hash',
    'markdown_content',
    'markdown_path',
    'conversion_status',
    'conversion_error',
    'converted_at'
  )
ORDER BY column_name;

