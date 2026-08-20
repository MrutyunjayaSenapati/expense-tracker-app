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

  // Production standalone build fallback
  if (!__DEV__) {
    return 'https://expense-tracker-backend-9bdd.onrender.com/api/v1';
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
  private initPromise: Promise<void>;

  constructor() {
    this.baseUrl = resolveBaseUrl();
    this.initPromise = this.loadTokensFromStorage();
  }

  public async isReady(): Promise<boolean> {
    await this.initPromise;
    return this.hasValidToken();
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private async loadTokensFromStorage() {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) {
            this.tokens = JSON.parse(stored);
          }
        }
      } else {
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        if (stored) {
          this.tokens = JSON.parse(stored);
        }
      }

      if (__DEV__ && this.tokens?.accessToken) {
        console.log('[Auth Token Loaded from SecureStore]', {
          hasToken: true,
          expiresInMinutes: Math.round((this.tokens.expiresAt - Date.now()) / 60000),
          expiresAt: new Date(this.tokens.expiresAt).toLocaleTimeString(),
        });
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
          SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(tokens)).catch(() => {});
        } else {
          SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
        }
      }
    } catch {
      // Ignored
    }
  }

  public setSessionTokens(tokens: { accessToken: string; refreshToken: string; expiresIn?: number }) {
    this.saveTokensToStorage({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: Date.now() + (tokens.expiresIn || 1800) * 1000,
    });
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

  public async googleLogin(tokens: {
    idToken?: string;
    accessToken?: string;
    code?: string;
    redirectUri?: string;
  }): Promise<{ user: any }> {
    const response = await fetch(`${this.baseUrl}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_token: tokens.idToken,
        access_token: tokens.accessToken,
        code: tokens.code,
        redirect_uri: tokens.redirectUri,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const errorDetail = data?.error;
      throw new ApiError(
        errorDetail?.message || 'Google sign-in failed',
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

  public async deleteAccount(): Promise<void> {
    await this.request<void>('/auth/account', { method: 'DELETE' });
    this.saveTokensToStorage(null);
  }

  public async exportTransactionsCsv(): Promise<string> {
    const token = await this.ensureAuthenticated();
    const response = await fetch(`${this.baseUrl}/reports/export/csv`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export CSV report');
    }

    return await response.text();
  }

  public async getRecurringTransactions(): Promise<any[]> {
    const res = await this.request<{ items: any[] }>('/recurring-transactions');
    return res?.items || [];
  }

  public async createRecurringTransaction(payload: any): Promise<any> {
    return await this.request<any>('/recurring-transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async updateRecurringTransaction(id: string, payload: any): Promise<any> {
    return await this.request<any>(`/recurring-transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  public async deleteRecurringTransaction(id: string): Promise<void> {
    return await this.request<void>(`/recurring-transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Split Expense & Bill Sharing
  public async getSplitBills(status?: string): Promise<any[]> {
    const query = status ? `?status=${status}` : '';
    const res = await this.request<any[]>(`/splits${query}`);
    return res || [];
  }

  public async getSplitSummary(): Promise<any> {
    return await this.request<any>('/splits/summary');
  }

  public async getSplitBill(id: string): Promise<any> {
    return await this.request<any>(`/splits/${id}`);
  }

  public async createSplitBill(payload: any): Promise<any> {
    return await this.request<any>('/splits', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async settleSplitParticipant(billId: string, participantId: string, isPaid: boolean = true): Promise<any> {
    return await this.request<any>(`/splits/${billId}/participants/${participantId}/settle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_paid: isPaid }),
    });
  }

  public async deleteSplitBill(billId: string): Promise<void> {
    return await this.request<void>(`/splits/${billId}`, {
      method: 'DELETE',
    });
  }

  // Shared Expense Groups (Flatmates / Room Expenses)
  public async getGroups(): Promise<any[]> {
    const res = await this.request<any[]>('/groups');
    return res || [];
  }

  public async getGroup(id: string): Promise<any> {
    return await this.request<any>(`/groups/${id}`);
  }

  public async createGroup(payload: any): Promise<any> {
    return await this.request<any>('/groups', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async joinGroup(inviteCode: string): Promise<any> {
    return await this.request<any>('/groups/join', {
      method: 'POST',
      body: JSON.stringify({ invite_code: inviteCode }),
    });
  }

  public async addGroupExpense(groupId: string, payload: any): Promise<any> {
    return await this.request<any>(`/groups/${groupId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async recordGroupSettlement(groupId: string, payload: any): Promise<any> {
    return await this.request<any>(`/groups/${groupId}/settle`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async deleteGroup(groupId: string): Promise<void> {
    return await this.request<void>(`/groups/${groupId}`, {
      method: 'DELETE',
    });
  }

  public hasValidToken(): boolean {
    return !!this.tokens?.accessToken;
  }

  private refreshPromise: Promise<void> | null = null;

  public async ensureAuthenticated(): Promise<string> {
    await this.initPromise;

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
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: this.tokens!.refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Refresh failed');
        }

        const data = await response.json();
        this.saveTokensToStorage({
          accessToken: data.access_token,
          refreshToken: this.tokens!.refreshToken,
          expiresAt: Date.now() + data.expires_in * 1000,
        });
      } catch (e) {
        this.saveTokensToStorage(null);
        throw e;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
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
    const method = options.method || 'GET';

    if (__DEV__) {
      console.log(`[API ${method}] ${url}`, options.body ? JSON.parse(options.body as string) : '');
    }

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
      if (__DEV__) {
        console.log(`[API Response 204 No Content] ${url}`);
      }
      return null as unknown as T;
    }

    const data = await response.json().catch(() => null);

    if (__DEV__) {
      if (response.ok) {
        console.log(`[API Response ${response.status}] ${url}`, data);
      } else {
        console.warn(`[API Error ${response.status}] ${url}`, data);
      }
    }

    if (!response.ok) {
      const errorDetail = data?.error;
      let errorMessage = errorDetail?.message || response.statusText || 'An unexpected error occurred';
      
      if (errorDetail?.fields && typeof errorDetail.fields === 'object') {
        const fieldErrors = Object.entries(errorDetail.fields)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        if (fieldErrors) {
          errorMessage = `${errorMessage}: ${fieldErrors}`;
        }
      }

      throw new ApiError(
        errorMessage,
        errorDetail?.code || 'HTTP_ERROR',
        response.status,
        errorDetail?.fields
      );
    }

    return data as T;
  }
}

export const apiClient = new ApiClient();
