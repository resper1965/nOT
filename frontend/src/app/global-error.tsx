'use client';

import NextError from 'next/error';

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string };
}) {
  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Global error:', error);
  }

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
