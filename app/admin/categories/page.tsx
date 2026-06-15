import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">Categories</h1>
          <p className="mt-2 text-sm text-[#666]">
            View all product categories used in your store.
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="inline-flex items-center justify-center rounded-xl bg-[#C8470A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a63b08]"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-2xl border border-[#e7e1d7] bg-white shadow-sm">
        <div className="border-b border-[#eee7dd] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1f1f1f]">Category list</h2>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#777]">
            No categories yet. Categories will appear automatically when you add products.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#faf8f4]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Store View
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category: any) => (
                  <tr key={category.id} className="border-t border-[#f0ebe3]">
                    <td className="px-6 py-4 text-sm font-semibold text-[#1f1f1f]">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#666]">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#666]">
                      {category._count.products}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/category/${category.slug}`}
                        className="inline-flex items-center rounded-lg border border-[#ddd6cb] px-3 py-2 text-sm font-medium text-[#333] transition hover:bg-[#faf7f2]"
                      >
                        Open Category
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}