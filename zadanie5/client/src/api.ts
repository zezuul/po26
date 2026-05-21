import axios from 'axios';
import type { PaymentPayload, Product } from './types';

interface PaymentResponse {
  success: boolean;
  message: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/api/products');
  return data;
}

export async function submitPayment(payload: PaymentPayload): Promise<PaymentResponse> {
  const { data } = await api.post<PaymentResponse>('/api/payments', payload);
  return data;
}
