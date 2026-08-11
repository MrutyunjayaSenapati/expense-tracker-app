import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

function resolveBaseUrl(): string {
  let envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (envUrl) {
    envUrl = envUrl.replace(/\/+$/, '');
    if (!envUrl.endsWith('/api/v1')) {
      envUrl = `${envUrl}/api/v1`;
    }
    return envUrl;
  }

  // 1. If running on Web, localhost:8000 works directly
  if (Platform.OS === 'web') {
    return 'http://localhost:8000/api/v1';
  }

  // 2. Automatically extract PC's Wi-Fi IP address from Expo Metro Bundler connection
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:8000/api/v1`;
    }
  }

  // 3. Android Emulator loopback alias
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }

  return 'http://localhost:8000/api/v1';
}

export class ApiError extends Error {
  code: string;
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, code: string = 'API_ERROR', status: number = 500, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const STORAGE_KEY = 'expense_tracker_tokens';

class ApiClient {
  private baseUrl: string;
  private tokens: AuthTokens | null = null;
  private authPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = resolveBaseUrl();
    this.loadTokensFromStorage();
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private loadTokensFromStorage() {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) {
            this.tokens = JSON.parse(stored);
          }
        }
      } else {
        const stored = SecureStore.getItemSync(STORAGE_KEY);
        if (stored) {
          this.tokens = JSON.parse(stored);
        }
      }
    } catch {
      // Ignored
    }
  }

  private saveTokensToStorage(tokens: AuthTokens | null) {
    this.tokens = tokens;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          if (tokens) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      } else {
        if (tokens) {
          SecureStore.setItemSync(STORAGE_KEY, JSON.stringify(tokens));
        } else {
          SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
        }
      }
    } catch {
      // Ignored
    }
  }

  public async login(email: string, password: string): Promise<{ user: any }> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const errorDetail = data?.error;
      throw new ApiError(
        errorDetail?.message || 'Invalid email or password',
        errorDetail?.code || 'AUTH_ERROR',
        response.status,
        errorDetail?.fields
      );
    }

    this.saveTokensToStorage({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in || 1800) * 1000,
    });

    return data;
  }

  public async register(name: string, email: string, password: string): Promise<{ user: any }> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirm_password: password,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const errorDetail = data?.error;
      throw new ApiError(
        errorDetail?.message || 'Registration failed',
        errorDetail?.code || 'AUTH_ERROR',
        response.status,
        errorDetail?.fields
      );
    }

    // Auto-login after registration
    return this.login(email, password);
  }

  public async logout(): Promise<void> {
    try {
      if (this.tokens?.refreshToken) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokens.accessToken}`,
          },
          body: JSON.stringify({ refresh_token: this.tokens.refreshToken }),
        });
      }
    } catch {
      // Ignore network failure on logout
    } finally {
      this.saveTokensToStorage(null);
    }
  }

  public hasValidToken(): boolean {
    return !!this.tokens?.accessToken;
  }

  public async ensureAuthenticated(): Promise<string> {
    if (this.tokens && this.tokens.expiresAt > Date.now() + 60000) {
      return this.tokens.accessToken;
    }

    if (this.tokens && this.tokens.refreshToken) {
      try {
        await this.refreshAccessToken();
        if (this.tokens?.accessToken) {
          return this.tokens.accessToken;
        }
      } catch {
        // Refresh failed
      }
    }

    return this.tokens?.accessToken || '';
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.tokens?.refreshToken) return;
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      this.saveTokensToStorage({
        accessToken: data.access_token,
        refreshToken: this.tokens.refreshToken,
        expiresAt: Date.now() + data.expires_in * 1000,
      });
    } catch (e) {
      this.saveTokensToStorage(null);
      throw e;
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (requiresAuth) {
      const token = await this.ensureAuthenticated();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 token expiry retry
    if (response.status === 401 && requiresAuth) {
      try {
        await this.refreshAccessToken();
        const newToken = this.tokens?.accessToken;
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      } catch {
        // Fall through to error handler
      }
    }

    if (response.status === 204) {
      return null as unknown as T;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorDetail = data?.error;
      throw new ApiError(
        errorDetail?.message || response.statusText || 'An unexpected error occurred',
        errorDetail?.code || 'HTTP_ERROR',
        response.status,
        errorDetail?.fields
      );
    }

    return data as T;
  }
}

export const apiClient = new ApiClient();
