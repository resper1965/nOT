import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    const supabase = getServerSupabaseClient()

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar documento
    const { data: document, error: docError } = await supabase
      .from('compliance.documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found', details: docError?.message },
        { status: 404 }
      )
    }

    // Verificar se o documento tem Markdown
    if (!document.markdown_content) {
      return NextResponse.json(
        { error: 'Markdown content not available', conversion_status: document.conversion_status },
        { status: 404 }
      )
    }

    return NextResponse.json({
      document_id: documentId,
      content: document.markdown_content,
      conversion_status: document.conversion_status,
      markdown_path: document.markdown_path,
      converted_at: document.converted_at,
    })
  } catch (error: any) {
    console.error('Get markdown error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    const supabase = getServerSupabaseClient()

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obter conteúdo do body
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    // Buscar documento atual
    const { data: document, error: docError } = await supabase
      .from('compliance.documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found', details: docError?.message },
        { status: 404 }
      )
    }

    // Validar que é Markdown (básico - verificar frontmatter)
    if (!content.includes('---') || !content.includes('\n')) {
      // Não é Markdown válido, mas permitir salvar mesmo assim
      // console.warn('Content may not be valid Markdown')
    }

    // Atualizar markdown_path se necessário
    const markdownPath = document.markdown_path || `${document.storage_path.replace('/original/', '/markdown/')}.md`

    // Upload do novo Markdown para Storage (sobrescrever)
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(markdownPath, Buffer.from(content, 'utf-8'), {
        contentType: 'text/markdown',
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to save markdown to storage', details: uploadError.message },
        { status: 500 }
      )
    }

    // Atualizar banco de dados
    const { error: updateError } = await supabase
      .from('compliance.documents')
      .update({
        markdown_content: content,
        markdown_path: markdownPath,
        updated_at: new Date().toISOString(),
        // Se ainda estava pendente, marcar como concluído
        conversion_status: document.conversion_status === 'pending' ? 'completed' : document.conversion_status,
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update database', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'saved',
      message: 'Markdown saved successfully',
      document_id: documentId,
      markdown_path: markdownPath,
      saved_at: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Save markdown error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

