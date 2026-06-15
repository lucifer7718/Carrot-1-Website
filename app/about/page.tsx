import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-white text-zinc-900">
      <section className="border-b border-zinc-200 bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            About Us
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Thoughtful style, made to feel easy every day.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            We started this store with a simple idea: good pieces should feel
            effortless to wear, easy to style, and worth coming back to. We
            focus on versatile fashion that fits real routines, not just special
            occasions.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
            Built for people who want style without the noise
          </h2>
          <p className="mt-6 text-base leading-7 text-zinc-600">
            Our collections are chosen with a clear point of view: clean
            silhouettes, wearable details, and pieces that work beyond one-time
            trends. We care about how something looks online, but even more
            about how it feels in real life.
          </p>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            That means focusing on fit, comfort, repeat wear, and simple styling
            that helps customers buy with confidence. We want every order to
            feel reliable, useful, and genuinely loved after delivery.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            What We Value
          </p>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Everyday wearability
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Pieces should be easy to repeat, pair, and style across
                different moments of the week.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Honest presentation
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                We aim to show products clearly so customers know what to expect
                before placing an order.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Better customer experience
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Fast support, smooth ordering, and clear updates matter just as
                much as the product itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold">Quality-first</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                We focus on pieces customers will actually want to wear again.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold">Clear updates</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                From order placement to delivery, communication should feel
                simple and dependable.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold">Customer trust</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                We are building a store people feel comfortable ordering from
                again and recommending to others.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Why customers choose us
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
              A store experience that feels clear and personal
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Curated selection
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  We focus on styles that feel relevant, wearable, and easy to
                  return to.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Simple ordering
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  A smoother checkout and clear order communication help reduce
                  confusion.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Reliable support
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  When customers need help, they should know exactly how to
                  reach us.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Ongoing improvement
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  We keep refining the store experience to make buying easier
                  and better.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-stone-100 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Need help?
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
              We’re here if you have questions before or after ordering
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              For sizing questions, order help, or general support, contact us
              through the details available on the store. We want the shopping
              experience to feel straightforward from start to finish.
            </p>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}