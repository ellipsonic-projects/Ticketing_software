import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketPriorityBadgeProps {
  priority: string;
  className?: string;
}

export function TicketPriorityBadge({ priority, className }: TicketPriorityBadgeProps) {
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'URGENT':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'LOW':
        return 'bg-green-100 text-green-600 border-green-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <Badge variant="outline" className={cn(getPriorityColor(priority), className)}>
      {priority}
    </Badge>
  );
}
