"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { type CartItem } from "@/lib/products";

const INDIA_STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

type PaymentMethod = "COD" | "RAZORPAY";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState(false);
  const [generalMessage, setGeneralMessage] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("carrotCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const numericPrice = Number(String(item.price).replace(/[^\d]/g, "")) || 0;
      const numericQuantity = Number(item.quantity) || 1;
      return sum + numericPrice * numericQuantity;
    }, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }, [cartItems]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (errors[e.target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) next.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      next.phone = "Enter a valid 10-digit phone number";
    }
    if (!form.address1.trim()) next.address1 = "Address line 1 is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.state.trim()) next.state = "Please select a state / UT";
    if (!form.pincode.trim()) next.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode.trim())) {
      next.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const clearCartAndRedirect = (orderId: string) => {
    localStorage.removeItem("carrotCart");
    window.dispatchEvent(new Event("carrot-cart-updated"));
    setPlaced(true);
    router.push(`/order-success?orderId=${orderId}`);
  };

  const verifyRazorpayPayment = async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => {
    const response = await fetch("/api/razorpay/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpayOrderId: payload.razorpay_order_id,
        razorpayPaymentId: payload.razorpay_payment_id,
        razorpaySignature: payload.razorpay_signature,
        orderId: payload.orderId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment verification failed");
    }

    clearCartAndRedirect(payload.orderId);
  };

  const handleCodOrder = async () => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        addressLine1: form.address1,
        addressLine2: form.address2,
        city: form.city,
        state: form.state,
        postalCode: form.pincode,
        total: cartTotal,
        items: cartItems,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    clearCartAndRedirect(data.order.id);
  };

  const handleRazorpayOrder = async () => {
    if (!window.Razorpay) {
      throw new Error("Razorpay is not loaded yet. Please try again.");
    }

    const response = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        addressLine1: form.address1,
        addressLine2: form.address2,
        city: form.city,
        state: form.state,
        postalCode: form.pincode,
        total: cartTotal,
        items: cartItems,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create Razorpay order");
    }

    const options = {
      key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Carrot",
      description: `Order ${data.orderNumber}`,
      order_id: data.razorpayOrderId,
      handler: async function (response: any) {
        try {
          await verifyRazorpayPayment({
            ...response,
            orderId: data.orderId,
          });
        } catch (error: any) {
          setGeneralMessage(error.message || "Payment verification failed");
          setIsSubmitting(false);
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: {
        color: "#1A1A1A",
      },
      modal: {
        ondismiss: function () {
          setIsSubmitting(false);
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.on("payment.failed", function (response: any) {
      setGeneralMessage(
        response?.error?.description || "Payment failed. Please try again."
      );
      setIsSubmitting(false);
    });

    razorpayInstance.open();
  };

  const handlePlaceOrder = async () => {
    setGeneralMessage("");

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      if (paymentMethod === "COD") {
        await handleCodOrder();
        return;
      }

      await handleRazorpayOrder();
    } catch (error: any) {
      setGeneralMessage(
        error?.message || "Something went wrong while placing the order"
      );
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-[#5f5f5f] text-sm">Loading...</div>
      </div>
    );
  }

  if (cartItems.length === 0 && !placed) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Your cart is empty</h1>
          <p className="text-[#5f5f5f] mb-8">Add some items to your cart before checking out.</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayReady(true)}
      />

      <section className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7a7974] mb-3">Checkout</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            Secure Checkout
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg max-w-2xl leading-relaxed">
            Enter your delivery details and choose a payment method to complete your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div className="space-y-8">
            <div className="bg-white rounded-[24px] border border-[#ece8e1] p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Full Name <span className="text-[#C8470A]">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#bab9b4] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                    required
                  />
                  {errors.name && <p className="text-[#C8470A] text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Email <span className="text-[#C8470A]">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#bab9b4] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                    required
                  />
                  {errors.email && <p className="text-[#C8470A] text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Phone Number <span className="text-[#C8470A]">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#bab9b4] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                    required
                  />
                  {errors.phone && <p className="text-[#C8470A] text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Address Line 1 <span className="text-[#C8470A]">*</span>
                  </label>
                  <input
                    name="address1"
                    value={form.address1}
                    onChange={handleChange}
                    placeholder="House / Flat / Building"
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#bab9b4] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                    required
                  />
                  {errors.address1 && <p className="text-[#C8470A] text-xs mt-1">{errors.address1}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Address Line 2</label>
                  <input
                    name="address2"
                    value={form.address2}
                    onChange={handleChange}
                    placeholder="Street / Locality / Landmark (optional)"
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#bab9b4] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    City <span className="text-[#C8470A]">*</span>
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#bab9b4] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                    required
                  />
                  {errors.city && <p className="text-[#C8470A] text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    State / UT <span className="text-[#C8470A]">*</span>
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                  >
                    <option value="">Select state / UT</option>
                    {INDIA_STATES_AND_UTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-[#C8470A] text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Pincode <span className="text-[#C8470A]">*</span>
                  </label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    inputMode="numeric"
                    placeholder="6-digit pincode"
                    className="w-full h-12 px-4 rounded-xl border bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#bab9b4] focus:outline-none focus:border-[#C8470A] focus:ring-1 focus:ring-[#C8470A]/20 transition-all"
                    required
                  />
                  {errors.pincode && <p className="text-[#C8470A] text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#ece8e1] p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Payment Method</h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#2D7A3A]/30 bg-[#2D7A3A]/5"
                      : "border-[#ece8e1] bg-[#FAFAF8]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "COD" ? "border-[#2D7A3A]" : "border-[#bab9b4]"
                    }`}
                  >
                    {paymentMethod === "COD" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2D7A3A]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Cash on Delivery</p>
                    <p className="text-xs text-[#5f5f5f]">Pay when your order arrives</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-[#C8470A]/30 bg-[#C8470A]/5"
                      : "border-[#ece8e1] bg-[#FAFAF8]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "RAZORPAY" ? "border-[#C8470A]" : "border-[#bab9b4]"
                    }`}
                  >
                    {paymentMethod === "RAZORPAY" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C8470A]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Razorpay</p>
                    <p className="text-xs text-[#5f5f5f]">UPI, cards, netbanking and more</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "RAZORPAY" && (
                <p className="mt-4 text-xs text-[#5f5f5f] leading-relaxed">
                  Pay securely with Razorpay test mode first. After testing, we will switch to live keys.
                </p>
              )}
            </div>

            {generalMessage && (
              <div className="rounded-xl border border-[#C8470A]/20 bg-[#C8470A]/5 px-4 py-3">
                <p className="text-sm text-[#1A1A1A]">{generalMessage}</p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-[24px] border border-[#ece8e1] p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const numericPrice = Number(String(item.price).replace(/[^\d]/g, "")) || 0;
                  const qty = Number(item.quantity) || 1;

                  return (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F2E8DC] via-[#f6efe6] to-[#e8e2d8] flex items-center justify-center shrink-0 border border-[#ece8e1]">
                        <span className="text-[#C8470A] text-sm font-bold">T</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</p>
                        <p className="text-xs text-[#5f5f5f]">
                          Size: {item.size} · Qty: {qty}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1A1A] whitespace-nowrap">
                        ₹{numericPrice * qty}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#ece8e1] pt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5f5f5f]">Items ({totalQuantity})</span>
                  <span className="text-[#1A1A1A] font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5f5f5f]">Shipping</span>
                  <span className="text-[#2D7A3A] font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-[#ece8e1]">
                  <span className="text-[#1A1A1A]">Total</span>
                  <span className="text-[#1A1A1A]">₹{cartTotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || (paymentMethod === "RAZORPAY" && !razorpayReady)}
                className="w-full mt-6 bg-[#1A1A1A] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Processing..."
                  : paymentMethod === "COD"
                  ? "Place Order"
                  : !razorpayReady
                  ? "Loading Payment..."
                  : "Continue to Payment"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}