'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { payments as initialPayments } from '@/lib/mock-data';
import type { Payment } from '@/types';
import {
  CreditCard, Banknote, Smartphone, Euro, TrendingDown, Search,
  Split, RotateCcw, Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

const methodIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Cash: Banknote,
  Visa: CreditCard,
  Mastercard: CreditCard,
  Amex: CreditCard,
  'Apple Pay': Smartphone,
  'Google Pay': Smartphone,
  Online: Smartphone,
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [selected, setSelected] = useState<Payment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterMethod !== 'all' && p.method !== filterMethod) return false;
      if (search && !p.transactionId.toLowerCase().includes(search.toLowerCase()) && !p.order.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [payments, filterStatus, filterMethod, search]);

  const todayTotal = payments.reduce((s, p) => s + (p.status === 'Completed' ? p.amount : 0), 0);
  const cashTotal = payments.filter((p) => p.method === 'Cash' && p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const cardTotal = payments.filter((p) => (p.method === 'Visa' || p.method === 'Mastercard' || p.method === 'Amex') && p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const onlineTotal = payments.filter((p) => (p.method === 'Apple Pay' || p.method === 'Google Pay' || p.method === 'Online') && p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const tipsTotal = payments.filter((p) => p.status === 'Completed').reduce((s, p) => s + p.tip, 0);
  const refundsTotal = payments.filter((p) => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0);

  const openPayment = (p: Payment) => {
    setSelected(p);
    setDrawerOpen(true);
  };

  const processRefund = () => {
    if (!selected) return;
    setPayments((prev) => prev.map((p) => (p.id === selected.id ? { ...p, status: 'Refunded' } : p)));
    toast.success(`Refund processed for ${selected.transactionId}: €${refundAmount.toFixed(2)}`);
    setRefundOpen(false);
    setRefundAmount(0);
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Payments"
        description="Track transactions, tips, and refunds"
        actions={
          <>
            <Button variant="outline" onClick={() => setSplitOpen(true)}><Split className="mr-2 h-4 w-4" /> Split Payment</Button>
            <Button variant="outline" onClick={() => { setSelected(null); setRefundOpen(true); }}><RotateCcw className="mr-2 h-4 w-4" /> Refund</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard label="Today's Payments" value={`€${todayTotal.toLocaleString()}`} icon={Euro} />
        <KPICard label="Cash" value={`€${cashTotal.toLocaleString()}`} icon={Banknote} />
        <KPICard label="Card" value={`€${cardTotal.toLocaleString()}`} icon={CreditCard} />
        <KPICard label="Online" value={`€${onlineTotal.toLocaleString()}`} icon={Smartphone} />
        <KPICard label="Tips" value={`€${tipsTotal.toLocaleString()}`} icon={TrendingDown} />
        <KPICard label="Refunds" value={`€${refundsTotal.toLocaleString()}`} icon={RotateCcw} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transaction ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Visa">Visa</SelectItem>
            <SelectItem value="Mastercard">Mastercard</SelectItem>
            <SelectItem value="Amex">Amex</SelectItem>
            <SelectItem value="Apple Pay">Apple Pay</SelectItem>
            <SelectItem value="Google Pay">Google Pay</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="hidden md:table-cell">Table</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Tip</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 25).map((p) => {
                  const Icon = methodIcons[p.method] || CreditCard;
                  return (
                    <TableRow key={p.id} className="cursor-pointer" onClick={() => openPayment(p)}>
                      <TableCell className="font-medium">{p.transactionId}</TableCell>
                      <TableCell>{p.order}</TableCell>
                      <TableCell className="hidden md:table-cell">{p.table ? `Table ${p.table}` : '—'}</TableCell>
                      <TableCell className="text-right font-semibold">€{p.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {p.method}
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">{p.tip > 0 ? `€${p.tip.toFixed(2)}` : '—'}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{p.time}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">{selected.transactionId}</SheetTitle>
                <SheetDescription>{selected.order} · {selected.table ? `Table ${selected.table}` : 'Takeaway'}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold">€{selected.amount.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Tip</p>
                    <p className="text-lg font-bold">€{selected.tip.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Method</p>
                    <p className="text-sm font-medium">{selected.method}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">{selected.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selected.status} />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Receipt printed')}>
                    <Receipt className="mr-2 h-4 w-4" /> Print Receipt
                  </Button>
                  {selected.status === 'Completed' && (
                    <Button variant="destructive" className="w-full justify-start" onClick={() => { setRefundAmount(selected.amount); setRefundOpen(true); }}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Refund Payment
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Split Payment Modal */}
      <Dialog open={splitOpen} onOpenChange={setSplitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Split Payment</DialogTitle>
            <DialogDescription>Divide a payment across multiple methods</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Total Amount</Label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Method 1</Label>
                <Select defaultValue="Cash">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Amount 1</Label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label className="mb-1.5 block">Method 2</Label>
                <Select defaultValue="Visa">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Amount 2</Label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSplitOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Split payment processed'); setSplitOpen(false); }}>Process Split</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>{selected ? selected.transactionId : 'Enter transaction details'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Refund Amount</Label>
              <Input type="number" step="0.01" value={refundAmount} onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={processRefund} disabled={refundAmount <= 0}>Process Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
