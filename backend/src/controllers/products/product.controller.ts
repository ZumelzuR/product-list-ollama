import {
  Route,
  Tags,
  Security,
  Controller,
  Get,
  Middlewares,
  Path,
  Request,
  Body,
  Post,
  Put,
  Delete,
  Query,
} from 'tsoa';
import { Request as ExRequest, Router } from 'express';
import RateLimitMiddleware from '../../middlewares/rate-limit.middleware';
import addProduct from './implementations/add-product.implementation';
import getProduct from './implementations/get-product.implementation';
import updateProduct from './implementations/update-product.implementation';
import deleteProduct from './implementations/delete-product.implementation';
import getProducts from './implementations/get-products.implementation';
import { ProductCreateDto, ProductUpdateDto, ProductResponseDto, ProductListResponseDto } from '../../dto/product.dto';

const TRY_LIMIT = 40;
const TIME_LIMIT = 40;

@Route('products')
@Tags('Products')
@Security('jwt')
export class ProductController extends Controller {
  public router = Router();

  @Post('')
  @Middlewares([RateLimitMiddleware(TRY_LIMIT, TIME_LIMIT)])
  async addProduct(
    @Body() productBody: ProductCreateDto
  ): Promise<ProductResponseDto> {
    return addProduct(productBody);
  }

  @Get('{id}')
  @Middlewares([RateLimitMiddleware(TRY_LIMIT, TIME_LIMIT)])
  async getProduct(
    @Path() id: string
  ): Promise<ProductResponseDto> {
    return getProduct(id);
  }

  @Put('{id}')
  @Middlewares([RateLimitMiddleware(TRY_LIMIT, TIME_LIMIT)])
  async updateProduct(
    @Path() id: string,
    @Body() update: ProductUpdateDto
  ): Promise<ProductResponseDto> {
    return updateProduct(id, update);
  }

  @Delete('{id}')
  @Middlewares([RateLimitMiddleware(TRY_LIMIT, TIME_LIMIT)])
  async deleteProduct(
    @Path() id: string
  ): Promise<void> {
    return deleteProduct(id);
  }

  @Get('')
  @Middlewares([RateLimitMiddleware(TRY_LIMIT, TIME_LIMIT)])
  async getProducts(
    @Query() limit?: number,
    @Query() cursor?: string,
    @Query() category?: string,
    @Query() brand?: string
  ): Promise<ProductListResponseDto> {
    return getProducts({ limit, cursor, category, brand });
  }
}
