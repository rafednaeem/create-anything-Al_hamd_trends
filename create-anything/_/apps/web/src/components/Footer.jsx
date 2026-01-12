import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2B2B2B] dark:bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-[#D4AF37] mb-4 font-playfair">
              Zahra Fashion
            </h3>
            <p className="text-[#CCCCCC] font-poppins text-sm leading-relaxed">
              Your destination for authentic Pakistani fashion. We offer a
              curated selection of women's suits, jewelry, and accessories that
              celebrate South Asian elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-[#CCCCCC] hover:text-[#D4AF37] transition-colors font-poppins text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-[#CCCCCC] hover:text-[#D4AF37] transition-colors font-poppins text-sm"
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-[#CCCCCC] hover:text-[#D4AF37] transition-colors font-poppins text-sm"
                >
                  Cart
                </a>
              </li>
              <li>
                <a
                  href="/account/signin"
                  className="text-[#CCCCCC] hover:text-[#D4AF37] transition-colors font-poppins text-sm"
                >
                  My Account
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-[#CCCCCC]">
                <Phone size={18} className="text-[#D4AF37]" />
                <span className="font-poppins text-sm">+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-3 text-[#CCCCCC]">
                <Mail size={18} className="text-[#D4AF37]" />
                <span className="font-poppins text-sm">
                  info@zahrafashion.pk
                </span>
              </li>
              <li className="flex items-center space-x-4 mt-4">
                <a
                  href="#"
                  className="text-[#CCCCCC] hover:text-[#D4AF37] transition-colors"
                >
                  <Facebook size={22} />
                </a>
                <a
                  href="#"
                  className="text-[#CCCCCC] hover:text-[#D4AF37] transition-colors"
                >
                  <Instagram size={22} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#444444] mt-8 pt-6 text-center">
          <p className="text-[#AAAAAA] text-sm font-poppins">
            © 2026 Zahra Fashion. All rights reserved. | Payment Methods:
            JazzCash, EasyPaisa, COD
          </p>
        </div>
      </div>
    </footer>
  );
}
