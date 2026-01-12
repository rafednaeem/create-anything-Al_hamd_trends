import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Eye, CheckCircle, X, Clock } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentProof, setPaymentProof] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = async (order) => {
    try {
      const response = await fetch(
        `/api/orders?orderNumber=${order.order_number}`,
      );
      const data = await response.json();
      setSelectedOrder(data.order);
      setOrderItems(data.items || []);
      setPaymentProof(data.paymentProof || null);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: status }),
      });

      if (response.ok) {
        toast.success("Order status updated!");
        fetchOrders();
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, order_status: status });
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const verifyPaymentProof = async (proofId, status) => {
    try {
      const response = await fetch("/api/admin/payment-proofs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proofId,
          status,
          adminEmail: "admin@zahrafashion.pk",
        }),
      });

      if (response.ok) {
        toast.success(`Payment proof ${status}!`);
        setPaymentProof({ ...paymentProof, verification_status: status });
        fetchOrders();
      } else {
        toast.error("Failed to verify payment proof");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to verify payment proof");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
      <Toaster position="top-right" richColors />

      <nav className="bg-white dark:bg-[#1E1E1E] border-b border-[#E6E6E6] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="/admin"
              className="text-2xl font-bold text-[#8B1538] dark:text-[#D4AF37] font-playfair"
            >
              Zahra Fashion - Admin
            </a>
            <a
              href="/"
              className="text-[#666666] dark:text-[#AAAAAA] hover:text-[#8B1538] dark:hover:text-[#D4AF37] font-poppins"
            >
              View Store
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-[#2B2B2B] dark:text-white mb-8 font-playfair">
          Manage Orders
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333]">
            <Clock
              size={64}
              className="mx-auto text-[#CCCCCC] dark:text-[#555555] mb-4"
            />
            <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins text-lg">
              No orders yet
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F5F5] dark:bg-[#262626]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] dark:text-[#AAAAAA] uppercase tracking-wider font-poppins">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] dark:text-[#AAAAAA] uppercase tracking-wider font-poppins">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] dark:text-[#AAAAAA] uppercase tracking-wider font-poppins">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] dark:text-[#AAAAAA] uppercase tracking-wider font-poppins">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] dark:text-[#AAAAAA] uppercase tracking-wider font-poppins">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] dark:text-[#AAAAAA] uppercase tracking-wider font-poppins">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] dark:text-[#AAAAAA] uppercase tracking-wider font-poppins">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E6E6] dark:divide-[#333333]">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FFF5F0] dark:hover:bg-[#2A1810] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-[#8B1538] dark:text-[#D4AF37] font-poppins">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-poppins">
                          <div className="font-medium text-[#2B2B2B] dark:text-white">
                            {order.customer_name}
                          </div>
                          <div className="text-[#666666] dark:text-[#AAAAAA]">
                            {order.customer_phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-[#2B2B2B] dark:text-white font-poppins">
                          PKR {parseFloat(order.total_amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-poppins text-[#666666] dark:text-[#AAAAAA] capitalize">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold font-poppins ${getStatusColor(order.order_status)}`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
                        {new Date(order.created_at).toLocaleDateString("en-PK")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg max-w-4xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#E6E6E6] dark:border-[#333333]">
              <h3 className="text-xl font-bold text-[#2B2B2B] dark:text-white font-playfair">
                Order Details - {selectedOrder.order_number}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#666666] dark:text-[#AAAAAA] hover:text-[#2B2B2B] dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-[#2B2B2B] dark:text-white mb-3 font-poppins">
                  Customer Information
                </h4>
                <div className="bg-[#F5F5F5] dark:bg-[#262626] rounded-lg p-4 space-y-2">
                  <p className="text-sm font-poppins">
                    <span className="font-semibold">Name:</span>{" "}
                    {selectedOrder.customer_name}
                  </p>
                  <p className="text-sm font-poppins">
                    <span className="font-semibold">Phone:</span>{" "}
                    {selectedOrder.customer_phone}
                  </p>
                  {selectedOrder.customer_email && (
                    <p className="text-sm font-poppins">
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedOrder.customer_email}
                    </p>
                  )}
                  <p className="text-sm font-poppins">
                    <span className="font-semibold">Address:</span>{" "}
                    {selectedOrder.delivery_address}
                  </p>
                  {selectedOrder.city && (
                    <p className="text-sm font-poppins">
                      <span className="font-semibold">City:</span>{" "}
                      {selectedOrder.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-[#2B2B2B] dark:text-white mb-3 font-poppins">
                  Order Items
                </h4>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F5F5F5] dark:bg-[#262626] rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-[#2B2B2B] dark:text-white font-poppins">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
                          Qty: {item.quantity} × PKR{" "}
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

              {/* Payment Proof */}
              {paymentProof && (
                <div>
                  <h4 className="font-semibold text-[#2B2B2B] dark:text-white mb-3 font-poppins">
                    Payment Proof
                  </h4>
                  <div className="bg-[#F5F5F5] dark:bg-[#262626] rounded-lg p-4">
                    <img
                      src={paymentProof.proof_image_url}
                      alt="Payment proof"
                      className="max-w-md mx-auto rounded-lg mb-4"
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          verifyPaymentProof(paymentProof.id, "approved")
                        }
                        disabled={
                          paymentProof.verification_status === "approved"
                        }
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          verifyPaymentProof(paymentProof.id, "rejected")
                        }
                        disabled={
                          paymentProof.verification_status === "rejected"
                        }
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                    <p className="text-center text-sm text-[#666666] dark:text-[#AAAAAA] mt-2 font-poppins">
                      Status:{" "}
                      <span className="capitalize font-semibold">
                        {paymentProof.verification_status}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Order Status */}
              <div>
                <h4 className="font-semibold text-[#2B2B2B] dark:text-white mb-3 font-poppins">
                  Update Order Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, status)
                      }
                      className={`px-4 py-2 rounded-lg font-semibold font-poppins capitalize transition-colors ${
                        selectedOrder.order_status === status
                          ? "bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black"
                          : "bg-[#F5F5F5] dark:bg-[#262626] text-[#2B2B2B] dark:text-white hover:bg-[#E6E6E6] dark:hover:bg-[#333333]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
