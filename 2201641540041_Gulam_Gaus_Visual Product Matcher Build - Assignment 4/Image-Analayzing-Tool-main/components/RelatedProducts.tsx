"use client";
import { useState, useEffect } from "react";

interface RelatedProduct {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags?: string[];
  colors?: string[];
  brand?: string;
  similarity?: number;
}

interface RelatedProductsProps {
  productId: string;
  limit?: number;
}

export default function RelatedProducts({
  productId,
  limit = 6,
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/related-products?id=${productId}&limit=${limit}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch related products");
        }

        setRelatedProducts(data.relatedProducts || []);
      } catch (err: any) {
        setError(err.message || "Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, limit]);

  // === Loading State ===
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Related Products</h3>
        <div className="text-gray-500 animate-pulse">
          Loading related products...
        </div>
      </div>
    );
  }

  // === Error State ===
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Related Products</h3>
        <div className="text-red-600">⚠ {error}</div>
      </div>
    );
  }

  // === No Products ===
  if (relatedProducts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Related Products</h3>
        <div className="text-gray-500">No related products found.</div>
      </div>
    );
  }

  // Helper to pick similarity color
  const getSimilarityColor = (score: number) => {
    if (score >= 0.7) return "bg-green-500"; // high similarity
    if (score >= 0.4) return "bg-yellow-500"; // medium
    return "bg-red-500"; // low
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-5">
        Related Products ({relatedProducts.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product._id}
            className="group cursor-pointer rounded-lg border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 p-2"
          >
            {/* Image Wrapper */}
            <div className="relative overflow-hidden rounded-md">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-28 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              {product.similarity !== undefined && (
                <div
                  className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full shadow ${getSimilarityColor(
                    product.similarity
                  )}`}
                >
                  {Math.round(product.similarity * 100)}%
                </div>
              )}
            </div>

            {/* Text Info */}
            <div className="mt-3">
              <div
                className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600"
                title={product.name}
              >
                {product.name}
              </div>
              <div className="text-xs text-gray-500">{product.category}</div>
              {product.brand && (
                <div className="text-xs text-indigo-600">{product.brand}</div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.colors.slice(0, 2).map((color, index) => (
                    <span
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{product.colors.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
