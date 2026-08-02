'use client';

import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

import { setGlobalToken } from '@/services/api/api-client';
import { authApi, LoginCredentials } from '@/services/api/auth-api';
import { Role } from '@/lib/auth';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  tenantId: string;
  mustChangePassword?: boolean;
  clientId?: string;
  tenant?: {
    id: string;
    name: string;
    status: string;
  };
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
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
      setGlobalToken(newAccessToken);

      const { user: refreshedUser } = await authApi.me(newAccessToken);
      setUser(refreshedUser as User);
    } catch {
      setUser(null);
      setAccessToken(null);
      setGlobalToken(null);
    }
  }, []);

  useEffect(() => {
    // Attempt silent refresh on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  useEffect(() => {
    // Redirect if user must change password
    if (user?.mustChangePassword && !window.location.pathname.startsWith('/auth/change-password')) {
      window.location.href = '/auth/change-password';
    }
  }, [user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    try {
      setIsLoading(true);
      const { user: loggedInUser, accessToken: newAccessToken } = await authApi.login(credentials);
      setAccessToken(newAccessToken);
      setGlobalToken(newAccessToken);
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
      setGlobalToken(null);
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
    (_permission: string) => {
      // Full permission checks use useCan() hook from @/hooks/use-can
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

/**
 * Returns the AuthContext. Must be used within an AuthProvider.
 * Prefer importing from '@/hooks/use-auth' instead of using this directly.
 */
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
