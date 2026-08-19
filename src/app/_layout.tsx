import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { AppState, type AppStateStatus } from 'react-native';
import { Toast } from '../components/ui/Toast';
import { BiometricLockOverlay } from '../components/ui/BiometricLockOverlay';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { notificationService } from '../services/notifications/notificationService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function ProtectedNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const { colors } = useTheme();

  useEffect(() => {
    initializeAuth();
    notificationService.init();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'onboarding';

    if (!isAuthenticated && !inAuthGroup) {
      // 1. Block access: Unauthenticated users are sent immediately to Login
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      // 2. Authenticated users cannot stay on Login/Register screen
      router.replace('/(tabs)/home');
    }
  }, [segments, isAuthenticated, isInitialized, router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="transactions/[id]"
        options={{
          title: 'Transaction Details',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="transactions/edit"
        options={{
          title: 'Edit Transaction',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="budgets/index"
        options={{
          title: 'Monthly Budgets',
        }}
      />
      <Stack.Screen
        name="budgets/create"
        options={{
          title: 'Create Budget',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="accounts/index"
        options={{
          title: 'Accounts & Wallets',
        }}
      />
      <Stack.Screen
        name="accounts/create"
        options={{
          title: 'Add Account',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="categories/index"
        options={{
          title: 'Manage Categories',
        }}
      />
      <Stack.Screen
        name="subscriptions/index"
        options={{
          title: 'Subscriptions & Bills',
        }}
      />
      <Stack.Screen
        name="subscriptions/create"
        options={{
          title: 'Add Subscription',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="splits/index"
        options={{
          title: 'Split Expenses',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="splits/create"
        options={{
          title: 'Split Expense',
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="groups/index"
        options={{
          title: 'Shared Groups',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="groups/create"
        options={{
          title: 'Create Group',
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="groups/join"
        options={{
          title: 'Join Group',
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="groups/[id]/index"
        options={{
          title: 'Group Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="groups/[id]/add-expense"
        options={{
          title: 'Add Group Expense',
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="auth/login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function RootLayoutNav() {
  const { isDark } = useTheme();
  const lockApp = useAppStore(state => state.lockApp);
  const biometricsEnabled = useAppStore(state => state.biometricsEnabled);

  useEffect(() => {
    if (biometricsEnabled) {
      lockApp();
    }

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && biometricsEnabled) {
        lockApp();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [biometricsEnabled, lockApp]);

  return (
    <>
      <StatusBar
        style={isDark ? 'light' : 'dark'}
      />
      <Toast />
      <BiometricLockOverlay />
      <ProtectedNavigation />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <RootLayoutNav />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

