'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { menuItems } from '@/lib/mock-data';
import type { OrderItem } from '@/types';
import {
  ArrowLeft, Plus, Minus, Clock, Euro, Users, Send, Receipt,
  ArrowRightLeft, Trash2, StickyNote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WaiterTable {
  number: number;
  guests: number;
  amount: number;
  elapsedMin: number;
  status: string;
}

const initialTables: WaiterTable[] = [
  { number: 4, guests: 4, amount: 184, elapsedMin: 42, status: 'Occupied' },
  { number: 7, guests: 2, amount: 86, elapsedMin: 22, status: 'Occupied' },
  { number: 12, guests: 4, amount: 184, elapsedMin: 42, status: 'Occupied' },
  { number: 18, guests: 4, amount: 196, elapsedMin: 35, status: 'Occupied' },
];

export default function WaiterPage() {
  const [tables] = useState<WaiterTable[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<WaiterTable | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');

  const addToOrder = (name: string, price: number) => {
    setOrderItems((prev) => {
      const existing = prev.find((c) => c.name === name);
      if (existing) return prev.map((c) => (c.name === name ? { ...c, quantity: c.quantity + 1 } : c));
      return [...prev, { name, quantity: 1, price }];
    });
    toast.success(`${name} added`);
  };

  const updateQty = (name: string, delta: number) => {
    setOrderItems((prev) =>
      prev.map((c) => (c.name === name ? { ...c, quantity: c.quantity + delta } : c)).filter((c) => c.quantity > 0)
    );
  };

  const total = orderItems.reduce((s, c) => s + c.price * c.quantity, 0);

  const openTable = (t: WaiterTable) => {
    setSelectedTable(t);
    setOrderItems([]);
    setNotes('');
    setShowMenu(false);
  };

  const sendToKitchen = () => {
    toast.success(`Order sent to kitchen for Table ${selectedTable?.number}`);
    setOrderItems([]);
  };

  const requestBill = () => {
    toast.success(`Bill requested for Table ${selectedTable?.number} (€${selectedTable?.amount})`);
  };

  const transferTable = () => {
    toast.info(`Transfer initiated for Table ${selectedTable?.number}`);
  };

  const filteredMenu = menuItems.filter((m) => m.available && (search === '' || m.name.toLowerCase().includes(search.toLowerCase())));

  if (selectedTable) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedTable(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-serif text-2xl font-semibold">Table {selectedTable.number}</h2>
            <p className="text-sm text-muted-foreground">{selectedTable.guests} guests · {selectedTable.elapsedMin} min · €{selectedTable.amount}</p>
          </div>
        </div>

        {!showMenu ? (
          <>
            {/* Current order items */}
            <Card className="border-border/60">
              <CardContent className="p-4">
                <h3 className="mb-3 font-semibold">Current Order</h3>
                {orderItems.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No items in this order yet</p>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">€{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(item.name, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(item.name, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold">€{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-border/60">
              <CardContent className="p-4">
                <Label className="mb-2 flex items-center gap-1.5"><StickyNote className="h-4 w-4" /> Order Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions…" />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button size="lg" className="h-14 text-base" onClick={() => setShowMenu(true)}>
                <Plus className="mr-2 h-5 w-5" /> Add Items
              </Button>
              <Button size="lg" variant="secondary" className="h-14 text-base" onClick={sendToKitchen} disabled={orderItems.length === 0}>
                <Send className="mr-2 h-5 w-5" /> Send to Kitchen
              </Button>
              <Button size="lg" variant="outline" className="h-14 text-base" onClick={requestBill}>
                <Receipt className="mr-2 h-5 w-5" /> Request Bill
              </Button>
              <Button size="lg" variant="outline" className="h-14 text-base" onClick={transferTable}>
                <ArrowRightLeft className="mr-2 h-5 w-5" /> Transfer Table
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Menu browser */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setShowMenu(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Input placeholder="Search dishes…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToOrder(item.name, item.price)}
                  className="rounded-lg border border-border/60 bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                  <p className="mt-2 text-base font-bold">€{item.price}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Waiter App" description="Jean's assigned tables" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((t) => (
          <button
            key={t.number}
            onClick={() => openTable(t)}
            className="rounded-xl border border-border/60 bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="font-serif text-xl font-semibold">Table {t.number}</p>
              <StatusBadge status={t.status} />
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {t.guests} guests</p>
              <p className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {t.elapsedMin} min</p>
              <p className="flex items-center gap-1.5 font-semibold text-foreground"><Euro className="h-4 w-4" /> {t.amount}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
