
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  RestaurantTable, Order, MenuItem, Reservation, WaitlistEntry,
  Notification, AuditLogEntry, ServiceMode, OrderItem, CourseType, CourseStatus,
  Payment, Customer, InventoryItem,
} from '@/types';
import {
  restaurantTables as initialTables, menuItems as initialMenuItems,
  reservations as initialReservations, orders as initialOrders,
  kitchenOrders as initialKitchenOrders, inventoryItems as initialInventory,
  customers as initialCustomers, payments as initialPayments,
  initialWaitlist, initialAuditLog, initialServiceMode,
} from '@/lib/mock-data';

const STORAGE_KEY = 'maisonos-restaurant-state-v1';

interface PersistedState {
  tables: RestaurantTable[];
  orders: Order[];
  kitchenOrders: Order[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
  notifications: Notification[];
  auditLog: AuditLogEntry[];
  payments: Payment[];
  customers: Customer[];
  inventory: InventoryItem[];
  serviceMode: ServiceMode;
  salesToday: number;
  ordersToday: number;
  guestsToday: number;
}

function getInitialState(): PersistedState {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fall through to defaults
      }
    }
  }
  return {
    tables: initialTables,
    orders: initialOrders,
    kitchenOrders: initialKitchenOrders,
    menuItems: initialMenuItems,
    reservations: initialReservations,
    waitlist: initialWaitlist,
    notifications: [],
    auditLog: initialAuditLog,
    payments: initialPayments,
    customers: initialCustomers,
    inventory: initialInventory,
    serviceMode: initialServiceMode,
    salesToday: 8742.5,
    ordersToday: 186,
    guestsToday: 312,
  };
}

interface RestaurantContextValue extends PersistedState {
  // Tables
  updateTableStatus: (tableNumber: number, status: RestaurantTable['status']) => void;
  updateTable: (tableNumber: number, updates: Partial<RestaurantTable>) => void;
  seatTable: (tableNumber: number, guests: number, waiter: string) => void;
  transferTable: (from: number, to: number) => void;
  mergeTables: (t1: number, t2: number) => void;
  // Orders
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  sendOrderToKitchen: (order: Order) => void;
  // Kitchen
  updateKitchenOrderStatus: (orderId: string, status: Order['status']) => void;
  // Menu
  toggleMenuItemAvailability: (itemId: string) => void;
  // Reservations
  createReservation: (reservation: Reservation) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  seatReservation: (id: string, tableNumber: number, waiter: string) => void;
  // Waitlist
  addToWaitlist: (entry: WaitlistEntry) => void;
  seatFromWaitlist: (id: string, tableNumber: number) => void;
  // Notifications
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  // Audit
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'time'>) => void;
  // Payments
  addPayment: (payment: Payment) => void;
  // Customers
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  // Inventory
  adjustInventory: (id: string, delta: number) => void;
  // Service mode
  setServiceMode: (mode: ServiceMode) => void;
  // Reset
  resetState: () => void;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

let notificationIdCounter = 100;
let auditIdCounter = 100;
let orderIdCounter = 1060;
let paymentIdCounter = 100;

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(getInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const addNotification = useCallback((notification: Notification) => {
    setState((prev) => ({
      ...prev,
      notifications: [{ ...notification, id: `n${notificationIdCounter++}` }, ...prev.notifications].slice(0, 50),
    }));
  }, []);

  const addAuditLog = useCallback((entry: Omit<AuditLogEntry, 'id' | 'time'>) => {
    const now = new Date();
    const time = `${now.toLocaleDateString('en-CA')} ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    setState((prev) => ({
      ...prev,
      auditLog: [{ ...entry, id: `a${auditIdCounter++}`, time }, ...prev.auditLog].slice(0, 100),
    }));
  }, []);

  const updateTableStatus = useCallback((tableNumber: number, status: RestaurantTable['status']) => {
    setState((prev) => ({
      ...prev,
      tables: prev.tables.map((t) => (t.number === tableNumber ? { ...t, status } : t)),
    }));
  }, []);

  const updateTable = useCallback((tableNumber: number, updates: Partial<RestaurantTable>) => {
    setState((prev) => ({
      ...prev,
      tables: prev.tables.map((t) => (t.number === tableNumber ? { ...t, ...updates } : t)),
    }));
  }, []);

  const seatTable = useCallback((tableNumber: number, guests: number, waiter: string) => {
    setState((prev) => ({
      ...prev,
      tables: prev.tables.map((t) =>
        t.number === tableNumber
          ? { ...t, status: 'Occupied', guests, waiter, amount: 0, elapsedMin: 0, seatedAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
          : t
      ),
    }));
  }, []);

  const transferTable = useCallback((from: number, to: number) => {
    setState((prev) => {
      const fromTable = prev.tables.find((t) => t.number === from);
      const toTable = prev.tables.find((t) => t.number === to);
      if (!fromTable || !toTable) return prev;
      return {
        ...prev,
        tables: prev.tables.map((t) => {
          if (t.number === to) {
            return { ...t, status: fromTable.status, guests: fromTable.guests, waiter: fromTable.waiter, amount: fromTable.amount, elapsedMin: fromTable.elapsedMin, customerId: fromTable.customerId };
          }
          if (t.number === from) {
            return { ...t, status: 'Available', guests: undefined, waiter: undefined, amount: undefined, elapsedMin: undefined, customerId: undefined };
          }
          return t;
        }),
        orders: prev.orders.map((o) => (o.table === from ? { ...o, table: to } : o)),
      };
    });
  }, []);

  const mergeTables = useCallback((t1: number, t2: number) => {
    setState((prev) => {
      const table1 = prev.tables.find((t) => t.number === t1);
      const table2 = prev.tables.find((t) => t.number === t2);
      if (!table1 || !table2) return prev;
      const mergedGuests = (table1.guests || 0) + (table2.guests || 0);
      const mergedAmount = (table1.amount || 0) + (table2.amount || 0);
      return {
        ...prev,
        tables: prev.tables.map((t) => {
          if (t.number === t1) return { ...t, guests: mergedGuests, amount: mergedAmount, seats: table1.seats + table2.seats };
          if (t.number === t2) return { ...t, status: 'Available', guests: undefined, waiter: undefined, amount: undefined };
          return t;
        }),
      };
    });
  }, []);

  const createOrder = useCallback((order: Order) => {
    setState((prev) => ({ ...prev, orders: [order, ...prev.orders] }));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  }, []);

  const sendOrderToKitchen = useCallback((order: Order) => {
    const kitchenOrder: Order = { ...order, status: 'Sent to Kitchen' };
    setState((prev) => ({
      ...prev,
      orders: [kitchenOrder, ...prev.orders],
      kitchenOrders: [{ ...kitchenOrder, status: 'New' }, ...prev.kitchenOrders],
      tables: prev.tables.map((t) =>
        t.number === order.table ? { ...t, status: 'Order Sent', amount: order.amount } : t
      ),
    }));
  }, []);

  const updateKitchenOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setState((prev) => {
      const newTables = [...prev.tables];
      const order = prev.kitchenOrders.find((o) => o.id === orderId);
      if (order && order.table) {
        const tableIdx = newTables.findIndex((t) => t.number === order.table);
        if (tableIdx >= 0) {
          if (status === 'Preparing') newTables[tableIdx] = { ...newTables[tableIdx], status: 'Preparing' };
          if (status === 'Ready') newTables[tableIdx] = { ...newTables[tableIdx], status: 'Food Ready' };
          if (status === 'Served') newTables[tableIdx] = { ...newTables[tableIdx], status: 'Occupied' };
        }
      }
      return {
        ...prev,
        kitchenOrders: prev.kitchenOrders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        tables: newTables,
      };
    });
  }, []);

  const toggleMenuItemAvailability = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((m) =>
        m.id === itemId ? { ...m, available: !m.available } : m
      ),
    }));
  }, []);

  const createReservation = useCallback((reservation: Reservation) => {
    setState((prev) => ({ ...prev, reservations: [reservation, ...prev.reservations] }));
  }, []);

  const updateReservationStatus = useCallback((id: string, status: Reservation['status']) => {
    setState((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  }, []);

  const seatReservation = useCallback((id: string, tableNumber: number, waiter: string) => {
    setState((prev) => {
      const reservation = prev.reservations.find((r) => r.id === id);
      if (!reservation) return prev;
      return {
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === id ? { ...r, status: 'Seated', table: tableNumber } : r
        ),
        tables: prev.tables.map((t) =>
          t.number === tableNumber
            ? { ...t, status: 'Occupied', guests: reservation.guests, waiter, amount: 0, elapsedMin: 0, reservation: reservation.guest }
            : t
        ),
      };
    });
  }, []);

  const addToWaitlist = useCallback((entry: WaitlistEntry) => {
    setState((prev) => ({ ...prev, waitlist: [...prev.waitlist, entry] }));
  }, []);

  const seatFromWaitlist = useCallback((id: string, tableNumber: number) => {
    setState((prev) => ({
      ...prev,
      waitlist: prev.waitlist.map((w) => (w.id === id ? { ...w, status: 'Seated' } : w)),
      tables: prev.tables.map((t) =>
        t.number === tableNumber ? { ...t, status: 'Occupied' } : t
      ),
    }));
  }, []);

  const addPayment = useCallback((payment: Payment) => {
    setState((prev) => ({
      ...prev,
      payments: [payment, ...prev.payments],
      tables: prev.tables.map((t) =>
        t.number === payment.table ? { ...t, status: 'Cleaning' } : t
      ),
      salesToday: prev.salesToday + payment.amount,
      ordersToday: prev.ordersToday + 1,
    }));
  }, []);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const adjustInventory = useCallback((id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) => {
        if (item.id !== id) return item;
        const newStock = Math.max(0, item.currentStock + delta);
        let status: InventoryItem['status'] = 'In Stock';
        if (newStock === 0) status = 'Out of Stock';
        else if (newStock < item.minLevel * 0.5) status = 'Critical';
        else if (newStock < item.minLevel) status = 'Low Stock';
        return { ...item, currentStock: newStock, status };
      }),
    }));
  }, []);

  const setServiceMode = useCallback((mode: ServiceMode) => {
    setState((prev) => ({ ...prev, serviceMode: mode }));
  }, []);

  const resetState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(getInitialState());
  }, []);

  const value: RestaurantContextValue = {
    ...state,
    updateTableStatus,
    updateTable,
    seatTable,
    transferTable,
    mergeTables,
    createOrder,
    updateOrderStatus,
    sendOrderToKitchen,
    updateKitchenOrderStatus,
    toggleMenuItemAvailability,
    createReservation,
    updateReservationStatus,
    seatReservation,
    addToWaitlist,
    seatFromWaitlist,
    addNotification,
    markNotificationRead: (id: string) => {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    },
    addAuditLog,
    addPayment,
    updateCustomer,
    adjustInventory,
    setServiceMode,
    resetState,
  };

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
}

export function generateOrderId(): string {
  return `o${orderIdCounter++}`;
}

export function generatePaymentId(): string {
  return `p${paymentIdCounter++}`;
}
