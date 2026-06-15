"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [popupText, setPopupText] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();

        if (!response.ok) {
          setProduct(null);
          return;
        }

        const foundProduct =
          (data.products || []).find((item: Product) => item.slug === slug) || null;

        setProduct(foundProduct);
      } catch (error) {
        console.error("Failed to load product", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    setSelectedSize(product.sizes?.[0] ?? null);

    const existingWishlist = localStorage.getItem("carrotWishlist");
    const parsedWishlist: WishlistItem[] = existingWishlist
      ? JSON.parse(existingWishlist)
      : [];
    setIsWishlisted(parsedWishlist.some((item) => item.id === product.id));

    const existingCart = localStorage.getItem("carrotCart");
    const parsedCart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
    setIsInCart(
      parsedCart.some(
        (item) => item.id === product.id && item.size === (product.sizes?.[0] ?? null)
      )
    );
  }, [product]);

  useEffect(() => {
    if (!product || !selectedSize) return;

    const existingCart = localStorage.getItem("carrotCart");
    const parsedCart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    setIsInCart(
      parsedCart.some((item) => item.id === product.id && item.size === selectedSize)
    );
  }, [product, selectedSize]);

  const primaryImage = useMemo(() => {
    return product?.images?.[0] || "";
  }, [product]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-6">
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold text-[#1A1A1A]">Loading product...</h1>
          <p className="text-[#5f5f5f]">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-6">
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold text-[#1A1A1A]">Product not found</h1>
          <p className="text-[#5f5f5f]">This product does not exist.</p>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    const existingWishlist = localStorage.getItem("carrotWishlist");
    const parsedWishlist: WishlistItem[] = existingWishlist
      ? JSON.parse(existingWishlist)
      : [];

    const alreadyExists = parsedWishlist.some((item) => item.id === product.id);

    if (alreadyExists) {
      const updatedWishlist = parsedWishlist.filter((item) => item.id !== product.id);
      localStorage.setItem("carrotWishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("carrot-wishlist-updated"));
      setIsWishlisted(false);
      setPopupText(`${product.name} removed from wishlist`);
    } else {
      const updatedWishlist = [...parsedWishlist, product];
      localStorage.setItem("carrotWishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("carrot-wishlist-updated"));
      setIsWishlisted(true);
      setPopupText(`${product.name} added to wishlist`);
    }

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setPopupText("Please select a size");
      setTimeout(() => setPopupText(""), 2000);
      return;
    }

    const existingCart = localStorage.getItem("carrotCart");
    const parsedCart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingIndex = parsedCart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingIndex !== -1) {
      const updatedCart = [...parsedCart];
      updatedCart[existingIndex].quantity += quantity;
      localStorage.setItem("carrotCart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("carrot-cart-updated"));
      setPopupText(`${product.name} quantity updated in cart`);
    } else {
      const cartItem: CartItem = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: primaryImage,
        size: selectedSize,
        quantity,
      };

      const updatedCart = [...parsedCart, cartItem];
      localStorage.setItem("carrotCart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("carrot-cart-updated"));
      setPopupText(`${product.name} added to cart`);
    }

    setIsInCart(true);

    setTimeout(() => {
      setPopupText("");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAF8]">
      {popupText && (
        <div className="fixed right-6 top-24 z-50 rounded-xl bg-[#1A1A1A] px-5 py-3 text-sm font-medium text-white shadow-xl">
          {popupText}
        </div>
      )}

      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[28px] border border-[#ece8e1] bg-gradient-to-br from-[#F2E8DC] via-[#f6efe6] to-[#e8e2d8] shadow-sm">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-36 w-36 items-center justify-center rounded-full border border-[#C8470A]/20 bg-[#C8470A]/10 shadow-inner">
                  <span className="text-5xl font-bold text-[#C8470A]">T</span>
                </div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#7a7974]">
                  Carrot Product
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#7a7974]">
              Carrot
            </p>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-3">
              <p className="text-2xl font-bold text-[#C8470A]">₹{product.price}</p>
              {product.comparePrice ? (
                <p className="text-lg text-[#7a7974] line-through">
                  ₹{product.comparePrice}
                </p>
              ) : null}
            </div>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-[#5f5f5f] md:text-lg">
              {product.description}
            </p>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">
                Select Size
              </p>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
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
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="h-12 w-12 rounded-full border border-[#ddd6cb] bg-white text-lg font-semibold text-[#1A1A1A] transition-all hover:border-[#C8470A] hover:text-[#C8470A]"
                >
                  -
                </button>

                <div className="flex h-12 min-w-[64px] items-center justify-center rounded-full border border-[#ddd6cb] bg-white px-4 text-sm font-semibold text-[#1A1A1A]">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="h-12 w-12 rounded-full border border-[#ddd6cb] bg-white text-lg font-semibold text-[#1A1A1A] transition-all hover:border-[#C8470A] hover:text-[#C8470A]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 rounded-xl py-4 text-sm font-semibold transition-all shadow-md hover:shadow-lg ${
                  isInCart
                    ? "bg-[#2D7A3A] text-white"
                    : "bg-[#1A1A1A] text-white hover:bg-[#2a2a2a]"
                }`}
              >
                {isInCart ? "Update Cart" : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`py-4 text-sm font-semibold transition-all sm:w-[180px] rounded-xl border ${
                  isWishlisted
                    ? "border-[#C8470A] bg-[#C8470A] text-white"
                    : "border-[#ddd6cb] bg-white text-[#1A1A1A] hover:border-[#C8470A] hover:text-[#C8470A]"
                }`}
              >
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#ece8e1] bg-white p-5">
                <p className="mb-1 text-sm font-semibold text-[#1A1A1A]">Delivery</p>
                <p className="text-sm text-[#5f5f5f]">All India Delivery</p>
              </div>

              <div className="rounded-2xl border border-[#ece8e1] bg-white p-5">
                <p className="mb-1 text-sm font-semibold text-[#1A1A1A]">Payment</p>
                <p className="text-sm text-[#5f5f5f]">COD Available</p>
              </div>

              <div className="rounded-2xl border border-[#ece8e1] bg-white p-5">
                <p className="mb-1 text-sm font-semibold text-[#1A1A1A]">Timeline</p>
                <p className="text-sm text-[#5f5f5f]">7-10 Days Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}