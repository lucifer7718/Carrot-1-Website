"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
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
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type WishlistItem = Product;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [popupText, setPopupText] = useState("");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load shop products", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();

    const existingWishlist = localStorage.getItem("carrotWishlist");
    const parsedWishlist: WishlistItem[] = existingWishlist
      ? JSON.parse(existingWishlist)
      : [];
    setWishlistIds(parsedWishlist.map((item) => item.id));

    const existingCart = localStorage.getItem("carrotCart");
    const parsedCart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
    setCartItems(parsedCart);
  }, []);

  const handleWishlistToggle = (product: Product) => {
    const existingWishlist = localStorage.getItem("carrotWishlist");
    const parsedWishlist: WishlistItem[] = existingWishlist
      ? JSON.parse(existingWishlist)
      : [];

    const alreadyExists = parsedWishlist.some((item) => item.id === product.id);

    if (alreadyExists) {
      const updatedWishlist = parsedWishlist.filter(
        (item) => item.id !== product.id
      );
      localStorage.setItem("carrotWishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("carrot-wishlist-updated"));
      setWishlistIds(updatedWishlist.map((item) => item.id));
      setPopupText(`${product.name} removed from wishlist`);
    } else {
      const updatedWishlist = [...parsedWishlist, product];
      localStorage.setItem("carrotWishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("carrot-wishlist-updated"));
      setWishlistIds(updatedWishlist.map((item) => item.id));
      setPopupText(`${product.name} added to wishlist`);
    }

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  const openSizePopup = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] ?? null);
    setSelectedQuantity(1);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedProduct || !selectedSize) {
      setPopupText("Please select a size");
      setTimeout(() => setPopupText(""), 2000);
      return;
    }

    const existingCart = localStorage.getItem("carrotCart");
    const parsedCart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingIndex = parsedCart.findIndex(
      (item) =>
        item.id === selectedProduct.id && item.size === selectedSize
    );

    let updatedCart: CartItem[];

    if (existingIndex !== -1) {
      updatedCart = [...parsedCart];
      updatedCart[existingIndex].quantity += selectedQuantity;
      setPopupText(`${selectedProduct.name} quantity updated in cart`);
    } else {
      const newCartItem: CartItem = {
        id: selectedProduct.id,
        slug: selectedProduct.slug,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.images?.[0] || "",
        size: selectedSize,
        quantity: selectedQuantity,
      };

      updatedCart = [...parsedCart, newCartItem];
      setPopupText(`${selectedProduct.name} added to cart`);
    }

    localStorage.setItem("carrotCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("carrot-cart-updated"));
    setCartItems(updatedCart);
    setSelectedProduct(null);
    setSelectedSize(null);
    setSelectedQuantity(1);

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  const isVariantInCart = (productId: string, size: string) => {
    return cartItems.some((item) => item.id === productId && item.size === size);
  };

  const totalProductQuantity = (productId: string) => {
    return cartItems
      .filter((item) => item.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAF8]">
      {popupText && (
        <div className="fixed right-6 top-24 z-50 rounded-xl bg-[#1A1A1A] px-5 py-3 text-sm font-medium text-white shadow-xl">
          {popupText}
        </div>
      )}

      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#7a7974]">
            Shop
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">
            Carrot T-Shirts
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-[#5f5f5f] md:text-lg">
            Discover premium Carrot essentials with a minimal aesthetic, clean finishes, and everyday comfort.
          </p>
        </div>

        {loadingProducts ? (
          <div className="rounded-2xl border border-[#ece8e1] bg-white p-10 text-center text-sm text-[#666]">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[#ece8e1] bg-white p-10 text-center text-sm text-[#666]">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const productQty = totalProductQuantity(product.id);

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-[24px] border border-[#ece8e1] bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => handleWishlistToggle(product)}
                      aria-label="Toggle wishlist"
                      className={`absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border shadow-md transition-all ${
                        isWishlisted
                          ? "border-[#C8470A] bg-[#C8470A] text-white"
                          : "border-[#e8dfd2] bg-white text-[#1A1A1A] hover:border-[#C8470A] hover:text-[#C8470A]"
                      }`}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20.5s-6.8-4.4-9.1-8.1C1.2 9.8 2.3 5.8 6 5.3c2-.2 3.5.8 4.3 2 .8-1.2 2.3-2.2 4.3-2 3.7.5 4.8 4.5 3.1 7.1-2.3 3.7-9.1 8.1-9.1 8.1z" />
                      </svg>
                    </button>

                    <Link href={`/product/${product.slug}`} className="block">
                      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2E8DC] via-[#f6efe6] to-[#e8e2d8]">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="relative z-10 text-center">
                            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border border-[#C8470A]/20 bg-[#C8470A]/10 shadow-inner">
                              <span className="text-3xl font-bold text-[#C8470A]">T</span>
                            </div>

                            <p className="text-xs uppercase tracking-[0.25em] text-[#7a7974]">
                              Carrot Product
                            </p>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <Link href={`/product/${product.slug}`} className="block">
                        <h2 className="mb-1 text-xl font-semibold text-[#1A1A1A] transition-colors hover:text-[#C8470A]">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mb-3 text-lg font-bold text-[#C8470A]">
                        ₹{product.price}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              isVariantInCart(product.id, size)
                                ? "border-[#2D7A3A] bg-[#2D7A3A] text-white"
                                : "border-[#ddd6cb] bg-[#FAFAF8] text-[#5f5f5f]"
                            }`}
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openSizePopup(product)}
                      className={`w-full rounded-xl py-3.5 text-sm font-semibold shadow-md transition-all hover:shadow-lg ${
                        productQty > 0
                          ? "bg-[#2D7A3A] text-white"
                          : "bg-[#1A1A1A] text-white hover:bg-[#2a2a2a]"
                      }`}
                    >
                      {productQty > 0 ? `In Cart (${productQty})` : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
          <div className="relative w-full max-w-xl rounded-t-[28px] bg-white p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null);
                setSelectedSize(null);
                setSelectedQuantity(1);
              }}
              aria-label="Close popup"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd6cb] bg-[#FAFAF8] text-[#1A1A1A] transition-all hover:border-[#1A1A1A]"
            >
              <svg
                className="h-5 w-5"
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

            <h3 className="mb-2 pr-12 text-2xl font-semibold text-[#1A1A1A]">
              Select options
            </h3>

            <p className="mb-6 text-sm leading-relaxed text-[#5f5f5f] md:text-base">
              Choose size and quantity for{" "}
              <span className="font-semibold text-[#1A1A1A]">
                {selectedProduct.name}
              </span>
              .
            </p>

            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Size</p>

              <div className="flex flex-wrap gap-3">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 min-w-[48px] rounded-full border px-5 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-[#ddd6cb] bg-white text-[#1A1A1A] hover:border-[#C8470A] hover:text-[#C8470A]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">
                Quantity
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedQuantity((prev) => Math.max(1, prev - 1))
                  }
                  className="h-12 w-12 rounded-full border border-[#ddd6cb] bg-white text-lg font-semibold text-[#1A1A1A] transition-all hover:border-[#C8470A] hover:text-[#C8470A]"
                >
                  -
                </button>

                <div className="flex h-12 min-w-[64px] items-center justify-center rounded-full border border-[#ddd6cb] bg-white px-4 text-sm font-semibold text-[#1A1A1A]">
                  {selectedQuantity}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedQuantity((prev) => prev + 1)}
                  className="h-12 w-12 rounded-full border border-[#ddd6cb] bg-white text-lg font-semibold text-[#1A1A1A] transition-all hover:border-[#C8470A] hover:text-[#C8470A]"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAddToCart}
              className="w-full rounded-xl bg-[#1A1A1A] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2a2a2a] hover:shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}