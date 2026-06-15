import { notFound } from "next/navigation";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClasses(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-[#fff3ea] text-[#C8470A]";
    case "PAID":
      return "bg-[#eef7ee] text-[#2D7A3A]";
    case "SHIPPED":
      return "bg-[#eef4ff] text-[#1d4ed8]";
    case "DELIVERED":
      return "bg-[#f0fdf4] text-[#15803d]";
    case "CANCELLED":
      return "bg-[#fef2f2] text-[#b91c1c]";
    default:
      return "bg-[#f5f5f5] text-[#555]";
  }
}

const orderWithItems = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    items: {
      include: {
        product: true,
      },
    },
  },
});

type OrderWithItems = Prisma.OrderGetPayload<typeof orderWithItems>;

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order: OrderWithItems | null = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-[#C8470A] hover:underline"
          >
            Back to orders
          </Link>

          <h1 className="mt-2 text-3xl font-bold text-[#1f1f1f]">
            Order #{order.id.slice(0, 8)}
          </h1>

          <p className="mt-2 text-sm text-[#666]">
            View customer details, order items, payment status, and shipment information.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${statusClasses(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-semibold text-[#1f1f1f]">Order items</h2>

          <div className="mt-5 space-y-4">
            {order.items.length === 0 ? (
              <div className="rounded-xl bg-[#f8f5ef] p-4 text-sm text-[#666]">
                No items found in this order.
              </div>
            ) : (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#ece6dd] p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl border border-[#ece6dd] object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-[#ece6dd] bg-[#f8f5ef] text-sm font-semibold text-[#777]">
                          No image
                        </div>
                      )}

                      <div>
                        <p className="text-base font-semibold text-[#1f1f1f]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-[#666]">
                          Quantity: {item.quantity}
                        </p>
                        <p className="mt-1 text-sm text-[#666]">
                          Size: {item.size || "Not selected"}
                        </p>
                        <p className="mt-1 text-sm text-[#666]">
                          Unit price: {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-[#777]">Line total</p>
                      <p className="mt-1 text-base font-semibold text-[#1f1f1f]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1f1f1f]">Customer</h2>

            <div className="mt-5 space-y-3 text-sm text-[#444]">
              <div>
                <p className="font-semibold text-[#1f1f1f]">Name</p>
                <p className="mt-1">{order.customerName}</p>
              </div>

              <div>
                <p className="font-semibold text-[#1f1f1f]">Email</p>
                <p className="mt-1">{order.email}</p>
              </div>

              <div>
                <p className="font-semibold text-[#1f1f1f]">Phone</p>
                <p className="mt-1">{order.phone}</p>
              </div>

              <div>
                <p className="font-semibold text-[#1f1f1f]">Address</p>
                <p className="mt-1 text-[#777]">
                  Address field is not available in your current order model.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1f1f1f]">Order summary</h2>

            <div className="mt-5 space-y-3 text-sm text-[#444]">
              <div className="flex items-center justify-between">
                <span>Order ID</span>
                <span className="font-medium text-[#1f1f1f]">
                  #{order.id.slice(0, 8)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Order date</span>
                <span className="font-medium text-[#1f1f1f]">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Payment</span>
                <span className="font-medium text-[#1f1f1f]">{order.status}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total items</span>
                <span className="font-medium text-[#1f1f1f]">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className="border-t border-[#eee7dd] pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1f1f1f]">Total amount</span>
                  <span className="text-lg font-bold text-[#C8470A]">
                    {formatPrice(
                      order.items.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1f1f1f]">Shipment</h2>

            <div className="mt-5 space-y-3 text-sm text-[#444]">
              <div>
                <p className="font-semibold text-[#1f1f1f]">Courier</p>
                <p className="mt-1">{order.courierName || "Not added yet"}</p>
              </div>

              <div>
                <p className="font-semibold text-[#1f1f1f]">Tracking number</p>
                <p className="mt-1">{order.trackingNumber || "Not added yet"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}