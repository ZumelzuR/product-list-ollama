import { ProductCreateDto, ProductUpdateDto, ProductResponseDto, ProductListResponseDto } from '../../dto/product.dto';

describe('Product DTOs', () => {
  describe('ProductCreateDto', () => {
    it('should have required fields', () => {
      const dto: ProductCreateDto = {
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99,
      };

      expect(dto.name).toBe('Test Product');
      expect(dto.description).toBe('A test product description');
      expect(dto.price).toBe(29.99);
    });

    it('should have optional fields', () => {
      const dto: ProductCreateDto = {
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99,
        category: 'Electronics',
        brand: 'TestBrand',
        tags: ['test', 'new'],
      };

      expect(dto.category).toBe('Electronics');
      expect(dto.brand).toBe('TestBrand');
      expect(dto.tags).toEqual(['test', 'new']);
    });

    it('should allow empty tags array', () => {
      const dto: ProductCreateDto = {
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99,
        tags: [],
      };

      expect(dto.tags).toEqual([]);
    });
  });

  describe('ProductUpdateDto', () => {
    it('should have all fields as optional', () => {
      const dto: ProductUpdateDto = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 39.99,
        category: 'New Category',
        brand: 'New Brand',
        tags: ['updated'],
      };

      expect(dto.name).toBe('Updated Product');
      expect(dto.description).toBe('Updated description');
      expect(dto.price).toBe(39.99);
      expect(dto.category).toBe('New Category');
      expect(dto.brand).toBe('New Brand');
      expect(dto.tags).toEqual(['updated']);
    });

    it('should allow partial updates', () => {
      const dto: ProductUpdateDto = {
        price: 49.99,
      };

      expect(dto.price).toBe(49.99);
      expect(dto.name).toBeUndefined();
      expect(dto.description).toBeUndefined();
    });

    it('should allow empty object', () => {
      const dto: ProductUpdateDto = {};

      expect(dto.name).toBeUndefined();
      expect(dto.description).toBeUndefined();
      expect(dto.price).toBeUndefined();
    });
  });

  describe('ProductResponseDto', () => {
    it('should have all required fields', () => {
      const dto: ProductResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99,
        tags: ['test'],
        category: 'Electronics',
        brand: 'TestBrand',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      expect(dto.id).toBe('507f1f77bcf86cd799439011');
      expect(dto.name).toBe('Test Product');
      expect(dto.description).toBe('A test product description');
      expect(dto.price).toBe(29.99);
      expect(dto.tags).toEqual(['test']);
      expect(dto.category).toBe('Electronics');
      expect(dto.brand).toBe('TestBrand');
      expect(dto.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(dto.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should allow optional fields to be undefined', () => {
      const dto: ProductResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99,
        tags: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      expect(dto.category).toBeUndefined();
      expect(dto.brand).toBeUndefined();
    });
  });

  describe('ProductListResponseDto', () => {
    it('should have required products array', () => {
      const dto: ProductListResponseDto = {
        products: [
          {
            id: '507f1f77bcf86cd799439011',
            name: 'Product 1',
            description: 'Description 1',
            price: 29.99,
            tags: ['tag1'],
            category: 'Electronics',
            brand: 'Brand A',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      expect(dto.products).toHaveLength(1);
      expect(dto.products[0].name).toBe('Product 1');
    });

    it('should have optional pagination fields', () => {
      const dto: ProductListResponseDto = {
        products: [],
        nextCursor: '2024-01-02T00:00:00.000Z',
        prevCursor: '2024-01-01T00:00:00.000Z',
        total: 10,
      };

      expect(dto.nextCursor).toBe('2024-01-02T00:00:00.000Z');
      expect(dto.prevCursor).toBe('2024-01-01T00:00:00.000Z');
      expect(dto.total).toBe(10);
    });

    it('should allow pagination fields to be undefined', () => {
      const dto: ProductListResponseDto = {
        products: [],
      };

      expect(dto.nextCursor).toBeUndefined();
      expect(dto.prevCursor).toBeUndefined();
      expect(dto.total).toBeUndefined();
    });

    it('should handle empty products array', () => {
      const dto: ProductListResponseDto = {
        products: [],
      };

      expect(dto.products).toHaveLength(0);
    });
  });

  describe('DTO Compatibility', () => {
    it('should allow ProductCreateDto to be used for creating products', () => {
      const createDto: ProductCreateDto = {
        name: 'New Product',
        description: 'New description',
        price: 19.99,
        category: 'Books',
        brand: 'Publisher',
        tags: ['new', 'bestseller'],
      };

      expect(createDto.name).toBeDefined();
      expect(createDto.description).toBeDefined();
      expect(createDto.price).toBeDefined();
    });

    it('should allow ProductUpdateDto to be used for partial updates', () => {
      const updateDto: ProductUpdateDto = {
        price: 25.99,
        tags: ['updated'],
      };

      expect(updateDto.price).toBeDefined();
      expect(updateDto.tags).toBeDefined();
      expect(updateDto.name).toBeUndefined();
    });

    it('should ensure ProductResponseDto has all necessary fields for API responses', () => {
      const responseDto: ProductResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Response Product',
        description: 'Response description',
        price: 35.99,
        tags: ['response'],
        category: 'Category',
        brand: 'Brand',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      expect(responseDto.id).toBeDefined();
      expect(responseDto.name).toBeDefined();
      expect(responseDto.description).toBeDefined();
      expect(responseDto.price).toBeDefined();
      expect(responseDto.tags).toBeDefined();
      expect(responseDto.createdAt).toBeDefined();
      expect(responseDto.updatedAt).toBeDefined();
    });
  });
}); 