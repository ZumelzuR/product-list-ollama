import { Product } from '../../../models/product.model';
import NotFoundException from '../../../utils/exceptions/no-found.exception';

const deleteProduct = async (
  id: string
): Promise<void> => {
  const product = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!product) {
    throw new NotFoundException('Product not found');
  }
};

export default deleteProduct; 