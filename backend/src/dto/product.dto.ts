// Product DTOs for CRUD and list operations

export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  category?: string;
  brand?: string;
}

export interface ProductUpdateDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  category?: string;
  brand?: string;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  category?: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponseDto {
  products: ProductResponseDto[];
  nextCursor?: string;
  prevCursor?: string;
  total?: number;
} 