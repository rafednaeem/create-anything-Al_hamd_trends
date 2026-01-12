import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="group bg-white dark:bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#E6E6E6] dark:border-[#333333] hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg">
      {/* Product Image */}
      <a
        href={`/products/${product.id}`}
        className="block relative overflow-hidden aspect-[3/4]"
      >
        <img
          src={
            product.image_url ||
            "https://via.placeholder.com/400x600?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-xs font-semibold font-poppins">
            Featured
          </span>
        )}
      </a>

      {/* Product Info */}
      <div className="p-4">
        <a href={`/products/${product.id}`}>
          <h3 className="text-base font-semibold text-[#2B2B2B] dark:text-white mb-1 line-clamp-2 group-hover:text-[#8B1538] dark:group-hover:text-[#D4AF37] transition-colors font-poppins">
            {product.name}
          </h3>
        </a>

        <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-3 font-poppins">
          {product.category_name || "Uncategorized"}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#8B1538] dark:text-[#D4AF37] font-poppins">
            PKR {parseFloat(product.price).toLocaleString()}
          </span>

          <button
            onClick={handleAddToCart}
            className="bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black p-2 rounded-lg hover:bg-[#6B0F28] dark:hover:bg-[#B8941F] transition-all duration-200 hover:scale-105"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
