'use client';
import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </ActiveThemeProvider>
    </>
  );
}
