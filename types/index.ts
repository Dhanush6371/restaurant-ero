export type UserRole = 'Admin' | 'Manager' | 'Chef' | 'Waiter' | 'Cashier';

export type Permission =
  | 'POS_VIEW' | 'POS_CREATE_ORDER' | 'POS_EDIT_ORDER' | 'POS_VOID_ORDER' | 'POS_REFUND'
  | 'TABLE_VIEW' | 'TABLE_EDIT' | 'TABLE_MERGE' | 'TABLE_SPLIT'
  | 'RESERVATION_VIEW' | 'RESERVATION_CREATE' | 'RESERVATION_EDIT'
  | 'MENU_VIEW' | 'MENU_EDIT'
  | 'INVENTORY_VIEW' | 'INVENTORY_ADJUST'
  | 'PURCHASING_VIEW' | 'PURCHASING_CREATE'
  | 'RECIPE_VIEW' | 'RECIPE_EDIT'
  | 'CUSTOMER_VIEW' | 'CUSTOMER_EDIT'
  | 'STAFF_VIEW' | 'STAFF_EDIT'
  | 'PAYMENT_VIEW' | 'PAYMENT_PROCESS' | 'PAYMENT_REFUND'
  | 'REPORT_VIEW'
  | 'ACCOUNTING_VIEW'
  | 'SETTINGS_VIEW'
  | 'USER_MANAGEMENT'
  | 'KDS_VIEW' | 'KDS_MANAGE'
  | 'WAITER_ORDER';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  avatar?: string;
  shift?: string;
  shiftStart?: string;
  shiftEnd?: string;
  section?: string;
  assignedTables?: number[];
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  permissions: Permission[];
}

export interface DemoUser extends User {
  password: string;
}

export type CourseType = 'Aperitif' | 'Starter' | 'Main' | 'Dessert' | 'Digestif';
export type CourseStatus = 'Draft' | 'Held' | 'Fired' | 'Preparing' | 'Ready' | 'Served';

export type TableStatus =
  | 'Available' | 'Reserved' | 'Seated' | 'Occupied'
  | 'Order Sent' | 'Preparing' | 'Food Ready'
  | 'Bill Requested' | 'Payment Due' | 'Cleaning';
export type TableZone = 'Main Dining' | 'Terrace' | 'Bar' | 'Private Dining';

export interface RestaurantTable {
  id: string;
  number: number;
  zone: TableZone;
  seats: number;
  status: TableStatus;
  guests?: number;
  waiter?: string;
  amount?: number;
  reservation?: string;
  elapsedMin?: number;
  customerId?: string;
  seatedAt?: string;
}

export type ReservationStatus = 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled' | 'No-show';

export interface Reservation {
  id: string;
  guest: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  table: number | null;
  area: TableZone;
  specialRequest?: string;
  status: ReservationStatus;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  guests: number;
  estimatedWait: number;
  seatingPreference: string;
  status: 'Waiting' | 'Seated';
  createdAt: string;
}

export type OrderStatus =
  | 'Draft' | 'Open' | 'New' | 'Sent to Kitchen' | 'Preparing'
  | 'Ready' | 'Served' | 'Bill Requested' | 'Paid' | 'Completed'
  | 'Cancelled' | 'Delayed';
export type OrderChannel = 'Dine-in' | 'Takeaway' | 'Delivery';
export type KitchenStation = 'Hot Kitchen' | 'Grill' | 'Garde Manger' | 'Pastry' | 'Bar';
export type Priority = 'Normal' | 'High' | 'VIP';

export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  notes?: string;
  station?: KitchenStation;
  course?: CourseType;
  status?: CourseStatus;
}

export interface Order {
  id: string;
  table?: number;
  waiter?: string;
  waiterId?: string;
  guests?: number;
  items: OrderItem[];
  status: OrderStatus;
  channel: OrderChannel;
  priority: Priority;
  station?: KitchenStation;
  amount: number;
  createdAt: string;
  elapsedMin: number;
  customerId?: string;
  notes?: string;
  courses?: { type: CourseType; status: CourseStatus; items: OrderItem[] }[];
}

export type MenuCategory = 'Entrées' | 'Plats' | 'Desserts' | 'Fromage' | 'Wine' | 'Drinks' | 'Cocktails' | 'Specials';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  foodCost: number;
  prepTime: number;
  allergens: string[];
  tags: string[];
  available: boolean;
  hasModifiers: boolean;
  image: string;
  station: KitchenStation;
}

export interface Modifier {
  id: string;
  name: string;
  options: { name: string; price: number }[];
}

export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minLevel: number;
  costPerUnit: number;
  status: InventoryStatus;
}

export type SupplierStatus = 'Active' | 'Inactive' | 'Pending';
export type POStatus = 'Draft' | 'Sent' | 'Partially Received' | 'Received' | 'Cancelled';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  lastOrder: string;
  outstanding: number;
  status: SupplierStatus;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  items: number;
  total: number;
  status: POStatus;
}

export interface RecipeIngredient {
  name: string;
  cost: number;
  quantity: string;
}

export interface Recipe {
  id: string;
  name: string;
  sellingPrice: number;
  ingredients: RecipeIngredient[];
  totalFoodCost: number;
  grossProfit: number;
  foodCostPct: number;
  servings: number;
  prepTime: number;
  station: KitchenStation;
}

export type LoyaltyStatus = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpend: number;
  averageSpend: number;
  preference: string;
  loyaltyStatus: LoyaltyStatus;
  loyaltyPoints: number;
  favoriteDishes: string[];
  winePreferences: string[];
  allergies: string[];
  specialOccasions?: string;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'Card' | 'Visa' | 'Mastercard' | 'Amex' | 'Apple Pay' | 'Google Pay' | 'Online' | 'Split';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';

export interface Payment {
  id: string;
  transactionId: string;
  order: string;
  table: number | null;
  amount: number;
  method: PaymentMethod;
  tip: number;
  status: PaymentStatus;
  time: string;
  waiter?: string;
}

export type DeliveryStatus = 'New' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type DeliveryType = 'Pickup' | 'Delivery';

export interface DeliveryOrder {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  address?: string;
  items: { name: string; quantity: number }[];
  amount: number;
  type: DeliveryType;
  scheduledTime: string;
  status: DeliveryStatus;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  todayShift: string;
  attendance: 'Present' | 'Absent' | 'Late' | 'On Leave';
  status: 'Active' | 'On Break' | 'Off Duty';
  phone: string;
  email: string;
  hireDate: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  station: string;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'reservation' | 'kitchen' | 'payment' | 'system' | 'waiter';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  module: string;
  time: string;
  details?: string;
}

export interface SalesRecord {
  date: string;
  sales: number;
  orders: number;
  channel: OrderChannel;
}

export interface HourlySale {
  hour: string;
  sales: number;
  orders: number;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  supplier: string;
  description: string;
  amount: number;
  vat: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export type ServiceMode = 'Lunch Service' | 'Dinner Service' | 'Closed' | 'Opening' | 'Closing';
