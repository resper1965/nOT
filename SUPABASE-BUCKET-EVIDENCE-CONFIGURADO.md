# ✅ Bucket Supabase Storage - evidence

**Data**: 2025-01-04  
**Status**: ✅ **Configurado**  
**Bucket**: `evidence`

---

## 📋 Configuração Aplicada

### ✅ Bucket Criado

**Nome**: `evidence`  
**Público**: Não (privado)  
**Tamanho máximo por arquivo**: 50MB (52.428.800 bytes)  
**Tipos MIME permitidos**:
- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `text/plain`
- `text/markdown`
- `image/png`
- `image/jpeg`
- `application/json`
- `application/xml`
- `text/csv`

---

## 🔒 Políticas RLS Configuradas

### 1. Upload (INSERT)
**Política**: `Authenticated users can upload evidence`
- ✅ Usuários autenticados podem fazer upload de arquivos no bucket `evidence`

### 2. Download (SELECT)
**Política**: `Authenticated users can download evidence`
- ✅ Usuários autenticados podem fazer download de arquivos do bucket `evidence`

### 3. Atualização (UPDATE)
**Política**: `Authenticated users can update own evidence`
- ✅ Usuários autenticados podem atualizar arquivos no bucket `evidence`

### 4. Deleção (DELETE)
**Política**: `Authenticated users can delete own evidence`
- ✅ Usuários autenticados podem deletar arquivos do bucket `evidence`

---

## 📁 Estrutura de Armazenamento

Os arquivos são armazenados no bucket seguindo a estrutura:

```
evidence/
  └── {package_id}/
      └── {artifact_id}/
          └── {filename}
```

**Exemplo**:
```
evidence/
  └── 550e8400-e29b-41d4-a716-446655440000/
      └── 6ba7b810-9dad-11d1-80b4-00c04fd430c8/
          └── relatorio-seguranca.pdf
```

---

## ✅ Verificação

O bucket foi criado e configurado com sucesso via SQL. As políticas RLS foram aplicadas e estão ativas.

**Próximo passo**: O sistema de upload de artefatos de evidência está pronto para uso!

---

**Configuração concluída em**: 2025-01-04  
**Método**: SQL via Supabase MCP

