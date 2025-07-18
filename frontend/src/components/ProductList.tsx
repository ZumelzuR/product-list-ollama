import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import ollamaApi from '../ollamaApi';
import type { Product } from '../types/index';
import { ProductForm } from './ProductForm';

export function ProductList() {
  const { data, isLoading, error } = useQuery<{ products: Product[], nextCursor: string | null, total: number }>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get<{ products: Product[], nextCursor: string | null, total: number }>("/products");
      return res.data;
    },
  });
  
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [showForm, setShowForm] = useState<null | { mode: 'create' } | { mode: 'edit', product: Product }>(null);
  const [search, setSearch] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      setDeleteError(err.response?.data?.message || "Delete failed");
    },
  });

  const handleSuggestTags = async (name: string, description: string) => {
    const res = await ollamaApi.post("/suggest-tags", { name, description });
    setSuggestedTags(res.data.tags);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Failed to load products</div>;

  // Filter products by name or tag
  const products = data?.products || [];
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    (product.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between gap-2">
        <input
          className="border rounded px-3 py-2 w-full sm:w-64"
          placeholder="Search by name or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" 
          onClick={() => handleSuggestTags(selectedProduct?.name || "", selectedProduct?.description || "")}
        >
          Auto-Suggest Tags
        </button>
        <div className="flex flex-col gap-2">
          {suggestedTags.map((tag: string) => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" 
          onClick={() => setShowForm({ mode: 'create' })}
        >
          + Add Product
        </button>
      </div>
      
      <table className="min-w-full bg-white border rounded shadow text-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-black">Name</th>
            <th className="px-4 py-2 border text-black">Description</th>
            <th className="px-4 py-2 border text-black">Price</th>
            <th className="px-4 py-2 border text-black">Tags</th>
            <th className="px-4 py-2 border text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product: Product) => (
            <tr
              key={product.id}
              className={
                `text-black cursor-pointer hover:bg-gray-100` +
                (selectedProduct?.id === product.id ? " bg-blue-100" : "")
              }
              onClick={() => handleSelectProduct(product)}
            >
              <td className="px-4 py-2 border text-black">{product.name}</td>
              <td className="px-4 py-2 border text-black">{product.description}</td>
              <td className="px-4 py-2 border text-black">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2 border text-black">{product.tags?.join(", ")}</td>
              <td className="px-4 py-2 border text-black">
                <button 
                  className="text-blue-600 hover:underline mr-2" 
                  onClick={() => setShowForm({ mode: 'edit', product })}
                >
                  Edit
                </button>
                <button 
                  className="text-red-600 hover:underline" 
                  onClick={() => setDeleteId(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-2 sm:p-6 rounded-none sm:rounded shadow-none sm:shadow-md w-full max-w-xs sm:max-w-sm text-black">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this product?</p>
            {deleteError && <div className="text-red-600 mb-2">{deleteError}</div>}
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.status === 'pending'}
              >
                {deleteMutation.status === 'pending' ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showForm && (
        <div className="text-black">
          <ProductForm
            initial={showForm.mode === 'edit' ? showForm.product : undefined}
            onSuccess={() => setShowForm(null)}
            onCancel={() => setShowForm(null)}
          />
        </div>
      )}
    </div>
  );
} 