import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a7974] mb-3">
            CARROT Policies
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Shipping Policy
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg leading-relaxed max-w-2xl">
            Last updated: 2026
          </p>
        </div>

        <div className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-10 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p className="text-[#4f4f4f] leading-8">
              At CARROT, we want your order to reach you as quickly and safely as possible.
              All orders are shipped from Coimbatore, Tamil Nadu and Cuttack, Odisha.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Courier Partners</h2>
            <p className="text-[#4f4f4f] leading-8">
              We ship through Delhivery and Blue Dart. The courier assigned depends on your
              location and availability at the time of dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Order Processing Time</h2>
            <p className="text-[#4f4f4f] leading-8">
              Since all CARROT products are made-to-order and printed on demand, please allow
              2 to 3 business days for your order to be processed, printed, quality-checked,
              and dispatched. You will receive a shipping confirmation with your tracking
              number once your order is on its way.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Delivery Timeline</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>After dispatch, estimated delivery times are:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Metro Cities (Delhi, Mumbai, Bangalore, etc.): 4 to 6 business days</li>
                <li>Tier 2 and Tier 3 Cities: 6 to 8 business days</li>
                <li>Remote or Rural Areas: 8 to 12 business days or more</li>
              </ul>
              <p>
                These timelines are estimates and may vary due to public holidays, weather,
                operational issues, or courier delays beyond our control.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Shipping Charges</h2>
            <p className="text-[#4f4f4f] leading-8">
              Shipping is completely free on all orders across India. No minimum order value
              is required. Cash on Delivery (COD) is also free with no extra charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Lost or Damaged Packages</h2>
            <div className="space-y-4 text-[#4f4f4f] leading-8">
              <p>
                <span className="font-semibold text-[#1A1A1A]">If your package is lost:</span>{" "}
                We will open an investigation with our courier partner immediately. Once
                confirmed, we will arrange a replacement or full refund, based on your
                preference.
              </p>
              <p>
                <span className="font-semibold text-[#1A1A1A]">If your package arrives damaged:</span>{" "}
                Please take photos immediately and contact us at{" "}
                <a
                  href="mailto:wearcarrot923@gmail.com"
                  className="underline underline-offset-4"
                >
                  wearcarrot923@gmail.com
                </a>{" "}
                within 48 hours of delivery. We will offer a replacement or full refund
                based on the situation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Shipping Coverage</h2>
            <p className="text-[#4f4f4f] leading-8">
              We currently ship to all states and union territories across India. International
              shipping is not available at the moment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-[#4f4f4f] leading-8">
              For shipping-related questions, email{" "}
              <a
                href="mailto:wearcarrot923@gmail.com"
                className="underline underline-offset-4"
              >
                wearcarrot923@gmail.com
              </a>
              . We usually respond within 24 to 48 business hours.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link
            href="/faq"
            className="inline-flex items-center text-sm font-medium text-[#1A1A1A] hover:text-[#C8470A] transition-colors"
          >
            View FAQ →
          </Link>
        </div>
      </section>
    </main>
  );
}