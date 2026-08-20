
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { useAuth } from '@/lib/auth-context';
import { useRestaurant } from '@/lib/restaurant-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search, Bell, Menu, ChevronDown, Settings, LogOut, User as UserIcon,
  Circle, Calendar,
} from 'lucide-react';
import { menuItems, customers, reservations, employees, inventoryItems, suppliers } from '@/lib/mock-data';

const pageTitles: Record<string, { title: string; breadcrumb: string }> = {
  '/dashboard': { title: 'Dashboard', breadcrumb: 'Home · Dashboard' },
  '/pos': { title: 'POS / Caisse', breadcrumb: 'Operations · POS' },
  '/tables': { title: 'Tables', breadcrumb: 'Operations · Tables' },
  '/reservations': { title: 'Reservations', breadcrumb: 'Operations · Reservations' },
  '/kitchen': { title: 'Kitchen / KDS', breadcrumb: 'Operations · Kitchen' },
  '/waiter': { title: 'Waiter App', breadcrumb: 'Operations · Waiter' },
  '/menu': { title: 'Menu', breadcrumb: 'Menu & Stock · Menu' },
  '/inventory': { title: 'Inventory', breadcrumb: 'Menu & Stock · Inventory' },
  '/purchasing': { title: 'Purchasing', breadcrumb: 'Menu & Stock · Purchasing' },
  '/recipes': { title: 'Recipes & Food Cost', breadcrumb: 'Menu & Stock · Recipes' },
  '/customers': { title: 'Customers / CRM', breadcrumb: 'Customers & Staff · Customers' },
  '/staff': { title: 'Staff', breadcrumb: 'Customers & Staff · Staff' },
  '/delivery': { title: 'Delivery & Takeaway', breadcrumb: 'Customers & Staff · Delivery' },
  '/payments': { title: 'Payments', breadcrumb: 'Finance · Payments' },
  '/reports': { title: 'Reports', breadcrumb: 'Finance · Reports' },
  '/accounting': { title: 'Accounting', breadcrumb: 'Finance · Accounting' },
  '/settings': { title: 'Settings', breadcrumb: 'Admin · Settings' },
};

interface SearchResult {
  category: string;
  label: string;
  sublabel?: string;
  href: string;
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, serviceMode } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pageMeta = pageTitles[pathname] || { title: 'Dashboard', breadcrumb: 'Home' };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : '??';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const searchResults: SearchResult[] = [];
  if (searchQuery.length > 0) {
    const q = searchQuery.toLowerCase();
    menuItems.filter(m => m.name.toLowerCase().includes(q)).slice(0, 4).forEach(m => {
      searchResults.push({ category: 'Dishes', label: m.name, sublabel: `€${m.price} · ${m.category}`, href: '/menu' });
    });
    customers.filter(c => c.name.toLowerCase().includes(q)).slice(0, 4).forEach(c => {
      searchResults.push({ category: 'Customers', label: c.name, sublabel: c.email, href: '/customers' });
    });
    reservations.filter(r => r.guest.toLowerCase().includes(q)).slice(0, 3).forEach(r => {
      searchResults.push({ category: 'Reservations', label: r.guest, sublabel: `${r.date} · ${r.time} · ${r.guests} guests`, href: '/reservations' });
    });
    employees.filter(e => e.name.toLowerCase().includes(q)).slice(0, 3).forEach(e => {
      searchResults.push({ category: 'Employees', label: e.name, sublabel: e.role, href: '/staff' });
    });
    inventoryItems.filter(i => i.name.toLowerCase().includes(q)).slice(0, 3).forEach(i => {
      searchResults.push({ category: 'Inventory', label: i.name, sublabel: `${i.currentStock} ${i.unit}`, href: '/inventory' });
    });
    suppliers.filter(s => s.name.toLowerCase().includes(q)).slice(0, 3).forEach(s => {
      searchResults.push({ category: 'Suppliers', label: s.name, sublabel: s.category, href: '/purchasing' });
    });
  }

  const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = (id: string, link: string) => {
    markNotificationRead(id);
    setNotifOpen(false);
    navigate(link);
  };

  const markAllRead = () => {
    notifications.forEach(n => !n.read && markNotificationRead(n.id));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="font-serif text-lg font-semibold leading-tight">{pageMeta.title}</h1>
        <p className="hidden text-xs text-muted-foreground sm:block">{pageMeta.breadcrumb}</p>
      </div>

      {/* Service mode badge */}
      <div className="hidden items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent md:flex">
        <Circle className="h-2 w-2 fill-accent text-accent" />
        {serviceMode}
      </div>

      {/* Global search */}
      <div ref={searchRef} className="relative hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search orders, customers, dishes…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            className="w-64 pl-9 lg:w-80"
          />
        </div>
        {searchOpen && searchQuery.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg scrollbar-thin">
            {searchResults.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No results found for "{searchQuery}"</div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedResults).map(([category, results]) => (
                  <div key={category}>
                    <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{category}</p>
                    {results.map((r, i) => (
                      <Link
                        key={`${category}-${i}`}
                        to={r.href}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{r.label}</p>
                          {r.sublabel && <p className="text-xs text-muted-foreground">{r.sublabel}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date selector */}
      <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground lg:flex">
        <Calendar className="h-4 w-4" />
        <span>Wed, 19 Aug 2026</span>
      </div>

      {/* Restaurant status */}
      <div className="hidden items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success sm:flex">
        <Circle className="h-2 w-2 fill-success text-success" />
        OPEN
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-foreground">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotifClick(n.id, n.link)}
                    className="flex w-full gap-3 border-b border-border/50 px-4 py-3 text-left hover:bg-muted transition-colors"
                  >
                    {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    {n.read && <div className="mt-1.5 h-2 w-2 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">{n.time}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            {user?.employeeId && (
              <p className="mt-1 text-xs text-muted-foreground">ID: {user.employeeId}</p>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <UserIcon className="mr-2 h-4 w-4" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
