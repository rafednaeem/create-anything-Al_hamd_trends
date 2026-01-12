import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import useUser from "@/utils/useUser";

export default function Navbar({ cartCount = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { data: user } = useUser();

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <nav className="bg-white dark:bg-[#1E1E1E] border-b border-[#E6E6E6] dark:border-[#333333] sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#8B1538] to-[#6B0F28] dark:from-[#D4AF37] dark:to-[#B8941F] text-white dark:text-black text-center py-2 px-4">
        <p className="text-sm font-poppins">
          Free delivery on orders above PKR 3,000
        </p>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#8B1538] dark:text-[#D4AF37] font-playfair">
              Zahra Fashion
            </h1>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-[#2B2B2B] dark:text-white hover:text-[#8B1538] dark:hover:text-[#D4AF37] font-poppins font-medium transition-colors"
            >
              Home
            </a>
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="text-[#2B2B2B] dark:text-white hover:text-[#8B1538] dark:hover:text-[#D4AF37] font-poppins font-medium transition-colors"
              >
                {category.name}
              </a>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            <a
              href={user ? "/account/logout" : "/account/signin"}
              className="hidden sm:flex items-center space-x-2 text-[#2B2B2B] dark:text-white hover:text-[#8B1538] dark:hover:text-[#D4AF37] transition-colors"
            >
              <User size={20} />
              <span className="text-sm font-poppins">
                {user ? user.name || user.email : "Account"}
              </span>
            </a>

            {/* Cart */}
            <a
              href="/cart"
              className="relative flex items-center space-x-2 text-[#2B2B2B] dark:text-white hover:text-[#8B1538] dark:hover:text-[#D4AF37] transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8B1538] dark:bg-[#D4AF37] text-white dark:text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#2B2B2B] dark:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1E1E1E] border-t border-[#E6E6E6] dark:border-[#333333]">
          <div className="px-4 py-4 space-y-3">
            <a
              href="/"
              className="block text-[#2B2B2B] dark:text-white hover:text-[#8B1538] dark:hover:text-[#D4AF37] font-poppins font-medium py-2"
            >
              Home
            </a>
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="block text-[#2B2B2B] dark:text-white hover:text-[#8B1538] dark:hover:text-[#D4AF37] font-poppins font-medium py-2"
              >
                {category.name}
              </a>
            ))}
            <a
              href={user ? "/account/logout" : "/account/signin"}
              className="block text-[#2B2B2B] dark:text-white hover:text-[#8B1538] dark:hover:text-[#D4AF37] font-poppins font-medium py-2"
            >
              {user ? "Sign Out" : "Sign In / Sign Up"}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
