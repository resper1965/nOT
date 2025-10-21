'use client';

import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Simple wrapper - theme is always dark
  return <>{children}</>;
}
