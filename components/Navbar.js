"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="bg-amber-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
      <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
        ☕ Thai Coffee
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-amber-300 transition-colors">
          Menu
        </Link>
        <Link href="/admin" className="hover:text-amber-300 transition-colors">
          Admin
        </Link>
        <Link
          href="/cart"
          className="relative flex items-center gap-1 hover:text-amber-300 transition-colors"
        >
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-amber-400 text-amber-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
