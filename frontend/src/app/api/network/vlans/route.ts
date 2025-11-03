// VLANs API Route
// GET /api/network/vlans

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get all VLANs
    const { data: vlans, error } = await supabase
      .from('topology.vlans')
      .select('*')
      .order('vlan_id');
    
    if (error) throw error;
    
    // Get count
    const { count } = await supabase
      .from('topology.vlans')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      vlans: vlans || [],
      count: count || 0,
    });
  } catch (error: any) {
    console.error('Error fetching VLANs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VLANs', message: error.message },
      { status: 500 }
    );
  }
}

