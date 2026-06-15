import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#FAFAF8]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#C8470A] mb-4">Carrot</h3>
            <p className="text-sm text-[#bab9b4] leading-relaxed">
              Crafted with care. Defined by art. Premium essentials for everyday wear.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Pages
            </h4>
            <ul className="space-y-2 text-sm text-[#bab9b4]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-[#bab9b4]">
              <li>
                <a
                  href="mailto:wearcarrot923@gmail.com"
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  wearcarrot923@gmail.com
                </a>
              </li>
              <li>All India Delivery</li>
              <li>COD Available</li>
              <li>7-10 Days Delivery</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#333] mt-8 pt-8 text-center text-xs text-[#7a7974] space-y-2">
          <p>© 2026 Carrot. All rights reserved.</p>
          <p>
            Made by{" "}
            <span className="text-[#bab9b4] font-medium">Ezzgo Digital</span>
          </p>
        </div>
      </div>
    </footer>
  );
}