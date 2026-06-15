import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";

async function createHomeSlide(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const buttonText = String(formData.get("buttonText") || "").trim();
  const buttonLink = String(formData.get("buttonLink") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";

  const imageFile = formData.get("image") as File | null;
  const mobileImageFile = formData.get("mobileImage") as File | null;

  if (!title) {
    throw new Error("Title is required.");
  }

  const uploadedImage = await saveUploadedFile(imageFile, "slides");
  const uploadedMobileImage = await saveUploadedFile(mobileImageFile, "slides");

  if (!uploadedImage) {
    throw new Error("Desktop image is required.");
  }

  await prisma.homeSlide.create({
    data: {
      title,
      subtitle: subtitle || null,
      buttonText: buttonText || null,
      buttonLink: buttonLink || null,
      image: uploadedImage,
      mobileImage: uploadedMobileImage || null,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/home-slides");

  redirect("/admin/home-slides");
}

export default function AddHomeSlidePage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">Add Home Slide</h1>
          <p className="mt-2 text-sm text-[#666]">
            Create a new homepage hero slide with image, text, button, and display order.
          </p>
        </div>

        <Link
          href="/admin/home-slides"
          className="inline-flex items-center justify-center rounded-xl border border-[#ddd6cb] px-4 py-2.5 text-sm font-semibold text-[#333] transition hover:bg-[#faf7f2]"
        >
          Back to Slides
        </Link>
      </div>

      <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
        <form action={createHomeSlide} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
            >
              Slide title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="New arrivals for everyday wear"
              className="h-12 w-full rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="subtitle"
              className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
            >
              Subtitle
            </label>
            <textarea
              id="subtitle"
              name="subtitle"
              rows={3}
              placeholder="Write a short supporting message for this slide."
              className="w-full rounded-xl border border-[#ddd6cb] bg-white px-4 py-3 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
            />
          </div>

          <div>
            <label
              htmlFor="buttonText"
              className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
            >
              Button text
            </label>
            <input
              id="buttonText"
              name="buttonText"
              type="text"
              placeholder="Shop now"
              className="h-12 w-full rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
            />
          </div>

          <div>
            <label
              htmlFor="buttonLink"
              className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
            >
              Button link
            </label>
            <input
              id="buttonLink"
              name="buttonLink"
              type="text"
              placeholder="/shop"
              className="h-12 w-full rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
            >
              Upload desktop image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="block w-full rounded-xl border border-[#ddd6cb] bg-white px-4 py-3 text-sm text-[#1f1f1f] file:mr-4 file:rounded-lg file:border-0 file:bg-[#C8470A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="mobileImage"
              className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
            >
              Upload mobile image
            </label>
            <input
              id="mobileImage"
              name="mobileImage"
              type="file"
              accept="image/*"
              className="block w-full rounded-xl border border-[#ddd6cb] bg-white px-4 py-3 text-sm text-[#1f1f1f] file:mr-4 file:rounded-lg file:border-0 file:bg-[#C8470A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
            >
              Sort order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              defaultValue="0"
              className="h-12 w-full rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm text-[#1f1f1f]">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked
                className="h-4 w-4 accent-[#C8470A]"
              />
              Active slide
            </label>
          </div>

          <div className="lg:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-[#C8470A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a63b08]"
            >
              Save Slide
            </button>

            <Link
              href="/admin/home-slides"
              className="inline-flex items-center justify-center rounded-xl border border-[#ddd6cb] px-5 py-3 text-sm font-semibold text-[#333] transition hover:bg-[#faf7f2]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}