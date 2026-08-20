
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/shared/kpi-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { restaurantTables } from '@/lib/mock-data';
import type { RestaurantTable, TableZone } from '@/types';
import {
  Armchair, Users, Clock, Euro, Plus, ArrowRightLeft, Split as SplitIcon,
  Printer, CheckCircle, X, User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const zones: TableZone[] = ['Main Dining', 'Terrace', 'Bar', 'Private Dining'];

const statusColors: Record<string, string> = {
  'Available': 'border-success/30 bg-success/5 hover:bg-success/10',
  'Occupied': 'border-primary/30 bg-primary/5 hover:bg-primary/10',
  'Reserved': 'border-accent/30 bg-accent/5 hover:bg-accent/10',
  'Cleaning': 'border-muted bg-muted/20 hover:bg-muted/30',
  'Payment Due': 'border-warning/30 bg-warning/5 hover:bg-warning/10',
};

export default function TablesPage() {
  const [tables, setTables] = useState(restaurantTables);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [mergeFrom, setMergeFrom] = useState<string>('');
  const [mergeTo, setMergeTo] = useState<string>('');
  const [splitTable, setSplitTable] = useState<string>('');
  const [splitGuests, setSplitGuests] = useState(2);

  const openTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    setDrawerOpen(true);
  };

  const markAvailable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: 'Available', guests: undefined, waiter: undefined, amount: undefined, elapsedMin: undefined, reservation: undefined } : t))
    );
    toast.success(`Table marked as available`);
    setDrawerOpen(false);
  };

  const handleMerge = () => {
    toast.success(`Tables ${mergeFrom} and ${mergeTo} merged`);
    setMergeOpen(false);
    setMergeFrom('');
    setMergeTo('');
  };

  const handleSplit = () => {
    toast.success(`Table ${splitTable} split for ${splitGuests} guests`);
    setSplitOpen(false);
    setSplitTable('');
    setSplitGuests(2);
  };

  const counts = {
    occupied: tables.filter((t) => t.status === 'Occupied').length,
    available: tables.filter((t) => t.status === 'Available').length,
    reserved: tables.filter((t) => t.status === 'Reserved').length,
    cleaning: tables.filter((t) => t.status === 'Cleaning').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tables"
        description="Interactive floor plan for Maison Étoile"
        actions={
          <>
            <Button variant="outline" onClick={() => setMergeOpen(true)}>
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Merge
            </Button>
            <Button variant="outline" onClick={() => setSplitOpen(true)}>
              <SplitIcon className="mr-2 h-4 w-4" /> Split
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Table
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Occupied" value={String(counts.occupied)} icon={Users} />
        <KPICard label="Available" value={String(counts.available)} icon={Armchair} />
        <KPICard label="Reserved" value={String(counts.reserved)} icon={Clock} />
        <KPICard label="Cleaning" value={String(counts.cleaning)} icon={CheckCircle} />
      </div>

      {/* Floor plan by zone */}
      <div className="space-y-6">
        {zones.map((zone) => {
          const zoneTables = tables.filter((t) => t.zone === zone);
          if (zoneTables.length === 0) return null;
          return (
            <Card key={zone} className="border-border/60">
              <CardContent className="p-5">
                <h3 className="mb-4 font-serif text-lg font-semibold">{zone}</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {zoneTables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => openTable(table)}
                      className={cn(
                        'group relative rounded-xl border-2 p-3 text-left transition-all hover:shadow-md',
                        statusColors[table.status]
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-sm font-bold">
                          {table.number}
                        </span>
                        <StatusBadge status={table.status} className="text-[10px]" />
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Armchair className="h-3 w-3" /> {table.seats} seats
                        </p>
                        {table.guests && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" /> {table.guests} guests
                          </p>
                        )}
                        {table.amount && (
                          <p className="flex items-center gap-1 text-xs font-semibold">
                            <Euro className="h-3 w-3" /> {table.amount}
                          </p>
                        )}
                        {table.waiter && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" /> {table.waiter}
                          </p>
                        )}
                        {table.elapsedMin && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {table.elapsedMin} min
                          </p>
                        )}
                        {table.reservation && (
                          <p className="truncate text-xs font-medium text-accent">{table.reservation}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedTable && (
            <>
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">Table {selectedTable.number}</SheetTitle>
                <SheetDescription>
                  {selectedTable.zone} · {selectedTable.seats} seats
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedTable.status} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Guests</p>
                    <p className="text-lg font-semibold">{selectedTable.guests || '—'}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Waiter</p>
                    <p className="text-lg font-semibold">{selectedTable.waiter || '—'}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Order Total</p>
                    <p className="text-lg font-semibold">{selectedTable.amount ? `€${selectedTable.amount}` : '—'}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Elapsed</p>
                    <p className="text-lg font-semibold">{selectedTable.elapsedMin ? `${selectedTable.elapsedMin} min` : '—'}</p>
                  </div>
                </div>

                {selectedTable.reservation && (
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                    <p className="text-xs text-muted-foreground">Reservation</p>
                    <p className="text-sm font-medium">{selectedTable.reservation}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Opening order…')}>
                    <Plus className="mr-2 h-4 w-4" /> Open Order
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Adding items…')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Items
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => { setMergeOpen(true); setDrawerOpen(false); }}>
                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Table
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => { setSplitOpen(true); setDrawerOpen(false); }}>
                    <SplitIcon className="mr-2 h-4 w-4" /> Split Table
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Bill printed')}>
                    <Printer className="mr-2 h-4 w-4" /> Print Bill
                  </Button>
                  <Button className="w-full justify-start" onClick={() => markAvailable(selectedTable.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark Available
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Merge modal */}
      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Merge Tables</DialogTitle>
            <DialogDescription>Combine two tables into a single seating</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">From Table</Label>
              <Select value={mergeFrom} onValueChange={setMergeFrom}>
                <SelectTrigger><SelectValue placeholder="Select table" /></SelectTrigger>
                <SelectContent>
                  {tables.map((t) => <SelectItem key={t.id} value={String(t.number)}>{`Table ${t.number} (${t.zone})`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Into Table</Label>
              <Select value={mergeTo} onValueChange={setMergeTo}>
                <SelectTrigger><SelectValue placeholder="Select table" /></SelectTrigger>
                <SelectContent>
                  {tables.map((t) => <SelectItem key={t.id} value={String(t.number)}>{`Table ${t.number} (${t.zone})`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeOpen(false)}>Cancel</Button>
            <Button onClick={handleMerge} disabled={!mergeFrom || !mergeTo}>Merge Tables</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Split modal */}
      <Dialog open={splitOpen} onOpenChange={setSplitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Split Table</DialogTitle>
            <DialogDescription>Split a table into separate parties</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Table to Split</Label>
              <Select value={splitTable} onValueChange={setSplitTable}>
                <SelectTrigger><SelectValue placeholder="Select table" /></SelectTrigger>
                <SelectContent>
                  {tables.filter((t) => t.status === 'Occupied').map((t) => (
                    <SelectItem key={t.id} value={String(t.number)}>{`Table ${t.number} (${t.guests} guests)`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Guests in New Party</Label>
              <Input type="number" min={1} value={splitGuests} onChange={(e) => setSplitGuests(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSplitOpen(false)}>Cancel</Button>
            <Button onClick={handleSplit} disabled={!splitTable}>Split Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
