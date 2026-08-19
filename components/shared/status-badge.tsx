'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, string> = {
  // Table
  'Available': 'bg-success/10 text-success border-success/20',
  'Occupied': 'bg-primary/10 text-primary border-primary/20',
  'Reserved': 'bg-accent/10 text-accent border-accent/20',
  'Cleaning': 'bg-muted text-muted-foreground border-border',
  'Payment Due': 'bg-warning/10 text-warning border-warning/20',
  // Reservation
  'Confirmed': 'bg-success/10 text-success border-success/20',
  'Seated': 'bg-primary/10 text-primary border-primary/20',
  'Completed': 'bg-muted text-muted-foreground border-border',
  'Cancelled': 'bg-destructive/10 text-destructive border-destructive/20',
  'No-show': 'bg-warning/10 text-warning border-warning/20',
  // Order / Kitchen
  'New': 'bg-accent/10 text-accent border-accent/20',
  'Preparing': 'bg-warning/10 text-warning border-warning/20',
  'Ready': 'bg-success/10 text-success border-success/20',
  'Served': 'bg-muted text-muted-foreground border-border',
  'Delayed': 'bg-destructive/10 text-destructive border-destructive/20',
  // Inventory
  'In Stock': 'bg-success/10 text-success border-success/20',
  'Low Stock': 'bg-warning/10 text-warning border-warning/20',
  'Critical': 'bg-destructive/10 text-destructive border-destructive/20',
  'Out of Stock': 'bg-destructive/10 text-destructive border-destructive/20',
  // PO
  'Draft': 'bg-muted text-muted-foreground border-border',
  'Sent': 'bg-accent/10 text-accent border-accent/20',
  'Partially Received': 'bg-warning/10 text-warning border-warning/20',
  'Received': 'bg-success/10 text-success border-success/20',
  // Supplier
  'Active': 'bg-success/10 text-success border-success/20',
  'Inactive': 'bg-muted text-muted-foreground border-border',
  'Pending': 'bg-warning/10 text-warning border-warning/20',
  // Payment
  'Failed': 'bg-destructive/10 text-destructive border-destructive/20',
  'Refunded': 'bg-muted text-muted-foreground border-border',
  // Delivery
  'Out for Delivery': 'bg-accent/10 text-accent border-accent/20',
  'Delivered': 'bg-muted text-muted-foreground border-border',
  // Priority
  'Normal': 'bg-muted text-muted-foreground border-border',
  'High': 'bg-warning/10 text-warning border-warning/20',
  'VIP': 'bg-accent/10 text-accent border-accent/20',
  // Employee
  'Present': 'bg-success/10 text-success border-success/20',
  'Absent': 'bg-destructive/10 text-destructive border-destructive/20',
  'Late': 'bg-warning/10 text-warning border-warning/20',
  'On Leave': 'bg-muted text-muted-foreground border-border',
  'On Break': 'bg-warning/10 text-warning border-warning/20',
  'Off Duty': 'bg-muted text-muted-foreground border-border',
  // Invoice / Expense
  'Paid': 'bg-success/10 text-success border-success/20',
  'Overdue': 'bg-destructive/10 text-destructive border-destructive/20',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const colorClass = statusConfig[status] || 'bg-muted text-muted-foreground border-border';
  return (
    <Badge variant="outline" className={cn(colorClass, 'font-medium', className)}>
      {status}
    </Badge>
  );
}
