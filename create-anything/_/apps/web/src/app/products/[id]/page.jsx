import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { ShoppingCart, Minus, Plus } from "lucide-react";

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const productId = params.id;

  useEffect(() => {
    // Fetch product details
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });

    // Fetch cart count
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCartCount(data.count || 0))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (response.ok) {
        toast.success(`Added ${quantity} item(s) to cart!`);
        setCartCount((prev) => prev + quantity);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
        <Navbar cartCount={cartCount} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-[600px] bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-10 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded animate-pulse"></div>
              <div className="h-6 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded animate-pulse w-1/2"></div>
              <div className="h-24 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
        <Navbar cartCount={cartCount} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-[#666666] dark:text-[#AAAAAA] font-poppins">
            Product not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
      <Toaster position="top-right" richColors />
      <Navbar cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm font-poppins">
          <a
            href="/"
            className="text-[#666666] dark:text-[#AAAAAA] hover:text-[#8B1538] dark:hover:text-[#D4AF37]"
          >
            Home
          </a>
          <span className="text-[#666666] dark:text-[#AAAAAA]">/</span>
          <a
            href="/products"
            className="text-[#666666] dark:text-[#AAAAAA] hover:text-[#8B1538] dark:hover:text-[#D4AF37]"
          >
            Products
          </a>
          <span className="text-[#666666] dark:text-[#AAAAAA]">/</span>
          <span className="text-[#2B2B2B] dark:text-white">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white dark:bg-[#1E1E1E]">
            <img
              src={
                product.image_url ||
                "https://via.placeholder.com/600x800?text=No+Image"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.is_featured && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-semibold font-poppins">
                Featured
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] dark:text-white mb-4 font-playfair">
              {product.name}
            </h1>

            <p className="text-lg text-[#666666] dark:text-[#AAAAAA] mb-6 font-poppins">
              {product.category_name || "Uncategorized"}
            </p>

            <div className="mb-8">
              <span className="text-4xl font-bold text-[#8B1538] dark:text-[#D4AF37] font-poppins">
                PKR {parseFloat(product.price).toLocaleString()}
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B2B2B] dark:text-white mb-3 font-poppins">
                Description
              </h3>
              <p className="text-[#666666] dark:text-[#AAAAAA] leading-relaxed font-poppins">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B2B2B] dark:text-white mb-3 font-poppins">
                Stock Status
              </h3>
              <p
                className={`font-semibold font-poppins ${
                  product.stock_quantity > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} items available`
                  : "Out of Stock"}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B2B2B] dark:text-white mb-3 font-poppins">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-[#E6E6E6] dark:border-[#333333] flex items-center justify-center hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-semibold text-[#2B2B2B] dark:text-white font-poppins w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock_quantity, quantity + 1))
                  }
                  className="w-10 h-10 rounded-lg border-2 border-[#E6E6E6] dark:border-[#333333] flex items-center justify-center hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors"
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full bg-gradient-to-r from-[#8B1538] to-[#6B0F28] dark:from-[#D4AF37] dark:to-[#B8941F] text-white dark:text-black py-4 rounded-lg font-semibold hover:from-[#6B0F28] hover:to-[#4B0818] dark:hover:from-[#B8941F] dark:hover:to-[#9C7E1A] transition-all duration-200 flex items-center justify-center gap-3 font-poppins text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={22} />
              {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
