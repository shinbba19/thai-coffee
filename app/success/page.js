"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const txHash = params.get("txHash");

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-6xl mb-6">☕</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Your payment was received. Your coffee is on its way!
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left space-y-4 mb-8">
        {orderId && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
            <p className="font-mono text-gray-700">#{orderId}</p>
          </div>
        )}
        {txHash && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Transaction Hash</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-amber-600 hover:underline text-sm break-all"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          href="/"
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Order More
        </Link>
        <Link
          href="/admin"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
