"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-500 mt-1 flex-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-amber-700 font-bold">
            {product.price_eth} MTHB1
          </span>
          <button
            onClick={() => dispatch({ type: "ADD_ITEM", product })}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
