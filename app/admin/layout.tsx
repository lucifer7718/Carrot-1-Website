import Link from "next/link";
import type { ReactNode } from "react";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#1f1f1f]">
      <div className="flex min-h-screen">
        <aside className="w-[260px] border-r border-[#e5e2db] bg-white px-6 py-8">
          <Link href="/admin" className="block">
            <h1 className="text-2xl font-bold text-[#C8470A]">Carrot Admin</h1>
          </Link>

          <p className="mt-2 text-sm text-[#6b6b6b]">
            Manage products, orders, customers, and settings.
          </p>

          <nav className="mt-8">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-[#2b2b2b] transition hover:bg-[#f3efe7] hover:text-[#C8470A]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-[#e5e2db] bg-white px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8a8a]">
                  Admin Panel
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[#1f1f1f]">
                  Carrot Store Dashboard
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="rounded-xl border border-[#ded8cf] px-4 py-2 text-sm font-medium text-[#2b2b2b] transition hover:border-[#C8470A] hover:text-[#C8470A]"
                >
                  View Store
                </Link>

                <AdminLogoutButton />
              </div>
            </div>
          </header>

          <main className="px-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}