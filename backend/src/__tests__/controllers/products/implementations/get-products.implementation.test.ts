import { Product } from '../../../../models/product.model';
import getProducts from '../../../../controllers/products/implementations/get-products.implementation';
import { ProductListResponseDto } from '../../../../dto/product.dto';

// Mock the Product model
jest.mock('../../../../models/product.model');
const MockedProduct = Product as jest.Mocked<typeof Product>;

describe('getProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProducts = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Product 1',
      description: 'Description 1',
      price: 29.99,
      category: 'Electronics',
      brand: 'Brand A',
      tags: ['tag1'],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Product 2',
      description: 'Description 2',
      price: 39.99,
      category: 'Electronics',
      brand: 'Brand B',
      tags: ['tag2'],
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    },
    {
      _id: '507f1f77bcf86cd799439013',
      name: 'Product 3',
      description: 'Description 3',
      price: 49.99,
      category: 'Clothing',
      brand: 'Brand A',
      tags: ['tag3'],
      createdAt: new Date('2024-01-03T00:00:00.000Z'),
      updatedAt: new Date('2024-01-03T00:00:00.000Z'),
    },
  ];

  it('should return products with default pagination', async () => {
    const mockAggregateResult = [
      {
        items: mockProducts.slice(0, 2),
        totalCount: [{ count: 3 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({});

    expect(MockedProduct.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false } },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          items: [{ $limit: 21 }], // limit + 1
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    expect(result).toEqual({
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
        {
          id: '507f1f77bcf86cd799439012',
          name: 'Product 2',
          description: 'Description 2',
          price: 39.99,
          tags: ['tag2'],
          category: 'Electronics',
          brand: 'Brand B',
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ],
      nextCursor: undefined, // Only 2 items, no next page
      total: 3,
    });
  });

  it('should return products with custom limit', async () => {
    const mockAggregateResult = [
      {
        items: mockProducts.slice(0, 1),
        totalCount: [{ count: 3 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({ limit: 1 });

    expect(MockedProduct.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false } },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          items: [{ $limit: 2 }], // limit + 1
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    expect(result.products).toHaveLength(1);
    expect(result.nextCursor).toBeUndefined(); // No next page
    expect(result.total).toBe(3);
  });

  it('should filter by category', async () => {
    const mockAggregateResult = [
      {
        items: mockProducts.filter(p => p.category === 'Electronics'),
        totalCount: [{ count: 2 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({ category: 'Electronics' });

    expect(MockedProduct.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false, category: 'Electronics' } },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          items: [{ $limit: 21 }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    expect(result.products).toHaveLength(2);
    expect(result.products.every(p => p.category === 'Electronics')).toBe(true);
  });

  it('should filter by brand', async () => {
    const mockAggregateResult = [
      {
        items: mockProducts.filter(p => p.brand === 'Brand A'),
        totalCount: [{ count: 2 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({ brand: 'Brand A' });

    expect(MockedProduct.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false, brand: 'Brand A' } },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          items: [{ $limit: 21 }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    expect(result.products).toHaveLength(2);
    expect(result.products.every(p => p.brand === 'Brand A')).toBe(true);
  });

  it('should filter by both category and brand', async () => {
    const mockAggregateResult = [
      {
        items: mockProducts.filter(p => p.category === 'Electronics' && p.brand === 'Brand A'),
        totalCount: [{ count: 1 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({ category: 'Electronics', brand: 'Brand A' });

    expect(MockedProduct.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false, category: 'Electronics', brand: 'Brand A' } },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          items: [{ $limit: 21 }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    expect(result.products).toHaveLength(1);
    expect(result.products[0].category).toBe('Electronics');
    expect(result.products[0].brand).toBe('Brand A');
  });

  it('should handle cursor-based pagination', async () => {
    const cursor = '2024-01-01T00:00:00.000Z';
    const mockAggregateResult = [
      {
        items: mockProducts.slice(1), // Products after cursor
        totalCount: [{ count: 3 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({ cursor });

    expect(MockedProduct.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false, createdAt: { $gt: new Date(cursor) } } },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          items: [{ $limit: 21 }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    expect(result.products).toHaveLength(2);
  });

  it('should handle empty results', async () => {
    const mockAggregateResult = [
      {
        items: [],
        totalCount: [{ count: 0 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({});

    expect(result).toEqual({
      products: [],
      nextCursor: undefined,
      total: 0,
    });
  });

  it('should handle database errors', async () => {
    const dbError = new Error('Database connection failed');
    MockedProduct.aggregate = jest.fn().mockRejectedValue(dbError);

    await expect(getProducts({})).rejects.toThrow('Database connection failed');
  });

  it('should handle products without optional fields', async () => {
    const minimalProducts = [
      {
        _id: '507f1f77bcf86cd799439014',
        name: 'Minimal Product',
        description: 'Minimal description',
        price: 19.99,
        category: null,
        brand: null,
        tags: [],
        createdAt: new Date('2024-01-04T00:00:00.000Z'),
        updatedAt: new Date('2024-01-04T00:00:00.000Z'),
      },
    ];

    const mockAggregateResult = [
      {
        items: minimalProducts,
        totalCount: [{ count: 1 }],
      },
    ];

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({});

    expect(result.products[0]).toEqual({
      id: '507f1f77bcf86cd799439014',
      name: 'Minimal Product',
      description: 'Minimal description',
      price: 19.99,
      tags: [],
      category: undefined,
      brand: undefined,
      createdAt: '2024-01-04T00:00:00.000Z',
      updatedAt: '2024-01-04T00:00:00.000Z',
    });
  });

  it('should handle malformed aggregate result', async () => {
    const mockAggregateResult = [{
      items: undefined,
      totalCount: undefined,
    }]; // Missing items and totalCount

    MockedProduct.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await getProducts({});

    expect(result).toEqual({
      products: [],
      nextCursor: undefined,
      total: 0,
    });
  });
}); 