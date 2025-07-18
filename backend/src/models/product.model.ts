import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';
import { OmitTimestamps } from '../interfaces/omit-timestamps.interface';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    tags: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: null,
      index: true,
    },
    brand: {
      type: String,
      default: null,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    collection: 'products',
    timestamps: true,
  }
);

productSchema.index({ createdAt: 1 });

type IProductSchema = InferSchemaType<typeof productSchema>;

type IProduct = OmitTimestamps<IProductSchema>;

const Product: Model<IProductSchema> = mongoose.model<IProductSchema>(
  'Product',
  productSchema
);

export { Product, IProduct, IProductSchema };
