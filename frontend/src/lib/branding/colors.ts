// ness. Brand Colors Configuration
// Centralized color system for OT GRC

export const brandColors = {
  // Primary Brand Color
  cyan: {
    base: '#00ADE8',
    dark: '#0090C4',
    light: '#33BDEF',
  },
  // Grayscale (Cool Grays - Dark First)
  gray: {
    950: '#0B0C0E', // Background principal
    900: '#111317', // Surface elevada 1
    850: '#151820', // Surface elevada 2
    800: '#1B2030', // Surface elevada 3
    50: '#EEF1F6',  // Text
  },
} as const;

// CSS Variables mapping
export const cssVariables = {
  '--brand-cyan': brandColors.cyan.base,
  '--brand-cyan-dark': brandColors.cyan.dark,
  '--brand-cyan-light': brandColors.cyan.light,
  '--gray-950': brandColors.gray[950],
  '--gray-900': brandColors.gray[900],
  '--gray-850': brandColors.gray[850],
  '--gray-800': brandColors.gray[800],
  '--gray-50': brandColors.gray[50],
} as const;

// Tailwind color utilities
export const tailwindColors = {
  brand: {
    cyan: brandColors.cyan.base,
    'cyan-dark': brandColors.cyan.dark,
    'cyan-light': brandColors.cyan.light,
  },
  gray: {
    950: brandColors.gray[950],
    900: brandColors.gray[900],
    850: brandColors.gray[850],
    800: brandColors.gray[800],
    50: brandColors.gray[50],
  },
} as const;

