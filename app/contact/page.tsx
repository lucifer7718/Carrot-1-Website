"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    query: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    query: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      query: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.query.trim()) {
      newErrors.query = "Query is required.";
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.email && !newErrors.query;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setStatus({
      type: "",
      message: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data.message || "Failed to send your query.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Your query has been sent successfully.",
      });

      setForm({
        name: "",
        email: "",
        query: "",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a7974] mb-3">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-[#5f5f5f] text-base md:text-lg leading-relaxed max-w-2xl">
            Have a question about your order, delivery, sizing, or anything else?
            Fill out the form below and we will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

            {status.message && (
              <div
                className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e6e1d8] bg-[#fcfcfa] px-4 py-3 outline-none focus:border-[#C8470A] focus:ring-2 focus:ring-[#C8470A]/10 transition"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e6e1d8] bg-[#fcfcfa] px-4 py-3 outline-none focus:border-[#C8470A] focus:ring-2 focus:ring-[#C8470A]/10 transition"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="query"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Query
                </label>
                <textarea
                  id="query"
                  name="query"
                  rows={6}
                  value={form.query}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e6e1d8] bg-[#fcfcfa] px-4 py-3 outline-none focus:border-[#C8470A] focus:ring-2 focus:ring-[#C8470A]/10 transition resize-none"
                />
                {errors.query && (
                  <p className="mt-2 text-sm text-red-600">{errors.query}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[#C8470A] px-6 py-3 text-sm font-medium text-white hover:bg-[#b33f08] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Submit Query"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Contact details</h2>
              <div className="space-y-4 text-[#4f4f4f] leading-8">
                <p>
                  <span className="font-semibold text-[#1A1A1A]">Email:</span>{" "}
                  <a
                    href="mailto:wearcarrot923@gmail.com"
                    className="underline underline-offset-4"
                  >
                    wearcarrot923@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-[#1A1A1A]">Delivery:</span>{" "}
                  All India Delivery
                </p>
                <p>
                  <span className="font-semibold text-[#1A1A1A]">Payment:</span>{" "}
                  COD Available
                </p>
                <p>
                  <span className="font-semibold text-[#1A1A1A]">
                    Estimated Delivery:
                  </span>{" "}
                  7-10 Days
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#ece8e1] rounded-[28px] p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Support notes</h2>
              <div className="space-y-4 text-[#4f4f4f] leading-8">
                <p>We usually respond within 24 to 48 business hours.</p>
                <p>
                  If your query is about an order, mention your order number in
                  the message.
                </p>
                <p>
                  For return, exchange, or damage issues, include clear product
                  details so we can help you faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}