import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api/apiClient';
import { Text } from '../components/ui/Text';
import { colors } from '../theme/colors';

export default function OAuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    async function handleOAuthReturn() {
      try {
        let accessToken = (params.access_token as string) || (params.accessToken as string);
        let refreshToken = (params.refresh_token as string) || (params.refreshToken as string);

        // Parse hash fragment if available via deep link URL
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && initialUrl.includes('#')) {
          const fragment = initialUrl.split('#')[1];
          const searchParams = new URLSearchParams(fragment);
          accessToken = accessToken || searchParams.get('access_token') || undefined;
          refreshToken = refreshToken || searchParams.get('refresh_token') || undefined;
        }

        if (accessToken && refreshToken) {
          apiClient.setSessionTokens({ accessToken, refreshToken, expiresIn: 1800 });
          await checkAuth();
          router.replace('/(tabs)/home');
        } else {
          router.replace('/auth/login');
        }
      } catch (err) {
        console.error('OAuth Callback error:', err);
        router.replace('/auth/login');
      }
    }

    handleOAuthReturn();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.dark, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.accent.primary} />
      <Text style={{ color: colors.text.secondary, marginTop: 16, fontSize: 14 }}>
        Completing Google Sign-In...
      </Text>
    </View>
  );
}
