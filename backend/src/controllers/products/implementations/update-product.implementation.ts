import { Product } from '../../../models/product.model';
import { ProductUpdateDto, ProductResponseDto } from '../../../dto/product.dto';
import NotFoundException from '../../../utils/exceptions/no-found.exception';

const updateProduct = async (
  id: string,
  update: ProductUpdateDto
): Promise<ProductResponseDto> => {
  const product = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: update },
    { new: true }
  );
  if (!product) {
    throw new NotFoundException('Product not found');
  }
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags || [],
    category: product.category || undefined,
    brand: product.brand || undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
};

export default updateProduct; 