"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  size: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  status: string;
  items: OrderItem[];
};

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (response.ok) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("LOAD_ORDER_ERROR", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm text-[#5f5f5f]">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">Order not found</h1>
          <Link href="/shop" className="text-[#C8470A] text-sm font-medium hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="max-w-[800px] mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2D7A3A]/10 border border-[#2D7A3A]/20 flex items-center justify-center">
            <svg
              className="w-9 h-9 text-[#2D7A3A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            Order Placed
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Thank you, {order.customerName}. Your order has been placed successfully.
          </p>
        </div>

        <div className="bg-white rounded-[24px] border border-[#ece8e1] p-6 md:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-[#5f5f5f] mb-1">Order ID</p>
              <p className="text-lg font-bold text-[#1A1A1A]">{order.orderNumber}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-[#5f5f5f] mb-1">Date</p>
              <p className="text-sm font-medium text-[#1A1A1A]">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="border-t border-[#ece8e1] pt-5 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F2E8DC] via-[#f6efe6] to-[#e8e2d8] flex items-center justify-center shrink-0 border border-[#ece8e1]">
                  <span className="text-[#C8470A] text-sm font-bold">T</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</p>
                  <p className="text-xs text-[#5f5f5f]">
                    Size: {item.size || "—"} · Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#1A1A1A] whitespace-nowrap">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#ece8e1] mt-5 pt-5">
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-[#1A1A1A]">Total</span>
              <span className="text-[#1A1A1A]">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-[#ece8e1] p-6 md:p-8 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Delivery Address</h2>
          <div className="text-sm text-[#1A1A1A] leading-relaxed">
            <p className="font-medium">{order.customerName}</p>
            <p className="text-[#5f5f5f]">{order.addressLine1}</p>
            {order.addressLine2 && <p className="text-[#5f5f5f]">{order.addressLine2}</p>}
            <p className="text-[#5f5f5f]">
              {order.city}, {order.state} — {order.postalCode}
            </p>
            <p className="text-[#5f5f5f] mt-2">{order.phone}</p>
            <p className="text-[#5f5f5f]">{order.email}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-all shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center bg-[#FAFAF8] text-[#1A1A1A] px-8 py-3.5 rounded-xl text-sm font-semibold border border-[#ddd6cb] hover:border-[#C8470A] hover:text-[#C8470A] transition-all"
          >
            View Cart
          </Link>
        </div>
      </section>
    </div>
  );
}