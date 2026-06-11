"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatKes } from "@/lib/format";
import { adminButtonPrimary, adminCardClassName } from "@/lib/admin-ui";
import { formatOrderDate } from "@/lib/orders";
import { formatPhoneDisplay } from "@/lib/ui";
import type { Order } from "@/lib/order-types";

export default function AdminDeliveryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [delivering, setDelivering] = useState<string | null>(null);

  function loadQueue() {
    fetch("/api/admin/orders?status=pending_delivery")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadQueue();
  }, []);

  async function markDelivered(id: string) {
    setDelivering(id);
    await fetch(`/api/admin/orders/${id}/deliver`, { method: "POST" });
    setOrders((current) => current.filter((order) => order.id !== id));
    setDelivering(null);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Delivery queue"
        description="Orders waiting to be marked as delivered."
      />

      {loading ? (
        <AdminLoading label="Loading delivery queue…" />
      ) : orders.length === 0 ? (
        <AdminEmptyState
          emoji="✓"
          title="All caught up"
          description="No pending deliveries right now."
          action={
            <Link href="/admin/orders" className={adminButtonPrimary}>
              View all orders
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className={`${adminCardClassName} flex flex-wrap items-start justify-between gap-4 p-5`}
            >
              <div className="space-y-1">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-lg font-semibold text-white hover:text-emerald-200"
                >
                  {order.id}
                </Link>
                <p className="text-sm text-emerald-100/70">
                  {order.name} · {formatPhoneDisplay(order.phone)}
                </p>
                <p className="text-sm text-emerald-100/60">{order.deliveryLocation}</p>
                <p className="text-xs text-emerald-100/40">
                  {formatOrderDate(order.createdAt)} · {order.items.length} items · {formatKes(order.total)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => markDelivered(order.id)}
                disabled={delivering === order.id}
                className={adminButtonPrimary}
              >
                {delivering === order.id ? "Updating…" : "Mark delivered"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
