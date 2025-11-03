// Assets API Route
// GET /api/assets?limit=20&offset=0

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const supabase = createServerClient();
    
    // Get assets with pagination
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    // Get total count
    const { count } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      assets: assets || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets', message: error.message },
      { status: 500 }
    );
  }
}

