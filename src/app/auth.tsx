import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { demoUsers } from '../data/mockData';
import type { DemoUser, UserRole } from '../types/domain';

const AUTH_STORAGE_KEY = 'cureally:demoSession';

interface AuthContextValue {
  isAuthenticated: boolean;
  currentUser: DemoUser | null;
  loginAs: (userId: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): DemoUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUserId = window.localStorage.getItem(AUTH_STORAGE_KEY);
  return demoUsers.find((user) => user.id === storedUserId) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => readStoredUser());

  const persist = (user: DemoUser | null) => {
    setCurrentUser(user);
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, user.id);
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(currentUser),
      currentUser,
      loginAs: (userId) => {
        const user = demoUsers.find((candidate) => candidate.id === userId) ?? null;
        persist(user);
        return Boolean(user);
      },
      logout: () => {
        persist(null);
      },
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }

  return context;
}

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export function RequireRole({ role }: { role: UserRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'caregiver' ? '/caregiver/home' : '/home'} replace />;
  }

  return <Outlet />;
}

export function RequireCoordinator() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'family' || !currentUser.isCoordinator) return <Navigate to="/home" replace />;
  return <Outlet />;
}
