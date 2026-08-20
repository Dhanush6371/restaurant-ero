
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { deliveryOrders as initialOrders } from '@/lib/mock-data';
import type { DeliveryOrder, DeliveryStatus } from '@/types';
import {
  Truck, Package, Clock, MapPin, Phone, Euro, ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

const statusFlow: Record<DeliveryStatus, DeliveryStatus | null> = {
  'New': 'Confirmed',
  'Confirmed': 'Preparing',
  'Preparing': 'Ready',
  'Ready': 'Out for Delivery',
  'Out for Delivery': 'Delivered',
  'Delivered': null,
  'Cancelled': null,
};

export default function DeliveryPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState('active');
  const [selected, setSelected] = useState<DeliveryOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const advanceStatus = (id: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id === id && statusFlow[o.status]) {
        const newStatus = statusFlow[o.status]!;
        toast.success(`Order ${o.orderId} moved to ${newStatus}`);
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o)));
    toast.success(`Order cancelled`);
  };

  const openOrder = (o: DeliveryOrder) => {
    setSelected(o);
    setDrawerOpen(true);
  };

  const activeOrders = orders.filter((o) => ['New', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery'].includes(o.status));
  const pickupOrders = orders.filter((o) => o.type === 'Pickup' && !['Delivered', 'Cancelled'].includes(o.status));
  const deliveryOrders = orders.filter((o) => o.type === 'Delivery' && !['Delivered', 'Cancelled'].includes(o.status));
  const completedOrders = orders.filter((o) => ['Delivered', 'Cancelled'].includes(o.status));

  const renderOrderCard = (o: DeliveryOrder) => (
    <Card key={o.id} className="border-border/60 cursor-pointer transition-all hover:border-primary/40 hover:shadow-md" onClick={() => openOrder(o)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold">{o.orderId}</p>
            <p className="text-sm text-muted-foreground">{o.customer}</p>
          </div>
          <StatusBadge status={o.status} />
        </div>
        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            {o.type === 'Pickup' ? <Package className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
            {o.type} · {o.scheduledTime}
          </p>
          <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {o.phone}</p>
          {o.address && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.address}</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            {o.items.map((item, i) => (
              <span key={i} className="rounded border border-border/40 px-1.5 py-0.5">
                {item.quantity}× {item.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
          <span className="text-lg font-bold">€{o.amount}</span>
          {statusFlow[o.status] && (
            <Button size="sm" onClick={(e) => { e.stopPropagation(); advanceStatus(o.id); }}>
              {o.status === 'New' ? 'Confirm' : o.status === 'Confirmed' ? 'Start Preparing' : o.status === 'Preparing' ? 'Mark Ready' : o.status === 'Ready' ? 'Dispatch' : 'Mark Delivered'}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Delivery & Takeaway" description="Manage pickup and delivery orders" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="pickup">Pickup ({pickupOrders.length})</TabsTrigger>
          <TabsTrigger value="delivery">Delivery ({deliveryOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeOrders.map(renderOrderCard)}
          </div>
        </TabsContent>
        <TabsContent value="pickup">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pickupOrders.map(renderOrderCard)}
          </div>
        </TabsContent>
        <TabsContent value="delivery">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deliveryOrders.map(renderOrderCard)}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {completedOrders.map(renderOrderCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">{selected.orderId}</SheetTitle>
                <SheetDescription>{selected.type} · {selected.status}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium">{selected.customer}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold">€{selected.amount}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selected.phone}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                    <p className="font-medium">{selected.scheduledTime}</p>
                  </div>
                </div>

                {selected.address && (
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm"><MapPin className="h-3.5 w-3.5" /> {selected.address}</p>
                  </div>
                )}

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Order Items</h4>
                  <div className="space-y-2">
                    {selected.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border/40 p-2.5 text-sm">
                        <span>{item.quantity}× {item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {statusFlow[selected.status] && (
                    <Button className="w-full" onClick={() => { advanceStatus(selected.id); setDrawerOpen(false); }}>
                      <ArrowRight className="mr-2 h-4 w-4" /> Advance to {statusFlow[selected.status]}
                    </Button>
                  )}
                  {!['Delivered', 'Cancelled'].includes(selected.status) && (
                    <Button variant="destructive" className="w-full" onClick={() => { cancelOrder(selected.id); setDrawerOpen(false); }}>
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
