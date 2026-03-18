export type UserRole = 'trader' | 'manager';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  created_at: string;
}

export interface Division {
  id: string;
  name: string;
  identifier: number;
}

export type TradeStatus = 'pending' | 'approved';

export interface Trade {
  id: string;
  trade_id: string;
  deal_date: string;
  seller: string;
  buyer: string;
  product: string;
  division_id: string;
  quantity: number;
  delivery_date: string;
  price: number;
  total_price: number;
  currency: string;
  status: TradeStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  division?: Division;
}

export interface TradeCreate {
  seller: string;
  buyer: string;
  product: string;
  division_id: string;
  quantity: number;
  delivery_date: string;
  price: number;
  currency?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
