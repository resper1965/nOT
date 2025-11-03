// ness. Branding Utilities
// Helper functions for brand consistency

import { brandColors } from './colors';

/**
 * Get brand color by name
 */
export function getBrandColor(color: 'cyan' | 'cyan-dark' | 'cyan-light'): string {
  switch (color) {
    case 'cyan':
      return brandColors.cyan.base;
    case 'cyan-dark':
      return brandColors.cyan.dark;
    case 'cyan-light':
      return brandColors.cyan.light;
    default:
      return brandColors.cyan.base;
  }
}

/**
 * Get grayscale color by shade
 */
export function getGrayColor(shade: 950 | 900 | 850 | 800 | 50): string {
  return brandColors.gray[shade];
}

/**
 * Generate wordmark with colored dot
 */
export function formatWordmark(text: string = 'ness', dotColor: string = '#00ADE8'): string {
  return `${text}<span style="color: ${dotColor}">.</span>`;
}

/**
 * Brand configuration
 */
export const brandConfig = {
  name: 'ness.',
  product: 'OT GRC',
  tagline: {
    pt: 'Governança, Risco e Conformidade para Redes OT',
    en: 'Governance, Risk & Compliance for OT Networks',
    es: 'Gobernanza, Riesgo y Cumplimiento para Redes OT',
  },
  client: {
    segment: {
      pt: 'Setor Elétrico',
      en: 'Electric Sector',
      es: 'Sector Eléctrico',
    },
  },
} as const;

