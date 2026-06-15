export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a7974] mb-3">
            CARROT Policies
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg leading-relaxed max-w-2xl">
            Last updated: 2026
          </p>
        </div>

        <div className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-10 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Agreement</h2>
            <p className="text-[#4f4f4f] leading-8">
              By accessing or placing an order on the CARROT website, you agree to be bound by
              these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Products</h2>
            <p className="text-[#4f4f4f] leading-8">
              All CARROT products are made-to-order. Product colors may appear slightly
              different on screen compared to the actual product due to display settings and
              print-process variations. We reserve the right to discontinue any product at any
              time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Pricing</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>
                All prices are listed in Indian Rupees (₹) and are inclusive of applicable
                taxes unless stated otherwise.
              </p>
              <p>
                Prices may change without prior notice. However, once an order is confirmed and
                payment is received, the price at the time of purchase will be honored.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Payment</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>We accept the following payment methods:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>UPI</li>
                <li>Credit and Debit Cards</li>
                <li>Net Banking</li>
                <li>Wallets</li>
                <li>Cash on Delivery (COD)</li>
              </ul>
              <p>Online payments are processed through Razorpay.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Order Cancellation</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>
                After placing your order, you may receive a confirmation call from our team.
                You may cancel your order during that confirmation stage.
              </p>
              <p>
                Once the order is confirmed and production begins, cancellations may no longer
                be accepted.
              </p>
              <p>
                CARROT reserves the right to cancel any order due to stock unavailability,
                operational issues, or payment-related problems. In such cases, a full refund
                will be issued where applicable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Out of Stock Orders</h2>
            <p className="text-[#4f4f4f] leading-8">
              If an item goes out of stock after your payment is received, we will contact you
              and offer either a full refund or the option to wait for the next batch if a
              restock is expected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
            <p className="text-[#4f4f4f] leading-8">
              All content on this website, including the CARROT name, logo, product designs,
              graphics, photographs, and text, is the intellectual property of CARROT and is
              protected under applicable law. Unauthorized use, reproduction, or distribution is
              prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-[#4f4f4f] leading-8">
              CARROT shall not be liable for indirect, incidental, or consequential damages
              arising from the use of our website or products. To the maximum extent permitted
              by law, our liability shall be limited to the amount paid for the specific order
              in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Governing Law</h2>
            <p className="text-[#4f4f4f] leading-8">
              These Terms and Conditions are governed by the laws of India. Any disputes shall
              be subject to the jurisdiction of the courts of Odisha, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-[#4f4f4f] leading-8">
              For questions regarding these Terms, contact{" "}
              <a
                href="mailto:wearcarrot923@gmail.com"
                className="underline underline-offset-4"
              >
                wearcarrot923@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}