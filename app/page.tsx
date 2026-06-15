import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HomeHeroSlider from "@/components/HomeHeroSlider";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function HomePage() {
  const [featuredProducts, homeSlides, settings] = await Promise.all([
    prisma.product.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    }),
    prisma.homeSlide.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.siteSettings.findFirst(),
  ]);

  const siteName = settings?.siteName || "Carrot";
  const logoText = settings?.logoText || siteName;

  const heroSlides =
    homeSlides.length > 0
      ? homeSlides.map((slide) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
          image: slide.image,
          mobileImage: slide.mobileImage,
        }))
      : [
          {
            id: "fallback-slide",
            title: logoText,
            subtitle: "Crafted with care. Defined by art.",
            buttonText: "Shop Now",
            buttonLink: "/shop",
            image: "",
            mobileImage: null,
          },
        ];

  return (
    <div className="relative bg-[#FAFAF8]">
      <HomeHeroSlider siteName={siteName} slides={heroSlides} />

      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <h2 className="mb-12 text-center text-2xl font-bold text-[#1A1A1A] md:text-3xl">
          Featured Collection
        </h2>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-10 text-center text-sm text-[#777]">
            No featured products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative mb-5 aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-[#F2E8DC] to-[#e6e4df] shadow-sm transition-all group-hover:shadow-lg">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#C8470A]/20 bg-[#C8470A]/10">
                            <span className="text-3xl font-bold text-[#C8470A]">
                              T
                            </span>
                          </div>
                          <p className="text-xs font-medium uppercase tracking-wider text-[#7a7974]">
                            {siteName} Product
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="mb-1 text-lg font-semibold text-[#1A1A1A] transition-colors hover:text-[#C8470A]">
                    {product.name}
                  </h3>
                </Link>

                <p className="mb-2 text-sm text-[#777]">
                  {product.category?.name || "Uncategorized"}
                </p>

                <p className="mb-4 text-lg font-bold text-[#C8470A]">
                  {formatPrice(product.price)}
                </p>

                <Link
                  href={`/product/${product.slug}`}
                  className="block w-full rounded-xl bg-[#1A1A1A] py-3.5 text-center text-sm font-medium text-white shadow-md transition-colors hover:bg-[#333] hover:shadow-lg"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gradient-to-r from-[#2D7A3A] to-[#1B4332] py-20 text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="1.5" />
                  <circle cx="19.5" cy="18.5" r="1.5" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">All India Delivery</h3>
              <p className="text-sm text-white/80">7-10 business days</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 1v22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Cash on Delivery</h3>
              <p className="text-sm text-white/80">Pay when you receive</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Secure Payment</h3>
              <p className="text-sm text-white/80">Razorpay powered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}