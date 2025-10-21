import React from 'react';
import { cn } from '@/lib/utils';

interface NessLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
};

export function NessLogo({ size = 'md', className, showText = true }: NessLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showText ? (
        <h1 className={cn('ness-wordmark font-medium', sizeClasses[size])}>
          ness<span className="ness-wordmark-dot">.</span>
        </h1>
      ) : (
        <div className={cn('flex items-center justify-center', sizeClasses[size])}>
          <span className="font-medium text-gray-50">n</span>
          <span className="ness-wordmark-dot">.</span>
        </div>
      )}
    </div>
  );
}

export function NessSecurityLogo({ size = 'md', className }: Omit<NessLogoProps, 'showText'>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h1 className={cn('ness-wordmark font-medium', sizeClasses[size])}>
        ness<span className="ness-wordmark-dot">.</span>
        <span className="text-gray-400 font-normal ml-2">secops</span>
      </h1>
    </div>
  );
}
