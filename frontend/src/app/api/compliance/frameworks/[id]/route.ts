// API Route for Framework Details
// Returns framework details with all its controls
import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/supabase-admin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const frameworkId = params.id;

    // Get framework details
    const { data: framework, error: frameworkError } = await supabase
      .from('frameworks')
      .select('*')
      .eq('id', frameworkId)
      .single();

    if (frameworkError) throw frameworkError;
    if (!framework) {
      return NextResponse.json(
        { error: 'Framework not found' },
        { status: 404 }
      );
    }

    // Get all controls for this framework
    const { data: controls, error: controlsError } = await supabase
      .from('controls')
      .select('*')
      .eq('framework_id', frameworkId)
      .order('control_code', { ascending: true });

    if (controlsError) throw controlsError;

    // Get assessments for this framework
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('framework_id', frameworkId)
      .order('assessment_date', { ascending: false })
      .limit(1);

    const latestAssessment = assessments?.[0] || null;

    // Get control results if assessment exists
    let controlResults: any[] = [];
    if (latestAssessment) {
      const { data: results, error: resultsError } = await supabase
        .from('control_results')
        .select('*')
        .eq('assessment_id', latestAssessment.id);

      if (!resultsError && results) {
        controlResults = results;
      }
    }

    // Map controls with assessment results
    const controlsWithStatus = controls?.map((control) => {
      const result = controlResults.find((r) => r.control_id === control.id);
      return {
        ...control,
        assessment_status: result?.status || null,
        evidence: result?.evidence || null,
        gap_description: result?.gap_description || null,
        remediation_plan: result?.remediation_plan || null,
        target_date: result?.target_date || null,
      };
    }) || [];

    // Calculate statistics
    const totalControls = controls?.length || 0;
    const assessedControls = controlResults.length;
    const compliantControls = controlResults.filter((r) => r.status === 'compliant').length;
    const partiallyCompliant = controlResults.filter((r) => r.status === 'partially_compliant').length;
    const nonCompliant = controlResults.filter((r) => r.status === 'non_compliant').length;
    const notApplicable = controlResults.filter((r) => r.status === 'not_applicable').length;

    // Group controls by category/function (from metadata)
    const controlsByCategory = new Map<string, any[]>();
    controlsWithStatus.forEach((control) => {
      const category = 
        control.metadata?.function || 
        control.metadata?.domain_name || 
        control.metadata?.category_name || 
        control.metadata?.category ||
        'Outros';
      
      if (!controlsByCategory.has(category)) {
        controlsByCategory.set(category, []);
      }
      controlsByCategory.get(category)!.push(control);
    });

    return NextResponse.json({
      framework: {
        ...framework,
        total_controls: totalControls,
      },
      controls: controlsWithStatus,
      controls_by_category: Object.fromEntries(controlsByCategory),
      latest_assessment: latestAssessment,
      statistics: {
        total: totalControls,
        assessed: assessedControls,
        compliant: compliantControls,
        partially_compliant: partiallyCompliant,
        non_compliant: nonCompliant,
        not_applicable: notApplicable,
        compliance_rate: totalControls > 0 
          ? Math.round((compliantControls / totalControls) * 100)
          : 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching framework details:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch framework details',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
