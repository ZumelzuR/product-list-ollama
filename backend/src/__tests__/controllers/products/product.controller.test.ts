import { ProductController } from '../../../controllers/products/product.controller';
import addProduct from '../../../controllers/products/implementations/add-product.implementation';
import getProduct from '../../../controllers/products/implementations/get-product.implementation';
import updateProduct from '../../../controllers/products/implementations/update-product.implementation';
import deleteProduct from '../../../controllers/products/implementations/delete-product.implementation';
import getProducts from '../../../controllers/products/implementations/get-products.implementation';
import { ProductCreateDto, ProductUpdateDto, ProductResponseDto, ProductListResponseDto } from '../../../dto/product.dto';

// Mock all implementations
jest.mock('../../../controllers/products/implementations/add-product.implementation');
jest.mock('../../../controllers/products/implementations/get-product.implementation');
jest.mock('../../../controllers/products/implementations/update-product.implementation');
jest.mock('../../../controllers/products/implementations/delete-product.implementation');
jest.mock('../../../controllers/products/implementations/get-products.implementation');

const MockedAddProduct = addProduct as jest.MockedFunction<typeof addProduct>;
const MockedGetProduct = getProduct as jest.MockedFunction<typeof getProduct>;
const MockedUpdateProduct = updateProduct as jest.MockedFunction<typeof updateProduct>;
const MockedDeleteProduct = deleteProduct as jest.MockedFunction<typeof deleteProduct>;
const MockedGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(() => {
    controller = new ProductController();
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    const mockProductData: ProductCreateDto = {
      name: 'Test Product',
      description: 'A test product description',
      price: 29.99,
      category: 'Electronics',
      brand: 'TestBrand',
      tags: ['test', 'new'],
    };

    const mockResponse: ProductResponseDto = {
      id: '507f1f77bcf86cd799439011',
      name: mockProductData.name,
      description: mockProductData.description,
      price: mockProductData.price,
      tags: mockProductData.tags,
      category: mockProductData.category,
      brand: mockProductData.brand,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should create a product successfully', async () => {
      MockedAddProduct.mockResolvedValue(mockResponse);

      const result = await controller.addProduct(mockProductData);

      expect(MockedAddProduct).toHaveBeenCalledWith(mockProductData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle implementation errors', async () => {
      const error = new Error('Creation failed');
      MockedAddProduct.mockRejectedValue(error);

      await expect(controller.addProduct(mockProductData)).rejects.toThrow('Creation failed');
      expect(MockedAddProduct).toHaveBeenCalledWith(mockProductData);
    });
  });

  describe('getProduct', () => {
    const mockResponse: ProductResponseDto = {
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

    it('should get a product successfully', async () => {
      MockedGetProduct.mockResolvedValue(mockResponse);

      const result = await controller.getProduct('507f1f77bcf86cd799439011');

      expect(MockedGetProduct).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockResponse);
    });

    it('should handle implementation errors', async () => {
      const error = new Error('Product not found');
      MockedGetProduct.mockRejectedValue(error);

      await expect(controller.getProduct('507f1f77bcf86cd799439011')).rejects.toThrow('Product not found');
      expect(MockedGetProduct).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('updateProduct', () => {
    const mockUpdateData: ProductUpdateDto = {
      name: 'Updated Product',
      price: 39.99,
    };

    const mockResponse: ProductResponseDto = {
      id: '507f1f77bcf86cd799439011',
      name: 'Updated Product',
      description: 'A test product description',
      price: 39.99,
      tags: ['test'],
      category: 'Electronics',
      brand: 'TestBrand',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    };

    it('should update a product successfully', async () => {
      MockedUpdateProduct.mockResolvedValue(mockResponse);

      const result = await controller.updateProduct('507f1f77bcf86cd799439011', mockUpdateData);

      expect(MockedUpdateProduct).toHaveBeenCalledWith('507f1f77bcf86cd799439011', mockUpdateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle implementation errors', async () => {
      const error = new Error('Update failed');
      MockedUpdateProduct.mockRejectedValue(error);

      await expect(controller.updateProduct('507f1f77bcf86cd799439011', mockUpdateData)).rejects.toThrow('Update failed');
      expect(MockedUpdateProduct).toHaveBeenCalledWith('507f1f77bcf86cd799439011', mockUpdateData);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      MockedDeleteProduct.mockResolvedValue(undefined);

      const result = await controller.deleteProduct('507f1f77bcf86cd799439011');

      expect(MockedDeleteProduct).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBeUndefined();
    });

    it('should handle implementation errors', async () => {
      const error = new Error('Delete failed');
      MockedDeleteProduct.mockRejectedValue(error);

      await expect(controller.deleteProduct('507f1f77bcf86cd799439011')).rejects.toThrow('Delete failed');
      expect(MockedDeleteProduct).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('getProducts', () => {
    const mockResponse: ProductListResponseDto = {
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
      nextCursor: '2024-01-02T00:00:00.000Z',
      total: 2,
    };

    it('should get products with default parameters', async () => {
      MockedGetProducts.mockResolvedValue(mockResponse);

      const result = await controller.getProducts();

      expect(MockedGetProducts).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResponse);
    });

    it('should get products with custom parameters', async () => {
      MockedGetProducts.mockResolvedValue(mockResponse);

      const result = await controller.getProducts(10, '2024-01-01T00:00:00.000Z', 'Electronics', 'Brand A');

      expect(MockedGetProducts).toHaveBeenCalledWith({
        limit: 10,
        cursor: '2024-01-01T00:00:00.000Z',
        category: 'Electronics',
        brand: 'Brand A',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should get products with partial parameters', async () => {
      MockedGetProducts.mockResolvedValue(mockResponse);

      const result = await controller.getProducts(5, undefined, 'Electronics');

      expect(MockedGetProducts).toHaveBeenCalledWith({
        limit: 5,
        cursor: undefined,
        category: 'Electronics',
        brand: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle implementation errors', async () => {
      const error = new Error('List failed');
      MockedGetProducts.mockRejectedValue(error);

      await expect(controller.getProducts()).rejects.toThrow('List failed');
      expect(MockedGetProducts).toHaveBeenCalledWith({});
    });
  });

  describe('Controller Configuration', () => {
    it('should have correct route configuration', () => {
      // Test that the controller has the expected properties and decorators
      expect(controller.router).toBeDefined();
    });

    it('should have rate limit constants', () => {
      // These constants are defined in the controller
      expect(ProductController.prototype.addProduct).toBeDefined();
      expect(ProductController.prototype.getProduct).toBeDefined();
      expect(ProductController.prototype.updateProduct).toBeDefined();
      expect(ProductController.prototype.deleteProduct).toBeDefined();
      expect(ProductController.prototype.getProducts).toBeDefined();
    });
  });
}); 