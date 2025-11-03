// Health check endpoint for ness. OT GRC
// GET /api/health

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    // Test Supabase connection
    const supabase = createServerClient();
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('security.assets')
      .select('id')
      .limit(1);
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: error ? 'disconnected' : 'connected',
        supabase: error ? 'error' : 'ok',
      },
      version: '1.0.0',
      product: 'ness. OT GRC',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        database: 'error',
        supabase: 'error',
      },
    }, { status: 500 });
  }
}

