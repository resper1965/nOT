// ============================================================================
// EDGE FUNCTION: ingest_zabbix
// Sistema: ness. OT GRC
// Data: 2025-01-04
// Versão: 1.0
// ============================================================================
// Recebe métricas de disponibilidade do Zabbix e atualiza conformidade OPS-05
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ZabbixEvent {
  tenant_id: string;
  source: string;
  category: string;
  asset_ref?: string;
  payload: {
    host?: string;
    hostname?: string;
    ip?: string;
    item?: string;
    value?: number;
    availability?: number;
    uptime?: number;
    timestamp?: string;
    [key: string]: unknown;
  };
}

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
    const body: ZabbixEvent = await req.json();
    const { tenant_id, source, category, asset_ref, payload } = body;

    // Validar campos obrigatórios
    if (!tenant_id || !source || !payload) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tenant_id, source, payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Buscar ou criar source
    let { data: sourceData, error: sourceError } = await supabase
      .from("integration.sources")
      .select("id")
      .eq("code", source)
      .eq("tenant_id", tenant_id)
      .single();

    if (sourceError && sourceError.code === "PGRST116") {
      const { data: newSource, error: createError } = await supabase
        .from("integration.sources")
        .insert({
          tenant_id,
          code: source,
          source_type: "zabbix",
          description: `Zabbix source: ${source}`,
          is_active: true,
        })
        .select("id")
        .single();

      if (createError) {
        throw createError;
      }
      sourceData = newSource;
    } else if (sourceError) {
      throw sourceError;
    }

    // Normalizar evento Zabbix
    const normalizedPayload = {
      host: payload.host || payload.hostname,
      ip: payload.ip,
      item: payload.item,
      value: payload.value,
      availability: payload.availability,
      uptime: payload.uptime,
      ...payload,
    };

    // Determinar severity baseado na disponibilidade
    let severity = "info";
    const availability = payload.availability || payload.value || 100;
    if (availability < 99.9) {
      severity = "critical";
    } else if (availability < 99.95) {
      severity = "high";
    } else if (availability < 99.99) {
      severity = "medium";
    }

    // Determinar asset_ref
    const finalAssetRef = asset_ref || payload.host || payload.hostname || payload.ip || null;

    // Inserir evento
    const { data: eventData, error: eventError } = await supabase
      .from("integration.events")
      .insert({
        tenant_id,
        source_id: sourceData.id,
        category: category || "availability",
        event_type: "metric",
        asset_ref: finalAssetRef,
        severity,
        payload: normalizedPayload,
        occurred_at: payload.timestamp || new Date().toISOString(),
        metadata: {
          source_type: "zabbix",
          availability: availability,
        },
      })
      .select("id")
      .single();

    if (eventError) {
      throw eventError;
    }

    // Atualizar last_sync_at da source
    await supabase
      .from("integration.sources")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", sourceData.id);

    // Atualizar conformidade OPS-05 (continuidade operacional) se disponibilidade < 99.9%
    if (availability < 99.9) {
      // Buscar controle OPS-05 (Continuidade Operacional) do framework ANEEL
      const { data: controlData } = await supabase
        .from("compliance.controls")
        .select("id, control_code")
        .eq("control_code", "OPS-05")
        .single();

      if (controlData) {
        // Buscar avaliação ativa
        const { data: assessmentData } = await supabase
          .from("compliance.assessments")
          .select("id")
          .eq("framework_id", (await supabase
            .from("compliance.frameworks")
            .select("id")
            .eq("framework_name", "ANEEL RN 964/2021")
            .single()).data?.id)
          .order("assessment_date", { ascending: false })
          .limit(1)
          .single();

        if (assessmentData) {
          // Atualizar control_result para non_compliant
          await supabase
            .from("compliance.control_results")
            .upsert({
              assessment_id: assessmentData.id,
              control_id: controlData.id,
              status: "non_compliant",
              evidence: `Disponibilidade abaixo de 99.9%: ${availability}%`,
              gap_description: `Sistema ${payload.host || payload.hostname} com disponibilidade de ${availability}%`,
              metadata: {
                availability: availability,
                event_id: eventData.id,
                updated_by: "system",
                updated_at: new Date().toISOString(),
              },
            }, {
              onConflict: "assessment_id,control_id",
            });
        }
      }
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        event_id: eventData.id,
        availability: availability,
        compliance_updated: availability < 99.9,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing Zabbix event:", error);
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

