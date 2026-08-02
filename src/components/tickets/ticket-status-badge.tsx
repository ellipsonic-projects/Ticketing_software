import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketStatusBadgeProps {
  status: string;
  className?: string;
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'WAITING_ON_CLIENT':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (s: string) => {
    if (s === 'WAITING_ON_CLIENT') return 'WAITING FOR CLIENT';
    return s.replace(/_/g, ' ');
  };

  return (
    <Badge variant="outline" className={cn(getStatusColor(status), className)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
