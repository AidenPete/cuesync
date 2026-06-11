"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ReceiptView } from "@/components/ReceiptView";
import { accessExpiryLabel } from "@/lib/orders";
import type { Order } from "@/lib/order-types";
import { formatPhoneDisplay } from "@/lib/ui";

function TrackPageContent() {
  const params = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/orders/track/${params.token}`);
        const data = await response.json();
        if (data.order) {
          setOrder(data.order);
          setExpired(false);
        } else {
          setExpired(true);
        }
      } catch {
        setExpired(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.token]);

  if (loading) {
    return (
      <div className="py-16 text-center text-emerald-100/60">
        Loading your order…
      </div>
    );
  }

  if (expired || !order) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <p className="text-5xl">⏳</p>
        <h1 className="text-2xl font-bold text-white">Link expired</h1>
        <p className="text-emerald-100/70">
          This tracking link is no longer available. If you need help, contact
          the shop with your phone number.
        </p>
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-emerald-500 px-6 py-3 font-semibold text-[#062318]"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const isNew = searchParams.get("new") === "1";

  return (
    <div className="space-y-6">
      {isNew && (
        <div className="mx-auto max-w-lg rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-center">
          <p className="text-3xl">📱</p>
          <p className="mt-2 font-semibold text-white">Order confirmed</p>
          <p className="mt-1 text-sm text-emerald-100/70">
            We&apos;ve sent a tracking link to{" "}
            <span className="font-medium text-white">
              {formatPhoneDisplay(order.phone)}
            </span>
            . Bookmark this page or use the link from your SMS.
          </p>
        </div>
      )}

      <ReceiptView order={order} showSuccess={false} />

      <div className="mx-auto max-w-lg space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
        <h2 className="font-semibold text-white">Delivery status</h2>
        {order.status === "pending_delivery" ? (
          <p className="text-emerald-100/80">
            Your order is being prepared for delivery to{" "}
            <span className="text-white">{order.deliveryLocation}</span>. This
            link stays active until delivery is complete.
          </p>
        ) : order.status === "in_transit" ? (
          <p className="text-emerald-100/80">
            Your order is on the way to{" "}
            <span className="text-white">{order.deliveryLocation}</span>. This
            link stays active until delivery is complete.
          </p>
        ) : (
          <p className="text-emerald-100/80">
            Delivered
            {order.deliveredAt
              ? ` on ${accessExpiryLabel(order.deliveredAt)}`
              : ""}
            . You can view this receipt until{" "}
            {order.accessExpiresAt
              ? accessExpiryLabel(order.accessExpiresAt)
              : "the link expires"}
            .
          </p>
        )}
      </div>

      <div className="mx-auto flex max-w-lg justify-center gap-3 no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          Print receipt
        </button>
        <Link
          href="/shop"
          className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-[#062318] transition hover:bg-emerald-400"
        >
          Shop again
        </Link>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-emerald-100/60">Loading…</div>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}
