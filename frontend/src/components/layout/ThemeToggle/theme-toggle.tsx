'use client';

import * as React from 'react';
import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  // Theme is always dark - this is just a placeholder
  return (
    <Button variant="outline" size="icon" disabled title="Tema fixo: escuro">
      <Moon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Tema escuro</span>
    </Button>
  );
}
