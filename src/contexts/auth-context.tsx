'use client';

import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

import { authApi } from '@/services/api/auth-api';
import { Role } from '@/lib/auth';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  tenantId: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: Record<string, unknown>) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const { accessToken: newAccessToken } = await authApi.refresh();
      setAccessToken(newAccessToken);

      const { user: refreshedUser } = await authApi.me(newAccessToken);
      setUser(refreshedUser as User);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    // Attempt silent refresh on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const login = useCallback(async (credentials: Record<string, unknown>) => {
    setError(null);
    try {
      setIsLoading(true);
      const { user: loggedInUser, accessToken: newAccessToken } = await authApi.login(credentials);
      setAccessToken(newAccessToken);
      setUser(loggedInUser as User);
      return loggedInUser as User;
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'An error occurred') || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      if (accessToken) {
        await authApi.logout(accessToken);
      }
    } finally {
      setUser(null);
      setAccessToken(null);
      window.location.href = '/auth/login'; // Force redirect and clear state
    }
  };

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user],
  );

  const hasPermission = useCallback(
    (permission: string) => {
      // Stub for Sprint 1.3
      return !!user;
    },
    [user],
  );

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refresh,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
