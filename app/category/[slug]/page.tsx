import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: {
          inStock: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#7a7974]">
            Category
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link href="/shop" className="text-sm text-[#C8470A] hover:underline">
              Shop
            </Link>
            <span className="text-sm text-[#999]">/</span>
            <span className="text-sm text-[#666]">{category.name}</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">
            {category.name}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-[#5f5f5f] md:text-lg">
            Explore products available in the {category.name} category.
          </p>
        </div>

        {category.products.length === 0 ? (
          <div className="rounded-2xl border border-[#ece8e1] bg-white p-10 text-center text-sm text-[#666]">
            No products available in this category right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {category.products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-[24px] border border-[#ece8e1] bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2E8DC] via-[#f6efe6] to-[#e8e2d8]">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
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

                <div className="p-6">
                  <Link href={`/product/${product.slug}`} className="block">
                    <h2 className="mb-2 text-xl font-semibold text-[#1A1A1A] transition-colors hover:text-[#C8470A]">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mb-3 text-lg font-bold text-[#C8470A]">
                    {formatPrice(product.price)}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {product.sizes?.map((size) => (
                      <span
                        key={size}
                        className="rounded-full border border-[#ddd6cb] bg-[#FAFAF8] px-3 py-1 text-xs font-medium text-[#5f5f5f]"
                      >
                        {size}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#1A1A1A] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2a2a2a] hover:shadow-lg"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}