
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Video as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  className?: string;
}

export function KPICard({ label, value, icon: Icon, trend, className }: KPICardProps) {
  return (
    <Card className={cn('border-border/60', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.up ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}
            </div>
          )}
        </div>
        <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
