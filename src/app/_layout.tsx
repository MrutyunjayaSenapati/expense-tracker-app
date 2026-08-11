import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toast } from '../components/ui/Toast';
import { colors } from '../theme/colors';
import { apiClient } from '../services/api/apiClient';
import { useAuthStore } from '../store/useAuthStore';

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

  useEffect(() => {
    const hasToken = apiClient.hasValidToken();
    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'onboarding';

    if (!hasToken && !inAuthGroup) {
      // 1. Block access: Unauthenticated users are sent immediately to Login
      router.replace('/auth/login');
    } else if (hasToken && inAuthGroup) {
      // 2. Authenticated users cannot stay on Login/Register screen
      router.replace('/(tabs)/home');
    }
  }, [segments, isAuthenticated, router]);

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

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Toast />
        <ProtectedNavigation />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

