
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPICard } from '@/components/shared/kpi-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { customers as initialCustomers, reservations, orders } from '@/lib/mock-data';
import type { Customer } from '@/types';
import { Users, Repeat, Crown, Euro, Star, Search, Plus, Phone, Mail, Heart, Wine, CircleAlert as AlertCircle, Cake, StickyNote, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const loyaltyColors: Record<string, string> = {
  Bronze: 'bg-amber-600/10 text-amber-700 border-amber-600/20',
  Silver: 'bg-gray-400/10 text-gray-600 border-gray-400/20',
  Gold: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  Platinum: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
};

export default function CustomersPage() {
  const [customers] = useState(initialCustomers);
  const [search, setSearch] = useState('');
  const [filterLoyalty, setFilterLoyalty] = useState('all');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', email: '', phone: '' });

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (filterLoyalty !== 'all' && c.loyaltyStatus !== filterLoyalty) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [customers, filterLoyalty, search]);

  const openProfile = (c: Customer) => {
    setSelected(c);
    setDrawerOpen(true);
  };

  const addCustomer = () => {
    toast.success(`${newCust.name} added to CRM`);
    setAddOpen(false);
    setNewCust({ name: '', email: '', phone: '' });
  };

  const totalCustomers = customers.length;
  const returning = customers.filter((c) => c.visits > 5).length;
  const vip = customers.filter((c) => c.loyaltyStatus === 'Platinum' || c.loyaltyStatus === 'Gold').length;
  const avgSpend = Math.round(customers.reduce((s, c) => s + c.averageSpend, 0) / customers.length);
  const totalPoints = customers.reduce((s, c) => s + c.loyaltyPoints, 0);

  const customerReservations = selected ? reservations.filter((r) => r.guest === selected.name) : [];
  const customerOrders = selected ? orders.filter((o) => o.waiter === selected.name).slice(0, 5) : [];

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Customers / CRM"
        description="Manage guest profiles, loyalty, and preferences"
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Customer</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard label="Total Customers" value={String(totalCustomers)} icon={Users} />
        <KPICard label="Returning" value={String(returning)} icon={Repeat} />
        <KPICard label="VIP Customers" value={String(vip)} icon={Crown} />
        <KPICard label="Average Spend" value={`€${avgSpend}`} icon={Euro} />
        <KPICard label="Loyalty Points" value={totalPoints.toLocaleString()} icon={Star} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 pl-9" />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {['all', 'Bronze', 'Silver', 'Gold', 'Platinum'].map((l) => (
            <button
              key={l}
              onClick={() => setFilterLoyalty(l)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${filterLoyalty === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {l === 'all' ? 'All' : l}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                  <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                  <TableHead className="text-right">Total Spend</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Avg Spend</TableHead>
                  <TableHead className="hidden lg:table-cell">Preference</TableHead>
                  <TableHead>Loyalty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 20).map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => openProfile(c)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials(c.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{c.visits}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{c.lastVisit}</TableCell>
                    <TableCell className="text-right font-semibold">€{c.totalSpend.toLocaleString()}</TableCell>
                    <TableCell className="text-right hidden md:table-cell text-muted-foreground">€{c.averageSpend}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{c.preference}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${loyaltyColors[c.loyaltyStatus]}`}>
                        {c.loyaltyStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Profile Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">{initials(selected.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="font-serif text-xl">{selected.name}</SheetTitle>
                    <SheetDescription>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${loyaltyColors[selected.loyaltyStatus]}`}>
                        {selected.loyaltyStatus}
                      </span>
                      <span className="ml-2">{selected.loyaltyPoints} points</span>
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                {/* Contact */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Contact</h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {selected.email}</p>
                    <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {selected.phone}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-border/60 p-3 text-center">
                    <p className="text-lg font-bold">{selected.visits}</p>
                    <p className="text-xs text-muted-foreground">Visits</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3 text-center">
                    <p className="text-lg font-bold">€{selected.totalSpend.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Spend</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3 text-center">
                    <p className="text-lg font-bold">€{selected.averageSpend}</p>
                    <p className="text-xs text-muted-foreground">Avg Spend</p>
                  </div>
                </div>

                {/* Favorite Dishes */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold"><Heart className="h-4 w-4" /> Favorite Dishes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.favoriteDishes.map((d) => (
                      <span key={d} className="rounded-lg border border-border/60 px-3 py-1 text-xs">{d}</span>
                    ))}
                  </div>
                </div>

                {/* Wine Preferences */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold"><Wine className="h-4 w-4" /> Wine Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.winePreferences.map((w) => (
                      <span key={w} className="rounded-lg border border-border/60 px-3 py-1 text-xs">{w}</span>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                {selected.allergies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold"><AlertCircle className="h-4 w-4 text-destructive" /> Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.allergies.map((a) => (
                        <span key={a} className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1 text-xs text-destructive">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Occasions */}
                {selected.specialOccasions && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold"><Cake className="h-4 w-4" /> Special Occasions</h4>
                    <p className="text-sm text-muted-foreground">{selected.specialOccasions}</p>
                  </div>
                )}

                {/* Notes */}
                {selected.notes && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold"><StickyNote className="h-4 w-4" /> Notes</h4>
                    <p className="text-sm text-muted-foreground">{selected.notes}</p>
                  </div>
                )}

                {/* Visit History */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Recent Reservations</h4>
                  {customerReservations.length > 0 ? (
                    <div className="space-y-2">
                      {customerReservations.slice(0, 3).map((r) => (
                        <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/40 p-2.5 text-sm">
                          <div>
                            <p>{r.date} at {r.time}</p>
                            <p className="text-xs text-muted-foreground">{r.guests} guests · {r.area}</p>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No reservations yet</p>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Customer Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>Create a new customer profile</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Name</Label>
              <Input value={newCust.name} onChange={(e) => setNewCust({ ...newCust, name: e.target.value })} placeholder="Full name" />
            </div>
            <div>
              <Label className="mb-1.5 block">Email</Label>
              <Input type="email" value={newCust.email} onChange={(e) => setNewCust({ ...newCust, email: e.target.value })} placeholder="guest@email.com" />
            </div>
            <div>
              <Label className="mb-1.5 block">Phone</Label>
              <Input value={newCust.phone} onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })} placeholder="+33…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addCustomer} disabled={!newCust.name}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
