
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { suppliers, purchaseOrders } from '@/lib/mock-data';
import {
  Plus, Phone, Mail, Euro,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PurchasingPage() {
  const [tab, setTab] = useState('suppliers');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Purchasing"
        description="Manage suppliers, purchase orders, and deliveries"
        actions={<Button onClick={() => toast.info('Create PO flow')}><Plus className="mr-2 h-4 w-4" /> New Purchase Order</Button>}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="invoices">Supplier Invoices</TabsTrigger>
        </TabsList>

        {/* Suppliers */}
        <TabsContent value="suppliers">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden lg:table-cell">Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Last Order</TableHead>
                      <TableHead className="text-right">Outstanding</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.contact}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{s.category}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="space-y-0.5">
                            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{s.phone}</p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{s.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{s.lastOrder}</TableCell>
                        <TableCell className="text-right font-medium">{s.outstanding > 0 ? `€${s.outstanding.toLocaleString()}` : '—'}</TableCell>
                        <TableCell><StatusBadge status={s.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders */}
        <TabsContent value="orders">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="hidden md:table-cell">Order Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Expected Delivery</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.poNumber}</TableCell>
                        <TableCell>{po.supplier}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{po.orderDate}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">{po.expectedDelivery}</TableCell>
                        <TableCell className="text-right">{po.items}</TableCell>
                        <TableCell className="text-right font-semibold"><Euro className="inline mr-1 h-3 w-3" />{po.total.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status={po.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deliveries */}
        <TabsContent value="deliveries">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="space-y-3">
                {purchaseOrders.filter((p) => p.status === 'Sent' || p.status === 'Partially Received').map((po) => (
                  <div key={po.id} className="flex items-center justify-between rounded-lg border border-border/40 p-4">
                    <div>
                      <p className="font-medium">{po.poNumber}</p>
                      <p className="text-sm text-muted-foreground">{po.supplier} · {po.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{po.total.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Expected: {po.expectedDelivery}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`Delivery received for ${po.poNumber}`)}>
                      Receive
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices */}
        <TabsContent value="invoices">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.filter((s) => s.outstanding > 0).map((s, i) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">INV-2026-{(45 - i).toString().padStart(3, '0')}</TableCell>
                        <TableCell>{s.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{s.lastOrder}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{s.lastOrder}</TableCell>
                        <TableCell className="text-right font-semibold">€{s.outstanding.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status="Pending" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
