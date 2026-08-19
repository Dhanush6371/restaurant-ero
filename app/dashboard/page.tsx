'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPICard } from '@/components/shared/kpi-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingState } from '@/components/shared/states';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Euro, ShoppingBag, Users, TrendingUp, Wallet, Percent,
  ArrowRight, Clock,
} from 'lucide-react';
import {
  hourlySales, salesByDay, revenueBreakdown, topDishes,
  restaurantTables, kitchenOrders, orders,
} from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingState count={6} />;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const tableStatusCounts = {
    Occupied: restaurantTables.filter(t => t.status === 'Occupied').length,
    Available: restaurantTables.filter(t => t.status === 'Available').length,
    Reserved: restaurantTables.filter(t => t.status === 'Reserved').length,
    Cleaning: restaurantTables.filter(t => t.status === 'Cleaning').length,
  };

  const kitchenStatusCounts = {
    New: kitchenOrders.filter(o => o.status === 'New').length,
    Preparing: kitchenOrders.filter(o => o.status === 'Preparing').length,
    Ready: kitchenOrders.filter(o => o.status === 'Ready').length,
    Delayed: kitchenOrders.filter(o => o.status === 'Delayed').length,
  };

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Maison Étoile is open.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard label="Today's Sales" value="€8,742.50" icon={Euro} trend={{ value: '+12.3%', up: true }} />
        <KPICard label="Orders" value="186" icon={ShoppingBag} trend={{ value: '+8.1%', up: true }} />
        <KPICard label="Average Order" value="€47.00" icon={TrendingUp} trend={{ value: '+3.2%', up: true }} />
        <KPICard label="Guests Served" value="312" icon={Users} trend={{ value: '+15%', up: true }} />
        <KPICard label="Food Cost" value="28.4%" icon={Percent} trend={{ value: '-1.2%', up: true }} />
        <KPICard label="Net Revenue" value="€7,421" icon={Wallet} trend={{ value: '+10.8%', up: true }} />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sales Overview */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Sales Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Today vs Yesterday vs Last Week</p>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={salesByDay}>
                <defs>
                  <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorYesterday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="today" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorToday)" strokeWidth={2} name="Today" />
                <Area type="monotone" dataKey="yesterday" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorYesterday)" strokeWidth={2} name="Yesterday" />
                <Area type="monotone" dataKey="lastWeek" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorLastWeek)" strokeWidth={2} name="Last Week" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Revenue Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">By channel</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {revenueBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">€{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sales by Hour */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Sales by Hour</CardTitle>
            <p className="text-sm text-muted-foreground">11:00 — 23:00</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hourlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Sales (€)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Dishes */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Top Selling Dishes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDishes.map((dish, i) => (
              <div key={dish.name} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{dish.name}</p>
                  <p className="text-xs text-muted-foreground">{dish.quantity} sold</p>
                </div>
                <p className="text-sm font-semibold">€{dish.revenue}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Table Status */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Table Status</CardTitle>
            <Link href="/tables">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(tableStatusCounts).map(([status, count]) => (
                <div key={status} className="rounded-lg border border-border/60 p-3 text-center">
                  <p className="text-2xl font-semibold">{count}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kitchen Status */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Kitchen Status</CardTitle>
            <Link href="/kitchen">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(kitchenStatusCounts).map(([status, count]) => (
                <div key={status} className="rounded-lg border border-border/60 p-3 text-center">
                  <p className="text-2xl font-semibold">{count}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Link href="/pos">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Waiter</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.table ? `Table ${order.table}` : '—'}</TableCell>
                  <TableCell>{order.waiter || '—'}</TableCell>
                  <TableCell className="text-right font-medium">€{order.amount.toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {order.createdAt}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
