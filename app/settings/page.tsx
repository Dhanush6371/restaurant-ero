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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/shared/page-header';
import {
  Building2, Monitor, Armchair, ChefHat, Bell, Shield, Palette,
  Save, Moon, Sun, UserPlus, UserX, History,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useRestaurant } from '@/lib/restaurant-context';
import { ROLE_PERMISSIONS, PERMISSION_LABELS, ROLE_LABELS } from '@/lib/permissions';
import type { UserRole, DemoUser } from '@/types';

const sections = [
  { key: 'restaurant', label: 'Restaurant', icon: Building2 },
  { key: 'pos', label: 'POS', icon: Monitor },
  { key: 'tables', label: 'Tables', icon: Armchair },
  { key: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'permissions', label: 'Users & Permissions', icon: Shield },
  { key: 'audit', label: 'Audit Log', icon: History },
  { key: 'appearance', label: 'Appearance', icon: Palette },
];

const roles: UserRole[] = ['Admin', 'Manager', 'Chef', 'Waiter', 'Cashier'];
const permKeys = Object.keys(PERMISSION_LABELS) as (keyof typeof PERMISSION_LABELS)[];

export default function SettingsPage() {
  const { user, allUsers, addUser, deactivateUser, activateUser, hasPermission } = useAuth();
  const { auditLog } = useRestaurant();
  const [activeSection, setActiveSection] = useState('restaurant');
  const [darkMode, setDarkMode] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '', email: '', phone: '', employeeId: '', role: 'Waiter' as UserRole,
    department: 'Front of House', password: '', section: 'Main Dining', assignedTables: '',
  });
  const [notifSettings, setNotifSettings] = useState({
    reservationAlerts: true,
    lowStockAlerts: true,
    paymentAlerts: true,
    kitchenAlerts: true,
    dailyReports: false,
    weeklyReports: true,
  });

  const save = () => toast.success('Settings saved successfully');
  const canManageUsers = hasPermission('USER_MANAGEMENT');

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Name, email, and password are required');
      return;
    }
    const u: DemoUser = {
      id: `u${Date.now()}`,
      employeeId: newUser.employeeId || `EMP${Date.now().toString().slice(-4)}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      department: newUser.department,
      phone: newUser.phone,
      shift: '11:00 - 19:00',
      shiftStart: '11:00',
      shiftEnd: '19:00',
      section: newUser.section,
      assignedTables: newUser.assignedTables.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
      status: 'Active',
      permissions: ROLE_PERMISSIONS[newUser.role],
    };
    addUser(u);
    toast.success(`Employee ${u.name} created successfully`);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', phone: '', employeeId: '', role: 'Waiter', department: 'Front of House', password: '', section: 'Main Dining', assignedTables: '' });
  };

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
            <div className="space-y-4">
              {/* User list */}
              <Card className="border-border/60">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Employees & Permissions</CardTitle>
                  {canManageUsers && (
                    <Button size="sm" onClick={() => setShowAddUser(true)}>
                      <UserPlus className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        {canManageUsers && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                          <TableCell>{u.department}</TableCell>
                          <TableCell className="text-sm">{u.employeeId}</TableCell>
                          <TableCell>
                            {u.status === 'Active' ? (
                              <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
                            ) : (
                              <Badge className="bg-destructive/10 text-destructive border-destructive/20">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                          </TableCell>
                          {canManageUsers && (
                            <TableCell>
                              {u.status === 'Active' ? (
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { deactivateUser(u.id); toast.success(`${u.name} deactivated`); }}>
                                  <UserX className="mr-1 h-3.5 w-3.5" /> Deactivate
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" className="text-success" onClick={() => { activateUser(u.id); toast.success(`${u.name} activated`); }}>
                                  Activate
                                </Button>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Permission matrix */}
              <Card className="border-border/60">
                <CardHeader><CardTitle className="text-base">Role Permission Matrix</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="p-2 text-left font-medium text-muted-foreground">Permission</th>
                          {roles.map((r) => (
                            <th key={r} className="p-2 text-center font-medium text-muted-foreground whitespace-nowrap">{ROLE_LABELS[r]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {permKeys.map((perm) => (
                          <tr key={perm} className="border-b border-border/40">
                            <td className="p-2 font-medium">{PERMISSION_LABELS[perm]}</td>
                            {roles.map((r) => (
                              <td key={r} className="p-2 text-center">
                                {ROLE_PERMISSIONS[r].includes(perm) ? (
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
            </div>
          )}

          {activeSection === 'audit' && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Audit Log</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.user}</TableCell>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell><Badge variant="secondary">{entry.module}</Badge></TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{entry.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Add user dialog */}
          {showAddUser && (
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Add New Employee</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Name</Label>
                    <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Jean Martin" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Email</Label>
                    <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="waiter@maisoneetoile.com" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Phone</Label>
                    <Input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} placeholder="+33 6 12 34 56 78" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Employee ID</Label>
                    <Input value={newUser.employeeId} onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })} placeholder="WTR002" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Role</Label>
                    <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v as UserRole })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Department</Label>
                    <Input value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} placeholder="Front of House" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Password</Label>
                    <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="password123" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Assigned Tables (comma-separated)</Label>
                    <Input value={newUser.assignedTables} onChange={(e) => setNewUser({ ...newUser, assignedTables: e.target.value })} placeholder="4, 7, 12, 18" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
                  <Button onClick={handleAddUser}>Create Employee</Button>
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
