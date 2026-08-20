
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/states';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { reservations as initialReservations } from '@/lib/mock-data';
import type { Reservation, ReservationStatus, TableZone } from '@/types';
import {
  Plus, Calendar, List, Filter, Phone, Mail, Users, Clock, Search,
} from 'lucide-react';
import { toast } from 'sonner';

const statuses: ReservationStatus[] = ['Confirmed', 'Seated', 'Completed', 'Cancelled', 'No-show'];
const areas: TableZone[] = ['Main Dining', 'Terrace', 'Bar', 'Private Dining'];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(initialReservations);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterGuests, setFilterGuests] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'week' | 'all'>('all');

  const [newRes, setNewRes] = useState({
    guest: '', phone: '', email: '', date: '2026-08-19', time: '19:00', guests: 2, table: '', area: 'Main Dining' as TableZone, specialRequest: '',
  });

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (filterArea !== 'all' && r.area !== filterArea) return false;
      if (filterGuests !== 'all') {
        const g = parseInt(filterGuests);
        if (g === 1 && r.guests > 2) return false;
        if (g === 3 && (r.guests < 3 || r.guests > 4)) return false;
        if (g === 5 && r.guests < 5) return false;
      }
      if (search && !r.guest.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFilter === 'today' && r.date !== '2026-08-19') return false;
      if (dateFilter === 'tomorrow' && r.date !== '2026-08-20') return false;
      if (dateFilter === 'week' && !r.date.startsWith('2026-08-')) return false;
      return true;
    });
  }, [reservations, filterStatus, filterArea, filterGuests, search, dateFilter]);

  const createReservation = () => {
    const id = `r${reservations.length + 1}`;
    const newReservation: Reservation = {
      id, guest: newRes.guest, phone: newRes.phone, email: newRes.email,
      date: newRes.date, time: newRes.time, guests: newRes.guests,
      table: newRes.table ? parseInt(newRes.table) : null,
      area: newRes.area, specialRequest: newRes.specialRequest, status: 'Confirmed',
    };
    setReservations([newReservation, ...reservations]);
    setNewOpen(false);
    setNewRes({ guest: '', phone: '', email: '', date: '2026-08-19', time: '19:00', guests: 2, table: '', area: 'Main Dining', specialRequest: '' });
    toast.success('Reservation created');
  };

  const updateStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Reservation marked as ${status}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reservations"
        description="Manage bookings and guest reservations"
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Reservation
          </Button>
        }
      />

      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {(['all', 'today', 'tomorrow', 'week'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                dateFilter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'All' : f === 'week' ? 'This Week' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')}>
          <TabsList>
            <TabsTrigger value="list"><List className="mr-1 h-4 w-4" /> List</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="mr-1 h-4 w-4" /> Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search guest…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><Filter className="mr-1 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Area" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterGuests} onValueChange={setFilterGuests}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Guests" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Party Size</SelectItem>
            <SelectItem value="1">1–2 guests</SelectItem>
            <SelectItem value="3">3–4 guests</SelectItem>
            <SelectItem value="5">5+ guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No reservations found"
          description="Try changing your filters or create a new reservation."
          actionLabel="Create Reservation"
          onAction={() => setNewOpen(true)}
          icon={Calendar}
        />
      ) : view === 'list' ? (
        <Card className="border-border/60">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead className="hidden lg:table-cell">Area</TableHead>
                  <TableHead className="hidden lg:table-cell">Table</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{r.guest}</p>
                        {r.specialRequest && <p className="text-xs text-muted-foreground">{r.specialRequest}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{r.phone}</p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{r.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span></TableCell>
                    <TableCell><span className="flex items-center gap-1"><Users className="h-3 w-3" />{r.guests}</span></TableCell>
                    <TableCell className="hidden lg:table-cell">{r.area}</TableCell>
                    <TableCell className="hidden lg:table-cell">{r.table ? `Table ${r.table}` : '—'}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <Select onValueChange={(v) => updateStatus(r.id, v as ReservationStatus)}>
                        <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Change" /></SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <Card key={r.id} className="border-border/60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{r.guest}</p>
                    <p className="text-xs text-muted-foreground">{r.date} at {r.time}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1"><Users className="h-3 w-3" /> {r.guests} guests</p>
                  <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {r.phone}</p>
                  <p>{r.area}{r.table ? ` · Table ${r.table}` : ''}</p>
                  {r.specialRequest && <p className="text-accent">{r.specialRequest}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Reservation Modal */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Reservation</DialogTitle>
            <DialogDescription>Create a new booking for Maison Étoile</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Guest Name</Label>
                <Input value={newRes.guest} onChange={(e) => setNewRes({ ...newRes, guest: e.target.value })} placeholder="Full name" />
              </div>
              <div>
                <Label className="mb-1.5 block">Phone</Label>
                <Input value={newRes.phone} onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })} placeholder="+33…" />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Email</Label>
              <Input type="email" value={newRes.email} onChange={(e) => setNewRes({ ...newRes, email: e.target.value })} placeholder="guest@email.com" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="mb-1.5 block">Date</Label>
                <Input type="date" value={newRes.date} onChange={(e) => setNewRes({ ...newRes, date: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Time</Label>
                <Input type="time" value={newRes.time} onChange={(e) => setNewRes({ ...newRes, time: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Guests</Label>
                <Input type="number" min={1} value={newRes.guests} onChange={(e) => setNewRes({ ...newRes, guests: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Area</Label>
                <Select value={newRes.area} onValueChange={(v) => setNewRes({ ...newRes, area: v as TableZone })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Table</Label>
                <Input type="number" value={newRes.table} onChange={(e) => setNewRes({ ...newRes, table: e.target.value })} placeholder="Auto-assign" />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Special Request</Label>
              <Input value={newRes.specialRequest} onChange={(e) => setNewRes({ ...newRes, specialRequest: e.target.value })} placeholder="Window seat, birthday, etc." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={createReservation} disabled={!newRes.guest}>Create Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
