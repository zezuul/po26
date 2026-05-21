export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentPayload {
  cardHolder: string;
  email: string;
  items: { id: number; name: string; quantity: number; price: number }[];
  total: number;
}
