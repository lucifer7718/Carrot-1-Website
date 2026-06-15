const faqSections = [
  {
    title: "Orders",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our shop, select your size, and add the product to your cart. Then proceed to checkout, enter your delivery details, and complete the payment or choose COD where available.",
      },
      {
        q: "Will I receive a confirmation after ordering?",
        a: "Yes. You will receive an order confirmation by email. Our team may also contact you if additional confirmation is needed before production begins.",
      },
      {
        q: "Can I cancel my order?",
        a: "If your order has not gone into production yet, contact us as soon as possible. Once production begins, cancellation may not be possible.",
      },
      {
        q: "Can I modify my order after placing it?",
        a: "Please contact us immediately for size or address corrections. Once the order moves into processing or production, changes may not be possible.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders usually take 2 to 3 business days to process and dispatch. Delivery after dispatch usually takes 4 to 6 business days in metro cities, 6 to 8 business days in tier 2 or tier 3 cities, and longer for remote areas.",
      },
      {
        q: "Which couriers do you use?",
        a: "We ship through trusted courier partners such as Delhivery and Blue Dart, depending on location and service availability.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you will receive a tracking number by email.",
      },
      {
        q: "Do you ship across all of India?",
        a: "Yes, we currently ship across India. International shipping is not available at the moment.",
      },
      {
        q: "My package has not arrived. What should I do?",
        a: "First check the tracking details shared with you. If there has been no movement or you believe there is an issue, email us with your order number and we will investigate.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept eligible returns within 7 days of delivery for issues such as wrong item, wrong size delivered, or damaged/defective product, subject to our return conditions.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us within 7 days of delivery with your order number, reason for return, and clear photos if applicable.",
      },
      {
        q: "Do I have to ship the product back myself?",
        a: "No. If your return request is approved, we arrange a pickup from your delivery address.",
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes, eligible size exchanges are supported subject to stock availability and product inspection.",
      },
      {
        q: "Are sale items returnable?",
        a: "Items purchased at a discount of 25% or more are considered final sale and are not eligible for return or exchange.",
      },
      {
        q: "I do not like the product. Can I return it?",
        a: "Returns based on change of mind, preference, or incorrect size selected by the customer are not accepted.",
      },
    ],
  },
  {
    title: "Payments & Refunds",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit cards, debit cards, net banking, wallets, and Cash on Delivery where available.",
      },
      {
        q: "Is Cash on Delivery available?",
        a: "Yes, COD is available with no additional shipping charge.",
      },
      {
        q: "How long do refunds take?",
        a: "Approved refunds are usually processed within 5 to 7 business days after the returned item is received and inspected.",
      },
      {
        q: "Is my payment information safe?",
        a: "Online payments are processed through Razorpay. We do not store card details through the website interface.",
      },
    ],
  },
  {
    title: "Product & Sizing",
    items: [
      {
        q: "What fabric are your T-shirts made of?",
        a: "CARROT T-shirts are made in a premium oversized style. Refer to the product description for the latest fabric details on each product page.",
      },
      {
        q: "How should I wash my CARROT T-shirt?",
        a: "Wash cold, inside out, with similar colors. Avoid bleach and do not iron directly on the print.",
      },
      {
        q: "How do I choose the right size?",
        a: "Please check the size guide on the product page. If you prefer a less oversized fit, consider sizing down.",
      },
      {
        q: "Will colors look the same as on screen?",
        a: "We try to represent colors accurately, but slight variations may happen due to screen settings and printing differences.",
      },
      {
        q: "What sizes do you offer?",
        a: "Available sizes are shown on each product page and may vary by product.",
      },
    ],
  },
  {
    title: "Contact & Support",
    items: [
      {
        q: "How can I contact CARROT?",
        a: "You can email us at wearcarrot923@gmail.com.",
      },
      {
        q: "What are your support hours?",
        a: "We generally respond within 24 to 48 business hours. Replies may take longer on Sundays or public holidays.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a7974] mb-3">
            Support
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg leading-relaxed max-w-2xl">
            Quick answers to common questions about orders, shipping, returns, payments, and sizing.
          </p>
        </div>

        <div className="space-y-8">
          {faqSections.map((section) => (
            <section
              key={section.title}
              className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-10 shadow-sm"
            >
              <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-[#ece8e1] bg-[#fcfcfa] px-5 py-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#1A1A1A]">
                      <span>{item.q}</span>
                      <span className="text-[#7a7974] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="pt-3 text-[#5f5f5f] leading-8">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}