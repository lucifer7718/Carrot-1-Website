"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  image?: string;
  imageLabel?: string;
  size?: string;
  quantity?: number;
  sizes?: string[];
};

type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  stockQuantity: number;
};

type NavbarProps = {
  siteName: string;
  logoText: string;
  logoImage: string;
};

export default function Navbar({
  siteName,
  logoText,
  logoImage,
}: NavbarProps) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = () => {
    try {
      const savedCart = localStorage.getItem("carrotCart");
      const savedWishlist = localStorage.getItem("carrotWishlist");

      const parsedCart: Partial<CartItem>[] = savedCart ? JSON.parse(savedCart) : [];
      const parsedWishlist: Partial<WishlistItem>[] = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

      const totalCartCount = parsedCart.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 1;
        return sum + quantity;
      }, 0);

      setCartCount(totalCartCount);
      setWishlistCount(parsedWishlist.length);
    } catch {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateCounts();

    const handleCartUpdate = () => updateCounts();
    const handleWishlistUpdate = () => updateCounts();
    const handleFocus = () => updateCounts();
    const handleStorage = () => updateCounts();

    window.addEventListener("carrot-cart-updated", handleCartUpdate);
    window.addEventListener("carrot-wishlist-updated", handleWishlistUpdate);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("carrot-cart-updated", handleCartUpdate);
      window.removeEventListener("carrot-wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e6e4df] bg-[#FAFAF8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 text-[#C8470A]">
          {logoImage ? (
            <img
              src={logoImage}
              alt={siteName}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="text-2xl font-bold tracking-tight">
              {logoText || siteName}
            </span>
          )}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#C8470A]"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#C8470A]"
          >
            Shop
          </Link>

          <Link
            href="/categories"
            className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#C8470A]"
          >
            Categories
          </Link>

          <Link
            href="/wishlist"
            className="relative pr-3 text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#C8470A]"
          >
            Wishlist
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C8470A] px-1.5 text-[11px] font-bold leading-none text-white shadow-sm">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative pr-3 text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#C8470A]"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C8470A] px-1.5 text-[11px] font-bold leading-none text-white shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}