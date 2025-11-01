'use client';

// Locale Switcher Component
// For switching between languages (pt/en/es)

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

// Locale configuration
const locales = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
] as const;

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<'pt' | 'en' | 'es'>('pt');

  // Extract current locale from pathname
  const currentLocaleFromPath = pathname.split('/')[1] as 'pt' | 'en' | 'es' | undefined;
  const locale = currentLocaleFromPath && ['pt', 'en', 'es'].includes(currentLocaleFromPath)
    ? currentLocaleFromPath
    : 'pt';

  const handleLocaleChange = (newLocale: 'pt' | 'en' | 'es') => {
    setCurrentLocale(newLocale);
    
    // Replace locale in pathname
    const pathWithoutLocale = pathname.replace(/^\/(pt|en|es)/, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
    router.refresh();
  };

  const currentLocaleInfo = locales.find(l => l.code === locale) || locales[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((localeOption) => (
          <DropdownMenuItem
            key={localeOption.code}
            onClick={() => handleLocaleChange(localeOption.code)}
            className={locale === localeOption.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{localeOption.flag}</span>
            <span>{localeOption.name}</span>
            {locale === localeOption.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

