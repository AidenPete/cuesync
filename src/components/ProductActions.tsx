"use client";

import { useState } from "react";
import { PreorderWishlistModal } from "@/components/PreorderWishlistModal";
import { StockBadge } from "@/components/StockBadge";
import { useCart } from "@/components/CartProvider";
import { canAddToCart, showPreorder } from "@/lib/inventory";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  size?: "sm" | "lg";
};

export function ProductActions({ product, size = "sm" }: Props) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [preorderOpen, setPreorderOpen] = useState(false);

  const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const allowAddToCart = canAddToCart(product, inCart);
  const allowPreorder = showPreorder(product);

  const sizeClass =
    size === "lg"
      ? "w-full rounded-full py-3.5 text-base"
      : "rounded-full px-4 py-2 text-sm";

  function handleAdd() {
    if (!allowAddToCart) return;
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  if (allowAddToCart) {
    return (
      <div className="space-y-3">
        {size === "lg" && (
          <StockBadge stock={product.stock} preorderOnly={product.preorderOnly} />
        )}
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
      </div>
    );
  }

  if (allowPreorder) {
    return (
      <div className="space-y-3">
        <StockBadge stock={product.stock} preorderOnly={product.preorderOnly} />
        {message && (
          <p className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={() => setPreorderOpen(true)}
          className={`font-semibold transition ${sizeClass} bg-amber-400 text-[#062318] hover:bg-amber-300`}
        >
          Preorder
        </button>
        {preorderOpen && (
          <PreorderWishlistModal
            product={product}
            type="preorder"
            onClose={() => setPreorderOpen(false)}
            onSuccess={setMessage}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <StockBadge stock={product.stock} preorderOnly={product.preorderOnly} />
      <p className="text-xs text-emerald-100/50">Maximum available quantity in cart.</p>
    </div>
  );
}
