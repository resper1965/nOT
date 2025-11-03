import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obter arquivo do FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validar tamanho (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      )
    }

    // Validar tipo MIME
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT, MD' },
        { status: 400 }
      )
    }

    // Ler arquivo e calcular hash
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const hash = crypto.createHash('sha256').update(buffer).digest('hex')

    // Gerar ID único para o documento
    const documentId = crypto.randomUUID()
    
    // Upload para Supabase Storage
    // Estrutura: documents/{user_id}/{document_id}/original/{filename}
    const storagePath = `${user.id}/${documentId}/original/${file.name}`
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Upload failed', details: uploadError.message },
        { status: 500 }
      )
    }

    // Criar registro no banco de dados
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        id: documentId,
        original_filename: file.name,
        file_type: file.type,
        file_size: file.size,
        file_hash: hash,
        storage_path: storagePath,
        conversion_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Tentar remover arquivo do storage em caso de erro
      await supabase.storage.from('documents').remove([storagePath])
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      )
    }

    // Iniciar conversão (assíncrono)
    // Chamar API de conversão em background (não aguardar)
    const baseUrl = request.nextUrl.origin
    fetch(`${baseUrl}/api/documents/${documentId}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Passar token de autenticação se necessário
      },
    }).catch(err => {
      console.error('Conversion trigger error:', err)
      // Não falhar o upload se a conversão falhar - pode ser processada depois
    })

    return NextResponse.json({
      document_id: document.id,
      status: 'uploaded',
      message: 'Upload successful, conversion in progress',
      conversion_status: 'pending',
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

