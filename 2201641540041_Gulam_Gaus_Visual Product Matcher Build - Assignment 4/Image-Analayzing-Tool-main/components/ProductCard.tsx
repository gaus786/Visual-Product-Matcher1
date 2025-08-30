import { motion } from "framer-motion";
import { Tag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  similarity: number;
  brand?: string;
  description?: string;
  tags?: string[];
  colors?: string[];
  relatedProducts?: any[];
}

export default function ProductCard({
  id,
  name,
  category,
  imageUrl,
  similarity,
  brand,
  description,
  tags,
  colors,
  relatedProducts,
}: ProductCardProps) {
  // Dynamic similarity badge color
  const similarityColor =
    similarity >= 0.75
      ? "bg-green-500"
      : similarity >= 0.4
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-5 flex flex-col items-center gap-3 cursor-pointer border border-gray-100"
    >
      {/* Product Image + Similarity Badge */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div
          className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow ${similarityColor}`}
        >
          {Math.round(similarity * 100)}%
        </div>
      </div>

      {/* Product Info */}
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900">{name}</div>

        <div className="flex items-center gap-1 text-sm text-gray-500 justify-center">
          <Tag className="w-4 h-4" />
          {category}
        </div>

        {brand && (
          <div className="text-sm text-indigo-600 font-medium mt-0.5">
            {brand}
          </div>
        )}

        {description && (
          <div
            className="text-xs text-gray-600 mt-1 line-clamp-2 max-w-[200px] mx-auto"
            title={description}
          >
            {description}
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mt-1">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-400">+{tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Colors */}
      {colors && colors.length > 0 && (
        <div className="flex gap-2 justify-center mt-2">
          {colors.slice(0, 4).map((color, index) => (
            <span
              key={index}
              className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
          {colors.length > 4 && (
            <span className="text-xs text-gray-400">+{colors.length - 4}</span>
          )}
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="text-xs text-gray-500 mt-2">
          {relatedProducts.length} related products
        </div>
      )}
    </motion.div>
  );
}
