
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { modifiers } from '@/lib/mock-data';
import { useRestaurant } from '@/lib/restaurant-context';
import { useAuth } from '@/lib/auth-context';
import { generateOrderId, generatePaymentId } from '@/lib/restaurant-context';
import type { MenuItem, MenuCategory, OrderItem, Order, Payment } from '@/types';
import {
  Search, Plus, Minus, X, UtensilsCrossed, Clock, Send, Printer,
  Pause, CreditCard, Wallet, Banknote, Smartphone, Split,
} from 'lucide-react';
import { toast } from 'sonner';

const categories: MenuCategory[] = ['Entrées', 'Plats', 'Desserts', 'Fromage', 'Wine', 'Drinks', 'Cocktails', 'Specials'];

export default function PosPage() {
  const { menuItems, sendOrderToKitchen, addPayment, updateTableStatus, addAuditLog, addNotification } = useRestaurant();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Plats');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([
    { name: 'Steak Frites', quantity: 2, price: 32, modifiers: ['Medium Rare', 'Béarnaise'] },
    { name: 'Duck Confit', quantity: 1, price: 29 },
    { name: 'Crème Brûlée', quantity: 2, price: 10 },
  ]);
  const [tableNumber, setTableNumber] = useState(12);
  const [guests, setGuests] = useState(4);
  const [notes, setNotes] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<string>('');

  const filteredItems = menuItems.filter(
    (m) =>
      m.available &&
      m.category === activeCategory &&
      (search === '' || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name);
      if (existing) {
        return prev.map((c) => (c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { name: item.name, quantity: 1, price: item.price }];
    });
    toast.success(`${item.name} added to order`);
  };

  const updateQty = (name: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.name === name ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => prev.filter((c) => c.name !== name));
  };

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const vat = subtotal * 0.1;
  const service = subtotal * 0.05;
  const discount = 0;
  const total = subtotal + vat + service - discount;

  const sendToKitchen = () => {
    const order: Order = {
      id: generateOrderId(),
      table: tableNumber,
      waiter: user?.name?.split(' ')[0] || 'Waiter',
      waiterId: user?.id,
      guests,
      items: cart,
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
      id: '', type: 'kitchen', title: 'Kitchen', message: `Order for Table ${tableNumber} sent to kitchen.`,
      time: 'Just now', read: false, link: '/kitchen',
    });
    addAuditLog({ user: user?.name || 'Unknown', action: `Sent order to kitchen for Table ${tableNumber}`, module: 'POS' });
    toast.success(`Order sent to kitchen for Table ${tableNumber}`);
    setCart([]);
  };

  const holdOrder = () => {
    toast.success(`Order held for Table ${tableNumber}`);
  };

  const printOrder = () => {
    toast.success('Order printed');
  };

  const processPayment = () => {
    const payment: Payment = {
      id: generatePaymentId(),
      transactionId: `P${Math.floor(Math.random() * 9000) + 1000}`,
      order: `#${generateOrderId()}`,
      table: tableNumber,
      amount: total,
      method: payMethod as Payment['method'],
      tip: 0,
      status: 'Completed',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      waiter: user?.name?.split(' ')[0],
    };
    addPayment(payment);
    updateTableStatus(tableNumber, 'Cleaning');
    addAuditLog({ user: user?.name || 'Unknown', action: `Processed payment €${total.toFixed(2)} for Table ${tableNumber}`, module: 'POS' });
    toast.success(`Payment processed: €${total.toFixed(2)} via ${payMethod}`);
    setPayOpen(false);
    setPayMethod('');
    setCart([]);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4 animate-fade-in">
      {/* Left: Categories */}
      <div className="hidden w-44 shrink-0 lg:flex lg:flex-col">
        <div className="mb-3">
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Center: Menu items */}
      <div className="flex-1 overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">{activeCategory}</h3>
          <Badge variant="secondary">{filteredItems.length} items</Badge>
        </div>
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="group overflow-hidden rounded-lg border border-border/60 bg-card text-left transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {item.hasModifiers && (
                    <Badge className="absolute right-1.5 top-1.5 bg-primary/90 text-primary-foreground">
                      Modifiers
                    </Badge>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold">€{item.price}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.prepTime}m
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Current order */}
      <div className="flex w-80 shrink-0 flex-col rounded-lg border border-border/60 bg-card">
        <div className="border-b border-border/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-base font-semibold">Table {tableNumber}</p>
              <p className="text-sm text-muted-foreground">{guests} Guests</p>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <Label className="text-xs">Table</Label>
                <Input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(Number(e.target.value))}
                  className="h-8 w-16"
                />
              </div>
              <div>
                <Label className="text-xs">Guests</Label>
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-8 w-16"
                />
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UtensilsCrossed className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium">No items yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Tap a dish to add it to the order</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.name} className="rounded-lg border border-border/40 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.modifiers.join(', ')}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">€{item.price.toFixed(2)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(item.name, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-border hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.name, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-border hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Notes */}
        <div className="border-t border-border/60 p-3">
          <Input
            placeholder="Order notes…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        {/* Totals */}
        <div className="border-t border-border/60 p-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT (10%)</span>
              <span>€{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service (5%)</span>
              <span>€{service.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Discount</span>
                <span>-€{discount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 border-t border-border/60 p-3">
          <Button variant="outline" size="sm" onClick={holdOrder}>
            <Pause className="mr-1 h-3.5 w-3.5" /> Hold
          </Button>
          <Button variant="outline" size="sm" onClick={printOrder}>
            <Printer className="mr-1 h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="secondary" size="sm" onClick={sendToKitchen} disabled={cart.length === 0}>
            <Send className="mr-1 h-3.5 w-3.5" /> Send
          </Button>
          <Button size="sm" onClick={() => setPayOpen(true)} disabled={cart.length === 0}>
            <CreditCard className="mr-1 h-3.5 w-3.5" /> Pay
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Table {tableNumber} · Total: €{total.toFixed(2)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Cash', icon: Banknote },
                  { name: 'Card', icon: CreditCard },
                  { name: 'Online', icon: Smartphone },
                  { name: 'Split Payment', icon: Split },
                ].map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setPayMethod(m.name)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                      payMethod === m.name
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <m.icon className="h-4 w-4" />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            {payMethod === 'Cash' && (
              <div>
                <Label className="mb-2 block">Amount Received</Label>
                <Input type="number" placeholder="0.00" defaultValue={total.toFixed(2)} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button onClick={processPayment} disabled={!payMethod}>
              <Wallet className="mr-2 h-4 w-4" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
