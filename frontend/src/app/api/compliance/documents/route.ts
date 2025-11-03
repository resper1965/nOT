// Compliance Documents API Route
// GET /api/compliance/documents

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get all compliance documents
    // Note: Supabase PostgREST requires schema to be exposed or use views in public schema
    // For now, we'll access the table directly - if it fails, we'll need to create views
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      // If table not found, try with schema prefix (may not work with PostgREST)
      console.error('Error accessing documents table:', error);
      throw error;
    }
    
    // Get statistics
    const { count: total } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });
    
    const { count: approved } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');
    
    const { count: pending } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    return NextResponse.json({
      documents: documents || [],
      statistics: {
        total: total || 0,
        approved: approved || 0,
        pending: pending || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching compliance documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance documents', message: error.message },
      { status: 500 }
    );
  }
}

