
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { expenses, invoices } from '@/lib/mock-data';
import { Download, FileText, FileSpreadsheet, Euro, Percent } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountingPage() {
  const [tab, setTab] = useState('vat');

  const totalSales = 8742.50;
  const vatCollected = totalSales * 0.1;
  const vatRate = 10;
  const netSales = totalSales - vatCollected;
  const serviceCharge = totalSales * 0.05;

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalVatExpenses = expenses.reduce((s, e) => s + e.vat, 0);
  const pendingInvoices = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue');
  const pendingTotal = pendingInvoices.reduce((s, i) => s + i.amount, 0);

  const exportCsv = () => toast.success('CSV file downloaded');
  const exportPdf = () => toast.success('PDF file downloaded');
  const exportAccounting = () => toast.success('Accounting data exported');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Accounting"
        description="VAT, expenses, invoices, and financial exports"
        actions={
          <>
            <Button variant="outline" onClick={exportCsv}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Button variant="outline" onClick={exportPdf}><FileText className="mr-2 h-4 w-4" /> Export PDF</Button>
            <Button onClick={exportAccounting}><Download className="mr-2 h-4 w-4" /> Export Accounting Data</Button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="vat">VAT Summary</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* VAT Summary */}
        <TabsContent value="vat" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Sales (incl. VAT)</p>
                <p className="mt-2 text-2xl font-bold">€{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">VAT Collected (10%)</p>
                <p className="mt-2 text-2xl font-bold">€{vatCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Net Sales</p>
                <p className="mt-2 text-2xl font-bold">€{netSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Service Charge (5%)</p>
                <p className="mt-2 text-2xl font-bold">€{serviceCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">VAT Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Gross Sales</span>
                  </div>
                  <span className="font-semibold">€{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">VAT Rate</span>
                  </div>
                  <span className="font-semibold">{vatRate}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/40 p-3 bg-muted/30">
                  <span className="text-sm font-medium">VAT Collected</span>
                  <span className="font-semibold text-primary">€{vatCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <span className="text-sm font-medium">Net Sales (excl. VAT)</span>
                  <span className="font-semibold">€{netSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <span className="text-sm font-medium">Input VAT (Expenses)</span>
                  <span className="font-semibold">€{totalVatExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <span className="text-sm font-bold">VAT Payable</span>
                  <span className="font-bold text-primary">€{(vatCollected - totalVatExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="mt-2 text-2xl font-bold">€{totalExpenses.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">VAT on Expenses</p>
                <p className="mt-2 text-2xl font-bold">€{totalVatExpenses.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="mt-2 text-2xl font-bold">€{expenses.filter(e => e.status === 'Pending' || e.status === 'Overdue').reduce((s, e) => s + e.amount, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Supplier</TableHead>
                      <TableHead className="hidden lg:table-cell">Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right hidden md:table-cell">VAT</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="text-muted-foreground">{e.date}</TableCell>
                        <TableCell className="font-medium">{e.category}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{e.supplier}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">{e.description}</TableCell>
                        <TableCell className="text-right font-semibold">€{e.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right hidden md:table-cell text-muted-foreground">€{e.vat.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status={e.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="mt-2 text-2xl font-bold">€{invoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="mt-2 text-2xl font-bold">€{pendingTotal.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="mt-2 text-2xl font-bold text-destructive">€{invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

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
                    {invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                        <TableCell>{inv.supplier}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{inv.date}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{inv.dueDate}</TableCell>
                        <TableCell className="text-right font-semibold">€{inv.amount.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status={inv.status} /></TableCell>
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
