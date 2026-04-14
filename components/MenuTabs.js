"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

const TABS = [
  { key: "all", label: "All" },
  { key: "coffee", label: "☕ Coffee" },
  { key: "bakery", label: "🥐 Bakery" },
];

export default function MenuTabs({ products }) {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === tab.key
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-amber-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
