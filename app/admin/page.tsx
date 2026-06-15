import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminDashboardPage() {
  const [totalProducts, totalOrders, recentOrders, lowStockProducts, totalCategories, totalSlides] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      prisma.product.findMany({
        where: { stockQuantity: { lte: 5 } },
        orderBy: { stockQuantity: "asc" },
        take: 5,
        select: { id: true, name: true, stockQuantity: true },
      }),
      prisma.category.count(),
      prisma.homeSlide.count(),
    ]);

  const stats = [
    {
      title: "Total Products",
      value: String(totalProducts),
      description: "Products available in your store",
      href: "/admin/products",
    },
    {
      title: "Total Orders",
      value: String(totalOrders),
      description: "Orders received from customers",
      href: "/admin/orders",
    },
    {
      title: "Categories",
      value: String(totalCategories),
      description: "Product categories with their own pages and images",
      href: "/admin/categories",
    },
    {
      title: "Home Slides",
      value: String(totalSlides),
      description: "Homepage hero slides managed from admin",
      href: "/admin/home-slides",
    },
  ];

  const quickLinks = [
    {
      title: "Manage Products",
      text: "Add, edit, remove products, sizes, stock, and pricing.",
      href: "/admin/products",
    },
    {
      title: "Manage Orders",
      text: "View orders, update status, add tracking number and courier.",
      href: "/admin/orders",
    },
    {
      title: "Manage Categories",
      text: "Create and edit category names, images, banners, and descriptions.",
      href: "/admin/categories",
    },
    {
      title: "Manage Home Slides",
      text: "Control homepage banners, text, images, buttons, and slide order.",
      href: "/admin/home-slides",
    },
    {
      title: "Store Settings",
      text: "Manage brand name, logo image, tagline, and other store branding.",
      href: "/admin/settings",
    },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1f1f1f]">Dashboard</h1>
        <p className="mt-2 text-sm text-[#666]">
          Welcome to your Carrot admin panel. This is where you manage store content, products, and orders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C8470A]/30"
          >
            <p className="text-sm font-medium text-[#777]">{item.title}</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1f1f1f]">{item.value}</h2>
            <p className="mt-2 text-sm text-[#666]">{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#1f1f1f]">Store workflow</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-[#f8f5ef] p-4">
              <p className="text-sm font-semibold text-[#1f1f1f]">1. Manage homepage branding</p>
              <p className="mt-1 text-sm text-[#666]">
                Update logo, brand text, and homepage slides from admin instead of editing code.
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f5ef] p-4">
              <p className="text-sm font-semibold text-[#1f1f1f]">2. Organize catalog</p>
              <p className="mt-1 text-sm text-[#666]">
                Create categories, assign products, and keep inventory updated from the dashboard.
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f5ef] p-4">
              <p className="text-sm font-semibold text-[#1f1f1f]">3. Customer places order</p>
              <p className="mt-1 text-sm text-[#666]">
                Guest checkout is active, so customers can order without account creation.
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f5ef] p-4">
              <p className="text-sm font-semibold text-[#1f1f1f]">4. Admin fulfills order</p>
              <p className="mt-1 text-sm text-[#666]">
                Review order details, confirm shipment, and share tracking by email.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#1f1f1f]">Quick actions</h3>
          <div className="mt-5 grid gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-xl border border-[#ece6dd] p-4 transition hover:border-[#C8470A]/30 hover:bg-[#fffaf5]"
              >
                <p className="text-base font-semibold text-[#1f1f1f]">{item.title}</p>
                <p className="mt-1 text-sm text-[#666]">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#1f1f1f]">Recent orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-[#C8470A] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentOrders.length === 0 ? (
              <div className="rounded-xl bg-[#f8f5ef] p-4 text-sm text-[#666]">
                No orders yet.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-[#ece6dd] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1f1f1f]">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-xs text-[#777]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f8f5ef] px-3 py-1 text-xs font-medium text-[#1f1f1f]">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#C8470A]">
                    {formatPrice(order.total)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#1f1f1f]">Low stock alert</h3>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-[#C8470A] hover:underline"
            >
              Manage stock
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="rounded-xl bg-[#f8f5ef] p-4 text-sm text-[#666]">
                No low-stock products right now.
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-[#ece6dd] p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#1f1f1f]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-[#777]">Inventory alert</p>
                  </div>
                  <span className="rounded-full bg-[#fff3ea] px-3 py-1 text-xs font-semibold text-[#C8470A]">
                    {product.stockQuantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}