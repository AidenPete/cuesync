"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatKes } from "@/lib/format";

export function CartSummary() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-5xl">🛒</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          Your cart is empty
        </h2>
        <p className="mt-2 text-emerald-100/70">
          Browse the catalogue and add some gear.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-emerald-500 px-6 py-3 font-semibold text-[#062318] transition hover:bg-emerald-400"
        >
          Go to catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(({ product, quantity }) => (
        <div
          key={product.id}
          className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <ProductImage
            product={product}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl"
            imageClassName="object-cover"
            sizes="80px"
          />

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white">{product.name}</h3>
              <p className="text-sm text-emerald-300">
                {formatKes(product.price)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
              >
                −
              </button>
              <span className="min-w-6 text-center font-medium text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="ml-auto text-sm text-red-300 hover:text-red-200"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
        <div className="flex items-center justify-between text-lg">
          <span className="text-emerald-100">Subtotal</span>
          <span className="font-bold text-white">{formatKes(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex w-full items-center justify-center rounded-full bg-emerald-500 py-3 font-semibold text-[#062318] transition hover:bg-emerald-400"
        >
          Checkout with M-Pesa
        </Link>
      </div>
    </div>
  );
}
