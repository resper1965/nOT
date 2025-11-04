// ============================================================================
// EDGE FUNCTION: agent_evaluate
// Sistema: ness. OT GRC
// Data: 2025-01-04
// Versão: 1.0
// ============================================================================
// Agente de IA de conformidade - Analisa eventos e gera avaliações automáticas
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EvaluateRequest {
  tenant_id: string;
  scope: "control" | "assessment" | "incident" | "event" | "risk";
  scope_id?: string;
  event_ids?: string[];
  context?: {
    recent_events_count?: number;
    time_window_hours?: number;
    include_mitre?: boolean;
  };
}

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-4o";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse do body
    const body: EvaluateRequest = await req.json();
    const { tenant_id, scope, scope_id, event_ids, context } = body;

    // Validar campos obrigatórios
    if (!tenant_id || !scope) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tenant_id, scope" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Coletar eventos relevantes
    let events: any[] = [];
    
    if (event_ids && event_ids.length > 0) {
      // Usar eventos específicos fornecidos
      const { data: eventsData, error: eventsError } = await supabase
        .from("integration.events")
        .select("id, category, severity, payload, occurred_at")
        .in("id", event_ids)
        .eq("tenant_id", tenant_id)
        .order("occurred_at", { ascending: false });

      if (eventsError) {
        throw eventsError;
      }
      events = eventsData || [];
    } else {
      // Buscar eventos recentes
      const timeWindow = context?.time_window_hours || 24;
      const limit = context?.recent_events_count || 50;

      const { data: eventsData, error: eventsError } = await supabase
        .from("integration.events")
        .select("id, category, severity, payload, occurred_at")
        .eq("tenant_id", tenant_id)
        .gte("occurred_at", new Date(Date.now() - timeWindow * 60 * 60 * 1000).toISOString())
        .order("occurred_at", { ascending: false })
        .limit(limit);

      if (eventsError) {
        throw eventsError;
      }
      events = eventsData || [];
    }

    // Coletar contexto adicional baseado no scope
    let additionalContext: any = {};
    
    if (scope === "control" && scope_id) {
      // Buscar informações do controle
      const { data: controlData } = await supabase
        .from("compliance.controls")
        .select("control_code, control_title, description, metadata")
        .eq("id", scope_id)
        .single();

      if (controlData) {
        additionalContext.control = controlData;
      }

      // Buscar histórico de conformidade
      const { data: complianceHistory } = await supabase
        .from("compliance.control_results")
        .select("status, evidence, gap_description, updated_at")
        .eq("control_id", scope_id)
        .order("updated_at", { ascending: false })
        .limit(5);

      if (complianceHistory) {
        additionalContext.compliance_history = complianceHistory;
      }
    }

    // Construir prompt para IA
    const prompt = `Você é um especialista em conformidade regulatória OT/IT para o setor elétrico brasileiro.

Contexto:
${scope === "control" && additionalContext.control ? `
- Framework: ANEEL RN 964/2021 / ONS RO-CB.BR.01
- Controle: ${additionalContext.control.control_code} - ${additionalContext.control.control_title}
- Descrição: ${additionalContext.control.description || "N/A"}
` : ""}
${additionalContext.compliance_history ? `
- Histórico de Conformidade:
${JSON.stringify(additionalContext.compliance_history, null, 2)}
` : ""}
- Eventos Recentes (${events.length} eventos):
${JSON.stringify(events.map(e => ({
  id: e.id,
  category: e.category,
  severity: e.severity,
  occurred_at: e.occurred_at,
  summary: e.payload?.rule?.description || e.payload?.description || "Evento de segurança",
  mitre_technique: e.payload?.rule?.mitre?.technique || e.metadata?.mitre_technique,
  mitre_tactic: e.payload?.rule?.mitre?.tactic || e.metadata?.mitre_tactic,
})), null, 2)}

Analise:
1. O status atual de conformidade ${scope === "control" ? "do controle" : "do item"}
2. Riscos identificados baseados em MITRE ATT&CK
3. Violações potenciais ou confirmadas
4. Recomendações de ações corretivas

Responda em JSON estruturado:
{
  "conformity_status": "compliant" | "partially_compliant" | "non_compliant" | "not_applicable",
  "confidence": 0.0-1.0,
  "risk_level": "critical" | "high" | "medium" | "low",
  "mitre_techniques": ["T1001", "T1055"],
  "violations": [
    {
      "type": "regulatory" | "technical" | "operational",
      "description": "...",
      "severity": "critical" | "high" | "medium" | "low"
    }
  ],
  "recommendations": [
    {
      "action": "...",
      "priority": "critical" | "high" | "medium" | "low",
      "description": "...",
      "estimated_effort_hours": 10
    }
  ],
  "evidence_summary": "..."
}`;

    // Chamar OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "Você é um especialista em conformidade regulatória OT/IT. Responda sempre em JSON válido.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openaiResult = await openaiResponse.json();
    const aiContent = openaiResult.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No content from OpenAI");
    }

    // Parse do resultado JSON
    let aiResult: any;
    try {
      aiResult = JSON.parse(aiContent);
    } catch (e) {
      // Tentar extrair JSON do texto se houver markdown
      const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)\s*```/) || aiContent.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Calcular confiança baseada na qualidade da resposta
    const confidence = aiResult.confidence || 0.8;

    // Armazenar resultado em compliance.ai_assessments
    const { data: assessmentData, error: assessmentError } = await supabase
      .from("compliance.ai_assessments")
      .insert({
        tenant_id,
        scope,
        scope_id: scope_id || null,
        assessment_type: "conformity",
        model_used: OPENAI_MODEL,
        result_json: aiResult,
        confidence: confidence,
        recommendations: aiResult.recommendations || [],
        evidence_event_ids: events.map(e => e.id),
        processed_by: "ai",
      })
      .select("id")
      .single();

    if (assessmentError) {
      throw assessmentError;
    }

    // Marcar eventos como processados
    if (events.length > 0) {
      await supabase
        .from("integration.events")
        .update({
          processed_at: new Date().toISOString(),
          processed_by: "ai",
        })
        .in("id", events.map(e => e.id));
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        assessment_id: assessmentData.id,
        confidence: confidence,
        result: aiResult,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in AI evaluation:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

