import axios from 'axios';
import type { PaymentPayload, Product } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/api/products');
  return data;
}

export async function submitPayment(payload: PaymentPayload) {
  const { data } = await api.post('/api/payments', payload);
  return data;
}
