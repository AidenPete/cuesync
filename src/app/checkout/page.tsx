"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatKes, isValidKenyanPhone, normalizePhone } from "@/lib/format";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-[#041912] px-4 py-3 text-white outline-none ring-emerald-400/50 placeholder:text-white/30 focus:ring-2";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-5xl">💳</p>
        <h1 className="mt-4 text-2xl font-semibold">Nothing to checkout</h1>
        <p className="mt-2 text-emerald-100/70">Add items to your cart first.</p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedLocation = deliveryLocation.trim();

    if (!trimmedName) {
      setError("Enter your name.");
      return;
    }

    if (!trimmedLocation) {
      setError("Enter a delivery location.");
      return;
    }

    if (!isValidKenyanPhone(phone)) {
      setError("Enter a valid M-Pesa number (e.g. 0712 345 678).");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          deliveryLocation: trimmedLocation,
          phone: normalizePhone(phone),
          items: items.map(({ product, quantity }) => ({
            id: product.id,
            quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Payment failed. Try again.");
      }

      clearCart();

      const params = new URLSearchParams({
        orderId: data.orderId,
        name: trimmedName,
        delivery: trimmedLocation,
      });
      router.push(`/order/success?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="mt-2 text-emerald-100/70">
            Your name, delivery location, and M-Pesa number — that&apos;s all we
            need.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-100">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Kamau"
              autoComplete="name"
              className={inputClassName}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-100">
              Delivery location
            </span>
            <input
              type="text"
              value={deliveryLocation}
              onChange={(event) => setDeliveryLocation(event.target.value)}
              placeholder="Westlands, Nairobi"
              autoComplete="street-address"
              className={inputClassName}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-100">
              M-Pesa phone number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0712 345 678"
              autoComplete="tel"
              className={inputClassName}
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#43a047] py-3.5 font-semibold text-white transition hover:bg-[#388e3c] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending STK push…
              </>
            ) : (
              <>Pay {formatKes(subtotal)} with M-Pesa</>
            )}
          </button>

          <p className="text-center text-xs text-emerald-100/50">
            Demo mode — no real payment is processed yet.
          </p>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex items-center gap-3 text-emerald-100/80">
                <ProductImage
                  product={product}
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg"
                  imageClassName="object-cover"
                  sizes="40px"
                />
                {product.name} × {quantity}
              </span>
              <span className="font-medium text-white">
                {formatKes(product.price * quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold">
          <span>Total</span>
          <span className="text-emerald-300">{formatKes(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
