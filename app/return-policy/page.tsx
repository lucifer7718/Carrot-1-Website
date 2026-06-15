import Link from "next/link";

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a7974] mb-3">
            CARROT Policies
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Return & Exchange Policy
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg leading-relaxed max-w-2xl">
            Last updated: 2026
          </p>
        </div>

        <div className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-10 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p className="text-[#4f4f4f] leading-8">
              We want you to love your CARROT order. If something is not right, we are here
              to help.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Return Window</h2>
            <p className="text-[#4f4f4f] leading-8">
              You have 7 days from the date of delivery to initiate a return or exchange
              request. Requests raised after 7 days will not be accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Accepted Return Reasons</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>We accept returns and exchanges only for the following reasons:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wrong size delivered</li>
                <li>Damaged or defective product</li>
                <li>Wrong product delivered</li>
              </ul>
              <p>
                Returns due to change of mind, dislike of color or design, or incorrect size
                selected by the customer are not accepted. Please check the size guide before
                ordering.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Condition of Return</h2>
            <div className="text-[#4f4f4f] leading-8">
              <p className="mb-3">To be eligible for a return or exchange, the item must be:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unworn and unwashed</li>
                <li>With all original tags attached</li>
                <li>In the original packaging</li>
                <li>Free from stains, perfume, or deodorant marks</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Non-Returnable Items</h2>
            <p className="text-[#4f4f4f] leading-8">
              Items purchased at a discount of 25% or more are final sale and cannot be
              returned or exchanged. This will be clearly mentioned on the product page where
              applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How to Initiate a Return</h2>
            <ol className="list-decimal pl-6 space-y-3 text-[#4f4f4f] leading-8">
              <li>
                Email us at{" "}
                <a
                  href="mailto:wearcarrot923@gmail.com"
                  className="underline underline-offset-4"
                >
                  wearcarrot923@gmail.com
                </a>{" "}
                within 7 days of delivery with your order number, reason for return, and clear
                photos of the product.
              </li>
              <li>
                Our team will review your request within 2 business days and confirm whether
                it is approved.
              </li>
              <li>
                Once approved, we arrange a free pickup from your delivery address. You do not
                need to ship the item yourself.
              </li>
              <li>
                After the returned item is received and inspected, your refund or exchange
                will be processed within 5 to 7 business days.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Exchanges</h2>
            <p className="text-[#4f4f4f] leading-8">
              We offer direct exchanges for eligible size issues. Once your return is picked up
              and passes inspection, the correct size will be shipped at no extra cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Refunds</h2>
            <div className="space-y-3 text-[#4f4f4f] leading-8">
              <p>
                Approved refunds are credited to your original payment method within 5 to 7
                business days after we receive and inspect the returned item.
              </p>
              <p>
                For COD orders, refunds are processed via bank transfer. Please share your bank
                account details when contacting us.
              </p>
              <p>Shipping charges do not apply because shipping is free on all orders.</p>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <Link
            href="/shipping-policy"
            className="inline-flex items-center text-sm font-medium text-[#1A1A1A] hover:text-[#C8470A] transition-colors"
          >
            View Shipping Policy →
          </Link>
        </div>
      </section>
    </main>
  );
}