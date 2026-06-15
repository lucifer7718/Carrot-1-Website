"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProductSize = "S" | "M" | "L" | "XL" | "XXL" | "XXXL";

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

type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  image?: string;
  imageLabel?: string;
  size: ProductSize | string;
  quantity: number;
  sizes?: string[];
};

const DEFAULT_SIZES: ProductSize[] = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [popupText, setPopupText] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("carrotCart");

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      const normalizedCart: CartItem[] = parsedCart.map((item: Partial<CartItem>) => ({
        id: String(item.id ?? ""),
        slug: item.slug ?? "",
        name: item.name ?? "",
        price: item.price ?? 0,
        image: item.image ?? "",
        imageLabel: item.imageLabel ?? "",
        size: String(item.size ?? "M"),
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        sizes:
          Array.isArray(item.sizes) && item.sizes.length > 0
            ? item.sizes.map((size) => String(size).toUpperCase())
            : DEFAULT_SIZES,
      }));

      setCartItems(normalizedCart);
      localStorage.setItem("carrotCart", JSON.stringify(normalizedCart));
      window.dispatchEvent(new Event("carrot-cart-updated"));
    }
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const numericPrice =
        typeof item.price === "number"
          ? item.price
          : Number(String(item.price).replace(/[^\d]/g, "")) || 0;

      const numericQuantity = Number(item.quantity) || 1;
      return sum + numericPrice * numericQuantity;
    }, 0);
  }, [cartItems]);

  const updateCartStorage = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("carrotCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("carrot-cart-updated"));
  };

  const getAvailableSizes = (item: CartItem): string[] => {
    if (Array.isArray(item.sizes) && item.sizes.length > 0) {
      return item.sizes;
    }
    return DEFAULT_SIZES;
  };

  const handleRemoveOnly = () => {
    if (!selectedItem) return;

    const updatedCart = cartItems.filter(
      (item) => !(item.id === selectedItem.id && item.size === selectedItem.size)
    );

    updateCartStorage(updatedCart);
    setPopupText(`${selectedItem.name} removed from cart`);
    setSelectedItem(null);

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  const handleMoveToWishlist = () => {
    if (!selectedItem) return;

    const updatedCart = cartItems.filter(
      (item) => !(item.id === selectedItem.id && item.size === selectedItem.size)
    );

    updateCartStorage(updatedCart);

    const existingWishlist = localStorage.getItem("carrotWishlist");
    const parsedWishlist: WishlistItem[] = existingWishlist
      ? JSON.parse(existingWishlist)
      : [];

    const alreadyExists = parsedWishlist.some((item) => item.id === selectedItem.id);

    if (!alreadyExists) {
      const wishlistProduct: WishlistItem = {
        id: selectedItem.id,
        slug: selectedItem.slug,
        name: selectedItem.name,
        price:
          typeof selectedItem.price === "number"
            ? selectedItem.price
            : Number(String(selectedItem.price).replace(/[^\d]/g, "")) || 0,
        images: selectedItem.image ? [selectedItem.image] : [],
        sizes: getAvailableSizes(selectedItem),
        inStock: true,
        featured: false,
        stockQuantity: selectedItem.quantity,
      };

      const updatedWishlist = [...parsedWishlist, wishlistProduct];
      localStorage.setItem("carrotWishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("carrot-wishlist-updated"));
    }

    setPopupText(`${selectedItem.name} moved to wishlist`);
    setSelectedItem(null);

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  const changeQuantity = (itemToUpdate: CartItem, newQuantity: number) => {
    const safeQuantity = Number(newQuantity);

    if (!safeQuantity || safeQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === itemToUpdate.id && item.size === itemToUpdate.size
        ? { ...item, quantity: safeQuantity }
        : item
    );

    updateCartStorage(updatedCart);
  };

  const changeSize = (itemToUpdate: CartItem, newSize: string) => {
    if (newSize === itemToUpdate.size) return;

    const existingMatch = cartItems.find(
      (item) =>
        item.id === itemToUpdate.id &&
        item.size === newSize &&
        !(item.id === itemToUpdate.id && item.size === itemToUpdate.size)
    );

    let updatedCart: CartItem[];

    if (existingMatch) {
      updatedCart = cartItems
        .map((item) => {
          if (item.id === existingMatch.id && item.size === existingMatch.size) {
            return {
              ...item,
              quantity:
                (Number(item.quantity) || 1) + (Number(itemToUpdate.quantity) || 1),
            };
          }
          return item;
        })
        .filter(
          (item) =>
            !(item.id === itemToUpdate.id && item.size === itemToUpdate.size)
        );

      setPopupText(
        `${itemToUpdate.name} changed to size ${newSize} and merged in cart`
      );
    } else {
      updatedCart = cartItems.map((item) =>
        item.id === itemToUpdate.id && item.size === itemToUpdate.size
          ? { ...item, size: newSize }
          : item
      );

      setPopupText(`${itemToUpdate.name} changed to size ${newSize}`);
    }

    updateCartStorage(updatedCart);

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
            Cart
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            Your Cart
          </h1>

          <p className="text-[#5f5f5f] text-base md:text-lg max-w-2xl leading-relaxed">
            Review your selected Carrot products before moving to checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-[#ece8e1] shadow-sm p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2D7A3A]/10 border border-[#2D7A3A]/20 flex items-center justify-center">
              <svg
                className="w-9 h-9 text-[#2D7A3A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.7L23 6H6"></path>
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-3">
              Your cart is empty
            </h2>

            <p className="text-[#6b6b6b] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
              You have not added any products yet. Explore the shop and add your favorite Carrot items to cart.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="bg-white rounded-[24px] border border-[#ece8e1] p-5 md:p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
                    <div className="w-full md:w-[180px] aspect-[3/4] rounded-[20px] bg-gradient-to-br from-[#F2E8DC] via-[#f6efe6] to-[#e8e2d8] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-[#C8470A]/10 border border-[#C8470A]/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                            <span className="text-[#C8470A] text-2xl font-bold">T</span>
                          </div>
                          <p className="text-xs uppercase tracking-[0.25em] text-[#7a7974]">
                            {item.imageLabel || "Carrot Product"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                        {item.name}
                      </h2>

                      <p className="text-[#C8470A] font-bold text-lg mb-4">
                        ₹
                        {typeof item.price === "number"
                          ? item.price
                          : Number(String(item.price).replace(/[^\d]/g, "")) || 0}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label
                            htmlFor={`size-${item.id}-${item.size}`}
                            className="text-sm font-semibold text-[#1A1A1A] mb-3 block"
                          >
                            Size
                          </label>

                          <select
                            id={`size-${item.id}-${item.size}`}
                            value={item.size}
                            onChange={(e) => changeSize(item, e.target.value)}
                            className="w-full sm:w-[220px] h-11 rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm font-medium text-[#1A1A1A] outline-none transition-all focus:border-[#C8470A]"
                          >
                            {getAvailableSizes(item).map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
                            Quantity
                          </p>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(item, (Number(item.quantity) || 1) - 1)
                              }
                              className="w-11 h-11 rounded-full border border-[#ddd6cb] bg-white text-[#1A1A1A] text-lg font-semibold hover:border-[#C8470A] hover:text-[#C8470A] transition-all"
                            >
                              -
                            </button>

                            <div className="min-w-[60px] h-11 px-4 rounded-full border border-[#ddd6cb] bg-[#FAFAF8] flex items-center justify-center text-sm font-semibold text-[#1A1A1A]">
                              {Number(item.quantity) || 1}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(item, (Number(item.quantity) || 1) + 1)
                              }
                              className="w-11 h-11 rounded-full border border-[#ddd6cb] bg-white text-[#1A1A1A] text-lg font-semibold hover:border-[#C8470A] hover:text-[#C8470A] transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/checkout"
                          className="inline-flex items-center justify-center bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
                        >
                          Checkout
                        </Link>

                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
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

            <div className="bg-white rounded-[24px] border border-[#ece8e1] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#7a7974] mb-2">
                    Summary
                  </p>
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">
                    Total: ₹{cartTotal}
                  </h3>
                </div>

                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center bg-[#C8470A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#b53f09] transition-all shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center">
          <div className="w-full max-w-xl bg-white rounded-t-[28px] p-6 md:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
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

            <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-3 pr-12">
              What would you like to do?
            </h3>

            <p className="text-[#5f5f5f] text-sm md:text-base leading-relaxed mb-6">
              You can remove{" "}
              <span className="font-semibold text-[#1A1A1A]">
                {selectedItem.name}
              </span>{" "}
              in size{" "}
              <span className="font-semibold text-[#1A1A1A]">
                {selectedItem.size}
              </span>{" "}
              from your cart or move it to your wishlist for later.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleMoveToWishlist}
                className="w-full bg-[#C8470A] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#b53f09] transition-all shadow-md hover:shadow-lg"
              >
                Move to Wishlist
              </button>

              <button
                type="button"
                onClick={handleRemoveOnly}
                className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}