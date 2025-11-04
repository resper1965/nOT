// ============================================================================
// EDGE FUNCTION: ingest_rmm
// Sistema: ness. OT GRC
// Data: 2025-01-04
// Versão: 1.0
// ============================================================================
// Recebe patch/inventário de RMMs (Datto, Atera, SuperOps) e atualiza conformidade ONS-08
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RMMEvent {
  tenant_id: string;
  source: string;
  source_type: "datto" | "atera" | "superops";
  category: "patch" | "inventory";
  asset_ref?: string;
  payload: {
    device_id?: string;
    device_name?: string;
    ip?: string;
    hostname?: string;
    os?: string;
    os_version?: string;
    patches?: Array<{
      id?: string;
      name?: string;
      severity?: string;
      installed?: boolean;
      date?: string;
    }>;
    inventory?: Record<string, unknown>;
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
    const body: RMMEvent = await req.json();
    const { tenant_id, source, source_type, category, asset_ref, payload } = body;

    // Validar campos obrigatórios
    if (!tenant_id || !source || !source_type || !category || !payload) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tenant_id, source, source_type, category, payload" }),
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
          source_type: source_type,
          description: `${source_type} source: ${source}`,
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

    // Normalizar evento RMM
    const normalizedPayload = {
      device_id: payload.device_id,
      device_name: payload.device_name,
      ip: payload.ip,
      hostname: payload.hostname,
      os: payload.os,
      os_version: payload.os_version,
      patches: payload.patches,
      inventory: payload.inventory,
      ...payload,
    };

    // Determinar severity baseado em patches pendentes
    let severity = "info";
    if (category === "patch") {
      const pendingPatches = payload.patches?.filter((p: any) => !p.installed && p.severity === "critical") || [];
      if (pendingPatches.length > 0) {
        severity = "high";
      }
    }

    // Determinar asset_ref
    const finalAssetRef = asset_ref || payload.device_name || payload.hostname || payload.ip || payload.device_id || null;

    // Inserir evento
    const { data: eventData, error: eventError } = await supabase
      .from("integration.events")
      .insert({
        tenant_id,
        source_id: sourceData.id,
        category,
        event_type: category === "patch" ? "change" : "discovery",
        asset_ref: finalAssetRef,
        severity,
        payload: normalizedPayload,
        occurred_at: payload.timestamp || new Date().toISOString(),
        metadata: {
          source_type: source_type,
          device_id: payload.device_id,
        },
      })
      .select("id")
      .single();

    if (eventError) {
      throw eventError;
    }

    // Atualizar ou criar asset
    if (finalAssetRef) {
      const { data: assetData } = await supabase
        .from("security.assets")
        .select("id")
        .eq("tenant_id", tenant_id)
        .or(`ip_address.eq.${payload.ip},hostname.eq.${payload.hostname || payload.device_name}`)
        .single();

      if (assetData) {
        // Atualizar asset existente
        await supabase
          .from("security.assets")
          .update({
            ext_refs: {
              ...(assetData.ext_refs || {}),
              [`${source_type}_device_id`]: payload.device_id,
              [`${source_type}_last_sync`]: new Date().toISOString(),
            },
            metadata: {
              os: payload.os,
              os_version: payload.os_version,
              last_inventory: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", assetData.id);
      } else {
        // Criar novo asset
        await supabase
          .from("security.assets")
          .insert({
            tenant_id,
            name: payload.device_name || payload.hostname || finalAssetRef,
            asset_type: "server",
            zone: "IT", // Default, pode ser ajustado
            criticality: "medium", // Default
            ip_address: payload.ip,
            hostname: payload.hostname || payload.device_name,
            ext_refs: {
              [`${source_type}_device_id`]: payload.device_id,
              [`${source_type}_last_sync`]: new Date().toISOString(),
            },
            metadata: {
              os: payload.os,
              os_version: payload.os_version,
              source_type: source_type,
            },
          });
      }
    }

    // Atualizar last_sync_at da source
    await supabase
      .from("integration.sources")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", sourceData.id);

    // Atualizar conformidade ONS-08 (gestão de patches) se houver patches pendentes
    if (category === "patch") {
      const pendingPatches = payload.patches?.filter((p: any) => !p.installed) || [];
      if (pendingPatches.length > 0) {
        // Buscar controle ONS-08 do framework ONS
        const { data: controlData } = await supabase
          .from("compliance.controls")
          .select("id, control_code")
          .eq("control_code", "ONS-08")
          .single();

        if (controlData) {
          // Buscar avaliação ativa
          const { data: assessmentData } = await supabase
            .from("compliance.assessments")
            .select("id")
            .eq("framework_id", (await supabase
              .from("compliance.frameworks")
              .select("id")
              .eq("framework_name", "ONS RO-CB.BR.01 Rev. 02")
              .single()).data?.id)
            .order("assessment_date", { ascending: false })
            .limit(1)
            .single();

          if (assessmentData) {
            // Atualizar control_result
            await supabase
              .from("compliance.control_results")
              .upsert({
                assessment_id: assessmentData.id,
                control_id: controlData.id,
                status: pendingPatches.length > 5 ? "non_compliant" : "partially_compliant",
                evidence: `${pendingPatches.length} patches pendentes no dispositivo ${payload.device_name || payload.hostname}`,
                gap_description: `Patches pendentes: ${pendingPatches.map((p: any) => p.name).join(", ")}`,
                metadata: {
                  pending_patches_count: pendingPatches.length,
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
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        event_id: eventData.id,
        category,
        compliance_updated: category === "patch" && (payload.patches?.filter((p: any) => !p.installed).length || 0) > 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing RMM event:", error);
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

