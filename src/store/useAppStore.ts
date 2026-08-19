import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { CurrencyCode } from '../types/currency';
import { TransactionFilters, TransactionSort } from '../types/transaction';
import { notificationService } from '../services/notifications/notificationService';
import { biometricService } from '../services/security/biometricService';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface SavingsVault {
  id: string;
  name: string;
  icon: string;
  color: string;
  targetAmount: number;
  currentAmount: number;
}

interface AppState {
  // Theme Mode (Persisted)
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // User Preferences (Persisted)
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;

  // Savings Vaults & Pockets (Persisted)
  vaults: SavingsVault[];
  addVault: (vault: Omit<SavingsVault, 'id' | 'currentAmount'>) => void;
  depositToVault: (vaultId: string, amount: number) => void;
  deleteVault: (vaultId: string) => void;

  // Active Transaction Filters & Sort
  filters: TransactionFilters;
  sort: TransactionSort;
  setFilters: (filters: TransactionFilters) => void;
  resetFilters: () => void;
  setSort: (sort: TransactionSort) => void;

  // Notification Preferences (Persisted)
  notificationsEnabled: boolean;
  dailyReminderHour: number;
  dailyReminderMinute: number;
  budgetAlertsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => Promise<boolean>;
  setDailyReminderTime: (hour: number, minute: number) => Promise<void>;
  setBudgetAlertsEnabled: (enabled: boolean) => void;

  // Biometric App Lock (Persisted)
  biometricsEnabled: boolean;
  isAppLocked: boolean;
  setBiometricsEnabled: (enabled: boolean) => Promise<boolean>;
  unlockApp: () => void;
  lockApp: () => void;

  // Global Lightweight Toast
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

// Storage adapter compatible with SecureStore on Native and localStorage on Web
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(name) : null;
    }
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(name, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // Ignore
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(name);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // Ignore
    }
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      setThemeMode: themeMode => set({ themeMode }),

      currency: 'INR',
      setCurrency: currency => set({ currency }),

      // Savings Vaults & Pockets (Default empty - user created only)
      vaults: [],
      addVault: vaultData => {
        const newVault: SavingsVault = {
          ...vaultData,
          id: `vault_${Date.now()}`,
          currentAmount: 0,
        };
        set(state => ({ vaults: [...state.vaults, newVault] }));
      },
      depositToVault: (vaultId, amount) => {
        set(state => ({
          vaults: state.vaults.map(v =>
            v.id === vaultId
              ? { ...v, currentAmount: Math.min(v.targetAmount, v.currentAmount + amount) }
              : v
          ),
        }));
      },
      deleteVault: vaultId => {
        set(state => ({
          vaults: state.vaults.filter(v => v.id !== vaultId),
        }));
      },

      filters: { type: 'all' },
      sort: 'date_desc',
      setFilters: filters => set({ filters }),
      resetFilters: () => set({ filters: { type: 'all' } }),
      setSort: sort => set({ sort }),

      // Notification Preferences Defaults
      notificationsEnabled: true,
      dailyReminderHour: 20, // 8:00 PM
      dailyReminderMinute: 0,
      budgetAlertsEnabled: true,

      setNotificationsEnabled: async (enabled: boolean) => {
        if (enabled) {
          const granted = await notificationService.requestPermissions();
          if (!granted) {
            set({ notificationsEnabled: false });
            return false;
          }
          const { dailyReminderHour, dailyReminderMinute } = get();
          await notificationService.scheduleDailyReminder(dailyReminderHour, dailyReminderMinute);
          set({ notificationsEnabled: true });
          return true;
        } else {
          await notificationService.cancelDailyReminder();
          set({ notificationsEnabled: false });
          return true;
        }
      },

      setDailyReminderTime: async (hour: number, minute: number) => {
        set({ dailyReminderHour: hour, dailyReminderMinute: minute });
        const { notificationsEnabled } = get();
        if (notificationsEnabled) {
          await notificationService.scheduleDailyReminder(hour, minute);
        }
      },

      setBudgetAlertsEnabled: (enabled: boolean) => set({ budgetAlertsEnabled: enabled }),

      // Biometric App Lock
      biometricsEnabled: false,
      isAppLocked: false,

      setBiometricsEnabled: async (enabled: boolean) => {
        if (enabled) {
          const available = await biometricService.isHardwareAvailable();
          if (!available) {
            return false;
          }
          const authenticated = await biometricService.authenticate('Confirm Face ID / Fingerprint to enable App Lock');
          if (authenticated) {
            set({ biometricsEnabled: true, isAppLocked: false });
            return true;
          }
          return false;
        } else {
          set({ biometricsEnabled: false, isAppLocked: false });
          return true;
        }
      },

      unlockApp: () => set({ isAppLocked: false }),
      lockApp: () => {
        const { biometricsEnabled } = get();
        if (biometricsEnabled) {
          set({ isAppLocked: true });
        }
      },

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
    }),
    {
      name: 'expense_tracker_app_preferences',
      storage: createJSONStorage(() => secureStorage),
      partialize: state => ({
        themeMode: state.themeMode,
        currency: state.currency,
        vaults: state.vaults,
        notificationsEnabled: state.notificationsEnabled,
        dailyReminderHour: state.dailyReminderHour,
        dailyReminderMinute: state.dailyReminderMinute,
        budgetAlertsEnabled: state.budgetAlertsEnabled,
        biometricsEnabled: state.biometricsEnabled,
      }),
    }
  )
);
