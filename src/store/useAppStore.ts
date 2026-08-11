import { create } from 'zustand';
import { CurrencyCode } from '../types/currency';
import { TransactionFilters, TransactionSort } from '../types/transaction';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  // Theme Mode
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // User Preferences
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;

  // Active Transaction Filters & Sort
  filters: TransactionFilters;
  sort: TransactionSort;
  setFilters: (filters: TransactionFilters) => void;
  resetFilters: () => void;
  setSort: (sort: TransactionSort) => void;

  // Global Lightweight Toast
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useAppStore = create<AppState>(set => ({
  themeMode: 'light',
  setThemeMode: themeMode => set({ themeMode }),

  currency: 'INR',
  setCurrency: currency => set({ currency }),

  filters: { type: 'all' },
  sort: 'date_desc',
  setFilters: filters => set({ filters }),
  resetFilters: () => set({ filters: { type: 'all' } }),
  setSort: sort => set({ sort }),

  toast: {
    visible: false,
    message: '',
    type: 'success',
  },
  showToast: (message, type = 'success') => {
    set({ toast: { visible: true, message, type } });
    setTimeout(() => {
      set(state => ({ toast: { ...state.toast, visible: false } }));
    }, 3000);
  },
  hideToast: () => set(state => ({ toast: { ...state.toast, visible: false } })),
}));
