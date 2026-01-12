import { useState, useEffect } from "react";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    Promise.all([
      fetch("/api/admin/orders").then((res) => res.json()),
      fetch("/api/products").then((res) => res.json()),
    ])
      .then(([ordersData, productsData]) => {
        const orders = ordersData.orders || [];
        const products = productsData.products || [];

        const totalRevenue = orders.reduce(
          (sum, order) => sum + parseFloat(order.total_amount),
          0,
        );
        const pendingOrders = orders.filter(
          (o) => o.order_status === "pending",
        ).length;

        setStats({
          totalOrders: orders.length,
          pendingOrders,
          totalRevenue,
          totalProducts: products.length,
        });
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
      <nav className="bg-white dark:bg-[#1E1E1E] border-b border-[#E6E6E6] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-[#8B1538] dark:text-[#D4AF37] font-playfair">
              Zahra Fashion - Admin
            </h1>
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
          Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#8B1538]/10 dark:bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                <ShoppingCart
                  className="text-[#8B1538] dark:text-[#D4AF37]"
                  size={24}
                />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2B2B2B] dark:text-white font-poppins mb-1">
              {stats.totalOrders}
            </p>
            <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
              Total Orders
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-orange-500" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2B2B2B] dark:text-white font-poppins mb-1">
              {stats.pendingOrders}
            </p>
            <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
              Pending Orders
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2B2B2B] dark:text-white font-poppins mb-1">
              PKR {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
              Total Revenue
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="text-blue-500" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2B2B2B] dark:text-white font-poppins mb-1">
              {stats.totalProducts}
            </p>
            <p className="text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
              Total Products
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/admin/products"
            className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-8 hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors"
          >
            <Package
              className="text-[#8B1538] dark:text-[#D4AF37] mb-4"
              size={32}
            />
            <h3 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-2 font-playfair">
              Manage Products
            </h3>
            <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins">
              Add, edit, or remove products from your catalog
            </p>
          </a>

          <a
            href="/admin/orders"
            className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] p-8 hover:border-[#8B1538] dark:hover:border-[#D4AF37] transition-colors"
          >
            <ShoppingCart
              className="text-[#8B1538] dark:text-[#D4AF37] mb-4"
              size={32}
            />
            <h3 className="text-xl font-bold text-[#2B2B2B] dark:text-white mb-2 font-playfair">
              Manage Orders
            </h3>
            <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins">
              View and update order statuses, verify payments
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
