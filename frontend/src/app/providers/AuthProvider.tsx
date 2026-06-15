import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useUserStore } from '@/entities/user/model/store';
import * as authApi from '@/shared/api/auth';

import type { User } from '@/entities/user/model/types';

// --- Context types ---

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  return ctx;
};

// --- Provider ---

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useUserStore();


  // On mount: validate persisted token
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem('sges_token');
      if (!savedToken) {
        store.setLoading(false);
        return;
      }

      try {
        const user = await authApi.getMe();
        store.setAuth(user, savedToken);
      } catch {
        // Token invalid/expired — clear
        localStorage.removeItem('sges_token');
        store.clearAuth();
      }

    };

    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('sges_token', data.accessToken);
    store.setAuth(data.user, data.accessToken);
  }, [store]);

  const signOut = useCallback(() => {
    // Fire-and-forget: attempt to invalidate on server
    authApi.logout().catch(() => {});
    // Immediately clear local state
    localStorage.removeItem('sges_token');
    store.clearAuth();
  }, [store]);

  const requestPasswordReset = useCallback(async (email: string) => {
    await authApi.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    await authApi.resetPassword(token, newPassword);
  }, []);

  const value: AuthContextValue = {
    user: store.user,
    accessToken: store.accessToken,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
