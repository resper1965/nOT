# 📋 Instruções: Configurar Supabase Storage para Upload de Documentos

## 🎯 Configuração Necessária

Para o sistema de upload de documentos funcionar, é necessário configurar o **Supabase Storage**.

## 📝 Passo a Passo

### 1. Acessar Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto **ngrcot**
3. Navegue até **Storage** no menu lateral

### 2. Criar Bucket `documents`

1. Clique em **"New bucket"**
2. Nome: `documents`
3. **Public**: ❌ **DESMARCAR** (Bucket privado)
4. Clique em **"Create bucket"**

### 3. Configurar Políticas RLS

Após criar o bucket, vá em **"Policies"** e crie as seguintes políticas:

#### Política 1: Upload (Insert)

```sql
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Política 2: Download (Select)

```sql
CREATE POLICY "Users can download their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Política 3: Delete (somente para o próprio usuário)

```sql
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Nota**: A estrutura de pastas é `{user_id}/{document_id}/original/{filename}`, então a primeira pasta (`foldername(name)[1]`) é o `user_id`.

### 4. Configuração Alternativa (Service Role para Conversão)

Se você precisar processar conversão usando Service Role (server-side), adicione esta política:

```sql
CREATE POLICY "Service role can access all documents"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');
```

**⚠️ ATENÇÃO**: Use Service Role apenas em API Routes server-side, nunca no frontend!

## ✅ Verificação

Após configurar, teste o upload:

1. Acesse `/dashboard/compliance/documents`
2. Clique em **"Upload Documento"**
3. Selecione um arquivo (PDF, DOCX, etc)
4. Faça upload

Se funcionar, você verá:
- ✅ Arquivo enviado com sucesso
- ✅ Status "Convertendo para Markdown..."
- ✅ Registro criado no banco de dados

## 🔍 Verificar no Supabase

### Verificar Arquivo no Storage

1. Vá em **Storage** → **`documents`**
2. Você deve ver pastas organizadas por `user_id`
3. Dentro: `{document_id}/original/{filename}`

### Verificar Registro no Banco

Execute no SQL Editor:

```sql
SELECT 
  id,
  original_filename,
  file_type,
  file_size,
  conversion_status,
  created_at
FROM compliance.documents
ORDER BY created_at DESC
LIMIT 10;
```

## ❌ Problemas Comuns

### Erro: "Bucket not found"

**Solução**: Certifique-se de criar o bucket `documents` no Supabase Dashboard.

### Erro: "Access denied"

**Solução**: Verifique se as políticas RLS estão configuradas corretamente.

### Erro: "Policy check failed"

**Solução**: Verifique se o `user_id` na estrutura de pastas corresponde ao `auth.uid()`.

## 📚 Referências

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

