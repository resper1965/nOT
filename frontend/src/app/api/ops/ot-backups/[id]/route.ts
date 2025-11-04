// OT Backup Detail API Route
// GET /api/ops/ot-backups/[id]
// PUT /api/ops/ot-backups/[id]
// DELETE /api/ops/ot-backups/[id]

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/ops/ot-backups/[id]
 * Obtém detalhes de um backup OT
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

    const { id } = await context.params;

    // Obter backup com informações do asset
    const { data: backup, error } = await supabase
      .from('ot_backups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching OT backup:', error);
      throw error;
    }

    if (!backup) {
      return NextResponse.json(
        { error: 'OT backup not found' },
        { status: 404 }
      );
    }

    // Obter informações do asset
    let asset = null;
    if (backup.asset_id) {
      const { data: assetData } = await supabase
        .from('assets')
        .select('id, asset_name, asset_type, ip_address')
        .eq('id', backup.asset_id)
        .single();
      asset = assetData;
    }

    // Combinar dados
    const result = {
      ...backup,
      asset,
    };

    return NextResponse.json({
      backup: result,
    });
  } catch (error: any) {
    console.error('Error fetching OT backup:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OT backup', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ops/ot-backups/[id]
 * Atualiza um backup OT
 */
export async function PUT(
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

    const { id } = await context.params;
    const body = await request.json();
    const { 
      backup_location,
      backup_method,
      frequency,
      last_backup_date,
      next_backup_date,
      last_restore_test_date,
      restore_test_result,
      restore_test_notes,
      backup_size_bytes,
      metadata 
    } = body;

    // Verificar se o backup existe
    const { data: existingBackup, error: fetchError } = await supabase
      .from('ot_backups')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingBackup) {
      return NextResponse.json(
        { error: 'OT backup not found' },
        { status: 404 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (backup_location !== undefined) {
      updateData.backup_location = backup_location || null;
    }
    if (backup_method !== undefined) {
      updateData.backup_method = backup_method || null;
    }
    if (frequency !== undefined) {
      updateData.frequency = frequency || null;
    }
    if (last_backup_date !== undefined) {
      updateData.last_backup_date = last_backup_date || null;
      // Se foi feito backup, calcular próximo baseado na frequência
      if (last_backup_date && frequency) {
        // TODO: Calcular next_backup_date baseado na frequência
      }
    }
    if (next_backup_date !== undefined) {
      updateData.next_backup_date = next_backup_date || null;
    }
    if (last_restore_test_date !== undefined) {
      updateData.last_restore_test_date = last_restore_test_date || null;
    }
    if (restore_test_result !== undefined) {
      if (restore_test_result && !['success', 'failed', 'partial', 'not_tested'].includes(restore_test_result)) {
        return NextResponse.json(
          { error: 'Invalid restore_test_result. Must be: success, failed, partial, or not_tested' },
          { status: 400 }
        );
      }
      updateData.restore_test_result = restore_test_result || null;
    }
    if (restore_test_notes !== undefined) {
      updateData.restore_test_notes = restore_test_notes || null;
    }
    if (backup_size_bytes !== undefined) {
      updateData.backup_size_bytes = backup_size_bytes || null;
    }
    if (metadata !== undefined) {
      updateData.metadata = metadata;
    }

    // Se foi feito backup, calcular hash se fornecido
    if (last_backup_date && body.backup_content) {
      // Hash do conteúdo do backup (simulado)
      const backupHash = crypto.createHash('sha256')
        .update(body.backup_content)
        .digest('hex');
      updateData.backup_hash = backupHash;
    }

    // Atualizar backup
    const { data: updatedBackup, error: updateError } = await supabase
      .from('ot_backups')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating OT backup:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      backup: updatedBackup,
      message: 'OT backup updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating OT backup:', error);
    return NextResponse.json(
      { error: 'Failed to update OT backup', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ops/ot-backups/[id]
 * Deleta um backup OT
 */
export async function DELETE(
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

    const { id } = await context.params;

    // Verificar se o backup existe
    const { data: existingBackup, error: fetchError } = await supabase
      .from('ot_backups')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingBackup) {
      return NextResponse.json(
        { error: 'OT backup not found' },
        { status: 404 }
      );
    }

    // Deletar backup
    const { error: deleteError } = await supabase
      .from('ot_backups')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting OT backup:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      message: 'OT backup deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting OT backup:', error);
    return NextResponse.json(
      { error: 'Failed to delete OT backup', message: error.message },
      { status: 500 }
    );
  }
}

