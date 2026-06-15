"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Logout failed");
        setLoading(false);
        return;
      }

      router.push("/admin/login");
      router.refresh();
    } catch {
      alert("Something went wrong during logout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#000] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}