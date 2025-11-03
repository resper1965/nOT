// API Route for Compliance Frameworks
// Returns frameworks from compliance.frameworks table
import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();

    // Get frameworks
    const { data: frameworks, error: frameworksError } = await supabase
      .from('compliance.frameworks')
      .select('*')
      .order('framework_name', { ascending: true });

    if (frameworksError) throw frameworksError;

    // Get controls count per framework
    const { data: controls, error: controlsError } = await supabase
      .from('compliance.controls')
      .select('framework_id');

    if (controlsError) throw controlsError;

    // Count controls per framework
    const controlsCount = new Map<string, number>();
    controls?.forEach((control) => {
      if (control.framework_id) {
        controlsCount.set(control.framework_id, (controlsCount.get(control.framework_id) || 0) + 1);
      }
    });

    // Get assessments to determine compliance status
    const { data: assessments, error: assessmentsError } = await supabase
      .from('compliance.assessments')
      .select('framework_id, compliance_percentage, status');

    if (assessmentsError) throw assessmentsError;

    // Map framework assessments
    const frameworkAssessments = new Map<string, any>();
    assessments?.forEach((assessment) => {
      if (assessment.framework_id) {
        frameworkAssessments.set(assessment.framework_id, assessment);
      }
    });

    // Map frameworks with metadata
    const mappedFrameworks = frameworks?.map((framework) => {
      const assessment = frameworkAssessments.get(framework.id);
      const controlCount = controlsCount.get(framework.id) || 0;
      const compliancePercent = assessment?.compliance_percentage || 0;
      
      // Determine status
      let status = 'missing';
      if (compliancePercent >= 100) status = 'approved';
      else if (compliancePercent > 0) status = 'partial';
      else status = 'missing';

      return {
        id: framework.id,
        name: framework.framework_name,
        description: framework.description || '',
        status,
        compliance: Math.round(compliancePercent),
        requirements: controlCount,
        category: 'Internacional', // Default, can be enhanced with framework metadata
        version: framework.version || '',
        metadata: framework.metadata || {},
      };
    }) || [];

    // Calculate stats
    const stats = {
      total: mappedFrameworks.length,
      implemented: mappedFrameworks.filter((f) => f.status === 'approved').length,
      partial: mappedFrameworks.filter((f) => f.status === 'partial').length,
      missing: mappedFrameworks.filter((f) => f.status === 'missing').length,
    };

    return NextResponse.json({
      frameworks: mappedFrameworks,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching frameworks:', error);
    return NextResponse.json(
      {
        frameworks: [],
        stats: {
          total: 0,
          implemented: 0,
          partial: 0,
          missing: 0,
        },
        error: error.message,
      },
      { status: 500 }
    );
  }
}

