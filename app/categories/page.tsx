import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: {
            where: {
              inStock: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#7a7974]">
            Browse
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">
            Categories
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-[#5f5f5f] md:text-lg">
            Explore all product categories available in the store.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-[#ece8e1] bg-white p-10 text-center text-sm text-[#666]">
            No categories available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group rounded-[24px] border border-[#ece8e1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8470A]/10 text-[#C8470A]">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7h18" />
                    <path d="M6 3h12l2 4H4l2-4Z" />
                    <path d="M5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
                  </svg>
                </div>

                <h2 className="mb-2 text-2xl font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#C8470A]">
                  {category.name}
                </h2>

                <p className="mb-4 text-sm text-[#6b6b6b]">
                  {category._count.products} product
                  {category._count.products === 1 ? "" : "s"}
                </p>

                <span className="inline-flex items-center text-sm font-semibold text-[#C8470A]">
                  View category
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}