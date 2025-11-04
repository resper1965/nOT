// Framework Compliance KPI API Route
// GET /api/kpis/framework-compliance
// Retorna conformidade por framework

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/kpis/framework-compliance
 * Retorna conformidade detalhada por framework
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: compliance, error } = await supabase
      .from('v_kpi_framework_compliance')
      .select('*')
      .order('compliance_percentage', { ascending: false });

    if (error) {
      console.error('Error fetching framework compliance:', error);
      throw error;
    }

    return NextResponse.json({
      compliance: compliance || [],
    });
  } catch (error: any) {
    console.error('Error fetching framework compliance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch framework compliance', message: error.message },
      { status: 500 }
    );
  }
}

