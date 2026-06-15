export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminCustomersPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1f1f1f]">Customers</h1>
        <p className="mt-2 text-sm text-[#666]">
          This page will show customer details collected from guest checkout orders.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f1f1f]">Guest checkout mode</h2>
        <p className="mt-3 text-sm leading-6 text-[#666]">
          Your store is currently using guest checkout only. That means customers do not
          have accounts or order history login access right now. Later, this section can
          still help you review names, emails, phone numbers, and shipping details
          collected from orders.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e7e1d7] bg-white shadow-sm">
        <div className="border-b border-[#eee7dd] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1f1f1f]">Customer list</h2>
        </div>

        <div className="px-6 py-10 text-center text-sm text-[#777]">
          No customers to show yet. Later this page will load customer data from orders.
        </div>
      </div>
    </section>
  );
}