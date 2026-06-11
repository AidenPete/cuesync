"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatKes } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  size?: "sm" | "lg";
};

export function AddToCartButton({ product, size = "sm" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  const sizeClass =
    size === "lg"
      ? "w-full rounded-full py-3.5 text-base"
      : "rounded-full px-4 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`font-semibold transition ${sizeClass} ${
        added
          ? "bg-white text-[#062318]"
          : "bg-emerald-500 text-[#062318] hover:bg-emerald-400"
      }`}
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
