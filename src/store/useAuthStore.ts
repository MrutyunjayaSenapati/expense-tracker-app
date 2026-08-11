import { create } from 'zustand';
import { User } from '../types/user';
import { apiClient } from '../services/api/apiClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),

  initializeAuth: async () => {
    await apiClient.isReady();
    const hasToken = apiClient.hasValidToken();
    set({ isAuthenticated: hasToken, isInitialized: true });
    if (hasToken) {
      get().checkAuth().catch(() => {});
    }
    return hasToken;
  },

  checkAuth: async () => {
    await apiClient.isReady();
    if (!apiClient.hasValidToken()) {
      set({ user: null, isAuthenticated: false, isInitialized: true });
      return false;
    }

    try {
      set({ isLoading: true });
      const data = await apiClient.request<any>('/auth/me');
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatar_url,
        currency: 'INR',
        locale: 'en-IN',
        createdAt: data.created_at || new Date().toISOString(),
      };
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await apiClient.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
