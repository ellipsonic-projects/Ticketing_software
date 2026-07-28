import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_ACTIVATION' | 'INVITED';

interface StatusBadgeProps {
  status: EntityStatus | string;
  variant?: 'dot' | 'emoji' | 'ring';
  className?: string;
}

export function StatusBadge({ status, variant = 'dot', className }: StatusBadgeProps) {
  // Common style maps
  const colorMap: Record<string, string> = {
    ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    INACTIVE: 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
    SUSPENDED: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
    PENDING_ACTIVATION: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
    INVITED: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
  };

  const ringMap: Record<string, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    INACTIVE: 'bg-slate-50 text-slate-700 ring-slate-600/20',
    SUSPENDED: 'bg-red-50 text-red-700 ring-red-600/20',
    PENDING_ACTIVATION: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    INVITED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  };

  const dotColorMap: Record<string, string> = {
    ACTIVE: 'bg-emerald-500',
    INACTIVE: 'bg-slate-500',
    SUSPENDED: 'bg-red-500',
    PENDING_ACTIVATION: 'bg-amber-500',
    INVITED: 'bg-amber-500',
  };

  const emojiMap: Record<string, string> = {
    ACTIVE: '🟢',
    INACTIVE: '⚪',
    SUSPENDED: '🔴',
    PENDING_ACTIVATION: '🟡',
    INVITED: '🟡',
  };

  const labelMap: Record<string, string> = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    PENDING_ACTIVATION: 'PENDING ACTIVATION',
    INVITED: 'INVITED',
  };

  const normalizedStatus = status.toUpperCase();
  const baseColor = colorMap[normalizedStatus] || colorMap.INACTIVE;
  const label = labelMap[normalizedStatus] || normalizedStatus;

  if (variant === 'ring') {
    const ringStyle = ringMap[normalizedStatus] || ringMap.INACTIVE;
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
          ringStyle,
          className,
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' ')}
      </span>
    );
  }

  return (
    <Badge variant="outline" className={cn(baseColor, className)}>
      {variant === 'emoji' && (
        <span className="mr-1.5">{emojiMap[normalizedStatus] || emojiMap.INACTIVE}</span>
      )}
      {variant === 'dot' && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            dotColorMap[normalizedStatus] || dotColorMap.INACTIVE,
          )}
        />
      )}
      {variant === 'emoji' ? label : label}
    </Badge>
  );
}
