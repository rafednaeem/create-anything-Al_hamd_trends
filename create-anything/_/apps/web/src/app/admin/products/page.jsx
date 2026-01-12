import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useUpload } from "@/utils/useUpload";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const { upload } = useUpload();

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSend.append("file", imageFile);
      }

      if (editingProduct) {
        formDataToSend.append("productId", editingProduct.id);
      }

      const url = editingProduct
        ? "/api/admin/products"
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success(editingProduct ? "Product updated!" : "Product created!");
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          categoryId: "",
          stockQuantity: "",
          isFeatured: false,
        });
        setImageFile(null);
        fetchProducts();
      } else {
        toast.error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted!");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      categoryId: product.category_id,
      stockQuantity: product.stock_quantity,
      isFeatured: product.is_featured,
    });
    setShowModal(true);
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#2B2B2B] dark:text-white font-playfair">
            Manage Products
          </h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: "",
                description: "",
                price: "",
                categoryId: "",
                stockQuantity: "",
                isFeatured: false,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black px-4 py-2 rounded-lg hover:bg-[#6B0F28] dark:hover:bg-[#B8941F] transition-colors font-poppins font-semibold"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E6E6E6] dark:border-[#333333] overflow-hidden"
              >
                <img
                  src={
                    product.image_url || "https://via.placeholder.com/400x300"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-2 font-poppins">
                    {product.category_name}
                  </p>
                  <p className="text-lg font-bold text-[#8B1538] dark:text-[#D4AF37] mb-3 font-poppins">
                    PKR {parseFloat(product.price).toLocaleString()}
                  </p>
                  <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-4 font-poppins">
                    Stock: {product.stock_quantity}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-poppins"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors font-poppins"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E6E6E6] dark:border-[#333333]">
              <h3 className="text-xl font-bold text-[#2B2B2B] dark:text-white font-playfair">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#666666] dark:text-[#AAAAAA] hover:text-[#2B2B2B] dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white outline-none font-poppins"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white outline-none font-poppins"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white outline-none font-poppins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white outline-none font-poppins"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white outline-none font-poppins"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white mb-2 font-poppins">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#2B2B2B] dark:text-white outline-none font-poppins"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 text-[#8B1538] dark:text-[#D4AF37] rounded"
                />
                <label className="ml-2 text-sm font-medium text-[#2B2B2B] dark:text-white font-poppins">
                  Featured Product
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-[#333333] text-[#2B2B2B] dark:text-white px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-[#444444] transition-colors font-poppins font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black px-4 py-3 rounded-lg hover:bg-[#6B0F28] dark:hover:bg-[#B8941F] transition-colors font-poppins font-semibold"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
