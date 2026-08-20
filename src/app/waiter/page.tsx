
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRestaurant } from '@/lib/restaurant-context';
import type { RestaurantTable, TableZone, OrderItem, CourseType, CourseStatus, Order, Payment, PaymentMethod } from '@/types';
import { menuItems as allMenuItems, modifiers as allModifiers } from '@/lib/mock-data';
import { generateOrderId, generatePaymentId } from '@/lib/restaurant-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { KPICard } from '@/components/shared/kpi-card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, Minus, Send, Receipt, Users, Euro, Clock, UserPlus, ArrowRightLeft, Bell, StickyNote, Search, X, CircleCheck as CheckCircle2, ChefHat, CreditCard, Wallet, Banknote, Smartphone, Split, Trash2, Flame, Salad, Cake, Wine, CircleAlert as AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const zones: TableZone[] = ['Main Dining', 'Terrace', 'Bar', 'Private Dining'];
const courses: CourseType[] = ['Aperitif', 'Starter', 'Main', 'Dessert', 'Digestif'];

const stationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Hot Kitchen': Flame,
  'Grill': Flame,
  'Garde Manger': Salad,
  'Pastry': Cake,
  'Bar': Wine,
};

const tableStatusColors: Record<string, string> = {
  'Available': 'border-success/40 bg-success/5',
  'Occupied': 'border-primary/40 bg-primary/5',
  'Reserved': 'border-accent/40 bg-accent/5',
  'Order Sent': 'border-accent/40 bg-accent/10',
  'Preparing': 'border-warning/40 bg-warning/5',
  'Food Ready': 'border-success/40 bg-success/10',
  'Bill Requested': 'border-destructive/40 bg-destructive/5',
  'Payment Due': 'border-destructive/40 bg-destructive/5',
  'Cleaning': 'border-muted-foreground/30 bg-muted/30',
  'Seated': 'border-primary/40 bg-primary/5',
};

export default function WaiterPage() {
  const { user } = useAuth();
  const {
    tables, menuItems, kitchenOrders, sendOrderToKitchen, updateTableStatus,
    updateTable, seatTable, transferTable, addNotification, addAuditLog,
    addPayment, updateKitchenOrderStatus, notifications,
  } = useRestaurant();

  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [view, setView] = useState<'floor' | 'order' | 'menu' | 'bill'>('floor');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeCourse, setActiveCourse] = useState<CourseType>('Main');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Plats');
  const [modifierItem, setModifierItem] = useState<string | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [itemNote, setItemNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showAddGuestDialog, setShowAddGuestDialog] = useState(false);
  const [showManagerApproval, setShowManagerApproval] = useState(false);
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [approvalError, setApprovalError] = useState('');
  const [pendingAction, setPendingAction] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [cashReceived, setCashReceived] = useState('');
  const [tipPercent, setTipPercent] = useState(0);
  const [guestCount, setGuestCount] = useState(4);
  const [transferTarget, setTransferTarget] = useState<number | null>(null);

  const waiterTables = user?.assignedTables?.length
    ? tables.filter(t => user.assignedTables!.includes(t.number) || t.waiter === user.name.split(' ')[0])
    : tables;

  const openTable = (t: RestaurantTable) => {
    setSelectedTable(t);
    setOrderItems([]);
    setView('order');
    setActiveCourse('Main');
  };

  const addToOrder = (itemName: string, price: number, station?: string) => {
    setOrderItems((prev) => {
      const existing = prev.find(c => c.name === itemName && c.course === activeCourse);
      if (existing) {
        return prev.map(c => c.name === itemName && c.course === activeCourse ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { name: itemName, quantity: 1, price, station: station as any, course: activeCourse, status: 'Draft' }];
    });
    toast.success(`${itemName} added to ${activeCourse}`);
  };

  const updateQty = (index: number, delta: number) => {
    setOrderItems((prev) =>
      prev.map((c, i) => i === index ? { ...c, quantity: c.quantity + delta } : c).filter(c => c.quantity > 0)
    );
  };

  const removeItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = orderItems.reduce((s, c) => s + c.price * c.quantity, 0);
  const vat = subtotal * 0.1;
  const service = subtotal * 0.05;
  const total = subtotal + vat + service;
  const tipAmount = total * (tipPercent / 100);
  const grandTotal = total + tipAmount;

  const confirmSendToKitchen = () => {
    if (!selectedTable) return;
    const order: Order = {
      id: generateOrderId(),
      table: selectedTable.number,
      waiter: user?.name?.split(' ')[0] || 'Waiter',
      waiterId: user?.id,
      guests: selectedTable.guests || guestCount,
      items: orderItems,
      status: 'Sent to Kitchen',
      channel: 'Dine-in',
      priority: 'Normal',
      station: 'Hot Kitchen',
      amount: subtotal,
      createdAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      elapsedMin: 0,
    };
    sendOrderToKitchen(order);
    addNotification({
      id: '', type: 'kitchen', title: 'Kitchen', message: `Order for Table ${selectedTable.number} sent to kitchen.`,
      time: 'Just now', read: false, link: '/kitchen',
    });
    addAuditLog({ user: user?.name || 'Unknown', action: `Sent order to kitchen for Table ${selectedTable.number}`, module: 'Waiter' });
    toast.success(`Order sent to kitchen for Table ${selectedTable.number}`);
    setShowSendConfirm(false);
    setOrderItems([]);
    setView('order');
  };

  const requestBill = () => {
    if (!selectedTable) return;
    updateTableStatus(selectedTable.number, 'Bill Requested');
    addNotification({
      id: '', type: 'payment', title: 'Bill', message: `Bill requested for Table ${selectedTable.number}.`,
      time: 'Just now', read: false, link: '/payments',
    });
    addAuditLog({ user: user?.name || 'Unknown', action: `Requested bill for Table ${selectedTable.number}`, module: 'Waiter' });
    toast.success(`Bill requested for Table ${selectedTable.number}`);
    setShowBillDialog(false);
    setView('bill');
  };

  const processPayment = () => {
    if (!selectedTable || !paymentMethod) return;
    const payment: Payment = {
      id: generatePaymentId(),
      transactionId: `P${Math.floor(Math.random() * 9000) + 1000}`,
      order: `#${generateOrderId()}`,
      table: selectedTable.number,
      amount: grandTotal,
      method: paymentMethod,
      tip: Math.round(tipAmount),
      status: 'Completed',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      waiter: user?.name?.split(' ')[0],
    };
    addPayment(payment);
    updateTableStatus(selectedTable.number, 'Cleaning');
    addAuditLog({ user: user?.name || 'Unknown', action: `Processed payment €${grandTotal.toFixed(2)} for Table ${selectedTable.number}`, module: 'Payments' });
    toast.success(`Payment completed: €${grandTotal.toFixed(2)} via ${paymentMethod}`);
    setShowPaymentDialog(false);
    setPaymentMethod('');
    setTipPercent(0);
    setCashReceived('');
    setSelectedTable(null);
    setView('floor');
    setOrderItems([]);
  };

  const handleManagerApproval = () => {
    setApprovalError('');
    
    
  };

  const doTransfer = () => {
    if (!selectedTable || transferTarget === null) return;
    transferTable(selectedTable.number, transferTarget);
    addAuditLog({ user: user?.name || 'Unknown', action: `Transferred Table ${selectedTable.number} → Table ${transferTarget}`, module: 'Waiter' });
    toast.success(`Table ${selectedTable.number} transferred to Table ${transferTarget}`);
    setShowTransferDialog(false);
    setSelectedTable(tables.find(t => t.number === transferTarget) || null);
    setTransferTarget(null);
  };

  const doAddGuest = () => {
    if (!selectedTable) return;
    updateTable(selectedTable.number, { guests: guestCount });
    setSelectedTable({ ...selectedTable, guests: guestCount });
    toast.success(`Table ${selectedTable.number} now has ${guestCount} guests`);
    setShowAddGuestDialog(false);
  };

  const markTableClean = () => {
    if (!selectedTable) return;
    updateTableStatus(selectedTable.number, 'Available');
    toast.success(`Table ${selectedTable.number} is now available`);
    setSelectedTable(null);
    setView('floor');
  };

  const categories = ['Entrées', 'Plats', 'Desserts', 'Fromage', 'Wine', 'Cocktails', 'Drinks', 'Specials'];
  const filteredMenu = menuItems.filter(m =>
    m.available && m.category === activeCategory &&
    (search === '' || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  const tableOrders = selectedTable ? kitchenOrders.filter(o => o.table === selectedTable.number) : [];
  const waiterNotifications = notifications.filter(n => n.type === 'kitchen' || n.type === 'waiter' || n.type === 'payment');

  // FLOOR VIEW
  if (view === 'floor' || !selectedTable) {
    const openOrdersCount = waiterTables.filter(t => t.status === 'Occupied' || t.status === 'Order Sent' || t.status === 'Preparing').length;
    const totalGuests = waiterTables.reduce((s, t) => s + (t.guests || 0), 0);
    const totalSales = waiterTables.reduce((s, t) => s + (t.amount || 0), 0);

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold">Maison Étoile</h2>
              <p className="text-sm text-muted-foreground">{user?.name} · {user?.role}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Shift</p>
                <p className="font-semibold">{user?.shiftStart} — {user?.shiftEnd}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Section</p>
                <p className="font-semibold">{user?.section}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard label="Assigned Tables" value={String(waiterTables.length)} icon={Users} />
          <KPICard label="Open Orders" value={String(openOrdersCount)} icon={ChefHat} />
          <KPICard label="Guests" value={String(totalGuests)} icon={Users} />
          <KPICard label="Sales" value={`€${totalSales}`} icon={Euro} />
        </div>

        {/* Notifications */}
        {waiterNotifications.length > 0 && (
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" />
              <p className="text-sm font-semibold">Notifications</p>
            </div>
            <div className="space-y-1.5">
              {waiterNotifications.slice(0, 4).map(n => (
                <div key={n.id} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-muted-foreground">{n.message}</span>
                  <span className="ml-auto text-xs text-muted-foreground/60">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floor plan */}
        <div className="space-y-4">
          {zones.map(zone => {
            const zoneTables = waiterTables.filter(t => t.zone === zone);
            if (zoneTables.length === 0) return null;
            return (
              <div key={zone}>
                <h3 className="mb-3 font-serif text-lg font-semibold">{zone}</h3>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {zoneTables.map(t => (
                    <button
                      key={t.id}
                      onClick={() => openTable(t)}
                      className={cn(
                        'rounded-xl border-2 p-4 text-left transition-all hover:shadow-md',
                        tableStatusColors[t.status] || 'border-border/60 bg-card'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-lg font-bold">T{String(t.number).padStart(2, '0')}</p>
                        <StatusBadge status={t.status} className="text-[10px]" />
                      </div>
                      <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                        <p>{t.seats} seats</p>
                        {t.guests !== undefined && <p className="font-medium text-foreground">{t.guests} guests</p>}
                        {t.amount !== undefined && t.amount > 0 && <p className="font-semibold text-foreground">€{t.amount}</p>}
                        {t.elapsedMin !== undefined && <p>{t.elapsedMin} min</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // TABLE DETAIL / ORDER VIEW
  const tableItems = tableOrders.flatMap(o => o.items);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => { setSelectedTable(null); setView('floor'); }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-serif text-2xl font-semibold">Table {selectedTable.number}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedTable.guests || 0} guests · {selectedTable.zone} · {user?.name}
          </p>
        </div>
        <StatusBadge status={selectedTable.status} />
      </div>

      {/* Course tabs */}
      <div className="flex flex-wrap gap-2">
        {courses.map(c => (
          <button
            key={c}
            onClick={() => setActiveCourse(c)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              activeCourse === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Left: Order items / Menu */}
        <div className="space-y-4">
          {view === 'order' && (
            <>
              {/* Current order items by course */}
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <h3 className="mb-3 font-semibold">Current Order</h3>
                {orderItems.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No items in this order yet. Tap "Add Items" to start.</p>
                ) : (
                  <div className="space-y-3">
                    {courses.map(c => {
                      const courseItems = orderItems.filter(i => i.course === c);
                      if (courseItems.length === 0) return null;
                      return (
                        <div key={c}>
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c}</p>
                          <div className="space-y-2">
                            {courseItems.map((item, idx) => {
                              const realIdx = orderItems.indexOf(item);
                              return (
                                <div key={idx} className="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-medium">{item.name}</p>
                                      {item.notes && <StickyNote className="h-3 w-3 text-accent" />}
                                    </div>
                                    {item.modifiers && item.modifiers.length > 0 && (
                                      <p className="text-xs text-muted-foreground">{item.modifiers.join(', ')}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">€{item.price.toFixed(2)}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(realIdx, -1)}>
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(realIdx, 1)}>
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <button onClick={() => removeItem(realIdx)} className="ml-1 text-muted-foreground hover:text-destructive">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Kitchen status for this table */}
              {tableOrders.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-card p-4">
                  <h3 className="mb-3 font-semibold">Kitchen Status</h3>
                  <div className="space-y-2">
                    {tableOrders.map(o => (
                      <div key={o.id} className="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
                        <div>
                          <p className="text-sm font-medium">Order #{o.id}</p>
                          <p className="text-xs text-muted-foreground">{o.items.length} items · {o.elapsedMin} min</p>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Button size="lg" className="h-14 text-base" onClick={() => setView('menu')}>
                  <Plus className="mr-2 h-5 w-5" /> Add Items
                </Button>
                <Button size="lg" variant="secondary" className="h-14 text-base" onClick={() => setShowSendConfirm(true)} disabled={orderItems.length === 0}>
                  <Send className="mr-2 h-5 w-5" /> Send
                </Button>
                <Button size="lg" variant="outline" className="h-14 text-base" onClick={() => setShowBillDialog(true)}>
                  <Receipt className="mr-2 h-5 w-5" /> Bill
                </Button>
                <Button size="lg" variant="outline" className="h-14 text-base" onClick={() => { setGuestCount(selectedTable.guests || 4); setShowAddGuestDialog(true); }}>
                  <UserPlus className="mr-2 h-5 w-5" /> Guests
                </Button>
                <Button size="lg" variant="outline" className="h-14 text-base" onClick={() => setShowTransferDialog(true)}>
                  <ArrowRightLeft className="mr-2 h-5 w-5" /> Transfer
                </Button>
                {selectedTable.status === 'Cleaning' && (
                  <Button size="lg" variant="default" className="h-14 text-base" onClick={markTableClean}>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Clean
                  </Button>
                )}
              </div>
            </>
          )}

          {view === 'menu' && (
            <>
              {/* Search + categories */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setView('order')}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Input placeholder="Search dishes…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                      activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu items grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredMenu.map(item => {
                  const StationIcon = stationIcons[item.station] || ChefHat;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.hasModifiers) {
                          setModifierItem(item.name);
                          setSelectedModifiers([]);
                        } else {
                          addToOrder(item.name, item.price, item.station);
                        }
                      }}
                      className="rounded-lg border border-border/60 bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <StationIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-base font-bold">€{item.price}</p>
                        {item.hasModifiers && <Badge variant="secondary" className="text-[10px]">Mods</Badge>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === 'bill' && (
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <div className="text-center">
                <h3 className="font-serif text-xl font-semibold">Maison Étoile</h3>
                <p className="text-xs text-muted-foreground">Paris, France</p>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-sm">
                <span>Table {selectedTable.number}</span>
                <span>{selectedTable.guests || 0} Guests</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Waiter: {user?.name}</span>
                <span>{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <Separator className="my-4" />
              {orderItems.length > 0 ? (
                <>
                  {orderItems.map((item, i) => (
                    <div key={i} className="flex justify-between py-1 text-sm">
                      <span>{item.quantity}× {item.name}</span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-3" />
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>VAT (10%)</span><span>€{vat.toFixed(2)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Service (5%)</span><span>€{service.toFixed(2)}</span></div>
                    <div className="flex justify-between text-base font-bold"><span>Total</span><span>€{total.toFixed(2)}</span></div>
                  </div>
                </>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">No active order for this table.</p>
              )}
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => toast.success('Bill printed')}>
                  Print Bill
                </Button>
                <Button className="flex-1" onClick={() => setShowPaymentDialog(true)} disabled={orderItems.length === 0}>
                  <CreditCard className="mr-2 h-4 w-4" /> Pay
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Ticket summary */}
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <h3 className="mb-3 font-serif text-base font-semibold">Ticket · Table {selectedTable.number}</h3>
          <p className="mb-3 text-sm text-muted-foreground">{selectedTable.guests || 0} Guests · {user?.name}</p>
          {orderItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No items</p>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}× {item.name}</span>
                    <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <Separator className="my-3" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>VAT</span><span>€{vat.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Service</span><span>€{service.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold"><span>Total</span><span>€{total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* Send to kitchen confirmation */}
      <Dialog open={showSendConfirm} onOpenChange={setShowSendConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send order to kitchen?</DialogTitle>
            <DialogDescription>Table {selectedTable.number} · {orderItems.length} items</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            {orderItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.quantity}× {item.name}</span>
                {item.modifiers && item.modifiers.length > 0 && (
                  <span className="text-xs text-muted-foreground">{item.modifiers.join(', ')}</span>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendConfirm(false)}>Cancel</Button>
            <Button onClick={confirmSendToKitchen}>
              <Send className="mr-2 h-4 w-4" /> Send to Kitchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modifier dialog */}
      <Dialog open={modifierItem !== null} onOpenChange={(open) => !open && setModifierItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{modifierItem}</DialogTitle>
            <DialogDescription>Select modifiers</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {allModifiers.map(mod => (
              <div key={mod.id}>
                <Label className="mb-2 block text-sm font-medium">{mod.name}</Label>
                <div className="flex flex-wrap gap-2">
                  {mod.options.map(opt => (
                    <button
                      key={opt.name}
                      onClick={() => {
                        setSelectedModifiers(prev =>
                          prev.includes(opt.name) ? prev.filter(m => m !== opt.name) : [...prev, opt.name]
                        );
                      }}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                        selectedModifiers.includes(opt.name)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:bg-muted'
                      )}
                    >
                      {opt.name}
                      {opt.price > 0 && <span className="ml-1 text-xs text-muted-foreground">+€{opt.price}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <Label className="mb-2 block text-sm font-medium">Item Note</Label>
              <Input placeholder="e.g. No butter, allergy alert…" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setModifierItem(null); setSelectedModifiers([]); setNoteText(''); }}>Cancel</Button>
            <Button onClick={() => {
              const item = menuItems.find(m => m.name === modifierItem);
              if (item) {
                const modPrice = allModifiers.flatMap(m => m.options).filter(o => selectedModifiers.includes(o.name)).reduce((s, o) => s + o.price, 0);
                addToOrder(item.name, item.price + modPrice, item.station);
                if (selectedModifiers.length > 0 || noteText) {
                  setOrderItems(prev => {
                    const last = prev[prev.length - 1];
                    if (last) {
                      return [...prev.slice(0, -1), { ...last, modifiers: selectedModifiers.length > 0 ? selectedModifiers : undefined, notes: noteText || undefined }];
                    }
                    return prev;
                  });
                }
              }
              setModifierItem(null);
              setSelectedModifiers([]);
              setNoteText('');
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add to Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bill request dialog */}
      <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Request Bill</DialogTitle>
            <DialogDescription>Table {selectedTable.number} · Total: €{total.toFixed(2)}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBillDialog(false)}>Cancel</Button>
            <Button onClick={requestBill}>
              <Receipt className="mr-2 h-4 w-4" /> Request Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Table {selectedTable.number} · Total: €{total.toFixed(2)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Cash' as PaymentMethod, icon: Banknote },
                  { name: 'Card' as PaymentMethod, icon: CreditCard },
                  { name: 'Apple Pay' as PaymentMethod, icon: Smartphone },
                  { name: 'Split' as PaymentMethod, icon: Split },
                ].map(m => (
                  <button
                    key={m.name}
                    onClick={() => setPaymentMethod(m.name)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
                      paymentMethod === m.name ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted'
                    )}
                  >
                    <m.icon className="h-4 w-4" />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Tip</Label>
              <div className="flex gap-2">
                {[0, 5, 10, 15].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={cn(
                      'flex-1 rounded-lg border px-2 py-1.5 text-sm font-medium transition-colors',
                      tipPercent === pct ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'
                    )}
                  >
                    {pct === 0 ? 'No Tip' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
            {paymentMethod === 'Cash' && (
              <div>
                <Label className="mb-2 block">Amount Received</Label>
                <Input type="number" placeholder={grandTotal.toFixed(2)} value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} />
                {cashReceived && parseFloat(cashReceived) >= grandTotal && (
                  <p className="mt-1 text-sm text-success">Change: €{(parseFloat(cashReceived) - grandTotal).toFixed(2)}</p>
                )}
              </div>
            )}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>VAT (10%)</span><span>€{vat.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Service (5%)</span><span>€{service.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tip ({tipPercent}%)</span><span>€{tipAmount.toFixed(2)}</span></div>
              <Separator className="my-1" />
              <div className="flex justify-between text-base font-bold"><span>Grand Total</span><span>€{grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={processPayment} disabled={!paymentMethod}>
              <Wallet className="mr-2 h-4 w-4" /> Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer table dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Table</DialogTitle>
            <DialogDescription>Transfer Table {selectedTable.number} to another table</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Select target table</Label>
            <div className="grid grid-cols-4 gap-2">
              {tables.filter(t => t.number !== selectedTable.number && t.status === 'Available').map(t => (
                <button
                  key={t.id}
                  onClick={() => setTransferTarget(t.number)}
                  className={cn(
                    'rounded-lg border p-3 text-center text-sm font-medium transition-colors',
                    transferTarget === t.number ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'
                  )}
                >
                  T{t.number}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>Cancel</Button>
            <Button onClick={doTransfer} disabled={transferTarget === null}>
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add guests dialog */}
      <Dialog open={showAddGuestDialog} onOpenChange={setShowAddGuestDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Guests for Table {selectedTable.number}</DialogTitle>
            <DialogDescription>Current: {selectedTable.guests || 0} guests</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-4">
            <Button size="icon" variant="outline" onClick={() => setGuestCount(g => Math.max(1, g - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-3xl font-bold">{guestCount}</span>
            <Button size="icon" variant="outline" onClick={() => setGuestCount(g => g + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGuestDialog(false)}>Cancel</Button>
            <Button onClick={doAddGuest}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
