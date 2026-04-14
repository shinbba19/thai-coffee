"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { cart, dispatch, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl mb-4">Your cart is empty.</p>
        <Link
          href="/"
          className="text-amber-600 hover:underline font-semibold"
        >
          Browse the menu →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-amber-700">{item.price_eth} MTHB1 each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch({ type: "UPDATE_QTY", id: item.id, quantity: item.quantity - 1 })
                }
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 flex items-center justify-center"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch({ type: "UPDATE_QTY", id: item.id, quantity: item.quantity + 1 })
                }
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 flex items-center justify-center"
              >
                +
              </button>
            </div>
            <p className="w-28 text-right font-semibold text-gray-700">
              {(item.price_eth * item.quantity).toFixed(2)} MTHB1
            </p>
            <button
              onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
              className="text-gray-300 hover:text-red-400 transition-colors text-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-amber-700">{total.toFixed(2)} MTHB1</p>
        </div>
        <Link
          href="/checkout"
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
