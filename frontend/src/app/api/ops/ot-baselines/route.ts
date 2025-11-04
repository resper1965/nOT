// OT Baselines API Route
// GET /api/ops/ot-baselines
// POST /api/ops/ot-baselines

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/ops/ot-baselines
 * Lista todos os baselines OT
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
    const isActive = searchParams.get('is_active');

    // Construir query
    let query = supabase
      .from('ot_baselines')
      .select('*')
      .order('baseline_date', { ascending: false });

    // Aplicar filtros
    if (assetId) {
      query = query.eq('asset_id', assetId);
    }
    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: baselines, error } = await query;

    if (error) {
      console.error('Error fetching OT baselines:', error);
      throw error;
    }

    // Obter estatísticas
    const { count: total } = await supabase
      .from('ot_baselines')
      .select('*', { count: 'exact', head: true });

    const { count: active } = await supabase
      .from('ot_baselines')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    return NextResponse.json({
      baselines: baselines || [],
      statistics: {
        total: total || 0,
        active: active || 0,
        inactive: (total || 0) - (active || 0),
      },
    });
  } catch (error: any) {
    console.error('Error fetching OT baselines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OT baselines', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ops/ot-baselines
 * Cria um novo baseline OT
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
      baseline_name,
      baseline_version,
      baseline_config,
      metadata 
    } = body;

    // Validações
    if (!asset_id) {
      return NextResponse.json(
        { error: 'asset_id is required' },
        { status: 400 }
      );
    }

    if (!baseline_name || baseline_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'baseline_name is required' },
        { status: 400 }
      );
    }

    // Gerar hash da configuração
    const configString = JSON.stringify(baseline_config || {});
    const baselineHash = crypto.createHash('sha256')
      .update(configString)
      .digest('hex');

    // Criar baseline
    const { data: baseline, error: createError } = await supabase
      .from('ot_baselines')
      .insert({
        asset_id: asset_id,
        baseline_name: baseline_name.trim(),
        baseline_version: baseline_version || null,
        baseline_config: baseline_config || {},
        baseline_hash: baselineHash,
        is_active: true,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating OT baseline:', createError);
      throw createError;
    }

    return NextResponse.json({
      baseline: baseline,
      message: 'OT baseline created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating OT baseline:', error);
    return NextResponse.json(
      { error: 'Failed to create OT baseline', message: error.message },
      { status: 500 }
    );
  }
}

