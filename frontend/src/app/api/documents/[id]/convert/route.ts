import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabaseClient } from '@/lib/supabase-server'
import { convertDocumentToMarkdown, formatMarkdownWithFrontmatter } from '@/lib/document-converter'
import crypto from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    // Usar admin client para bypass RLS (processamento server-side)
    const supabase = getAdminSupabaseClient()

    // Buscar informações do documento
    const { data: document, error: docError } = await supabase
      .from('compliance.documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      console.error('Document fetch error:', docError)
      return NextResponse.json(
        { error: 'Document not found', details: docError?.message },
        { status: 404 }
      )
    }

    // Verificar se já foi convertido
    if (document.conversion_status === 'completed' && document.markdown_content) {
      return NextResponse.json({
        status: 'already_converted',
        message: 'Document already converted',
        document_id: documentId,
      })
    }

    // Atualizar status para "processing"
    await supabase
      .from('compliance.documents')
      .update({
        conversion_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    // Buscar arquivo original do Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('documents')
      .download(document.storage_path)

    if (storageError || !fileData) {
      console.error('Storage download error:', storageError)
      
      // Atualizar status para "failed"
      await supabase
        .from('compliance.documents')
        .update({
          conversion_status: 'failed',
          conversion_error: `Storage download failed: ${storageError?.message}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId)

      return NextResponse.json(
        { error: 'File not found in storage', details: storageError?.message },
        { status: 404 }
      )
    }

    // Converter arquivo para buffer
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    try {
      // Converter para Markdown
      const result = await convertDocumentToMarkdown(
        buffer,
        document.file_type || 'application/pdf',
        {
          documentId: document.id,
          originalFilename: document.original_filename || 'document',
          uploadedBy: document.created_by || 'system',
          uploadedAt: document.created_at || new Date().toISOString(),
        }
      )

      // Formatar Markdown com frontmatter
      const markdownContent = await formatMarkdownWithFrontmatter(result)

      // Upload do Markdown para Storage
      const markdownPath = `${document.storage_path.replace('/original/', '/markdown/')}.md`
      
      const { error: markdownUploadError } = await supabase.storage
        .from('documents')
        .upload(markdownPath, Buffer.from(markdownContent, 'utf-8'), {
          contentType: 'text/markdown',
          upsert: true,
        })

      if (markdownUploadError) {
        console.error('Markdown upload error:', markdownUploadError)
        
        // Atualizar status para "failed"
        await supabase
          .from('compliance.documents')
          .update({
            conversion_status: 'failed',
            conversion_error: `Markdown upload failed: ${markdownUploadError.message}`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', documentId)

        return NextResponse.json(
          { error: 'Markdown upload failed', details: markdownUploadError.message },
          { status: 500 }
        )
      }

      // Atualizar banco de dados com o Markdown
      const { error: updateError } = await supabase
        .from('compliance.documents')
        .update({
          markdown_content: markdownContent,
          markdown_path: markdownPath,
          conversion_status: 'completed',
          converted_at: new Date().toISOString(),
          conversion_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId)

      if (updateError) {
        console.error('Database update error:', updateError)
        
        // Tentar remover Markdown do storage em caso de erro
        await supabase.storage.from('documents').remove([markdownPath])
        
        return NextResponse.json(
          { error: 'Database update failed', details: updateError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        status: 'completed',
        message: 'Document converted successfully',
        document_id: documentId,
        markdown_path: markdownPath,
        conversion_status: 'completed',
      })

    } catch (conversionError: any) {
      console.error('Conversion error:', conversionError)
      
      // Atualizar status para "failed"
      await supabase
        .from('compliance.documents')
        .update({
          conversion_status: 'failed',
          conversion_error: `Conversion failed: ${conversionError.message}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId)

      return NextResponse.json(
        {
          error: 'Conversion failed',
          details: conversionError.message,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Convert error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

