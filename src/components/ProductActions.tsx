"use client";

import { useState } from "react";
import { PreorderWishlistModal } from "@/components/PreorderWishlistModal";
import { StockBadge } from "@/components/StockBadge";
import { useCart } from "@/components/CartProvider";
import { isInStock, maxAddQuantity } from "@/lib/inventory";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  size?: "sm" | "lg";
};

export function ProductActions({ product, size = "sm" }: Props) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<"preorder" | "wishlist" | null>(null);

  const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const canAdd = maxAddQuantity(product, inCart) > 0;
  const inStock = isInStock(product);

  const sizeClass =
    size === "lg"
      ? "w-full rounded-full py-3.5 text-base"
      : "rounded-full px-4 py-2 text-sm";

  function handleAdd() {
    if (!canAdd) return;
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  if (inStock && canAdd) {
    return (
      <div className="space-y-3">
        {size === "lg" && <StockBadge stock={product.stock} />}
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

  return (
    <div className="space-y-3">
      <StockBadge stock={product.stock} />
      {message && (
        <p className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      )}
      <div className={`flex flex-wrap gap-2 ${size === "lg" ? "flex-col" : ""}`}>
        {!inStock && (
          <button
            type="button"
            onClick={() => setModal("preorder")}
            className={`font-semibold transition ${sizeClass} bg-amber-400 text-[#062318] hover:bg-amber-300`}
          >
            Preorder
          </button>
        )}
        <button
          type="button"
          onClick={() => setModal("wishlist")}
          className={`font-semibold transition ${sizeClass} border border-white/20 text-white hover:bg-white/10`}
        >
          Add to wishlist
        </button>
      </div>
      {inStock && !canAdd && (
        <p className="text-xs text-emerald-100/50">Maximum available quantity in cart.</p>
      )}
      {modal && (
        <PreorderWishlistModal
          product={product}
          type={modal}
          onClose={() => setModal(null)}
          onSuccess={setMessage}
        />
      )}
    </div>
  );
}
