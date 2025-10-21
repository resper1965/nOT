// Sentry disabled for ness. OT GRC
// import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Sentry disabled - no instrumentation
  console.log('[ness. OT GRC] Instrumentation disabled for performance');
}

export const onRequestError = () => {};
