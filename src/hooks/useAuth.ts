import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { apiClient } from '../services/api/apiClient';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const showToast = useAppStore((state) => state.showToast);
  const { user, isAuthenticated, isLoading, checkAuth, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await apiClient.login(email, password);
      await checkAuth();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      showToast('Welcome back! Successfully logged in.', 'success');
      router.replace('/(tabs)/home');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Login failed. Check your credentials.', 'error');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const data = await apiClient.register(name, email, password);
      await checkAuth();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      showToast('Account created successfully! Welcome aboard.', 'success');
      router.replace('/(tabs)/home');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Sign up failed. Please try again.', 'error');
    },
  });

  const logout = async () => {
    await storeLogout();
    queryClient.clear();
    showToast('You have been logged out.', 'info');
    router.replace('/auth/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    checkAuth,
  };
}
