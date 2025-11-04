// OT Backups API Route
// GET /api/ops/ot-backups
// POST /api/ops/ot-backups

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/ops/ot-backups
 * Lista todos os backups OT
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obter parâmetros de query
    const searchParams = request.nextUrl.searchParams;
    const assetId = searchParams.get('asset_id');
    const backupType = searchParams.get('backup_type');

    // Construir query
    let query = supabase
      .from('ot_backups')
      .select('*')
      .order('last_backup_date', { ascending: false });

    // Aplicar filtros
    if (assetId) {
      query = query.eq('asset_id', assetId);
    }
    if (backupType) {
      query = query.eq('backup_type', backupType);
    }

    const { data: backups, error } = await query;

    if (error) {
      console.error('Error fetching OT backups:', error);
      throw error;
    }

    // Verificar backups vencidos
    const now = new Date();
    const overdueBackups = (backups || []).filter(backup => {
      if (!backup.next_backup_date) return false;
      return new Date(backup.next_backup_date) < now;
    });

    // Obter estatísticas
    const { count: total } = await supabase
      .from('ot_backups')
      .select('*', { count: 'exact', head: true });

    const { count: overdue } = await supabase
      .from('ot_backups')
      .select('*', { count: 'exact', head: true })
      .lt('next_backup_date', now.toISOString());

    return NextResponse.json({
      backups: backups || [],
      statistics: {
        total: total || 0,
        overdue: overdue || 0,
        due_soon: 0, // TODO: Calcular backups próximos do vencimento
      },
    });
  } catch (error: any) {
    console.error('Error fetching OT backups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OT backups', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ops/ot-backups
 * Cria um novo backup OT
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      asset_id,
      backup_type,
      backup_location,
      backup_method,
      frequency,
      next_backup_date,
      metadata 
    } = body;

    // Validações
    if (!asset_id) {
      return NextResponse.json(
        { error: 'asset_id is required' },
        { status: 400 }
      );
    }

    if (!backup_type || !['plc', 'rtu', 'hmi', 'scada', 'network_device', 'other'].includes(backup_type)) {
      return NextResponse.json(
        { error: 'Invalid backup_type. Must be: plc, rtu, hmi, scada, network_device, or other' },
        { status: 400 }
      );
    }

    // Criar backup
    const { data: backup, error: createError } = await supabase
      .from('ot_backups')
      .insert({
        asset_id: asset_id,
        backup_type: backup_type,
        backup_location: backup_location || null,
        backup_method: backup_method || null,
        frequency: frequency || null,
        next_backup_date: next_backup_date || null,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating OT backup:', createError);
      throw createError;
    }

    return NextResponse.json({
      backup: backup,
      message: 'OT backup created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating OT backup:', error);
    return NextResponse.json(
      { error: 'Failed to create OT backup', message: error.message },
      { status: 500 }
    );
  }
}

