export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags?: string[];
  category?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
} 