import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";

async function updateHomeSlide(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const buttonText = String(formData.get("buttonText") || "").trim();
  const buttonLink = String(formData.get("buttonLink") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";

  const imageFile = formData.get("image") as File | null;
  const mobileImageFile = formData.get("mobileImage") as File | null;

  if (!id) {
    throw new Error("Slide ID is missing.");
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  const existing = await prisma.homeSlide.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Slide not found.");
  }

  const uploadedImage = await saveUploadedFile(imageFile, "slides");
  const uploadedMobileImage = await saveUploadedFile(mobileImageFile, "slides");

  await prisma.homeSlide.update({
    where: { id },
    data: {
      title,
      subtitle: subtitle || null,
      buttonText: buttonText || null,
      buttonLink: buttonLink || null,
      image: uploadedImage || existing.image,
      mobileImage: uploadedMobileImage || existing.mobileImage || null,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/home-slides");
  revalidatePath(`/admin/home-slides/edit/${id}`);

  redirect("/admin/home-slides");
}

async function deleteHomeSlide(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Slide ID is missing.");
  }

  await prisma.homeSlide.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/home-slides");

  redirect("/admin/home-slides");
}

export default async function EditHomeSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const slide = await prisma.homeSlide.findUnique({
    where: { id },
  });

  if (!slide) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">Edit Home Slide</h1>
          <p className="mt-2 text-sm text-[#666]">
            Update the content, image, order, and visibility of this homepage slide.
          </p>
        </div>

        <Link
          href="/admin/home-slides"
          className="inline-flex items-center justify-center rounded-xl border border-[#ddd6cb] px-4 py-2.5 text-sm font-semibold text-[#333] transition hover:bg-[#faf7f2]"
        >
          Back to Slides
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
          <form action={updateHomeSlide} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <input type="hidden" name="id" value={slide.id} />

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
                defaultValue={slide.title}
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
                defaultValue={slide.subtitle || ""}
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
                defaultValue={slide.buttonText || ""}
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
                defaultValue={slide.buttonLink || ""}
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
              />
              <img
                src={slide.image}
                alt={slide.title}
                className="mt-3 h-20 w-32 rounded-xl border border-[#ece6dd] object-cover"
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
              {slide.mobileImage ? (
                <img
                  src={slide.mobileImage}
                  alt={`${slide.title} mobile`}
                  className="mt-3 h-20 w-32 rounded-xl border border-[#ece6dd] object-cover"
                />
              ) : null}
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
                defaultValue={slide.sortOrder}
                className="h-12 w-full rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm text-[#1f1f1f]">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={slide.isActive}
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
                Update Slide
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

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1f1f]">Preview</h2>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[#ece6dd] bg-[#faf8f4]">
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-52 w-full object-cover"
                />
              ) : null}

              <div className="p-5">
                <p className="text-xl font-bold text-[#1f1f1f]">{slide.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#666]">
                  {slide.subtitle || "No subtitle added yet."}
                </p>

                {slide.buttonText ? (
                  <span className="mt-4 inline-flex rounded-xl bg-[#C8470A] px-4 py-2 text-sm font-semibold text-white">
                    {slide.buttonText}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f1d7c9] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#8a2f06]">Danger zone</h2>
            <p className="mt-2 text-sm text-[#666]">
              Delete this slide if you no longer want it available in homepage management.
            </p>

            <form action={deleteHomeSlide} className="mt-5">
              <input type="hidden" name="id" value={slide.id} />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-[#b93815] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#962d0e]"
              >
                Delete Slide
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}