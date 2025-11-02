"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  FileText,
  Activity,
  AlertTriangle,
  Database,
  Settings,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import * as React from "react";

// Menu principal TBE-OT
const navItems = [
  {
    title: "Visão Geral",
    url: "/dashboard/overview",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "1. Normativa",
    url: "/dashboard/compliance",
    icon: FileText,
    badge: "0/50",
    badgeColor: "text-red-500",
    items: [
      { title: "Documentos Obrigatórios", url: "/dashboard/compliance/documents" },
      { title: "Controles ONS", url: "/dashboard/compliance/ons" },
      { title: "ANEEL RN 964", url: "/dashboard/compliance/aneel" },
      { title: "Frameworks", url: "/dashboard/compliance/frameworks" },
    ],
  },
  {
    title: "2. Análise de Rede",
    url: "/dashboard/network",
    icon: Activity,
    badge: "14.6k",
    badgeColor: "text-green-500",
    items: [
      { title: "Assets & Inventário", url: "/dashboard/network/assets" },
      { title: "Endereçamento IP (IPAM)", url: "/dashboard/network/ipam" },
      { title: "VLANs & Segmentação L2", url: "/dashboard/network/vlans" },
      { title: "Roteamento & L3", url: "/dashboard/network/routing" },
      { title: "Topologia Visual", url: "/dashboard/network/topology" },
      { title: "Network Health", url: "/dashboard/network/health" },
    ],
  },
  {
    title: "3. Adequação",
    url: "/dashboard/remediation",
    icon: AlertTriangle,
    badge: "6 gaps",
    badgeColor: "text-red-500",
    items: [
      { title: "Gap Analysis ONS", url: "/dashboard/remediation/gaps" },
      { title: "Matriz de Riscos", url: "/dashboard/remediation/risks" },
      { title: "Plano de Adequação", url: "/dashboard/remediation/plan" },
      { title: "Timeline (90 dias)", url: "/dashboard/remediation/timeline" },
    ],
  },
  {
    title: "Relatórios",
    url: "/dashboard/reports",
    icon: Database,
    items: [
      { title: "Todos os Relatórios", url: "/dashboard/reports" },
      { title: "Gerar Novo Relatório", url: "/dashboard/reports/generate" },
      { title: "Histórico", url: "/dashboard/reports/history" },
    ],
  },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Administração",
    url: "#",
    icon: Settings2,
    items: [
      { title: "pgAdmin (Banco de Dados)", url: "/admin/pgadmin" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    // Obter usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Expandir itens ativos por padrão
    const activeItems = navItems
      .filter((item) => pathname.startsWith(item.url))
      .map((item) => item.title);
    setExpandedItems(activeItems);

    return () => subscription.unsubscribe();
  }, [pathname]);

  const isActive = (url: string) => {
    if (url === "#") return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Header com logo ness. */}
        <div className="flex h-14 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-brand-cyan/10 border border-brand-cyan/20">
              <Shield className="size-5 text-brand-cyan" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold ness-wordmark">
                ness<span className="text-[#00ADE8]">.</span>
              </span>
              <span className="text-xs text-muted-foreground">OT GRC</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              const hasSubItems = item.items && item.items.length > 0;
              const isExpanded = expandedItems.includes(item.title);

              return (
                <div key={item.title}>
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className={cn("text-xs", item.badgeColor)}>
                            {item.badge}
                          </span>
                        )}
                        <span
                          className={cn(
                            "transition-transform",
                            isExpanded ? "rotate-90" : ""
                          )}
                        >
                          ▶
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.items?.map((subItem) => {
                            const subActive = isActive(subItem.url);
                            return (
                              <Link
                                key={subItem.url}
                                href={subItem.url}
                                className={cn(
                                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                                  subActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                {subItem.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className={cn("text-xs", item.badgeColor)}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer com info do usuário */}
        {user && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00ade8]/10 border border-[#00ade8]/20 text-sm font-semibold text-[#00ade8]">
                {user.user_metadata?.full_name?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">
                  {user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    "Usuário"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

