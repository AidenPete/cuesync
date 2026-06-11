"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { formatKes } from "@/lib/format";
import { formatPhoneDisplay } from "@/lib/ui";

type OrderSummary = {
  id: string;
  token: string;
  total: number;
  status: "pending_delivery" | "delivered";
  createdAt: string;
  deliveryLocation: string;
  itemCount: number;
  trackUrl: string;
  linkActive: boolean;
};

export default function OrdersPage() {
  const router = useRouter();
  const { phone, loading: authLoading } = usePhoneAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!phone) {
      router.replace("/login?next=/orders");
      return;
    }

    fetch("/api/orders/mine")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, [phone, authLoading, router]);

  if (authLoading || !phone || loading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-emerald-100/60">
        Loading your orders…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Your orders</h1>
        <p className="mt-2 text-emerald-100/70">
          Signed in as {formatPhoneDisplay(phone)}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-5xl">📦</p>
          <p className="mt-4 text-emerald-100/70">No orders yet for this number.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white transition hover:bg-emerald-400"
          >
            Browse catalogue
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{order.id}</p>
                  <p className="text-sm text-emerald-100/60">
                    {new Date(order.createdAt).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                  </p>
                  <p className="mt-1 text-sm text-emerald-100/70">
                    {order.deliveryLocation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-300">{formatKes(order.total)}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                      order.status === "delivered"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-amber-500/20 text-amber-200"
                    }`}
                  >
                    {order.status === "delivered" ? "Delivered" : "On the way"}
                  </span>
                </div>
              </div>
              {order.linkActive && (
                <div className="mt-4">
                  <Link
                    href={`/track/${order.token}`}
                    className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    View receipt & track
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
