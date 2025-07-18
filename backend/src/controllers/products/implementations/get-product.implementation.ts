import { Product } from '../../../models/product.model';
import { ProductResponseDto } from '../../../dto/product.dto';
import NotFoundException from '../../../utils/exceptions/no-found.exception';

const getProduct = async (
  id: string
): Promise<ProductResponseDto> => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
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

export default getProduct; 