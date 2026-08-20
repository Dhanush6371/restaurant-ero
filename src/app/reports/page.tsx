
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/page-header';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  menuItems, salesHistory, hourlySales, revenueBreakdown, topDishes,
} from '@/lib/mock-data';
import {
  TrendingUp, TrendingDown, Euro, Percent, Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const dateRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom'];

const staffPerformance = [
  { name: 'Jean', sales: 1240, orders: 28, avgTicket: 44, tips: 85 },
  { name: 'Claire', sales: 980, orders: 22, avgTicket: 45, tips: 72 },
  { name: 'Manon', sales: 720, orders: 16, avgTicket: 45, tips: 48 },
  { name: 'Charlotte', sales: 560, orders: 12, avgTicket: 47, tips: 65 },
  { name: 'Marie', sales: 420, orders: 10, avgTicket: 42, tips: 38 },
];

const foodCostTrend = [
  { day: 'Mon', cost: 28.2 }, { day: 'Tue', cost: 27.8 }, { day: 'Wed', cost: 28.4 },
  { day: 'Thu', cost: 29.1 }, { day: 'Fri', cost: 27.5 }, { day: 'Sat', cost: 28.0 }, { day: 'Sun', cost: 28.4 },
];

const worstDishes = [
  { name: 'Pâté de Campagne', quantity: 4, revenue: 52 },
  { name: 'Gaspacho Provençal', quantity: 5, revenue: 60 },
  { name: 'Pissaladière', quantity: 6, revenue: 84 },
  { name: 'Quenelle de Brochet', quantity: 7, revenue: 196 },
  { name: 'Croque Monsieur', quantity: 8, revenue: 144 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [tab, setTab] = useState('sales');

  const grossSales = salesHistory.reduce((s, r) => s + r.sales, 0);
  const discounts = Math.round(grossSales * 0.03);
  const refunds = Math.round(grossSales * 0.01);
  const netSales = grossSales - discounts - refunds;
  const vat = Math.round(netSales * 0.1);
  const serviceCharge = Math.round(netSales * 0.05);

  const exportReport = () => {
    toast.success('Report exported as CSV');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports"
        description="Sales performance, product analysis, and financial reporting"
        actions={<Button variant="outline" onClick={exportReport}><Download className="mr-2 h-4 w-4" /> Export Report</Button>}
      />

      {/* Date filters */}
      <div className="flex flex-wrap items-center gap-2">
        {dateRanges.map((r) => (
          <button
            key={r}
            onClick={() => setDateRange(r)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              dateRange === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="foodcost">Food Cost</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="channels">Channel Performance</TabsTrigger>
        </TabsList>

        {/* Sales */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { label: 'Gross Sales', value: `€${grossSales.toLocaleString()}`, up: true },
              { label: 'Discounts', value: `€${discounts.toLocaleString()}`, up: false },
              { label: 'Refunds', value: `€${refunds.toLocaleString()}`, up: false },
              { label: 'Net Sales', value: `€${netSales.toLocaleString()}`, up: true },
              { label: 'VAT Collected', value: `€${vat.toLocaleString()}`, up: true },
              { label: 'Service Charge', value: `€${serviceCharge.toLocaleString()}`, up: true },
            ].map((kpi) => (
              <Card key={kpi.label} className="border-border/60">
                <CardContent className="p-5">
                  <p className="text-2xl font-semibold">{kpi.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Sales Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesHistory.slice(0, 30).map((r, i) => ({ day: `Day ${i + 1}`, sales: r.sales }))}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Performance */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Best Sellers</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topDishes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Revenue (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Worst Sellers</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={worstDishes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-5))" radius={[0, 4, 4, 0]} name="Revenue (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Product Performance Table</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dish</TableHead>
                    <TableHead className="text-right">Qty Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Food Cost</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Margin</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDishes.map((d) => {
                    const item = menuItems.find((m) => m.name === d.name);
                    const foodCost = item ? item.foodCost * d.quantity : 0;
                    const margin = d.revenue - foodCost;
                    const marginPct = ((margin / d.revenue) * 100).toFixed(0);
                    return (
                      <TableRow key={d.name}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="text-right">{d.quantity}</TableCell>
                        <TableCell className="text-right font-semibold">€{d.revenue}</TableCell>
                        <TableCell className="text-right hidden md:table-cell text-muted-foreground">€{foodCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">€{margin.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-success">{marginPct}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Food Cost */}
        <TabsContent value="foodcost" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Food Cost Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={foodCostTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[25, 32]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="cost" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Food Cost %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Performance */}
        <TabsContent value="staff" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Sales by Waiter</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={staffPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Sales (€)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waiter</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Avg Ticket</TableHead>
                    <TableHead className="text-right">Tips</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformance.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-right">€{s.sales}</TableCell>
                      <TableCell className="text-right">{s.orders}</TableCell>
                      <TableCell className="text-right">€{s.avgTicket}</TableCell>
                      <TableCell className="text-right">€{s.tips}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channel Performance */}
        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Revenue by Channel</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Sales by Hour by Channel</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={hourlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="sales" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
