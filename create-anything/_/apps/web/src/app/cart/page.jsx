import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setCartItems(data.cartItems || []);
      setTotal(data.total || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCart();
        toast.success("Cart updated");
      } else {
        toast.error("Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCart();
        toast.success("Item removed from cart");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
        <Navbar cartCount={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-64 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
      <Toaster position="top-right" richColors />
      <Navbar cartCount={cartItems.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] dark:text-white mb-8 font-playfair">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333]">
            <ShoppingBag
              size={64}
              className="mx-auto text-[#CCCCCC] dark:text-[#555555] mb-4"
            />
            <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins text-lg mb-6">
              Your cart is empty
            </p>
            <a
              href="/products"
              className="inline-block bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#6B0F28] dark:hover:bg-[#B8941F] transition-all duration-200 font-poppins"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-4 flex gap-4"
                >
                  <img
                    src={item.image_url || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                      {item.name}
                    </h3>
                    <p className="text-[#8B1538] dark:text-[#D4AF37] font-semibold font-poppins">
                      PKR {parseFloat(item.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded border border-[#E6E6E6] dark:border-[#333333] flex items-center justify-center hover:border-[#8B1538] dark:hover:border-[#D4AF37]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold font-poppins">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded border border-[#E6E6E6] dark:border-[#333333] flex items-center justify-center hover:border-[#8B1538] dark:hover:border-[#D4AF37]"
                        disabled={item.quantity >= item.stock_quantity}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-poppins">
                    <span className="text-[#666666] dark:text-[#AAAAAA]">
                      Subtotal
                    </span>
                    <span className="font-semibold text-[#2B2B2B] dark:text-white">
                      PKR {parseFloat(total).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-poppins">
                    <span className="text-[#666666] dark:text-[#AAAAAA]">
                      Shipping
                    </span>
                    <span className="font-semibold text-[#2B2B2B] dark:text-white">
                      {parseFloat(total) >= 3000 ? "FREE" : "PKR 200"}
                    </span>
                  </div>
                  <div className="border-t border-[#E6E6E6] dark:border-[#333333] pt-4">
                    <div className="flex justify-between font-poppins">
                      <span className="text-lg font-semibold text-[#2B2B2B] dark:text-white">
                        Total
                      </span>
                      <span className="text-lg font-bold text-[#8B1538] dark:text-[#D4AF37]">
                        PKR{" "}
                        {(
                          parseFloat(total) +
                          (parseFloat(total) >= 3000 ? 0 : 200)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="/checkout"
                  className="w-full block text-center bg-gradient-to-r from-[#8B1538] to-[#6B0F28] dark:from-[#D4AF37] dark:to-[#B8941F] text-white dark:text-black py-3 rounded-lg font-semibold hover:from-[#6B0F28] hover:to-[#4B0818] dark:hover:from-[#B8941F] dark:hover:to-[#9C7E1A] transition-all duration-200 font-poppins"
                >
                  Proceed to Checkout
                </a>

                <a
                  href="/products"
                  className="w-full block text-center mt-3 bg-white dark:bg-transparent text-[#8B1538] dark:text-[#D4AF37] border-2 border-[#8B1538] dark:border-[#D4AF37] py-3 rounded-lg font-semibold hover:bg-[#8B1538] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black transition-all duration-200 font-poppins"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
