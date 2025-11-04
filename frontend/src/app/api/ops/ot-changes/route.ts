// OT Changes API Route
// GET /api/ops/ot-changes
// POST /api/ops/ot-changes

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * GET /api/ops/ot-changes
 * Lista todas as mudanças OT
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
    const status = searchParams.get('status');
    const changeType = searchParams.get('change_type');

    // Construir query
    let query = supabase
      .from('ot_changes')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (assetId) {
      query = query.eq('asset_id', assetId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (changeType) {
      query = query.eq('change_type', changeType);
    }

    const { data: changes, error } = await query;

    if (error) {
      console.error('Error fetching OT changes:', error);
      throw error;
    }

    // Obter estatísticas
    const { count: total } = await supabase
      .from('ot_changes')
      .select('*', { count: 'exact', head: true });

    const { count: requested } = await supabase
      .from('ot_changes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'requested');

    const { count: approved } = await supabase
      .from('ot_changes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: inProgress } = await supabase
      .from('ot_changes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_progress');

    return NextResponse.json({
      changes: changes || [],
      statistics: {
        total: total || 0,
        requested: requested || 0,
        approved: approved || 0,
        in_progress: inProgress || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching OT changes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OT changes', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ops/ot-changes
 * Cria uma nova mudança OT
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
      change_title,
      description,
      asset_id,
      change_type,
      priority,
      metadata 
    } = body;

    // Validações
    if (!change_title || change_title.trim().length === 0) {
      return NextResponse.json(
        { error: 'change_title is required' },
        { status: 400 }
      );
    }

    if (change_type && !['hardware', 'software', 'configuration', 'network', 'other'].includes(change_type)) {
      return NextResponse.json(
        { error: 'Invalid change_type. Must be: hardware, software, configuration, network, or other' },
        { status: 400 }
      );
    }

    if (priority && !['low', 'medium', 'high', 'critical'].includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be: low, medium, high, or critical' },
        { status: 400 }
      );
    }

    // Gerar número único de mudança (CHG-YYYYMMDD-XXX)
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase().substring(0, 3);
    const changeNumber = `CHG-${dateStr}-${randomStr}`;

    // Criar mudança
    const { data: change, error: createError } = await supabase
      .from('ot_changes')
      .insert({
        change_number: changeNumber,
        change_title: change_title.trim(),
        description: description || null,
        asset_id: asset_id || null,
        change_type: change_type || null,
        priority: priority || 'medium',
        status: 'requested',
        requested_by: user.id,
        requested_at: new Date().toISOString(),
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating OT change:', createError);
      throw createError;
    }

    return NextResponse.json({
      change: change,
      message: 'OT change created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating OT change:', error);
    return NextResponse.json(
      { error: 'Failed to create OT change', message: error.message },
      { status: 500 }
    );
  }
}

