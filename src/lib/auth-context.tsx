
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Permission, UserRole, DemoUser } from '@/types';
import { demoUsers } from '@/lib/mock-data';
import { ROLE_PERMISSIONS, canAccessRoute, hasPermission as checkPerm } from '@/lib/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (perm: Permission) => boolean;
  canAccessRoute: (route: string) => boolean;
  requestManagerApproval: (email: string, password: string) => { success: boolean; error?: string };
  allUsers: DemoUser[];
  addUser: (user: DemoUser) => void;
  deactivateUser: (id: string) => void;
  activateUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'maisonos_auth_v2';
const USERS_KEY = 'maisonos_users_v2';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<DemoUser[]>([]);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_KEY);
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      } else {
        setAllUsers(demoUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as DemoUser[];
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }

    if (found.status === 'Inactive') {
      return { success: false, error: 'This account has been deactivated. Contact an administrator.' };
    }

    const { password: _pw, ...userWithoutPw } = found;
    const updatedUser = { ...userWithoutPw, lastLogin: new Date().toISOString() };
    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    const updatedUsers = users.map((u) =>
      u.id === found.id ? { ...u, lastLogin: updatedUser.lastLogin } : u
    );
    setAllUsers(updatedUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasPermission = useCallback(
    (perm: Permission) => (user ? checkPerm(user.permissions, perm) : false),
    [user]
  );

  const canAccessRouteFn = useCallback(
    (route: string) => (user ? canAccessRoute(user.permissions, route) : false),
    [user]
  );

  const requestManagerApproval = useCallback((email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as DemoUser[];
    const manager = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!manager) {
      return { success: false, error: 'Invalid manager credentials.' };
    }
    if (manager.role !== 'Manager' && manager.role !== 'Admin') {
      return { success: false, error: 'This account does not have approval authority.' };
    }
    return { success: true };
  }, []);

  const addUser = useCallback((newUser: DemoUser) => {
    setAllUsers((prev) => {
      const updated = [...prev, newUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deactivateUser = useCallback((id: string) => {
    setAllUsers((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, status: 'Inactive' as const } : u));
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const activateUser = useCallback((id: string) => {
    setAllUsers((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, status: 'Active' as const } : u));
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasPermission,
        canAccessRoute: canAccessRouteFn,
        requestManagerApproval,
        allUsers,
        addUser,
        deactivateUser,
        activateUser,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
