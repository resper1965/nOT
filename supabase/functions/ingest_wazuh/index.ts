// ============================================================================
// EDGE FUNCTION: ingest_wazuh
// Sistema: ness. OT GRC
// Data: 2025-01-04
// Versão: 1.0
// ============================================================================
// Recebe eventos do Wazuh via Shuffle e armazena em integration.events
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WazuhEvent {
  tenant_id: string;
  source: string;
  category: string;
  asset_ref?: string;
  payload: {
    id?: string;
    timestamp?: string;
    agent?: {
      id?: string;
      name?: string;
      ip?: string;
    };
    rule?: {
      id?: number;
      description?: string;
      level?: number;
      mitre?: {
        technique?: string;
        tactic?: string;
      };
    };
    data?: Record<string, unknown>;
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
    const body: WazuhEvent = await req.json();
    const { tenant_id, source, category, asset_ref, payload } = body;

    // Validar campos obrigatórios
    if (!tenant_id || !source || !category || !payload) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tenant_id, source, category, payload" }),
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
      // Source não existe, criar
      const { data: newSource, error: createError } = await supabase
        .from("integration.sources")
        .insert({
          tenant_id,
          code: source,
          source_type: "wazuh",
          description: `Wazuh source: ${source}`,
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

    // Normalizar evento Wazuh
    const normalizedPayload = {
      wazuh_id: payload.id,
      timestamp: payload.timestamp || new Date().toISOString(),
      agent: payload.agent,
      rule: payload.rule,
      data: payload.data,
      ...payload,
    };

    // Determinar severity baseado no level da regra
    let severity = "info";
    if (payload.rule?.level) {
      if (payload.rule.level >= 12) severity = "critical";
      else if (payload.rule.level >= 8) severity = "high";
      else if (payload.rule.level >= 5) severity = "medium";
      else severity = "low";
    }

    // Determinar asset_ref se não fornecido
    const finalAssetRef = asset_ref || payload.agent?.ip || payload.agent?.name || null;

    // Inserir evento
    const { data: eventData, error: eventError } = await supabase
      .from("integration.events")
      .insert({
        tenant_id,
        source_id: sourceData.id,
        category: category || "security",
        event_type: "alert",
        asset_ref: finalAssetRef,
        severity,
        payload: normalizedPayload,
        occurred_at: payload.timestamp || new Date().toISOString(),
        metadata: {
          source_type: "wazuh",
          rule_id: payload.rule?.id,
          rule_level: payload.rule?.level,
          mitre_technique: payload.rule?.mitre?.technique,
          mitre_tactic: payload.rule?.mitre?.tactic,
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

    // Se evento crítico, disparar avaliação IA assíncrona
    if (severity === "critical") {
      // Disparar avaliação IA em background (não bloquear resposta)
      fetch(`${supabaseUrl}/functions/v1/agent-evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          tenant_id,
          scope: "event",
          scope_id: eventData.id,
          event_ids: [eventData.id],
        }),
      }).catch((err) => {
        console.error("Failed to trigger AI evaluation:", err);
      });
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        event_id: eventData.id,
        severity,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing Wazuh event:", error);
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

