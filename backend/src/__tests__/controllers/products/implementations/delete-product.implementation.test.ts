import { Product } from '../../../../models/product.model';
import deleteProduct from '../../../../controllers/products/implementations/delete-product.implementation';
import NotFoundException from '../../../../utils/exceptions/no-found.exception';

// Mock the Product model
jest.mock('../../../../models/product.model');
const MockedProduct = Product as jest.Mocked<typeof Product>;

describe('deleteProduct', () => {
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
    isDeleted: false,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  it('should soft delete a product successfully', async () => {
    const softDeletedProduct = {
      ...mockProduct,
      isDeleted: true,
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(softDeletedProduct);

    await deleteProduct('507f1f77bcf86cd799439011');

    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439011', isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
  });

  it('should throw NotFoundException when product does not exist', async () => {
    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(deleteProduct('507f1f77bcf86cd799439013')).rejects.toThrow(NotFoundException);
    await expect(deleteProduct('507f1f77bcf86cd799439013')).rejects.toThrow('Product not found');

    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439013', isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
  });

  it('should throw NotFoundException when product is already soft deleted', async () => {
    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(deleteProduct('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    await expect(deleteProduct('507f1f77bcf86cd799439011')).rejects.toThrow('Product not found');
  });

  it('should handle database errors', async () => {
    const dbError = new Error('Database connection failed');
    MockedProduct.findOneAndUpdate = jest.fn().mockRejectedValue(dbError);

    await expect(deleteProduct('507f1f77bcf86cd799439011')).rejects.toThrow('Database connection failed');
  });

  it('should handle invalid ObjectId format', async () => {
    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(deleteProduct('invalid-id')).rejects.toThrow(NotFoundException);
    expect(MockedProduct.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'invalid-id', isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
  });

  it('should return void on successful deletion', async () => {
    const softDeletedProduct = {
      ...mockProduct,
      isDeleted: true,
    };

    MockedProduct.findOneAndUpdate = jest.fn().mockResolvedValue(softDeletedProduct);

    const result = await deleteProduct('507f1f77bcf86cd799439011');

    expect(result).toBeUndefined();
  });

  it('should handle concurrent deletion attempts', async () => {
    // First call succeeds, second call fails (product already deleted)
    MockedProduct.findOneAndUpdate
      .mockResolvedValueOnce({ ...mockProduct, isDeleted: true })
      .mockResolvedValueOnce(null);

    // First deletion should succeed
    await deleteProduct('507f1f77bcf86cd799439011');

    // Second deletion should fail
    await expect(deleteProduct('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
  });
}); 