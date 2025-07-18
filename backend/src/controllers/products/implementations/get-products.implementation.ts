import { Product } from '../../../models/product.model';
import { ProductListResponseDto, ProductResponseDto } from '../../../dto/product.dto';

interface GetProductsParams {
  limit?: number;
  cursor?: string;
  category?: string;
  brand?: string;
}

const getProducts = async (
  params: GetProductsParams
): Promise<ProductListResponseDto> => {
  const { limit = 20, cursor, category, brand } = params;
  const query: any = { isDeleted: false };
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (cursor) {
    query.createdAt = { $gt: new Date(cursor) };
  }
  // Use aggregation with $facet for paginated results and total count
  const pipeline: any[] = [
    { $match: query },
    { $sort: { createdAt: 1 } },
    {
      $facet: {
        items: [
          { $limit: limit + 1 }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    }
  ];

  const result = await Product.aggregate(pipeline);
  const items = result[0]?.items || [];
  const total = result[0]?.totalCount?.[0]?.count || 0;

  const hasNext = items.length > limit;
  const paginatedItems = hasNext ? items.slice(0, limit) : items;
  const nextCursor = hasNext ? paginatedItems[paginatedItems.length - 1].createdAt.toISOString() : undefined;

  const productDtos: ProductResponseDto[] = paginatedItems.map(product => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags || [],
    category: product.category || undefined,
    brand: product.brand || undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  return {
    products: productDtos,
    nextCursor,
    total,
  };
};

export default getProducts; 