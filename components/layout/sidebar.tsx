'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { ROUTE_PERMISSIONS } from '@/lib/permissions';
import { LayoutDashboard, Monitor, Armchair, CalendarDays, ChefHat, Smartphone, UtensilsCrossed, Package, ShoppingCart, FileText, Users, UserCog, Truck, CreditCard, ChartBar as BarChart3, Calculator, Settings, CircleHelp as HelpCircle, Bell, LogOut, ChevronLeft, Utensils, MapPin } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Operations',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'POS / Caisse', href: '/pos', icon: Monitor },
      { label: 'Tables', href: '/tables', icon: Armchair },
      { label: 'Reservations', href: '/reservations', icon: CalendarDays },
      { label: 'Kitchen / KDS', href: '/kitchen', icon: ChefHat },
      { label: 'Waiter App', href: '/waiter', icon: Smartphone },
    ],
  },
  {
    title: 'Menu & Stock',
    items: [
      { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
      { label: 'Inventory', href: '/inventory', icon: Package },
      { label: 'Purchasing', href: '/purchasing', icon: ShoppingCart },
      { label: 'Recipes & Food Cost', href: '/recipes', icon: FileText },
    ],
  },
  {
    title: 'Customers & Staff',
    items: [
      { label: 'Customers / CRM', href: '/customers', icon: Users },
      { label: 'Staff', href: '/staff', icon: UserCog },
      { label: 'Delivery & Takeaway', href: '/delivery', icon: Truck },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Payments', href: '/payments', icon: CreditCard },
      { label: 'Reports', href: '/reports', icon: BarChart3 },
      { label: 'Accounting', href: '/accounting', icon: Calculator },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { user, logout, canAccessRoute } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : '??';

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-[72px]' : 'w-[260px]',
          isMobile && collapsed && 'lg:w-[260px]'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Utensils className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-serif text-base font-semibold leading-tight">MaisonOS</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Maison Étoile · Paris</span>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
          <div className="space-y-6">
            {navSections.map((section) => {
              const visibleItems = section.items.filter((item) => canAccessRoute(item.href));
              if (visibleItems.length === 0) return null;
              return (
                <div key={section.title}>
                  {!collapsed && (
                    <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                      {section.title}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {visibleItems.map((item) => {
                      const active = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                              ? 'bg-primary text-primary-foreground'
                              : 'text-sidebar-foreground/80 hover:bg-muted hover:text-foreground',
                            collapsed && 'justify-center'
                          )}
                          title={collapsed ? item.label : undefined}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <div className="space-y-0.5">
            <Link
              href="/settings"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-muted hover:text-foreground transition-colors',
                collapsed && 'justify-center'
              )}
              title={collapsed ? 'Help' : undefined}
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Help</span>}
            </Link>
            <Link
              href="/settings"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-muted hover:text-foreground transition-colors',
                collapsed && 'justify-center'
              )}
              title={collapsed ? 'Notifications' : undefined}
            >
              <Bell className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Notifications</span>}
            </Link>
            <Link
              href="/settings"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-muted hover:text-foreground transition-colors',
                collapsed && 'justify-center'
              )}
              title={collapsed ? 'User Profile' : undefined}
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{user?.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{user?.role}</p>
                </div>
              )}
            </Link>
            <button
              onClick={() => setLogoutOpen(true)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors',
                collapsed && 'justify-center'
              )}
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout confirmation */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out?</DialogTitle>
            <DialogDescription>
              You'll need to sign in again to access MaisonOS.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
