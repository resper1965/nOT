// Evidence Artifacts API Route
// GET /api/compliance/evidence-packages/[id]/artifacts
// POST /api/compliance/evidence-packages/[id]/artifacts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/compliance/evidence-packages/[id]/artifacts
 * Lista artefatos de um pacote de evidência
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: packageId } = params;

    // Verificar se o pacote existe
    const { data: evidencePackage, error: packageError } = await supabase
      .from('evidence_packages')
      .select('id')
      .eq('id', packageId)
      .single();

    if (packageError || !evidencePackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Obter artefatos
    const { data: artifacts, error } = await supabase
      .from('evidence_artifacts')
      .select('*')
      .eq('package_id', packageId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching artifacts:', error);
      throw error;
    }

    return NextResponse.json({
      artifacts: artifacts || [],
      count: artifacts?.length || 0,
    });
  } catch (error: any) {
    console.error('Error fetching artifacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artifacts', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/compliance/evidence-packages/[id]/artifacts
 * Adiciona um artefato a um pacote de evidência
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: packageId } = params;

    // Verificar se o pacote existe e está em draft
    const { data: evidencePackage, error: packageError } = await supabase
      .from('evidence_packages')
      .select('id, status')
      .eq('id', packageId)
      .single();

    if (packageError || !evidencePackage) {
      return NextResponse.json(
        { error: 'Evidence package not found' },
        { status: 404 }
      );
    }

    // Só permite adicionar artefatos se estiver em draft
    if (evidencePackage.status !== 'draft') {
      return NextResponse.json(
        { error: 'Artifacts can only be added to draft packages' },
        { status: 400 }
      );
    }

    // Obter arquivo do FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validar tamanho (50MB máximo para artefatos)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 50MB' },
        { status: 400 }
      );
    }

    // Ler arquivo e calcular hash
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Gerar ID único para o artefato
    const artifactId = crypto.randomUUID();
    
    // Upload para Supabase Storage
    // Estrutura: evidence/{package_id}/{artifact_id}/{filename}
    const storagePath = `${packageId}/${artifactId}/${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Upload failed', details: uploadError.message },
        { status: 500 }
      );
    }

    // Determinar tipo de artefato baseado no tipo MIME
    const artifactType = getArtifactType(file.type, file.name);

    // Criar registro do artefato
    const { data: artifact, error: dbError } = await supabase
      .from('evidence_artifacts')
      .insert({
        id: artifactId,
        package_id: packageId,
        artifact_name: file.name,
        artifact_type: artifactType,
        file_path: storagePath,
        file_size: file.size,
        mime_type: file.type,
        hash: hash,
        uploaded_by: user.id,
        uploaded_at: new Date().toISOString(),
        metadata: {},
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Tentar remover arquivo do storage em caso de erro
      await supabase.storage.from('evidence').remove([storagePath]);
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      );
    }

    // Recalcular hash do pacote (baseado na concatenação dos hashes dos artefatos)
    await recalculatePackageHash(supabase, packageId);

    return NextResponse.json({
      artifact: artifact,
      message: 'Artifact uploaded successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Upload artifact error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Determina o tipo de artefato baseado no tipo MIME e nome do arquivo
 */
function getArtifactType(mimeType: string, filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  // Mapeamento de tipos MIME e extensões para tipos de artefato
  if (mimeType.startsWith('application/pdf') || extension === 'pdf') {
    return 'pdf';
  }
  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(extension)) {
    return 'image';
  }
  if (mimeType.startsWith('text/') || extension === 'txt' || extension === 'log') {
    return 'log';
  }
  if (['json', 'xml', 'csv'].includes(extension)) {
    return 'siem_export';
  }
  if (['conf', 'config', 'cfg'].includes(extension)) {
    return 'config';
  }
  if (mimeType.includes('word') || ['doc', 'docx'].includes(extension)) {
    return 'document';
  }
  if (mimeType.includes('excel') || ['xls', 'xlsx'].includes(extension)) {
    return 'spreadsheet';
  }
  
  return 'other';
}

/**
 * Recalcula o hash do pacote baseado na concatenação dos hashes dos artefatos
 */
async function recalculatePackageHash(supabase: any, packageId: string): Promise<void> {
  try {
    // Obter todos os hashes dos artefatos ordenados
    const { data: artifacts, error } = await supabase
      .from('evidence_artifacts')
      .select('hash')
      .eq('package_id', packageId)
      .order('hash', { ascending: true });

    if (error) {
      console.error('Error fetching artifacts for hash calculation:', error);
      return;
    }

    // Concatena todos os hashes
    const concatenatedHashes = artifacts
      .map((a: any) => a.hash)
      .join('');

    // Calcula SHA-256 da concatenação
    const packageHash = crypto.createHash('sha256')
      .update(concatenatedHashes || '')
      .digest('hex');

    // Atualiza o hash do pacote
    await supabase
      .from('evidence_packages')
      .update({ hash: packageHash })
      .eq('id', packageId);
  } catch (error) {
    console.error('Error recalculating package hash:', error);
  }
}

