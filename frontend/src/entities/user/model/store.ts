import { create } from 'zustand';
import type { User } from './types';

interface UserState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  // Compat aliases used by UI components
  userName: string | null;
  role: 'admin' | 'volunteer' | null;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,

  // Computed getters as state fields kept in sync
  userName: null,
  role: null,

  setUser: (user) =>
    set({ user, userName: user.name, role: user.role }),

  setToken: (token) =>
    set({ accessToken: token }),

  setLoading: (loading) =>
    set({ loading }),

  setAuth: (user, token) =>
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      loading: false,
      userName: user.name,
      role: user.role,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      userName: null,
      role: null,
    }),
}));
