import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { ThemeSelector } from '../theme-selector';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        {/* Sistema info */}
        <div className='hidden lg:flex items-center gap-2 text-sm text-muted-foreground mr-4'>
          <div className='w-2 h-2 rounded-full bg-green-500'></div>
          <span>Sistema Operacional</span>
        </div>
        
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        
        {/* Clerk Authentication */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className='px-3 py-1.5 text-sm rounded-md hover:bg-gray-800 transition-colors'>
              Entrar
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className='px-3 py-1.5 text-sm rounded-md bg-brand-cyan text-gray-950 hover:bg-brand-cyan/90 transition-colors font-medium'>
              Cadastrar
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8'
              }
            }}
          />
        </SignedIn>
        
        <ModeToggle />
        <ThemeSelector />
      </div>
    </header>
  );
}
