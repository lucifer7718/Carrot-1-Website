"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  size: string | null;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  total: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber: string | null;
  courierName: string | null;
  createdAt: string;
  items: OrderItem[];
};

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const INDIA_STATES_AND_UTS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load orders");
        setLoading(false);
        return;
      }

      setOrders(data.orders || []);
      setError("");
    } catch {
      setError("Something went wrong while loading orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateOrder(
    orderId: string,
    payload: Record<string, string>
  ) {
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update order");
        return;
      }

      setMessage("Order updated successfully");
      await loadOrders();
    } catch {
      setError("Something went wrong while updating the order");
    }
  }

  async function deleteOrder(orderId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete order");
        return;
      }

      setMessage("Order deleted successfully");
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch {
      setError("Something went wrong while deleting the order");
    }
  }

  if (loading) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-[#1f1f1f]">Orders</h1>
        <p className="mt-4 text-sm text-[#666]">Loading orders...</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1f1f1f]">Orders</h1>
        <p className="mt-2 text-sm text-[#666]">
          View, edit, and delete customer orders.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm text-sm text-[#666]">
          No orders found.
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdate={updateOrder}
              onDelete={deleteOrder}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function OrderCard({
  order,
  onUpdate,
  onDelete,
}: {
  order: Order;
  onUpdate: (orderId: string, payload: Record<string, string>) => Promise<void>;
  onDelete: (orderId: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    addressLine1: order.addressLine1,
    addressLine2: order.addressLine2 || "",
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    status: order.status,
    courierName: order.courierName || "",
    trackingNumber: order.trackingNumber || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      await onUpdate(order.id, {
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        status: form.status,
        courierName: form.courierName,
        trackingNumber: form.trackingNumber,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[#777]">{order.orderNumber}</p>
          <h2 className="text-xl font-semibold text-[#1f1f1f]">
            {order.customerName}
          </h2>
          <p className="text-sm text-[#666]">
            {order.email} · {order.phone}
          </p>
          <p className="text-sm text-[#666]">
            {order.addressLine1}
            {order.addressLine2 ? `, ${order.addressLine2}` : ""}
          </p>
          <p className="text-sm text-[#666]">
            {order.city}, {order.state} - {order.postalCode}
          </p>
          <p className="text-sm text-[#666]">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
          <p className="text-base font-semibold text-[#C8470A]">
            {formatPrice(order.total)}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : order.status === "SHIPPED"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
            {order.trackingNumber && (
              <span className="text-xs text-[#777]">
                Tracking: {order.trackingNumber}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-xl border border-[#ddd6cb] bg-[#FAFAF8] px-5 py-3 text-sm font-semibold text-[#1f1f1f] transition hover:border-[#C8470A] hover:text-[#C8470A]"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 border-t border-[#eee7dd] pt-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Customer Name
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              >
                {ORDER_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Address Line 1
              </label>
              <input
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Address Line 2
              </label>
              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                State / UT
              </label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              >
                {INDIA_STATES_AND_UTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Pincode
              </label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Courier Name
              </label>
              <input
                name="courierName"
                value={form.courierName}
                onChange={handleChange}
                placeholder="e.g. Delhivery"
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Tracking Number
              </label>
              <input
                name="trackingNumber"
                value={form.trackingNumber}
                onChange={handleChange}
                placeholder="e.g. TRK123456789"
                className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[#C8470A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a63b08] disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-[#eee7dd] pt-5">
        <h3 className="text-sm font-semibold text-[#1f1f1f]">Order items</h3>
        <div className="mt-3 space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-[#faf7f2] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[#1f1f1f]">{item.name}</p>
                <p className="text-xs text-[#777]">
                  Qty: {item.quantity} · Size: {item.size || "N/A"}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#1f1f1f]">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}