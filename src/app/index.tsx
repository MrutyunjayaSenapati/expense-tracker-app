import React from 'react';
import { Redirect } from 'expo-router';
import { apiClient } from '../services/api/apiClient';

export default function Index() {
  const hasToken = apiClient.hasValidToken();
  return <Redirect href={hasToken ? '/(tabs)/home' : '/auth/login'} />;
}

