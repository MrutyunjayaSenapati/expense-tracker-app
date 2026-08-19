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

  const googleLoginMutation = useMutation({
    mutationFn: async (tokens: {
      idToken?: string;
      accessToken?: string;
      code?: string;
      redirectUri?: string;
    }) => {
      const data = await apiClient.googleLogin(tokens);
      await checkAuth();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      showToast('Welcome! Signed in with Google.', 'success');
      router.replace('/(tabs)/home');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Google sign-in failed. Please try again.', 'error');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await apiClient.deleteAccount();
      await storeLogout();
    },
    onSuccess: () => {
      queryClient.clear();
      showToast('Your account and all associated data have been permanently deleted.', 'info');
      router.replace('/auth/login');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete account. Please try again.', 'error');
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
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      googleLoginMutation.isPending ||
      deleteAccountMutation.isPending,
    isGoogleLoading: googleLoginMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    googleLogin: googleLoginMutation.mutateAsync,
    deleteAccount: deleteAccountMutation.mutateAsync,
    logout,
    checkAuth,
  };
}
