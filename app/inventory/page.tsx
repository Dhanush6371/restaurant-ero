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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { inventoryItems as initialItems } from '@/lib/mock-data';
import type { InventoryItem } from '@/types';
import {
  Package, AlertTriangle, XCircle, Trash2, Search, Plus, Minus,
  History, ArrowRightLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryPage() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [wasteItem, setWasteItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [wasteAmount, setWasteAmount] = useState(0);
  const [wasteReason, setWasteReason] = useState('');

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (filterStatus !== 'all' && i.status !== filterStatus) return false;
      if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, filterStatus, search]);

  const inventoryValue = items.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);
  const lowStock = items.filter((i) => i.status === 'Low Stock').length;
  const outOfStock = items.filter((i) => i.status === 'Out of Stock').length;
  const critical = items.filter((i) => i.status === 'Critical').length;

  const applyAdjust = () => {
    if (!adjustItem) return;
    setItems((prev) => prev.map((i) => {
      if (i.id === adjustItem.id) {
        const newStock = Math.max(0, i.currentStock + adjustAmount);
        const status = newStock === 0 ? 'Out of Stock' : newStock < i.minLevel * 0.3 ? 'Critical' : newStock < i.minLevel ? 'Low Stock' : 'In Stock';
        return { ...i, currentStock: newStock, status: status as InventoryItem['status'] };
      }
      return i;
    }));
    toast.success(`${adjustItem.name} stock adjusted by ${adjustAmount > 0 ? '+' : ''}${adjustAmount}`);
    setAdjustItem(null);
    setAdjustAmount(0);
  };

  const applyWaste = () => {
    if (!wasteItem) return;
    setItems((prev) => prev.map((i) => {
      if (i.id === wasteItem.id) {
        const newStock = Math.max(0, i.currentStock - wasteAmount);
        const status = newStock === 0 ? 'Out of Stock' : newStock < i.minLevel * 0.3 ? 'Critical' : newStock < i.minLevel ? 'Low Stock' : 'In Stock';
        return { ...i, currentStock: newStock, status: status as InventoryItem['status'] };
      }
      return i;
    }));
    toast.success(`${wasteAmount} ${wasteItem.unit} of ${wasteItem.name} recorded as waste`);
    setWasteItem(null);
    setWasteAmount(0);
    setWasteReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Inventory" description="Track stock levels, wastage, and transfers" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Inventory Value" value={`€${inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={Package} />
        <KPICard label="Low Stock" value={String(lowStock)} icon={AlertTriangle} />
        <KPICard label="Critical" value={String(critical)} icon={AlertTriangle} />
        <KPICard label="Out of Stock" value={String(outOfStock)} icon={XCircle} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ingredients…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="In Stock">In Stock</SelectItem>
            <SelectItem value="Low Stock">Low Stock</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Min Level</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Cost/Unit</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{item.category}</TableCell>
                    <TableCell className="text-right">{item.currentStock} {item.unit}</TableCell>
                    <TableCell className="hidden lg:table-cell text-right text-muted-foreground">{item.minLevel} {item.unit}</TableCell>
                    <TableCell className="hidden md:table-cell text-right text-muted-foreground">€{item.costPerUnit.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">€{(item.currentStock * item.costPerUnit).toFixed(2)}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => { setAdjustItem(item); setAdjustAmount(0); }}>
                          <Plus className="mr-1 h-3 w-3" /> Adjust
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => { setWasteItem(item); setWasteAmount(0); setWasteReason(''); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.info(`Transfer for ${item.name}`)}>
                          <ArrowRightLeft className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.info(`History for ${item.name}`)}>
                          <History className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Stock Modal */}
      <Dialog open={!!adjustItem} onOpenChange={(v) => !v && setAdjustItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>{adjustItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
              <span>Current Stock</span>
              <span className="font-semibold">{adjustItem?.currentStock} {adjustItem?.unit}</span>
            </div>
            <div>
              <Label className="mb-1.5 block">Adjustment (+/-)</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setAdjustAmount((a) => a - 1)}><Minus className="h-4 w-4" /></Button>
                <Input type="number" value={adjustAmount} onChange={(e) => setAdjustAmount(parseFloat(e.target.value) || 0)} className="text-center" />
                <Button variant="outline" size="icon" onClick={() => setAdjustAmount((a) => a + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
              <span>New Stock</span>
              <span className="font-semibold">{adjustItem ? Math.max(0, adjustItem.currentStock + adjustAmount) : 0} {adjustItem?.unit}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustItem(null)}>Cancel</Button>
            <Button onClick={applyAdjust}>Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waste Modal */}
      <Dialog open={!!wasteItem} onOpenChange={(v) => !v && setWasteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Record Wastage</DialogTitle>
            <DialogDescription>{wasteItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Wasted Amount</Label>
              <Input type="number" step="0.1" value={wasteAmount} onChange={(e) => setWasteAmount(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Reason</Label>
              <Textarea value={wasteReason} onChange={(e) => setWasteReason(e.target.value)} placeholder="Expired, damaged, spillage…" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWasteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={applyWaste} disabled={wasteAmount <= 0}>Record Waste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
