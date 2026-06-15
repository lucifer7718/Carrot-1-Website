"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  image: string;
  mobileImage: string | null;
};

type HomeHeroSliderProps = {
  siteName: string;
  slides: Slide[];
};

export default function HomeHeroSlider({
  siteName,
  slides,
}: HomeHeroSliderProps) {
  const safeSlides = useMemo(() => slides.filter((slide) => !!slide), [slides]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = safeSlides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  if (totalSlides === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[620px]">
        {safeSlides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {slide.image ? (
                <>
                  <picture>
                    {slide.mobileImage ? (
                      <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
                    ) : null}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-black/35" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8470A] via-[#E85D04] to-[#F48C06]" />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="mx-auto max-w-4xl px-6 text-center text-white">
                  <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-white/85">
                    {siteName}
                  </p>

                  <h1 className="mb-5 text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl xl:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                    {slide.subtitle || "Explore the latest collection from our store."}
                  </p>

                  <Link
                    href={slide.buttonLink || "/shop"}
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-lg transition-all hover:scale-[1.02] hover:bg-[#f6f2eb]"
                  >
                    {slide.buttonText || "Shop Now"}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {totalSlides > 1 ? (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              aria-label="Previous slide"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              aria-label="Next slide"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
              {safeSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}