"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  id?: string;
  name: string;
  category: string;
  description?: string;
  brand?: string;
  tags?: string[];
  colors?: string[];
  imageUrl: string;
  relatedProducts?: Product[];
  createdAt: string;
}

export default function AdminPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          setItems(data.products || []);
          const uniqueCategories = Array.from(
            new Set(data.products.map((p: Product) => p.category))
          ).sort() as string[];
          setCategories(uniqueCategories);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item? This will also remove the uploaded file."))
      return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error || "Unknown error"}`);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = selectedCategory
    ? items.filter((item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : items;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Back to Home
        </Link>
      </div>

      {/* Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-8">
        <p className="text-sm text-gray-600">
          New items can only be added after analyzing an image on the Home page.
          Use{" "}
          <span className="font-semibold">Analyze Image → Save to Catalog</span>
          .
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-col w-full sm:w-1/2 bg-white border border-gray-200 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Category
            </label>
            <span className="text-xs text-gray-500">
              Showing {filteredItems.length} of {items.length}
            </span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          All Products ({items.length})
        </h2>

        {loading && <div className="text-gray-600">Loading...</div>}
        {!loading && items.length === 0 && (
          <div className="text-gray-600">No products in database yet.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-medium transition-colors ${
                    deletingId === item._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deletingId === item._id ? "Deleting..." : "Delete"}
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="font-semibold text-lg text-gray-900 mb-2">
                  {item.name}
                </div>

                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Category:</span> {item.category}
                </div>

                {item.brand && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Brand:</span> {item.brand}
                  </div>
                )}

                {item.description && (
                  <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                    <span className="font-medium">Description:</span>{" "}
                    {item.description}
                  </div>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.colors && item.colors.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Colors:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.colors.map((color, index) => (
                        <span
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.relatedProducts && item.relatedProducts.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Related Products ({item.relatedProducts.length}):
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.relatedProducts
                        .slice(0, 3)
                        .map((related, index) => (
                          <div key={index}>• {related.name}</div>
                        ))}
                      {item.relatedProducts.length > 3 && (
                        <div>
                          ... and {item.relatedProducts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">ID: {item._id}</div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
