import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth-context';
import { RestaurantProvider } from '@/lib/restaurant-context';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/routes/protected-route';
import { AppShell } from '@/components/layout/app-shell';

import LoginPage from '@/app/login/page';
import DashboardPage from '@/app/dashboard/page';
import PosPage from '@/app/pos/page';
import TablesPage from '@/app/tables/page';
import ReservationsPage from '@/app/reservations/page';
import KitchenPage from '@/app/kitchen/page';
import WaiterPage from '@/app/waiter/page';
import MenuPage from '@/app/menu/page';
import InventoryPage from '@/app/inventory/page';
import PurchasingPage from '@/app/purchasing/page';
import RecipesPage from '@/app/recipes/page';
import CustomersPage from '@/app/customers/page';
import StaffPage from '@/app/staff/page';
import DeliveryPage from '@/app/delivery/page';
import PaymentsPage from '@/app/payments/page';
import ReportsPage from '@/app/reports/page';
import AccountingPage from '@/app/accounting/page';
import SettingsPage from '@/app/settings/page';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/pos" element={<ProtectedLayout><PosPage /></ProtectedLayout>} />
          <Route path="/tables" element={<ProtectedLayout><TablesPage /></ProtectedLayout>} />
          <Route path="/reservations" element={<ProtectedLayout><ReservationsPage /></ProtectedLayout>} />
          <Route path="/kitchen" element={<ProtectedLayout><KitchenPage /></ProtectedLayout>} />
          <Route path="/waiter" element={<ProtectedLayout><WaiterPage /></ProtectedLayout>} />
          <Route path="/menu" element={<ProtectedLayout><MenuPage /></ProtectedLayout>} />
          <Route path="/inventory" element={<ProtectedLayout><InventoryPage /></ProtectedLayout>} />
          <Route path="/purchasing" element={<ProtectedLayout><PurchasingPage /></ProtectedLayout>} />
          <Route path="/recipes" element={<ProtectedLayout><RecipesPage /></ProtectedLayout>} />
          <Route path="/customers" element={<ProtectedLayout><CustomersPage /></ProtectedLayout>} />
          <Route path="/staff" element={<ProtectedLayout><StaffPage /></ProtectedLayout>} />
          <Route path="/delivery" element={<ProtectedLayout><DeliveryPage /></ProtectedLayout>} />
          <Route path="/payments" element={<ProtectedLayout><PaymentsPage /></ProtectedLayout>} />
          <Route path="/reports" element={<ProtectedLayout><ReportsPage /></ProtectedLayout>} />
          <Route path="/accounting" element={<ProtectedLayout><AccountingPage /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </RestaurantProvider>
    </AuthProvider>
  );
}
