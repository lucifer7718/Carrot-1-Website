import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();

  return {
    siteName: settings?.siteName || "Carrot",
    logoText: settings?.logoText || settings?.siteName || "Carrot",
    logoImage: settings?.logoImage || "",
    headerTagline:
      settings?.headerTagline || "Crafted with care. Defined by art.",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst();

  const siteName = settings?.siteName || "Carrot";
  const tagline =
    settings?.headerTagline || "Crafted with care. Defined by art.";

  return {
    title: `${siteName} - ${tagline}`,
    description:
      "Premium essentials for everyday wear. All India delivery with COD available.",
  };
}

function Footer({
  siteName,
  logoText,
  headerTagline,
}: {
  siteName: string;
  logoText: string;
  headerTagline: string;
}) {
  return (
    <footer className="bg-[#1A1A1A] text-[#FAFAF8]">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold text-[#C8470A]">
              {logoText || siteName}
            </h3>
            <p className="text-sm leading-relaxed text-[#bab9b4]">
              {headerTagline}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Company 
            </h4>
            <ul className="space-y-2 text-sm text-[#bab9b4]">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#FAFAF8]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="transition-colors hover:text-[#FAFAF8]"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="transition-colors hover:text-[#FAFAF8]"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-[#FAFAF8]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-[#FAFAF8]"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-[#FAFAF8]"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#FAFAF8]"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="mailto:wearcarrot923@gmail.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#444] text-[#bab9b4] transition-colors hover:border-[#C8470A] hover:text-white"
                aria-label={`Email ${siteName}`}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16v16H4z" stroke="none" />
                  <path d="M4 6l8 6 8-6" />
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                </svg>
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#444] text-[#bab9b4] transition-colors hover:border-[#C8470A] hover:text-white"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#444] text-[#bab9b4] transition-colors hover:border-[#C8470A] hover:text-white"
                aria-label="Facebook"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.2V11H8v3h2.4v8h3.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Delivery Info
            </h4>
            <ul className="space-y-2 text-sm text-[#bab9b4]">
              <li>All India Delivery</li>
              <li>COD Available</li>
              <li>7-10 Days Delivery</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 space-y-2 border-t border-[#333] pt-8 text-center text-xs text-[#7a7974]">
          <p>© 2026 {siteName}. All rights reserved.</p>
          <p>
            Made by{" "}
            <span className="font-medium text-[#bab9b4]">Ezzgo Digital</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#FAFAF8] text-[#1A1A1A] antialiased`}
      >
        <Navbar
          siteName={settings.siteName}
          logoText={settings.logoText}
          logoImage={settings.logoImage}
        />
        <main>{children}</main>
        <Footer
          siteName={settings.siteName}
          logoText={settings.logoText}
          headerTagline={settings.headerTagline}
        />
      </body>
    </html>
  );
}