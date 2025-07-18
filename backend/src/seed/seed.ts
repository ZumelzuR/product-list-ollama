import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test2';

const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys'];
const brands = ['BrandA', 'BrandB', 'BrandC', 'BrandD', 'BrandE'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Product.deleteMany({});
  await User.deleteMany({ email: 'testuser@example.com' });

  // Create one user
  const user = new User({
    email: 'testuser@example.com',
    password: 'TestPassword123', // Will be hashed by pre-save hook
  });
  await user.save();
  console.log('Inserted user:', user.email);

  // Create 20 products
  const products = [];
  for (let i = 1; i <= 20; i++) {
    const product = new Product({
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price: randomInt(10, 500),
      tags: [`tag${i}`, randomFromArray(['new', 'sale', 'popular', 'featured'])],
      category: randomFromArray(categories),
      brand: randomFromArray(brands),
    });
    products.push(product);
  }
  await Product.insertMany(products);
  console.log('Inserted 20 products');

  // await mongoose.disconnect();
  // console.log('Disconnected from MongoDB');
}

seed().catch(err => {
  console.error('Seeder error:', err);
  process.exit(1);
}); 