import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Filter } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get category from URL
    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get("category");
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, []);

  useEffect(() => {
    // Fetch products
    const url = selectedCategory
      ? `/api/products?category=${selectedCategory}`
      : "/api/products";

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });

    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch cart count
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCartCount(data.count || 0))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [selectedCategory]);

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (response.ok) {
        toast.success("Added to cart!");
        setCartCount((prev) => prev + 1);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    // Update URL without reload
    if (typeof window !== "undefined") {
      const newUrl = slug ? `/products?category=${slug}` : "/products";
      window.history.pushState({}, "", newUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-[#0A0A0A]">
      <Toaster position="top-right" richColors />
      <Navbar cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] dark:text-white mb-8 font-playfair">
          {selectedCategory
            ? categories.find((c) => c.slug === selectedCategory)?.name ||
              "Products"
            : "All Products"}
        </h1>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 text-[#666666] dark:text-[#AAAAAA]">
            <Filter size={20} />
            <span className="font-poppins font-medium">Filter:</span>
          </div>
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-4 py-2 rounded-lg font-poppins font-medium whitespace-nowrap transition-all duration-200 ${
              !selectedCategory
                ? "bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black"
                : "bg-white dark:bg-[#1E1E1E] text-[#2B2B2B] dark:text-white border border-[#E6E6E6] dark:border-[#333333] hover:border-[#8B1538] dark:hover:border-[#D4AF37]"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-lg font-poppins font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.slug
                  ? "bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black"
                  : "bg-white dark:bg-[#1E1E1E] text-[#2B2B2B] dark:text-white border border-[#E6E6E6] dark:border-[#333333] hover:border-[#8B1538] dark:hover:border-[#D4AF37]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-96 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#666666] dark:text-[#AAAAAA] font-poppins text-lg">
              No products found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
