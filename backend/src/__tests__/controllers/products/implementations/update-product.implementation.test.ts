import { Product } from '../../../../models/product.model';
import updateProduct from '../../../../controllers/products/implementations/update-product.implementation';
import { ProductUpdateDto } from '../../../../dto/product.dto';
import NotFoundException from '../../../../utils/exceptions/no-found.exception';

// Mock the Product model
jest.mock('../../../../models/product.model');
const MockedProduct = Product as jest.Mocked<typeof Product>;

describe('updateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Original Product',
    description: 'Original description',
    price: 29.99,
    category: 'Electronics',
    brand: 'OriginalBrand',
    tags: ['original'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  it('should update a product successfully', async () => {
    const updateData: ProductUpdateDto = {
      name: 'Updated Product',
      price: 39.99,
      tags: ['updated', 'featured'],
    };

    const updatedProduct = {
      ...mockProduct,
      ...updateData,
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(updatedProduct);

    const result = await updateProduct('507f1f77bcf86cd799439011', updateData);

    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439011', isDeleted: false },
      { $set: updateData },
      { new: true }
    );
    expect(result).toEqual({
      id: '507f1f77bcf86cd799439011',
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      tags: updatedProduct.tags,
      category: updatedProduct.category,
      brand: updatedProduct.brand,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    });
  });

  it('should update only provided fields', async () => {
    const partialUpdate: ProductUpdateDto = {
      price: 49.99,
    };

    const partiallyUpdatedProduct = {
      ...mockProduct,
      price: 49.99,
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(partiallyUpdatedProduct);

    const result = await updateProduct('507f1f77bcf86cd799439011', partialUpdate);

    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439011', isDeleted: false },
      { $set: partialUpdate },
      { new: true }
    );
    expect(result.price).toBe(49.99);
    expect(result.name).toBe(mockProduct.name); // Should remain unchanged
  });

  it('should update category and brand fields', async () => {
    const categoryBrandUpdate: ProductUpdateDto = {
      category: 'New Category',
      brand: 'New Brand',
    };

    const categoryBrandUpdatedProduct = {
      ...mockProduct,
      category: 'New Category',
      brand: 'New Brand',
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(categoryBrandUpdatedProduct);

    const result = await updateProduct('507f1f77bcf86cd799439011', categoryBrandUpdate);

    expect(result.category).toBe('New Category');
    expect(result.brand).toBe('New Brand');
  });

  it('should handle empty tags array', async () => {
    const tagsUpdate: ProductUpdateDto = {
      tags: [],
    };

    const tagsUpdatedProduct = {
      ...mockProduct,
      tags: [],
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(tagsUpdatedProduct);

    const result = await updateProduct('507f1f77bcf86cd799439011', tagsUpdate);

    expect(result.tags).toEqual([]);
  });

  it('should throw NotFoundException when product does not exist', async () => {
    const updateData: ProductUpdateDto = {
      name: 'Updated Product',
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(updateProduct('507f1f77bcf86cd799439013', updateData)).rejects.toThrow(NotFoundException);
    await expect(updateProduct('507f1f77bcf86cd799439013', updateData)).rejects.toThrow('Product not found');

    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439013', isDeleted: false },
      { $set: updateData },
      { new: true }
    );
  });

  it('should throw NotFoundException when product is soft deleted', async () => {
    const updateData: ProductUpdateDto = {
      name: 'Updated Product',
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(updateProduct('507f1f77bcf86cd799439011', updateData)).rejects.toThrow(NotFoundException);
  });

  it('should handle database errors', async () => {
    const updateData: ProductUpdateDto = {
      name: 'Updated Product',
    };

    const dbError = new Error('Database connection failed');
    MockedProduct.findOneAndUpdate = jest.fn().mockRejectedValue(dbError);

    await expect(updateProduct('507f1f77bcf86cd799439011', updateData)).rejects.toThrow('Database connection failed');
  });

  it('should handle invalid ObjectId format', async () => {
    const updateData: ProductUpdateDto = {
      name: 'Updated Product',
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(updateProduct('invalid-id', updateData)).rejects.toThrow(NotFoundException);
    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'invalid-id', isDeleted: false },
      { $set: updateData },
      { new: true }
    );
  });

  it('should handle empty update object', async () => {
    const emptyUpdate: ProductUpdateDto = {};

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(mockProduct);

    const result = await updateProduct('507f1f77bcf86cd799439011', emptyUpdate);

    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439011', isDeleted: false },
      { $set: {} },
      { new: true }
    );
    expect(result).toBeDefined();
  });
}); 