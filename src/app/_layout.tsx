import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toast } from '../components/ui/Toast';
import { colors } from '../theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Toast />
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
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
