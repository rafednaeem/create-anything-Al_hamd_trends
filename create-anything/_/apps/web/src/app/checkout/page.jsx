import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (data.cartItems && data.cartItems.length === 0) {
          window.location.href = "/cart";
          return;
        }
        setCartItems(data.cartItems || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const shippingCost = parseFloat(total) >= 3000 ? 0 : 200;
      const totalAmount = parseFloat(total) + shippingCost;

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cartItems,
          totalAmount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Clear cart items
        for (const item of cartItems) {
          await fetch(`/api/cart?id=${item.id}`, { method: "DELETE" });
        }
        // Redirect to order confirmation
        window.location.href = `/order-confirmation?orderNumber=${data.orderNumber}`;
      } else {
        toast.error("Failed to create order");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
        <Navbar cartCount={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-96 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  const shippingCost = parseFloat(total) >= 3000 ? 0 : 200;
  const totalAmount = parseFloat(total) + shippingCost;

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
      <Toaster position="top-right" richColors />
      <Navbar cartCount={cartItems.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] dark:text-white mb-8 font-playfair">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
                <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white focus:border-[#8B1538] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] outline-none font-poppins"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white focus:border-[#8B1538] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] outline-none font-poppins"
                        placeholder="03XX XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white focus:border-[#8B1538] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] outline-none font-poppins"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
                <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                      Complete Address *
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white focus:border-[#8B1538] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] outline-none font-poppins"
                      placeholder="House/Flat number, Street, Area"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white focus:border-[#8B1538] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] outline-none font-poppins"
                        placeholder="e.g., Karachi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white focus:border-[#8B1538] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] outline-none font-poppins"
                        placeholder="e.g., 75500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
                <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-[#E6E6E6] dark:border-[#333333] rounded-lg cursor-pointer hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8B1538] dark:text-[#D4AF37]"
                    />
                    <Banknote
                      className="ml-3 text-[#8B1538] dark:text-[#D4AF37]"
                      size={20}
                    />
                    <span className="ml-3 font-poppins font-medium text-[#2B2B2B] dark:text-white">
                      Cash on Delivery (COD)
                    </span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-[#E6E6E6] dark:border-[#333333] rounded-lg cursor-pointer hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={formData.paymentMethod === "jazzcash"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8B1538] dark:text-[#D4AF37]"
                    />
                    <Smartphone
                      className="ml-3 text-[#8B1538] dark:text-[#D4AF37]"
                      size={20}
                    />
                    <span className="ml-3 font-poppins font-medium text-[#2B2B2B] dark:text-white">
                      JazzCash
                    </span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-[#E6E6E6] dark:border-[#333333] rounded-lg cursor-pointer hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={formData.paymentMethod === "easypaisa"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8B1538] dark:text-[#D4AF37]"
                    />
                    <Smartphone
                      className="ml-3 text-[#8B1538] dark:text-[#D4AF37]"
                      size={20}
                    />
                    <span className="ml-3 font-poppins font-medium text-[#2B2B2B] dark:text-white">
                      EasyPaisa
                    </span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-[#E6E6E6] dark:border-[#333333] rounded-lg cursor-pointer hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8B1538] dark:text-[#D4AF37]"
                    />
                    <CreditCard
                      className="ml-3 text-[#8B1538] dark:text-[#D4AF37]"
                      size={20}
                    />
                    <span className="ml-3 font-poppins font-medium text-[#2B2B2B] dark:text-white">
                      Bank Transfer
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
                <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
                  Order Notes (Optional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white focus:border-[#8B1538] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] outline-none font-poppins"
                  placeholder="Any special instructions for your order"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between font-poppins text-sm"
                    >
                      <span className="text-[#666666] dark:text-[#AAAAAA]">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-[#2B2B2B] dark:text-white font-semibold">
                        PKR{" "}
                        {(
                          parseFloat(item.price) * item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-[#E6E6E6] dark:border-[#333333] pt-4">
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
                      {shippingCost === 0 ? "FREE" : `PKR ${shippingCost}`}
                    </span>
                  </div>
                  <div className="border-t border-[#E6E6E6] dark:border-[#333333] pt-3">
                    <div className="flex justify-between font-poppins">
                      <span className="text-lg font-semibold text-[#2B2B2B] dark:text-white">
                        Total
                      </span>
                      <span className="text-lg font-bold text-[#8B1538] dark:text-[#D4AF37]">
                        PKR {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-gradient-to-r from-[#8B1538] to-[#6B0F28] dark:from-[#D4AF37] dark:to-[#B8941F] text-white dark:text-black py-3 rounded-lg font-semibold hover:from-[#6B0F28] hover:to-[#4B0818] dark:hover:from-[#B8941F] dark:hover:to-[#9C7E1A] transition-all duration-200 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
