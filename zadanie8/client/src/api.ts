import axios, { isAxiosError } from 'axios';
import type { PaymentPayload, Product } from './types';

interface PaymentResponse {
  success: boolean;
  message: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3011',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/api/products');
  return data;
}

export async function submitPayment(payload: PaymentPayload): Promise<PaymentResponse> {
  const { data } = await api.post<PaymentResponse>('/api/payments', payload);
  return data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; message?: string; errors?: RegisterErrors }> {
  try {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response?.data) {
      return err.response.data as {
        success: boolean;
        message?: string;
        errors?: RegisterErrors;
      };
    }
    throw err;
  }
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post('/api/auth/logout');
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/api/auth/me');
  return data;
}

export async function fetchCsrfToken(): Promise<string> {
  const { data } = await api.get<{ csrfToken: string }>('/api/csrf-token');
  return data.csrfToken;
}

export async function updateAccountSettings(
  displayName: string,
  csrfToken: string,
): Promise<{ success: boolean; user: AuthUser; error?: string }> {
  const { data } = await api.post(
    '/api/account/settings',
    { displayName },
    { headers: { 'X-CSRF-Token': csrfToken } },
  );
  return data;
}
