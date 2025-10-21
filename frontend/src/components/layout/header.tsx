import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import { UserButton } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-3 px-4'>
        {/* Sistema info */}
        <div className='hidden lg:flex items-center gap-2 text-sm text-muted-foreground'>
          <div className='w-2 h-2 rounded-full bg-green-500'></div>
          <span className="text-xs">Operacional</span>
        </div>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#00ade8]" />
        </Button>
        
        {/* User Button from Clerk */}
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
              userButtonPopoverCard: "shadow-xl border border-border/50",
              userButtonPopoverActionButton: "hover:bg-accent",
              userButtonPopoverActionButtonText: "text-sm",
              userButtonPopoverFooter: "hidden"
            }
          }}
          afterSignOutUrl="/sign-in"
        />
      </div>
    </header>
  );
}
