import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHomeSlidesPage() {
  const slides = await prisma.homeSlide.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">Home Slides</h1>
          <p className="mt-2 text-sm text-[#666]">
            Manage homepage hero slides, text, CTA buttons, and display order.
          </p>
        </div>

        <Link
          href="/admin/home-slides/add"
          className="inline-flex items-center justify-center rounded-xl bg-[#C8470A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a63b08]"
        >
          Add Slide
        </Link>
      </div>

      <div className="rounded-2xl border border-[#e7e1d7] bg-white shadow-sm">
        <div className="border-b border-[#eee7dd] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1f1f1f]">Slides list</h2>
        </div>

        {slides.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#777]">
            No slides yet. Create your first homepage slide.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#faf8f4]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Preview
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    CTA
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#555]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {slides.map((slide) => (
                  <tr key={slide.id} className="border-t border-[#f0ebe3]">
                    <td className="px-6 py-4">
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="h-16 w-24 rounded-xl border border-[#ece6dd] object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-[#ece6dd] bg-[#f8f5ef] text-[11px] font-medium text-[#777]">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#1f1f1f]">{slide.title}</p>
                      <p className="mt-1 text-xs text-[#777]">
                        {slide.subtitle || "No subtitle"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#555]">
                      {slide.buttonText || "No button"}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#555]">
                      {slide.sortOrder}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          slide.isActive
                            ? "bg-[#edf7ee] text-[#2d7a3a]"
                            : "bg-[#f3f3f3] text-[#777]"
                        }`}
                      >
                        {slide.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/home-slides/edit/${slide.id}`}
                          className="inline-flex items-center rounded-lg border border-[#ddd6cb] px-3 py-2 text-sm font-medium text-[#333] transition hover:bg-[#faf7f2]"
                        >
                          Edit
                        </Link>
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