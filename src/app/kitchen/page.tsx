
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/shared/kpi-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  Tabs, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { useRestaurant } from '@/lib/restaurant-context';
import { useAuth } from '@/lib/auth-context';
import type { OrderStatus, KitchenStation, Priority, Order } from '@/types';
import { Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, ChefHat, Flame, Salad, Cake, Wine, Play, CheckCheck, X, RotateCcw, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'New', label: 'NEW', color: 'border-t-accent' },
  { status: 'Preparing', label: 'PREPARING', color: 'border-t-warning' },
  { status: 'Ready', label: 'READY', color: 'border-t-success' },
  { status: 'Served', label: 'SERVED', color: 'border-t-muted-foreground' },
];

const stationIcons: Record<KitchenStation, React.ComponentType<{ className?: string }>> = {
  'Hot Kitchen': Flame,
  'Grill': Flame,
  'Garde Manger': Salad,
  'Pastry': Cake,
  'Bar': Wine,
};

const priorityColors: Record<Priority, string> = {
  'Normal': 'bg-muted text-muted-foreground',
  'High': 'bg-warning/10 text-warning',
  'VIP': 'bg-accent/10 text-accent',
};

export default function KitchenPage() {
  const { kitchenOrders, updateKitchenOrderStatus, addNotification, addAuditLog } = useRestaurant();
  const { user } = useAuth();
  const [stationFilter, setStationFilter] = useState<string>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      // Timer ticks are visual only — we don't mutate shared state every minute
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const moveOrder = (id: string, newStatus: OrderStatus) => {
    updateKitchenOrderStatus(id, newStatus);
    toast.success(`Order #${id} moved to ${newStatus}`);

    if (newStatus === 'Ready') {
      const order = kitchenOrders.find(o => o.id === id);
      addNotification({
        id: '', type: 'waiter', title: 'Kitchen Ready',
        message: `Table ${order?.table} order is ready.`,
        time: 'Just now', read: false, link: '/waiter',
      });
    }
    if (newStatus === 'Served') {
      addNotification({
        id: '', type: 'kitchen', title: 'Kitchen',
        message: `Order #${id} has been served.`,
        time: 'Just now', read: false, link: '/kitchen',
      });
    }
    addAuditLog({ user: user?.name || 'Unknown', action: `Moved order #${id} to ${newStatus}`, module: 'Kitchen' });
  };

  const bumpOrder = (id: string) => {
    updateKitchenOrderStatus(id, 'Served');
    toast.success(`Order #${id} bumped`);
    addAuditLog({ user: user?.name || 'Unknown', action: `Bumped order #${id}`, module: 'Kitchen' });
  };

  const filteredOrders = stationFilter === 'all' ? kitchenOrders : kitchenOrders.filter((o) => o.station === stationFilter);

  const stats = {
    waiting: kitchenOrders.filter((o) => o.status === 'New').length,
    preparing: kitchenOrders.filter((o) => o.status === 'Preparing').length,
    ready: kitchenOrders.filter((o) => o.status === 'Ready').length,
    delayed: kitchenOrders.filter((o) => o.status === 'Delayed' || (o.status === 'Preparing' && o.elapsedMin > 30)).length,
  };

  const avgPrepTime = '18 min';
  const stations: (KitchenStation | 'all')[] = ['all', 'Hot Kitchen', 'Grill', 'Garde Manger', 'Pastry', 'Bar'];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Kitchen / KDS"
        description="Real-time kitchen display system"
        actions={
          <Button variant="outline" onClick={() => toast.info('Recalling last bumped order…')}>
            <RotateCcw className="mr-2 h-4 w-4" /> Recall
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard label="Orders Waiting" value={String(stats.waiting)} icon={Clock} />
        <KPICard label="Preparing" value={String(stats.preparing)} icon={ChefHat} />
        <KPICard label="Ready" value={String(stats.ready)} icon={CheckCircle2} />
        <KPICard label="Delayed" value={String(stats.delayed)} icon={AlertTriangle} />
        <KPICard label="Avg Prep Time" value={avgPrepTime} icon={Clock} />
      </div>

      {/* Station filter */}
      <div className="flex flex-wrap gap-2">
        {stations.map((s) => (
          <button
            key={s}
            onClick={() => setStationFilter(s)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              stationFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {s === 'all' ? 'All Stations' : s}
          </button>
        ))}
      </div>

      {/* KDS Columns */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.status || (col.status === 'Served' && o.status === 'Delayed'));
          return (
            <div key={col.status} className={cn('rounded-lg border border-border/60 border-t-2 bg-card/50', col.color)}>
              <div className="flex items-center justify-between border-b border-border/40 p-3">
                <h3 className="text-sm font-bold tracking-wide">{col.label}</h3>
                <Badge variant="secondary">{colOrders.length}</Badge>
              </div>
              <div className="space-y-3 p-3">
                {colOrders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No orders</p>
                ) : (
                  colOrders.map((order) => {
                    const StationIcon = order.station ? stationIcons[order.station] : ChefHat;
                    const isDelayed = order.elapsedMin > 30 && order.status !== 'Ready' && order.status !== 'Served';
                    return (
                      <Card key={order.id} className={cn('border-border/60 transition-shadow hover:shadow-md', isDelayed && 'border-destructive/40')}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold">#{order.id}</p>
                                <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold', priorityColors[order.priority])}>
                                  {order.priority}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {order.table ? `Table ${order.table}` : 'Takeaway'} · {order.guests || 0} covers
                              </p>
                              <p className="text-xs text-muted-foreground">Waiter: {order.waiter || '—'}</p>
                            </div>
                            <div className="text-right">
                              <span className={cn('flex items-center gap-1 text-xs font-semibold', isDelayed ? 'text-destructive' : 'text-muted-foreground')}>
                                <Clock className="h-3 w-3" />
                                {order.elapsedMin}m
                              </span>
                              <StationIcon className="mt-1 ml-auto h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="mt-3 space-y-1 border-t border-border/40 pt-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-start justify-between text-sm">
                                <div>
                                  <span className="font-medium">{item.quantity}×</span>
                                  <span className="ml-1.5">{item.name}</span>
                                  {item.modifiers && item.modifiers.length > 0 && (
                                    <p className="ml-5 text-xs text-muted-foreground">{item.modifiers.join(', ')}</p>
                                  )}
                                  {item.notes && (
                                    <p className="ml-5 text-xs text-accent">Note: {item.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="mt-3 flex gap-1.5">
                            {col.status === 'New' && (
                              <Button size="sm" className="h-7 flex-1 text-xs" onClick={() => moveOrder(order.id, 'Preparing')}>
                                <Play className="mr-1 h-3 w-3" /> Start
                              </Button>
                            )}
                            {col.status === 'Preparing' && (
                              <Button size="sm" className="h-7 flex-1 text-xs" onClick={() => moveOrder(order.id, 'Ready')}>
                                <CheckCheck className="mr-1 h-3 w-3" /> Ready
                              </Button>
                            )}
                            {col.status === 'Ready' && (
                              <Button size="sm" className="h-7 flex-1 text-xs" onClick={() => moveOrder(order.id, 'Served')}>
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Bump
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => bumpOrder(order.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
