// ness. Wordmark Component
// Refined branding component based on ness-theme

import { cn } from '@/lib/utils';
import { brandConfig } from '@/lib/branding/utils';

interface NessWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDot?: boolean;
  showProduct?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export function NessWordmark({
  size = 'md',
  showDot = true,
  showProduct = false,
  className,
}: NessWordmarkProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h1 className={cn('font-medium tracking-tight', sizeClasses[size])}>
        <span className="text-foreground">{brandConfig.name.replace('.', '')}</span>
        {showDot && <span className="text-[#00ade8]">.</span>}
      </h1>
      {showProduct && (
        <span className={cn('text-muted-foreground font-light', size === 'sm' ? 'text-sm' : 'text-base')}>
          {brandConfig.product}
        </span>
      )}
    </div>
  );
}

