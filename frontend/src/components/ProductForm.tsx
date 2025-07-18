import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { Product } from '../types/index';

interface ProductFormProps {
  initial?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ initial, onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const isEdit = !!initial;

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
      setPrice(initial.price.toString());
      setTags(initial.tags?.join(", ") || "");
    }
  }, [initial]);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; description: string; price: number; tags: string[] }) => {
      if (isEdit) {
        return api.put(`/products/${initial.id}`, data);
      } else {
        return api.post("/products", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Operation failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !description.trim() || !price.trim() || isNaN(Number(price))) {
      setError("All fields are required and price must be a number");
      return;
    }
    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-2 sm:p-6 rounded-none sm:rounded shadow-none sm:shadow-md w-full max-w-xs sm:max-w-md text-black">
        <h2 className="text-lg font-bold mb-4">{isEdit ? "Edit" : "Create"} Product</h2>
        <form onSubmit={handleSubmit}>
          <input 
            className="w-full mb-2 p-2 border rounded bg-white text-black" 
            placeholder="Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <textarea 
            className="w-full mb-2 p-2 border rounded bg-white text-black" 
            placeholder="Description" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required 
          />
          <input 
            className="w-full mb-2 p-2 border rounded bg-white text-black" 
            placeholder="Price" 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            required 
            type="number" 
            min="0" 
            step="0.01" 
          />
          <input 
            className="w-full mb-4 p-2 border rounded bg-white text-black" 
            placeholder="Tags (comma separated)" 
            value={tags} 
            onChange={e => setTags(e.target.value)} 
          />
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
              disabled={mutation.status === 'pending'}
            >
              {mutation.status === 'pending' ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 