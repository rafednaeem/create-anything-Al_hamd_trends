import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { CheckCircle, Upload } from "lucide-react";
import { useUpload } from "@/utils/useUpload";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { upload } = useUpload();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get("orderNumber");

    if (!orderNumber) {
      window.location.href = "/";
      return;
    }

    fetch(`/api/orders?orderNumber=${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);
        setOrderItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setLoading(false);
      });
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileUrl = await upload(file);

      const formData = new FormData();
      formData.append("orderNumber", order.order_number);
      formData.append("file", file);

      const response = await fetch("/api/payment-proof", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Payment proof uploaded successfully!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Failed to upload payment proof");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload payment proof");
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
        <Navbar cartCount={0} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-96 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
        <Navbar cartCount={0} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-[#666666] dark:text-[#AAAAAA] font-poppins">
            Order not found
          </p>
        </div>
      </div>
    );
  }

  const needsPaymentProof = ["jazzcash", "easypaisa", "bank"].includes(
    order.payment_method,
  );

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
      <Toaster position="top-right" richColors />
      <Navbar cartCount={0} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <CheckCircle
            size={80}
            className="mx-auto text-green-600 dark:text-green-400 mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] dark:text-white mb-3 font-playfair">
            Order Placed Successfully!
          </h1>
          <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins text-lg">
            Thank you for your order. We'll process it shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
            Order Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins mb-1">
                Order Number
              </p>
              <p className="text-lg font-bold text-[#8B1538] dark:text-[#D4AF37] font-poppins">
                {order.order_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins mb-1">
                Order Date
              </p>
              <p className="text-lg font-semibold text-[#2B2B2B] dark:text-white font-poppins">
                {new Date(order.created_at).toLocaleDateString("en-PK")}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins mb-1">
                Payment Method
              </p>
              <p className="text-lg font-semibold text-[#2B2B2B] dark:text-white font-poppins capitalize">
                {order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : order.payment_method}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins mb-1">
                Total Amount
              </p>
              <p className="text-lg font-bold text-[#8B1538] dark:text-[#D4AF37] font-poppins">
                PKR {parseFloat(order.total_amount).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
            Delivery Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins mb-1">
                Name
              </p>
              <p className="text-base font-semibold text-[#2B2B2B] dark:text-white font-poppins">
                {order.customer_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins mb-1">
                Phone
              </p>
              <p className="text-base font-semibold text-[#2B2B2B] dark:text-white font-poppins">
                {order.customer_phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins mb-1">
                Address
              </p>
              <p className="text-base font-semibold text-[#2B2B2B] dark:text-white font-poppins">
                {order.delivery_address}
                {order.city && `, ${order.city}`}
                {order.postal_code && ` - ${order.postal_code}`}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-6 font-playfair">
            Order Items
          </h2>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-[#E6E6E6] dark:border-[#333333] pb-4 last:border-0"
              >
                <div>
                  <p className="font-semibold text-[#2B2B2B] dark:text-white font-poppins">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
                    Quantity: {item.quantity} × PKR{" "}
                    {parseFloat(item.product_price).toLocaleString()}
                  </p>
                </div>
                <p className="font-bold text-[#8B1538] dark:text-[#D4AF37] font-poppins">
                  PKR {parseFloat(item.subtotal).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Proof Upload */}
        {needsPaymentProof && order.payment_status !== "confirmed" && (
          <div className="bg-[#FFF9E6] dark:bg-[#2A2410] rounded-lg border-2 border-[#D4AF37] p-6 mb-6">
            <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-4 font-playfair">
              Upload Payment Proof
            </h2>
            <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins mb-4">
              Please upload a screenshot of your payment to complete your order.
            </p>

            {order.payment_method === "jazzcash" && (
              <div className="mb-4 p-4 bg-white dark:bg-[#1E1E1E] rounded-lg">
                <p className="font-semibold text-[#2B2B2B] dark:text-white font-poppins mb-2">
                  JazzCash Account:
                </p>
                <p className="text-[#8B1538] dark:text-[#D4AF37] font-bold font-poppins">
                  03XX XXXXXXX
                </p>
              </div>
            )}

            {order.payment_method === "easypaisa" && (
              <div className="mb-4 p-4 bg-white dark:bg-[#1E1E1E] rounded-lg">
                <p className="font-semibold text-[#2B2B2B] dark:text-white font-poppins mb-2">
                  EasyPaisa Account:
                </p>
                <p className="text-[#8B1538] dark:text-[#D4AF37] font-bold font-poppins">
                  03XX XXXXXXX
                </p>
              </div>
            )}

            {order.payment_method === "bank" && (
              <div className="mb-4 p-4 bg-white dark:bg-[#1E1E1E] rounded-lg">
                <p className="font-semibold text-[#2B2B2B] dark:text-white font-poppins mb-2">
                  Bank Details:
                </p>
                <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins">
                  Account Title: Zahra Fashion
                  <br />
                  Account Number: XXXX XXXX XXXX XXXX
                  <br />
                  Bank: HBL / Meezan Bank
                </p>
              </div>
            )}

            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-[#8B1538] dark:border-[#D4AF37] rounded-lg cursor-pointer hover:bg-[#FFF5F0] dark:hover:bg-[#2A1810] transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Upload
                className="mr-3 text-[#8B1538] dark:text-[#D4AF37]"
                size={24}
              />
              <span className="font-semibold text-[#8B1538] dark:text-[#D4AF37] font-poppins">
                {uploading ? "Uploading..." : "Click to Upload Screenshot"}
              </span>
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/"
            className="flex-1 text-center bg-gradient-to-r from-[#8B1538] to-[#6B0F28] dark:from-[#D4AF37] dark:to-[#B8941F] text-white dark:text-black py-3 rounded-lg font-semibold hover:from-[#6B0F28] hover:to-[#4B0818] dark:hover:from-[#B8941F] dark:hover:to-[#9C7E1A] transition-all duration-200 font-poppins"
          >
            Continue Shopping
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
