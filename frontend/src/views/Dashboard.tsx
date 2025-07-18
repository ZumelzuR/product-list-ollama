import { ProductList } from '../components/ProductList';

export function Dashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-5xl w-full p-2 sm:p-8 bg-white rounded-none sm:rounded shadow-none sm:shadow-md mx-auto">
        <h1 className="font-bold mb-4 text-center text-black">Admin Dashboard</h1>
        <ProductList />
      </div>
    </div>
  );
} 