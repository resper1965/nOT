// Document Converter - Converte documentos para Markdown
// Note: Some libraries may need dynamic imports in server-side context

export interface ConversionResult {
  markdown: string
  frontmatter: Record<string, any>
  metadata: {
    pages?: number
    wordCount?: number
    convertedAt: string
  }
}

/**
 * Converte arquivo PDF para Markdown
 */
export async function convertPDFToMarkdown(
  buffer: Buffer,
  metadata: {
    documentId: string
    originalFilename: string
    uploadedBy: string
    uploadedAt: string
  }
): Promise<ConversionResult> {
  try {
    // Dynamic import for pdf-parse (CommonJS module)
    const pdfParse = (await import('pdf-parse')).default
    const pdfData = await pdfParse(buffer)
    
    // Extrair texto do PDF
    let text = pdfData.text
    
    // Tentar preservar estrutura básica (títulos, parágrafos)
    // Dividir por linhas e identificar títulos (linhas curtas em maiúsculas ou com formatação)
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    
    const markdownLines: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line: string = lines[i].trim()
      
      // Identificar possíveis títulos (linhas curtas, sem ponto final)
      if (line.length < 80 && 
          !line.endsWith('.') && 
          !line.endsWith(',') &&
          (line.match(/^[A-Z]/) || line.match(/^\d+\./))) {
        // Provável título - usar como H2
        markdownLines.push(`\n## ${line}\n`)
      } else if (line.match(/^\d+\.\s+/)) {
        // Lista numerada
        markdownLines.push(`${line}\n`)
      } else {
        // Parágrafo normal
        markdownLines.push(`${line}\n\n`)
      }
    }
    
    const markdown = markdownLines.join('')
    
    // Gerar frontmatter
    const frontmatter = {
      id: metadata.documentId,
      title: metadata.originalFilename.replace(/\.[^/.]+$/, ''),
      type: 'PDF',
      original_file: metadata.originalFilename,
      uploaded_by: metadata.uploadedBy,
      uploaded_at: metadata.uploadedAt,
      converted_at: new Date().toISOString(),
    }
    
    return {
      markdown,
      frontmatter,
      metadata: {
        pages: pdfData.numpages,
        convertedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    throw new Error(`PDF conversion failed: ${error.message}`)
  }
}

/**
 * Converte arquivo DOCX para Markdown
 */
export async function convertDOCXToMarkdown(
  buffer: Buffer,
  metadata: {
    documentId: string
    originalFilename: string
    uploadedBy: string
    uploadedAt: string
  }
): Promise<ConversionResult> {
  try {
    // Dynamic imports for mammoth and turndown
    const mammoth = await import('mammoth')
    const TurndownService = (await import('turndown')).default
    
    // Converter DOCX para HTML usando mammoth
    const result = await mammoth.convertToHtml({ buffer })
    const html = result.value
    
    // Converter HTML para Markdown usando Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })
    
    // Configurar regras personalizadas
    turndownService.addRule('strikethrough', {
      filter: ['del', 's', 'strike'],
      replacement: (content: string) => `~~${content}~~`,
    })
    
    const markdown = turndownService.turndown(html)
    
    // Gerar frontmatter
    const frontmatter = {
      id: metadata.documentId,
      title: metadata.originalFilename.replace(/\.[^/.]+$/, ''),
      type: 'DOCX',
      original_file: metadata.originalFilename,
      uploaded_by: metadata.uploadedBy,
      uploaded_at: metadata.uploadedAt,
      converted_at: new Date().toISOString(),
    }
    
    return {
      markdown,
      frontmatter,
      metadata: {
        wordCount: result.value.split(/\s+/).length,
        convertedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    throw new Error(`DOCX conversion failed: ${error.message}`)
  }
}

/**
 * Converte arquivo DOC para Markdown (via DOCX conversion)
 */
export async function convertDOCToMarkdown(
  buffer: Buffer,
  metadata: {
    documentId: string
    originalFilename: string
    uploadedBy: string
    uploadedAt: string
  }
): Promise<ConversionResult> {
  try {
    // Tentar converter DOC usando mammoth (pode ter limitações)
    // Mammoth funciona melhor com DOCX, mas pode tentar DOC
    return await convertDOCXToMarkdown(buffer, metadata)
  } catch (error: any) {
    // Se falhar, retornar como texto simples
    const text = buffer.toString('utf-8', 0, Math.min(10000, buffer.length))
    
    const frontmatter = {
      id: metadata.documentId,
      title: metadata.originalFilename.replace(/\.[^/.]+$/, ''),
      type: 'DOC',
      original_file: metadata.originalFilename,
      uploaded_by: metadata.uploadedBy,
      uploaded_at: metadata.uploadedAt,
      converted_at: new Date().toISOString(),
      note: 'DOC conversion had limitations - raw text extracted',
    }
    
    return {
      markdown: text,
      frontmatter,
      metadata: {
        convertedAt: new Date().toISOString(),
      },
    }
  }
}

/**
 * Converte arquivo TXT para Markdown
 */
export async function convertTXTToMarkdown(
  buffer: Buffer,
  metadata: {
    documentId: string
    originalFilename: string
    uploadedBy: string
    uploadedAt: string
  }
): Promise<ConversionResult> {
  try {
    const text = buffer.toString('utf-8')
    
    // Aplicar formatação mínima
    const lines = text.split('\n')
    const markdownLines: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Linhas vazias
      if (!trimmed) {
        markdownLines.push('\n')
        continue
      }
      
      // Possíveis títulos (linhas curtas, sem ponto final)
      if (trimmed.length < 80 && 
          !trimmed.endsWith('.') && 
          !trimmed.endsWith(',') &&
          (trimmed.match(/^[A-Z]/) || trimmed.match(/^\d+\./))) {
        markdownLines.push(`## ${trimmed}\n`)
      } else {
        markdownLines.push(`${trimmed}\n`)
      }
    }
    
    const markdown = markdownLines.join('')
    
    // Gerar frontmatter
    const frontmatter = {
      id: metadata.documentId,
      title: metadata.originalFilename.replace(/\.[^/.]+$/, ''),
      type: 'TXT',
      original_file: metadata.originalFilename,
      uploaded_by: metadata.uploadedBy,
      uploaded_at: metadata.uploadedAt,
      converted_at: new Date().toISOString(),
    }
    
    return {
      markdown,
      frontmatter,
      metadata: {
        convertedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    throw new Error(`TXT conversion failed: ${error.message}`)
  }
}

/**
 * Processa arquivo Markdown existente (apenas adiciona frontmatter)
 */
export async function processMarkdownFile(
  buffer: Buffer,
  metadata: {
    documentId: string
    originalFilename: string
    uploadedBy: string
    uploadedAt: string
  }
): Promise<ConversionResult> {
  try {
    const content = buffer.toString('utf-8')
    
    // Verificar se já tem frontmatter
    if (content.startsWith('---')) {
      // Já tem frontmatter, apenas validar
      return {
        markdown: content,
        frontmatter: {},
        metadata: {
          convertedAt: new Date().toISOString(),
        },
      }
    }
    
    // Adicionar frontmatter
    const frontmatter = {
      id: metadata.documentId,
      title: metadata.originalFilename.replace(/\.[^/.]+$/, ''),
      type: 'MD',
      original_file: metadata.originalFilename,
      uploaded_by: metadata.uploadedBy,
      uploaded_at: metadata.uploadedAt,
      converted_at: new Date().toISOString(),
    }
    
    // Dynamic import for js-yaml
    const yaml = await import('js-yaml')
    const frontmatterYaml = yaml.dump(frontmatter)
    const markdown = `---\n${frontmatterYaml}---\n\n${content}`
    
    return {
      markdown,
      frontmatter,
      metadata: {
        convertedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    throw new Error(`Markdown processing failed: ${error.message}`)
  }
}

/**
 * Função principal de conversão - detecta tipo e converte
 */
export async function convertDocumentToMarkdown(
  buffer: Buffer,
  fileType: string,
  metadata: {
    documentId: string
    originalFilename: string
    uploadedBy: string
    uploadedAt: string
  }
): Promise<ConversionResult> {
  switch (fileType) {
    case 'application/pdf':
      return convertPDFToMarkdown(buffer, metadata)
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return convertDOCXToMarkdown(buffer, metadata)
    
    case 'application/msword':
      return convertDOCToMarkdown(buffer, metadata)
    
    case 'text/plain':
      return convertTXTToMarkdown(buffer, metadata)
    
    case 'text/markdown':
      return processMarkdownFile(buffer, metadata)
    
    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}

/**
 * Formata o resultado final com frontmatter YAML
 */
export async function formatMarkdownWithFrontmatter(result: ConversionResult): Promise<string> {
  // Dynamic import for js-yaml
  const yaml = await import('js-yaml')
  const frontmatterYaml = yaml.dump(result.frontmatter, {
    indent: 2,
    lineWidth: -1,
  })
  
  return `---\n${frontmatterYaml}---\n\n${result.markdown}`
}

