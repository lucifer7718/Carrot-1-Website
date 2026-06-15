import { Suspense } from "react";
import OrderSuccessClient from "./OrderSuccessClient";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-sm text-[#5f5f5f]">Loading order...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}