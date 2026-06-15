export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a7974] mb-3">
            CARROT Policies
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg leading-relaxed max-w-2xl">
            Last updated: 2026
          </p>
        </div>

        <div className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-10 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p className="text-[#4f4f4f] leading-8">
              At CARROT, we respect your privacy and are committed to protecting your personal
              information. By using our website or placing an order with us, you agree to the
              practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">What Data We Collect</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>We collect only the information needed to process and deliver your order:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Delivery address</li>
              </ul>
              <p>
                We do not collect sensitive information such as date of birth, government IDs,
                or financial details through our store interface. Payment information is
                processed through Razorpay.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2 text-[#4f4f4f] leading-8">
              <li>To process and fulfil your order</li>
              <li>To make a confirmation call before dispatch</li>
              <li>To coordinate delivery with courier partners</li>
              <li>To send order updates and shipping notifications</li>
              <li>To send brand updates or offers where you have opted in</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Who We Share Your Data With</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>We do not sell, rent, or trade your personal data.</p>
              <p>Your information may be shared only with trusted service providers such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Courier partners like Delhivery and Blue Dart, for delivery-related purposes
                </li>
                <li>Razorpay, for payment processing</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Marketing Communications</h2>
            <p className="text-[#4f4f4f] leading-8">
              With your consent, we may send you emails about new drops, offers, and brand
              updates. You can unsubscribe at any time by using the unsubscribe option in the
              email or by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Browser Storage</h2>
            <p className="text-[#4f4f4f] leading-8">
              Our website may use browser-based storage technologies for essential shopping
              functionality, such as remembering items in your cart or wishlist on your device.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="text-[#4f4f4f] leading-8">
              We take reasonable measures to protect your personal information from unauthorized
              access, misuse, alteration, or loss.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-[#4f4f4f] leading-8">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-[#4f4f4f] leading-8">
              To exercise any of your privacy-related rights or ask questions about this policy,
              contact{" "}
              <a
                href="mailto:wearcarrot923@gmail.com"
                className="underline underline-offset-4"
              >
                wearcarrot923@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-[#4f4f4f] leading-8">
              We may update this Privacy Policy from time to time. Any changes will be posted
              on this page with an updated effective date.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}