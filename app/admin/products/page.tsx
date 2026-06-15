export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/DeleteProductButton";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      sizes: true,
      inStock: true,
      stockQuantity: true,
      featured: true,
      images: true,
      createdAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">Products</h1>
          <p className="mt-2 text-sm text-[#666]">
            Manage all products, sizes, stock, and pricing from here.
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
          <h2 className="text-lg font-semibold text-[#1f1f1f]">Product list</h2>
        </div>

        {products.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#777]">
            No products yet. Create your first product from the Add Product page.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#faf8f4]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Sizes
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Featured
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-[#f0ebe3]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-14 w-14 rounded-xl border border-[#ece6dd] object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#ece6dd] bg-[#f8f5ef] text-[11px] font-medium text-[#777]">
                            No image
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#1f1f1f]">{product.name}</p>
                          <p className="mt-1 text-xs text-[#777]">{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#555]">
                      {product.category?.name || "Uncategorized"}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[#555]">
                      {formatPrice(product.price)}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#555]">
                      {product.sizes?.length ? product.sizes.join(", ") : "No sizes"}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#555]">
                      {product.inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#555]">
                      {product.featured ? "Yes" : "No"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="inline-flex items-center rounded-lg border border-[#ddd6cb] px-3 py-2 text-sm font-medium text-[#333] transition hover:bg-[#faf7f2]"
                        >
                          Edit
                        </Link>

                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
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