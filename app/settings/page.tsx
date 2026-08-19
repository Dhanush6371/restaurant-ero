'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/shared/page-header';
import {
  Building2, Monitor, Armchair, ChefHat, Bell, Shield, Palette,
  Save, Moon, Sun,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const sections = [
  { key: 'restaurant', label: 'Restaurant', icon: Building2 },
  { key: 'pos', label: 'POS', icon: Monitor },
  { key: 'tables', label: 'Tables', icon: Armchair },
  { key: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'permissions', label: 'Users & Permissions', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
];

const roles = ['Admin', 'Manager', 'Chef', 'Waiter', 'Cashier', 'Inventory Manager'];
const permissions = ['Dashboard', 'POS', 'Tables', 'Reservations', 'Kitchen', 'Menu', 'Inventory', 'Purchasing', 'Recipes', 'Customers', 'Staff', 'Payments', 'Delivery', 'Reports', 'Accounting', 'Settings'];

const roleMatrix: Record<string, boolean[]> = {
  Admin: permissions.map(() => true),
  Manager: permissions.map((p) => p !== 'Settings'),
  Chef: permissions.map((p) => ['Dashboard', 'Kitchen', 'Menu', 'Inventory', 'Recipes'].includes(p)),
  Waiter: permissions.map((p) => ['Dashboard', 'POS', 'Tables', 'Reservations', 'Customers', 'Payments'].includes(p)),
  Cashier: permissions.map((p) => ['Dashboard', 'POS', 'Payments'].includes(p)),
  'Inventory Manager': permissions.map((p) => ['Dashboard', 'Inventory', 'Purchasing'].includes(p)),
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('restaurant');
  const [darkMode, setDarkMode] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    reservationAlerts: true,
    lowStockAlerts: true,
    paymentAlerts: true,
    kitchenAlerts: true,
    dailyReports: false,
    weeklyReports: true,
  });

  const save = () => toast.success('Settings saved successfully');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Configure your restaurant management platform"
        actions={<Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Settings nav */}
        <div className="lg:w-56 shrink-0">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                    activeSection === s.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'restaurant' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Restaurant Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Restaurant Name</Label>
                    <Input defaultValue="Maison Étoile" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Phone</Label>
                    <Input defaultValue="+33 1 42 60 12 34" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Email</Label>
                    <Input type="email" defaultValue="contact@maisoneetoile.com" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">VAT Number</Label>
                    <Input defaultValue="FR 12 345 678 901" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block">Address</Label>
                  <Textarea defaultValue="14 Rue de Rivoli, 75001 Paris, France" rows={2} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Opening Hours (Lunch)</Label>
                    <Input defaultValue="12:00 — 14:30" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Opening Hours (Dinner)</Label>
                    <Input defaultValue="18:30 — 23:00" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'pos' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">POS Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Currency</Label>
                    <Select defaultValue="eur">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1.5 block">VAT Rate</Label>
                    <Select defaultValue="10">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10% (Restaurant)</SelectItem>
                        <SelectItem value="20">20% (Standard)</SelectItem>
                        <SelectItem value="5.5">5.5% (Reduced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Service Charge (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Max Discount (%)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Print Receipts Automatically</p>
                      <p className="text-xs text-muted-foreground">Send receipts to kitchen printer on order completion</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Allow Split Payments</p>
                      <p className="text-xs text-muted-foreground">Enable multiple payment methods per order</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Require Manager Approval for Discounts</p>
                      <p className="text-xs text-muted-foreground">PIN required for discounts over 10%</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'tables' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Tables & Floor Plans</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Total Tables</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Dining Areas</Label>
                    <Input defaultValue="4" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  {['Main Dining', 'Terrace', 'Bar', 'Private Dining'].map((zone) => (
                    <div key={zone} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                      <div>
                        <p className="text-sm font-medium">{zone}</p>
                        <p className="text-xs text-muted-foreground">
                          {zone === 'Main Dining' ? '12 tables' : zone === 'Terrace' ? '6 tables' : zone === 'Bar' ? '4 tables' : '2 tables'}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => toast.info(`Editing ${zone} floor plan`)}>
                        Edit Plan
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'kitchen' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Kitchen Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Kitchen Stations</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Hot Kitchen', 'Grill', 'Garde Manger', 'Pastry', 'Bar'].map((st) => (
                      <Badge key={st} variant="secondary" className="px-3 py-1">{st}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Auto-bump after 30 seconds</p>
                      <p className="text-xs text-muted-foreground">Automatically clear ready orders after 30s</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Show Prep Timer</p>
                      <p className="text-xs text-muted-foreground">Display elapsed time on each ticket</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Color-code by Priority</p>
                      <p className="text-xs text-muted-foreground">Highlight VIP and High priority tickets</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Sound Alerts</p>
                      <p className="text-xs text-muted-foreground">Play sound when new order arrives</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'reservationAlerts', label: 'Reservation Alerts', desc: 'Get notified when a guest is arriving soon' },
                  { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Receive alerts when inventory falls below minimum' },
                  { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Get notified of failed or refunded payments' },
                  { key: 'kitchenAlerts', label: 'Kitchen Alerts', desc: 'Alert when orders exceed preparation time' },
                  { key: 'dailyReports', label: 'Daily Reports', desc: 'Receive a daily sales summary email' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive a weekly performance report email' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch
                      checked={notifSettings[n.key as keyof typeof notifSettings]}
                      onCheckedChange={(v) => setNotifSettings({ ...notifSettings, [n.key]: v })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === 'permissions' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Role Management & Permission Matrix</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <Badge key={r} variant="secondary" className="px-3 py-1">{r}</Badge>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-2 text-left font-medium text-muted-foreground">Permission</th>
                        {roles.map((r) => (
                          <th key={r} className="p-2 text-center font-medium text-muted-foreground whitespace-nowrap">{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((perm, pi) => (
                        <tr key={perm} className="border-b border-border/40">
                          <td className="p-2 font-medium">{perm}</td>
                          {roles.map((r) => (
                            <td key={r} className="p-2 text-center">
                              {roleMatrix[r]?.[pi] ? (
                                <span className="inline-block h-2 w-2 rounded-full bg-success" />
                              ) : (
                                <span className="inline-block h-2 w-2 rounded-full bg-muted" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Appearance & Branding</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <div>
                      <p className="text-sm font-medium">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={(v) => { setDarkMode(v); toast.info(`Theme switched to ${v ? 'dark' : 'light'} mode`); }} />
                </div>
                <div>
                  <Label className="mb-2 block">Brand Color</Label>
                  <div className="flex gap-3">
                    {['hsl(38,44%,52%)', 'hsl(200,55%,50%)', 'hsl(142,40%,45%)', 'hsl(12,70%,55%)', 'hsl(280,45%,55%)'].map((c) => (
                      <button
                        key={c}
                        className="h-10 w-10 rounded-full border-2 border-border transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        onClick={() => toast.info('Brand color updated')}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block">Logo URL</Label>
                  <Input placeholder="https://…" defaultValue="" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
