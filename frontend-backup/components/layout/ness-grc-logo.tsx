import React from 'react';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface NessGRCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showIcon?: boolean;
  variant?: 'full' | 'compact';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
};

const iconSizes = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

export function NessGRCLogo({ 
  size = 'md', 
  className, 
  showIcon = true,
  variant = 'full'
}: NessGRCLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showIcon && (
        <div className="relative">
          <Shield className={cn(
            iconSizes[size],
            'text-brand-cyan icon-ness'
          )} />
        </div>
      )}
      <div className="flex flex-col">
        <h1 className={cn('ness-wordmark font-medium leading-tight', sizeClasses[size])}>
          ness<span className="ness-wordmark-dot">.</span>
        </h1>
        {variant === 'full' && (
          <span className={cn(
            'text-gray-400 font-normal',
            size === 'xl' ? 'text-xl' :
            size === 'lg' ? 'text-lg' :
            size === 'md' ? 'text-sm' :
            'text-xs'
          )}>
            OT GRC
          </span>
        )}
      </div>
    </div>
  );
}

export function NessGRCWordmark({ size = 'md', className }: Omit<NessGRCLogoProps, 'showIcon' | 'variant'>) {
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('ness-wordmark font-medium', sizeClasses[size])}>
        ness<span className="ness-wordmark-dot">.</span>
      </span>
      <span className={cn(
        'text-gray-400 font-normal',
        size === 'xl' ? 'text-2xl' :
        size === 'lg' ? 'text-xl' :
        size === 'md' ? 'text-base' :
        'text-sm'
      )}>
        OT GRC
      </span>
    </div>
  );
}

export function GRCBadge({ className }: { className?: string }) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
      'bg-brand-cyan/10 border border-brand-cyan/20',
      className
    )}>
      <Shield className="w-4 h-4 text-brand-cyan icon-ness" />
      <span className="text-sm font-medium text-brand-cyan">
        OT GRC
      </span>
    </div>
  );
}
