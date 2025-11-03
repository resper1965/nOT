'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Activity, 
  AlertTriangle,
  Network,
  Database,
  Settings,
  ChevronRight,
  Building2,
  Settings2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import * as React from 'react';

// Dados do sistema ness. OT GRC
const company = {
  name: 'ness.',
  subtitle: 'OT GRC',
  plan: 'Enterprise'
};

// Menu principal
const navItems = [
  {
    title: 'Visão Geral',
    url: '/dashboard/overview',
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: '1. Normativa',
    url: '/dashboard/compliance',
    icon: FileText,
    badge: '0/50',
    badgeColor: 'text-red-500',
    items: [
      { title: 'Documentos Obrigatórios', url: '/dashboard/compliance/documents' },
      { title: 'Controles ONS', url: '/dashboard/compliance/ons' },
      { title: 'ANEEL RN 964', url: '/dashboard/compliance/aneel' },
      { title: 'Frameworks', url: '/dashboard/compliance/frameworks' },
    ]
  },
  {
    title: '2. Análise de Rede',
    url: '/dashboard/network',
    icon: Activity,
    badge: '14.6k',
    badgeColor: 'text-green-500',
    items: [
      { title: 'Assets & Inventário', url: '/dashboard/network/assets' },
      { title: 'Endereçamento IP (IPAM)', url: '/dashboard/network/ipam' },
      { title: 'VLANs & Segmentação L2', url: '/dashboard/network/vlans' },
      { title: 'Roteamento & L3', url: '/dashboard/network/routing' },
      { title: 'Topologia Visual', url: '/dashboard/network/topology' },
      { title: 'Network Health', url: '/dashboard/network/health' },
    ]
  },
  {
    title: '3. Adequação',
    url: '/dashboard/remediation',
    icon: AlertTriangle,
    badge: '6 gaps',
    badgeColor: 'text-red-500',
    items: [
      { title: 'Gap Analysis ONS', url: '/dashboard/remediation/gaps' },
      { title: 'Matriz de Riscos', url: '/dashboard/remediation/risks' },
      { title: 'Plano de Adequação', url: '/dashboard/remediation/plan' },
      { title: 'Timeline (90 dias)', url: '/dashboard/remediation/timeline' },
    ]
  },
  {
    title: 'Relatórios',
    url: '/dashboard/reports',
    icon: Database,
    items: [
      { title: 'Todos os Relatórios', url: '/dashboard/reports' },
      { title: 'Gerar Novo Relatório', url: '/dashboard/reports/generate' },
      { title: 'Histórico', url: '/dashboard/reports/history' },
    ]
  },
  {
    title: 'Configurações',
    url: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Administração',
    url: '#',
    icon: Settings2,
    items: [
      { title: 'pgAdmin (Banco de Dados)', url: '/admin/pgadmin' },
    ]
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

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

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Sidebar collapsible='icon'>
      {/* Header com logo ness. */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              asChild
            >
              <Link href='/dashboard'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-brand-cyan/10 border border-brand-cyan/20'>
                  <Shield className='size-5 text-brand-cyan' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='ness-wordmark text-lg font-medium'>
                    ness<span className='ness-wordmark-dot'>.</span>
                  </span>
                  <span className='text-xs text-gray-400'>OT GRC</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content com menu */}
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={pathname.startsWith(item.url)}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <item.icon className='size-4' />}
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className={`ml-auto text-xs ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className='ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span className='text-xs'>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon className='size-4' />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className={`ml-auto text-xs ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer com info do usuário e cliente */}
      <SidebarFooter>
        <SidebarMenu>
          {/* User Info */}
          {user && (
            <SidebarMenuItem className="border-t pt-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00ade8]/10 border border-[#00ade8]/20 text-sm font-semibold text-[#00ade8]">
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </SidebarMenuItem>
          )}
          
          {/* Client Info */}
          <SidebarMenuItem className="border-t pt-2">
            <div className='flex items-center gap-3 px-2 py-2'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20'>
                <Building2 className='size-4 text-purple-500' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold text-xs'>Sistema OT GRC</span>
                <span className='truncate text-[10px] text-muted-foreground'>
                  Setor Elétrico
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
