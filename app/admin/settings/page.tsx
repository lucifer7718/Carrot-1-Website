import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function ensureAdmin() {
  "use server";

  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin-auth");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminCookie || adminCookie.value !== adminPassword) {
    throw new Error("Unauthorized");
  }
}

async function fileToDataUrl(file: File | null) {
  "use server";

  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/png";

  return `data:${mimeType};base64,${base64}`;
}

async function saveSiteSettings(formData: FormData) {
  "use server";

  await ensureAdmin();

  const siteName = String(formData.get("siteName") || "").trim();
  const logoText = String(formData.get("logoText") || "").trim();
  const headerTagline = String(formData.get("headerTagline") || "").trim();

  const logoFile = formData.get("logoImage") as File | null;
  const faviconFile = formData.get("favicon") as File | null;

  const existing = await prisma.siteSettings.findFirst();

  const uploadedLogo = await fileToDataUrl(logoFile);
  const uploadedFavicon = await fileToDataUrl(faviconFile);

  await prisma.siteSettings.upsert({
    where: { id: existing?.id || "default-site-settings" },
    update: {
      siteName: siteName || "Carrot",
      logoText: logoText || "Carrot",
      logoImage: uploadedLogo || existing?.logoImage || null,
      headerTagline: headerTagline || "Crafted with care. Defined by art.",
      favicon: uploadedFavicon || existing?.favicon || null,
    },
    create: {
      id: existing?.id || "default-site-settings",
      siteName: siteName || "Carrot",
      logoText: logoText || "Carrot",
      logoImage: uploadedLogo || null,
      headerTagline: headerTagline || "Crafted with care. Defined by art.",
      favicon: uploadedFavicon || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/shop");
  revalidatePath("/about");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1f1f1f]">Settings</h1>
        <p className="mt-2 text-sm text-[#666]">
          Manage your store branding, logo, favicon, and shared site details from here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1f1f1f]">Brand settings</h2>

          <form action={saveSiteSettings} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="siteName"
                className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
              >
                Site name
              </label>
              <input
                id="siteName"
                name="siteName"
                type="text"
                defaultValue={settings?.siteName || "Carrot"}
                placeholder="Carrot"
                className="h-12 w-full rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label
                htmlFor="logoText"
                className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
              >
                Logo text
              </label>
              <input
                id="logoText"
                name="logoText"
                type="text"
                defaultValue={settings?.logoText || "Carrot"}
                placeholder="Carrot"
                className="h-12 w-full rounded-xl border border-[#ddd6cb] bg-white px-4 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label
                htmlFor="logoImage"
                className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
              >
                Upload logo image
              </label>
              <input
                id="logoImage"
                name="logoImage"
                type="file"
                accept="image/*"
                className="block w-full rounded-xl border border-[#ddd6cb] bg-white px-4 py-3 text-sm text-[#1f1f1f] file:mr-4 file:rounded-lg file:border-0 file:bg-[#C8470A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {settings?.logoImage ? (
                <img
                  src={settings.logoImage}
                  alt={settings.siteName || "Logo"}
                  className="mt-3 h-14 w-auto rounded-lg border border-[#ece6dd] object-contain"
                />
              ) : null}
            </div>

            <div>
              <label
                htmlFor="headerTagline"
                className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
              >
                Tagline
              </label>
              <textarea
                id="headerTagline"
                name="headerTagline"
                defaultValue={
                  settings?.headerTagline || "Crafted with care. Defined by art."
                }
                rows={3}
                placeholder="Crafted with care. Defined by art."
                className="w-full rounded-xl border border-[#ddd6cb] bg-white px-4 py-3 text-sm text-[#1f1f1f] outline-none transition focus:border-[#C8470A]"
              />
            </div>

            <div>
              <label
                htmlFor="favicon"
                className="mb-2 block text-sm font-semibold text-[#1f1f1f]"
              >
                Upload favicon
              </label>
              <input
                id="favicon"
                name="favicon"
                type="file"
                accept="image/*"
                className="block w-full rounded-xl border border-[#ddd6cb] bg-white px-4 py-3 text-sm text-[#1f1f1f] file:mr-4 file:rounded-lg file:border-0 file:bg-[#C8470A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {settings?.favicon ? (
                <img
                  src={settings.favicon}
                  alt="Favicon"
                  className="mt-3 h-10 w-10 rounded-lg border border-[#ece6dd] object-contain"
                />
              ) : null}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-[#C8470A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a63b08]"
            >
              Save Settings
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1f1f]">Preview</h2>

            <div className="mt-5 rounded-2xl border border-[#ece6dd] bg-[#faf8f4] p-5">
              <div className="flex items-center gap-3">
                {settings?.logoImage ? (
                  <img
                    src={settings.logoImage}
                    alt={settings?.siteName || "Carrot"}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold tracking-tight text-[#C8470A]">
                    {settings?.logoText || settings?.siteName || "Carrot"}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#666]">
                {settings?.headerTagline || "Crafted with care. Defined by art."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1f1f]">Notes</h2>
            <div className="mt-4 space-y-3 text-sm text-[#666]">
              <p>Upload a PNG, JPG, WebP, or other image file for branding.</p>
              <p>If no logo image is uploaded, the navbar will automatically show logo text.</p>
              <p>Branding updates now save directly in the database, so they are safer for Vercel deployment.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}