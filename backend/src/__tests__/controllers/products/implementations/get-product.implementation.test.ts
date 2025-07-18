import { Product } from '../../../../models/product.model';
import getProduct from '../../../../controllers/products/implementations/get-product.implementation';
import NotFoundException from '../../../../utils/exceptions/no-found.exception';

// Mock the Product model
jest.mock('../../../../models/product.model');
const MockedProduct = Product as jest.Mocked<typeof Product>;

describe('getProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Product',
    description: 'A test product description',
    price: 29.99,
    category: 'Electronics',
    brand: 'TestBrand',
    tags: ['test', 'new'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  it('should return a product successfully', async () => {
    MockedProduct.findOne = jest.fn().mockResolvedValue(mockProduct);

    const result = await getProduct('507f1f77bcf86cd799439011');

    expect(MockedProduct.findOne).toHaveBeenCalledWith({
      _id: '507f1f77bcf86cd799439011',
      isDeleted: false,
    });
    expect(result).toEqual({
      id: '507f1f77bcf86cd799439011',
      name: mockProduct.name,
      description: mockProduct.description,
      price: mockProduct.price,
      tags: mockProduct.tags,
      category: mockProduct.category,
      brand: mockProduct.brand,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('should return a product without optional fields', async () => {
    const minimalProduct = {
      _id: '507f1f77bcf86cd799439012',
      name: 'Minimal Product',
      description: 'A minimal product',
      price: 19.99,
      category: null,
      brand: null,
      tags: [],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    };

    MockedProduct.findOne = jest.fn().mockResolvedValue(minimalProduct);

    const result = await getProduct('507f1f77bcf86cd799439012');

    expect(result).toEqual({
      id: '507f1f77bcf86cd799439012',
      name: minimalProduct.name,
      description: minimalProduct.description,
      price: minimalProduct.price,
      tags: [],
      category: undefined,
      brand: undefined,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('should throw NotFoundException when product does not exist', async () => {
    MockedProduct.findOne = jest.fn().mockResolvedValue(null);

    await expect(getProduct('507f1f77bcf86cd799439013')).rejects.toThrow(NotFoundException);
    await expect(getProduct('507f1f77bcf86cd799439013')).rejects.toThrow('Product not found');

    expect(MockedProduct.findOne).toHaveBeenCalledWith({
      _id: '507f1f77bcf86cd799439013',
      isDeleted: false,
    });
  });

  it('should throw NotFoundException when product is soft deleted', async () => {
    // The implementation filters out soft deleted products, so it should return null
    MockedProduct.findOne = jest.fn().mockResolvedValue(null);

    await expect(getProduct('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    await expect(getProduct('507f1f77bcf86cd799439011')).rejects.toThrow('Product not found');
  });

  it('should handle database errors', async () => {
    const dbError = new Error('Database connection failed');
    MockedProduct.findOne = jest.fn().mockRejectedValue(dbError);

    await expect(getProduct('507f1f77bcf86cd799439011')).rejects.toThrow('Database connection failed');
  });

  it('should handle invalid ObjectId format', async () => {
    MockedProduct.findOne = jest.fn().mockResolvedValue(null);

    await expect(getProduct('invalid-id')).rejects.toThrow(NotFoundException);
    expect(MockedProduct.findOne).toHaveBeenCalledWith({
      _id: 'invalid-id',
      isDeleted: false,
    });
  });
}); 