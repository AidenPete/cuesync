"use client";

import { FormEvent, useState } from "react";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";
import { inputClassName } from "@/lib/ui";
import type { ProductRequestType } from "@/lib/product-request-types";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  type: ProductRequestType;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export function PreorderWishlistModal({
  product,
  type,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (!isValidKenyanPhone(phone)) {
      setError("Enter a valid phone number.");
      return;
    }

    if (type === "preorder" && !deliveryLocation.trim()) {
      setError("Enter a delivery location.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/product-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          productId: product.id,
          productName: product.name,
          name: name.trim(),
          phone: normalizePhone(phone),
          deliveryLocation: deliveryLocation.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not submit.");
      onSuccess(data.message);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/70 p-4">
      <div className="flex min-h-full items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="my-8 w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-[#062318] p-6 shadow-2xl"
        >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
            {type === "wishlist" ? "Wishlist" : "Preorder"}
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">{product.name}</h2>
          <p className="mt-1 text-sm text-emerald-100/70">
            {type === "wishlist"
              ? "Save this item — we'll let you know when it's back."
              : "Reserve this item and we'll contact you when it's ready."}
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-emerald-100">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClassName}
            placeholder="Your name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-emerald-100">Phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClassName}
            placeholder="0712 345 678"
          />
        </label>

        {type === "preorder" && (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-100">Delivery location</span>
            <input
              value={deliveryLocation}
              onChange={(event) => setDeliveryLocation(event.target.value)}
              className={inputClassName}
              placeholder="Westlands, Nairobi"
            />
          </label>
        )}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-emerald-100">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            className={inputClassName}
            placeholder="Quantity, colour preference, etc."
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-emerald-400 py-3 font-semibold text-[#062318] transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? "Submitting…" : type === "wishlist" ? "Add to wishlist" : "Submit preorder"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
