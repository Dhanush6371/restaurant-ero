'use client';
import ProtectedRoute from '@/components/routes/protected-route';
import { AppShell } from '@/components/layout/app-shell';
export default function TablesLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute><AppShell>{children}</AppShell></ProtectedRoute>;
}
