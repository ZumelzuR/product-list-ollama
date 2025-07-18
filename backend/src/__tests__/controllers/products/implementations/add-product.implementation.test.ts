import { Product } from '../../../../models/product.model';
import addProduct from '../../../../controllers/products/implementations/add-product.implementation';
import { ProductCreateDto } from '../../../../dto/product.dto';
import ConflictException from '../../../../utils/exceptions/conflict.exception';

// Mock the Product model
jest.mock('../../../../models/product.model');
const MockedProduct = Product as jest.Mocked<typeof Product>;

describe('addProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProductData: ProductCreateDto = {
    name: 'Test Product',
    description: 'A test product description',
    price: 29.99,
    category: 'Electronics',
    brand: 'TestBrand',
    tags: ['test', 'new'],
  };

  const mockSavedProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: mockProductData.name,
    description: mockProductData.description,
    price: mockProductData.price,
    category: mockProductData.category,
    brand: mockProductData.brand,
    tags: mockProductData.tags,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    save: jest.fn().mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: mockProductData.name,
      description: mockProductData.description,
      price: mockProductData.price,
      category: mockProductData.category,
      brand: mockProductData.brand,
      tags: mockProductData.tags,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    }),
  };

  it('should create a new product successfully', async () => {
    // Mock findOne to return null (no existing product)
    MockedProduct.findOne = jest.fn().mockResolvedValue(null);
    
    // Mock constructor and save
    (MockedProduct as any).mockImplementation(() => mockSavedProduct);

    const result = await addProduct(mockProductData);

    expect(MockedProduct.findOne).toHaveBeenCalledWith({
      name: mockProductData.name,
      brand: mockProductData.brand,
      isDeleted: false,
    });
    expect(MockedProduct).toHaveBeenCalledWith(mockProductData);
    expect(mockSavedProduct.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: '507f1f77bcf86cd799439011',
      name: mockProductData.name,
      description: mockProductData.description,
      price: mockProductData.price,
      tags: mockProductData.tags,
      category: mockProductData.category,
      brand: mockProductData.brand,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('should create a product without optional fields', async () => {
    const minimalProductData: ProductCreateDto = {
      name: 'Minimal Product',
      description: 'A minimal product',
      price: 19.99,
    };

    const minimalSavedProduct = {
      ...mockSavedProduct,
      name: minimalProductData.name,
      description: minimalProductData.description,
      price: minimalProductData.price,
      category: null,
      brand: null,
      tags: [],
      save: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: minimalProductData.name,
        description: minimalProductData.description,
        price: minimalProductData.price,
        category: null,
        brand: null,
        tags: [],
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      }),
    };

    MockedProduct.findOne = jest.fn().mockResolvedValue(null);
    (MockedProduct as any).mockImplementation(() => minimalSavedProduct);

    const result = await addProduct(minimalProductData);

    expect(result).toEqual({
      id: '507f1f77bcf86cd799439011',
      name: minimalProductData.name,
      description: minimalProductData.description,
      price: minimalProductData.price,
      tags: [],
      category: undefined,
      brand: undefined,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('should throw ConflictException when product with same name and brand exists', async () => {
    const existingProduct = {
      _id: '507f1f77bcf86cd799439012',
      name: mockProductData.name,
      brand: mockProductData.brand,
    };

    MockedProduct.findOne = jest.fn().mockResolvedValue(existingProduct);

    await expect(addProduct(mockProductData)).rejects.toThrow(ConflictException);
    await expect(addProduct(mockProductData)).rejects.toThrow(
      'Product with this name and brand already exists'
    );

    expect(MockedProduct.findOne).toHaveBeenCalledWith({
      name: mockProductData.name,
      brand: mockProductData.brand,
      isDeleted: false,
    });
  });

  it('should handle null brand in duplicate check', async () => {
    const productWithoutBrand: ProductCreateDto = {
      name: 'Product Without Brand',
      description: 'A product without brand',
      price: 15.99,
    };

    MockedProduct.findOne = jest.fn().mockResolvedValue(null);
    (MockedProduct as any).mockImplementation(() => mockSavedProduct);

    await addProduct(productWithoutBrand);

    expect(MockedProduct.findOne).toHaveBeenCalledWith({
      name: productWithoutBrand.name,
      brand: null,
      isDeleted: false,
    });
  });

  it('should handle database save errors', async () => {
    MockedProduct.findOne = jest.fn().mockResolvedValue(null);
    
    const saveError = new Error('Database connection failed');
    (MockedProduct as any).mockImplementation(() => ({
      ...mockSavedProduct,
      save: jest.fn().mockRejectedValue(saveError),
    }));

    await expect(addProduct(mockProductData)).rejects.toThrow('Database connection failed');
  });
}); 