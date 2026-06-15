"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  products,
  type CartItem,
  type Product,
  type ProductSize,
} from "@/lib/products";

type WishlistItem = Product;

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [popupText, setPopupText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<WishlistItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("carrotWishlist");

    if (savedWishlist) {
      const parsedWishlist = JSON.parse(savedWishlist);

      const normalizedWishlist: WishlistItem[] = parsedWishlist
        .map((item: Partial<WishlistItem>) => {
          const fullProduct = products.find((product) => product.id === item.id);

          if (fullProduct) return fullProduct;

          return {
            id: item.id ?? 0,
            slug: item.slug ?? "",
            name: item.name ?? "",
            price: item.price ?? "₹0",
            imageLabel: item.imageLabel ?? "",
            description: item.description ?? "",
            featured: item.featured ?? false,
            availableSizes:
              item.availableSizes && item.availableSizes.length > 0
                ? item.availableSizes
                : ["S", "M", "L", "XL"],
          };
        })
        .filter((item: WishlistItem) => item.id !== 0);

      setWishlistItems(normalizedWishlist);
      localStorage.setItem("carrotWishlist", JSON.stringify(normalizedWishlist));
      window.dispatchEvent(new Event("carrot-wishlist-updated"));
    }
  }, []);

  const updateWishlistStorage = (updatedWishlist: WishlistItem[]) => {
    setWishlistItems(updatedWishlist);
    localStorage.setItem("carrotWishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("carrot-wishlist-updated"));
  };

  const handleRemove = (id: number) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    updateWishlistStorage(updatedWishlist);
    setPopupText("Item removed from wishlist");

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  const openMoveToCartPopup = (item: WishlistItem) => {
    const fullProduct = products.find((product) => product.id === item.id) ?? item;
    setSelectedProduct(fullProduct);
    setSelectedSize(fullProduct.availableSizes?.[0] ?? null);
  };

  const handleMoveToCart = () => {
    if (!selectedProduct || !selectedSize) {
      setPopupText("Please select a size");

      setTimeout(() => {
        setPopupText("");
      }, 2000);

      return;
    }

    const existingCart = localStorage.getItem("carrotCart");
    const parsedCart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const normalizedCart: CartItem[] = parsedCart.map((item: Partial<CartItem>) => ({
      id: item.id ?? 0,
      slug: item.slug ?? "",
      name: item.name ?? "",
      price: item.price ?? "₹0",
      imageLabel: item.imageLabel ?? "",
      size: (item.size as ProductSize) ?? "M",
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    }));

    const existingIndex = normalizedCart.findIndex(
      (item) => item.id === selectedProduct.id && item.size === selectedSize
    );

    let updatedCart: CartItem[];

    if (existingIndex !== -1) {
      updatedCart = [...normalizedCart];
      updatedCart[existingIndex].quantity += 1;
    } else {
      const newCartItem: CartItem = {
        id: selectedProduct.id,
        slug: selectedProduct.slug,
        name: selectedProduct.name,
        price: selectedProduct.price,
        imageLabel: selectedProduct.imageLabel,
        size: selectedSize,
        quantity: 1,
      };

      updatedCart = [...normalizedCart, newCartItem];
    }

    localStorage.setItem("carrotCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("carrot-cart-updated"));

    const updatedWishlist = wishlistItems.filter((item) => item.id !== selectedProduct.id);
    updateWishlistStorage(updatedWishlist);

    setPopupText(`${selectedProduct.name} moved to cart`);
    setSelectedProduct(null);
    setSelectedSize(null);

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] relative">
      {popupText && (
        <div className="fixed top-24 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
          {popupText}
        </div>
      )}

      <section className="max-w-[1000px] mx-auto px-6 py-16 md:py-20">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7a7974] mb-3">
            Wishlist
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            Saved Items
          </h1>

          <p className="text-[#5f5f5f] text-base md:text-lg max-w-2xl leading-relaxed">
            Keep track of the pieces you love and move them to cart whenever you are ready.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-[#ece8e1] shadow-sm p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C8470A]/10 border border-[#C8470A]/20 flex items-center justify-center">
              <svg
                className="w-9 h-9 text-[#C8470A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20.5s-6.8-4.4-9.1-8.1C1.2 9.8 2.3 5.8 6 5.3c2-.2 3.5.8 4.3 2 .8-1.2 2.3-2.2 4.3-2 3.7.5 4.8 4.5 3.1 7.1-2.3 3.7-9.1 8.1-9.1 8.1z" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-3">
              Your wishlist is empty
            </h2>

            <p className="text-[#6b6b6b] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
              You have not saved any products yet. Explore the shop and add your favorite Carrot pieces here.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[24px] border border-[#ece8e1] p-5 md:p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
                  <div className="w-full md:w-[180px] aspect-[3/4] rounded-[20px] bg-gradient-to-br from-[#F2E8DC] via-[#f6efe6] to-[#e8e2d8] flex items-center justify-center shrink-0">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-[#C8470A]/10 border border-[#C8470A]/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <span className="text-[#C8470A] text-2xl font-bold">T</span>
                      </div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#7a7974]">
                        {item.imageLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                      {item.name}
                    </h2>

                    <p className="text-[#C8470A] font-bold text-lg mb-5">
                      {item.price}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => openMoveToCartPopup(item)}
                        className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
                      >
                        Move to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="bg-[#FAFAF8] text-[#1A1A1A] px-6 py-3 rounded-xl text-sm font-semibold border border-[#ddd6cb] hover:border-[#C8470A] hover:text-[#C8470A] transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center">
          <div className="w-full max-w-xl bg-white rounded-t-[28px] p-6 md:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null);
                setSelectedSize(null);
              }}
              aria-label="Close popup"
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-[#ddd6cb] bg-[#FAFAF8] text-[#1A1A1A] flex items-center justify-center hover:border-[#1A1A1A] transition-all"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </button>

            <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2 pr-12">
              Select size
            </h3>

            <p className="text-[#5f5f5f] text-sm md:text-base leading-relaxed mb-6">
              Choose a size for{" "}
              <span className="font-semibold text-[#1A1A1A]">
                {selectedProduct.name}
              </span>
              .
            </p>

            <div className="mb-8">
              <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
                Size
              </p>

              <div className="flex flex-wrap gap-3">
                {selectedProduct.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-5 rounded-full border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-white text-[#1A1A1A] border-[#ddd6cb] hover:border-[#C8470A] hover:text-[#C8470A]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleMoveToCart}
              className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
            >
              Move to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}