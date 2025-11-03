-- ============================================================================
-- CORREÇÃO DE AVISOS DE SEGURANÇA DO SUPABASE LINTER
-- ============================================================================
-- Este script corrige os avisos de segurança detectados pelo Supabase Linter:
-- 1. Function Search Path Mutable (funções com search_path mutável)
-- 2. Leaked Password Protection (habilitar no dashboard do Supabase)
-- ============================================================================

-- ============================================================================
-- 1. CORRIGIR: update_updated_at_column()
-- ============================================================================
-- Problema: Função tem search_path mutável
-- Solução: Definir search_path explicitamente como vazio para segurança
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_updated_at_column() IS 'Atualiza automaticamente o campo updated_at. Search_path definido como vazio para segurança.';

-- ============================================================================
-- 2. CORRIGIR: compliance.get_next_version()
-- ============================================================================
-- Problema: Função tem search_path mutável
-- Solução: Definir search_path explicitamente para o schema compliance
-- ============================================================================

CREATE OR REPLACE FUNCTION compliance.get_next_version(
  p_document_id UUID,
  p_content_type VARCHAR
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = compliance, pg_catalog
AS $$
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
$$;

COMMENT ON FUNCTION compliance.get_next_version(UUID, VARCHAR) IS 'Retorna o próximo número de versão para um documento. Search_path definido explicitamente para segurança.';

-- ============================================================================
-- 3. HABILITAR LEAKED PASSWORD PROTECTION
-- ============================================================================
-- NOTA: Esta configuração deve ser feita no Dashboard do Supabase:
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá para: Authentication > Settings
-- 4. Habilite: "Leaked Password Protection"
-- 
-- Isso protege contra o uso de senhas comprometidas verificando
-- contra o banco de dados HaveIBeenPwned.org
-- ============================================================================

-- Instruções para habilitar via Dashboard:
-- 1. Dashboard > Authentication > Settings
-- 2. Security > Password Security
-- 3. Habilitar "Leaked Password Protection"
-- 4. Salvar configurações

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
-- Execute estas queries para verificar se as correções foram aplicadas:
-- 
-- SELECT 
--   proname as function_name,
--   nspname as schema_name,
--   proconfig as config
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE proname IN ('update_updated_at_column', 'get_next_version')
--   AND nspname IN ('public', 'compliance');
-- 
-- As funções devem ter proconfig contendo 'search_path=' ou 'search_path=compliance,pg_catalog'
-- ============================================================================

