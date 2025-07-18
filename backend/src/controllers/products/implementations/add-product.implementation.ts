import { Product, IProduct } from '../../../models/product.model';
import { ProductCreateDto, ProductResponseDto } from '../../../dto/product.dto';
import ConflictException from '../../../utils/exceptions/conflict.exception';

const addProduct = async (
  productBody: ProductCreateDto
): Promise<ProductResponseDto> => {
  // Check for duplicate name (optional, or could be by name+brand)
  const existing = await Product.findOne({
    name: productBody.name,
    brand: productBody.brand || null,
    isDeleted: false,
  });
  if (existing) {
    throw new ConflictException('Product with this name and brand already exists');
  }
  const product = new Product({
    ...productBody,
  });
  const saved = await product.save();
  return {
    id: saved._id.toString(),
    name: saved.name,
    description: saved.description,
    price: saved.price,
    tags: saved.tags || [],
    category: saved.category || undefined,
    brand: saved.brand || undefined,
    createdAt: saved.createdAt.toISOString(),
    updatedAt: saved.updatedAt.toISOString(),
  };
};

export default addProduct; 