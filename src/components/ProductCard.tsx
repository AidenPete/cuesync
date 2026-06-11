"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatKes } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/30">
      <div className="relative h-52 overflow-hidden">
        <ProductImage
          product={product}
          className="relative h-full w-full"
          imageClassName="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062318]/80 via-transparent to-transparent" />
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-[#062318]">
            Popular
          </span>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-emerald-100/70">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-emerald-300">
            {formatKes(product.price)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              added
                ? "bg-white text-[#062318]"
                : "bg-emerald-500 text-[#062318] hover:bg-emerald-400"
            }`}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
