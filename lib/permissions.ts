import type { Permission, UserRole } from '@/types';

export const ALL_PERMISSIONS: Permission[] = [
  'POS_VIEW', 'POS_CREATE_ORDER', 'POS_EDIT_ORDER', 'POS_VOID_ORDER', 'POS_REFUND',
  'TABLE_VIEW', 'TABLE_EDIT', 'TABLE_MERGE', 'TABLE_SPLIT',
  'RESERVATION_VIEW', 'RESERVATION_CREATE', 'RESERVATION_EDIT',
  'MENU_VIEW', 'MENU_EDIT',
  'INVENTORY_VIEW', 'INVENTORY_ADJUST',
  'PURCHASING_VIEW', 'PURCHASING_CREATE',
  'RECIPE_VIEW', 'RECIPE_EDIT',
  'CUSTOMER_VIEW', 'CUSTOMER_EDIT',
  'STAFF_VIEW', 'STAFF_EDIT',
  'PAYMENT_VIEW', 'PAYMENT_PROCESS', 'PAYMENT_REFUND',
  'REPORT_VIEW',
  'ACCOUNTING_VIEW',
  'SETTINGS_VIEW',
  'USER_MANAGEMENT',
  'KDS_VIEW', 'KDS_MANAGE',
  'WAITER_ORDER',
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  POS_VIEW: 'View POS',
  POS_CREATE_ORDER: 'Create Orders',
  POS_EDIT_ORDER: 'Edit Orders',
  POS_VOID_ORDER: 'Void Orders',
  POS_REFUND: 'Process Refunds',
  TABLE_VIEW: 'View Tables',
  TABLE_EDIT: 'Edit Tables',
  TABLE_MERGE: 'Merge Tables',
  TABLE_SPLIT: 'Split Tables',
  RESERVATION_VIEW: 'View Reservations',
  RESERVATION_CREATE: 'Create Reservations',
  RESERVATION_EDIT: 'Edit Reservations',
  MENU_VIEW: 'View Menu',
  MENU_EDIT: 'Edit Menu',
  INVENTORY_VIEW: 'View Inventory',
  INVENTORY_ADJUST: 'Adjust Inventory',
  PURCHASING_VIEW: 'View Purchasing',
  PURCHASING_CREATE: 'Create Purchase Orders',
  RECIPE_VIEW: 'View Recipes',
  RECIPE_EDIT: 'Edit Recipes',
  CUSTOMER_VIEW: 'View Customers',
  CUSTOMER_EDIT: 'Edit Customers',
  STAFF_VIEW: 'View Staff',
  STAFF_EDIT: 'Edit Staff',
  PAYMENT_VIEW: 'View Payments',
  PAYMENT_PROCESS: 'Process Payments',
  PAYMENT_REFUND: 'Refund Payments',
  REPORT_VIEW: 'View Reports',
  ACCOUNTING_VIEW: 'View Accounting',
  SETTINGS_VIEW: 'View Settings',
  USER_MANAGEMENT: 'Manage Users',
  KDS_VIEW: 'View KDS',
  KDS_MANAGE: 'Manage KDS',
  WAITER_ORDER: 'Take Orders (Waiter)',
};

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [...ALL_PERMISSIONS],
  Manager: [
    'POS_VIEW', 'POS_CREATE_ORDER', 'POS_EDIT_ORDER', 'POS_VOID_ORDER', 'POS_REFUND',
    'TABLE_VIEW', 'TABLE_EDIT', 'TABLE_MERGE', 'TABLE_SPLIT',
    'RESERVATION_VIEW', 'RESERVATION_CREATE', 'RESERVATION_EDIT',
    'MENU_VIEW', 'MENU_EDIT',
    'INVENTORY_VIEW', 'INVENTORY_ADJUST',
    'PURCHASING_VIEW', 'PURCHASING_CREATE',
    'RECIPE_VIEW', 'RECIPE_EDIT',
    'CUSTOMER_VIEW', 'CUSTOMER_EDIT',
    'STAFF_VIEW', 'STAFF_EDIT',
    'PAYMENT_VIEW', 'PAYMENT_PROCESS', 'PAYMENT_REFUND',
    'REPORT_VIEW',
    'ACCOUNTING_VIEW',
    'SETTINGS_VIEW',
    'KDS_VIEW', 'KDS_MANAGE',
    'WAITER_ORDER',
  ],
  Chef: [
    'KDS_VIEW', 'KDS_MANAGE',
    'MENU_VIEW', 'MENU_EDIT',
    'INVENTORY_VIEW',
    'RECIPE_VIEW', 'RECIPE_EDIT',
    'TABLE_VIEW',
    'REPORT_VIEW',
  ],
  Waiter: [
    'TABLE_VIEW', 'TABLE_EDIT',
    'POS_VIEW', 'POS_CREATE_ORDER', 'POS_EDIT_ORDER',
    'WAITER_ORDER',
    'RESERVATION_VIEW', 'RESERVATION_CREATE',
    'KDS_VIEW',
    'CUSTOMER_VIEW', 'CUSTOMER_EDIT',
    'PAYMENT_VIEW',
    'MENU_VIEW',
  ],
  Cashier: [
    'POS_VIEW', 'POS_CREATE_ORDER', 'POS_EDIT_ORDER',
    'PAYMENT_VIEW', 'PAYMENT_PROCESS', 'PAYMENT_REFUND',
    'TABLE_VIEW',
    'CUSTOMER_VIEW',
    'MENU_VIEW',
  ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  Admin: 'Administrator',
  Manager: 'Restaurant Manager',
  Chef: 'Head Chef',
  Waiter: 'Head Waiter',
  Cashier: 'Cashier',
};

export function hasPermission(permissions: Permission[], perm: Permission): boolean {
  return permissions.includes(perm);
}

export function hasAnyPermission(permissions: Permission[], perms: Permission[]): boolean {
  return perms.some((p) => permissions.includes(p));
}

export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard': ['POS_VIEW', 'TABLE_VIEW', 'KDS_VIEW', 'REPORT_VIEW', 'STAFF_VIEW'],
  '/pos': ['POS_VIEW'],
  '/tables': ['TABLE_VIEW'],
  '/reservations': ['RESERVATION_VIEW'],
  '/kitchen': ['KDS_VIEW'],
  '/waiter': ['WAITER_ORDER'],
  '/menu': ['MENU_VIEW'],
  '/inventory': ['INVENTORY_VIEW'],
  '/purchasing': ['PURCHASING_VIEW'],
  '/recipes': ['RECIPE_VIEW'],
  '/customers': ['CUSTOMER_VIEW'],
  '/staff': ['STAFF_VIEW'],
  '/delivery': ['POS_VIEW'],
  '/payments': ['PAYMENT_VIEW'],
  '/reports': ['REPORT_VIEW'],
  '/accounting': ['ACCOUNTING_VIEW'],
  '/settings': ['SETTINGS_VIEW'],
};

export function canAccessRoute(permissions: Permission[], route: string): boolean {
  const required = ROUTE_PERMISSIONS[route];
  if (!required) return true;
  return hasAnyPermission(permissions, required);
}
