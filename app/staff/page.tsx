'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { employees, shifts } from '@/lib/mock-data';
import type { Employee } from '@/types';
import {
  Plus, Search, Phone, Mail, Calendar, Clock, Check, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const roles = ['Admin', 'Manager', 'Chef', 'Waiter', 'Cashier', 'Inventory Manager', 'Head Waiter', 'Sous Chef', 'Pastry Chef', 'Bartender', 'Sommelier', 'Line Cook', 'Dishwasher', 'Hostess', 'Pastry Assistant', 'Bar Back'];

export default function StaffPage() {
  const [tab, setTab] = useState('employees');
  const [search, setSearch] = useState('');
  const [shiftOpen, setShiftOpen] = useState(false);
  const [newShift, setNewShift] = useState({ employeeId: '', date: '2026-08-19', startTime: '10:00', endTime: '18:00', station: 'Main Dining' });

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
  );

  const markAttendance = (id: string, status: 'Present' | 'Absent' | 'Late') => {
    toast.success(`${employees.find((e) => e.id === id)?.name} marked as ${status}`);
  };

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Staff Management"
        description="Manage employees, shifts, attendance, and roles"
        actions={<Button onClick={() => setShiftOpen(true)}><Plus className="mr-2 h-4 w-4" /> Create Shift</Button>}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Employees */}
        <TabsContent value="employees" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search employees…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 pl-9" />
          </div>
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead className="hidden lg:table-cell">Today's Shift</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials(e.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{e.name}</p>
                              <p className="text-xs text-muted-foreground">{e.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{e.role}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{e.department}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-sm"><Clock className="h-3 w-3" /> {e.todayShift}</span>
                        </TableCell>
                        <TableCell><StatusBadge status={e.attendance} /></TableCell>
                        <TableCell><StatusBadge status={e.status === 'Active' ? 'Active' : e.status === 'On Break' ? 'On Break' : 'Off Duty'} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shifts */}
        <TabsContent value="shifts">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <h3 className="mb-4 font-semibold">Shift Calendar — Wednesday, 19 August 2026</h3>
              <div className="space-y-3">
                {shifts.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 rounded-lg border border-border/40 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials(s.employeeName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{s.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{s.role} · {s.station}</p>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center gap-1 text-sm font-medium"><Clock className="h-3 w-3" /> {s.startTime} — {s.endTime}</p>
                      <p className="text-xs text-muted-foreground">{s.station}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="text-muted-foreground">{e.role}</TableCell>
                      <TableCell><StatusBadge status={e.attendance} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-7 text-success" onClick={() => markAttendance(e.id, 'Present')}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-warning" onClick={() => markAttendance(e.id, 'Late')}>
                            <Clock className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => markAttendance(e.id, 'Absent')}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const count = employees.filter((e) => e.role === role).length;
              return (
                <Card key={role} className="border-border/60">
                  <CardContent className="p-5">
                    <p className="font-serif text-lg font-semibold">{role}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{count} employee{count !== 1 ? 's' : ''}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['View', 'Edit', 'Delete', 'Manage'].map((perm) => (
                        <span key={perm} className={cn('rounded-lg border px-2 py-0.5 text-xs',
                          role === 'Admin' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-border text-muted-foreground'
                        )}>
                          {perm}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Shift Modal */}
      <Dialog open={shiftOpen} onOpenChange={setShiftOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Shift</DialogTitle>
            <DialogDescription>Assign a shift to an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Employee</Label>
              <Select value={newShift.employeeId} onValueChange={(v) => setNewShift({ ...newShift, employeeId: v })}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} — {e.role}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Date</Label>
                <Input type="date" value={newShift.date} onChange={(e) => setNewShift({ ...newShift, date: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Station</Label>
                <Input value={newShift.station} onChange={(e) => setNewShift({ ...newShift, station: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Start Time</Label>
                <Input type="time" value={newShift.startTime} onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5 block">End Time</Label>
                <Input type="time" value={newShift.endTime} onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShiftOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Shift created'); setShiftOpen(false); }} disabled={!newShift.employeeId}>Create Shift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
