"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatKes } from "@/lib/format";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminCardClassName,
  adminInputClassName,
  adminLabelClassName,
} from "@/lib/admin-ui";
import { formatOrderDate } from "@/lib/orders";
import { formatPhoneDisplay } from "@/lib/ui";
import type { Order } from "@/lib/order-types";

type RiderDraft = {
  riderName: string;
  riderPhone: string;
};

function riderDraftFromOrder(order: Order): RiderDraft {
  return {
    riderName: order.riderName ?? "",
    riderPhone: order.riderPhone ? order.riderPhone.replace(/^254/, "0") : "",
  };
}

export default function AdminDeliveryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [delivering, setDelivering] = useState<string | null>(null);
  const [savingRider, setSavingRider] = useState<string | null>(null);
  const [riders, setRiders] = useState<Record<string, RiderDraft>>({});
  const [message, setMessage] = useState("");

  function loadQueue() {
    setLoading(true);
    fetch("/api/admin/orders?status=pending_delivery")
      .then((response) => response.json())
      .then((data) => {
        const nextOrders = (data.orders ?? []) as Order[];
        setOrders(nextOrders);
        setRiders(
          Object.fromEntries(
            nextOrders.map((order) => [order.id, riderDraftFromOrder(order)]),
          ),
        );
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadQueue();
  }, []);

  function updateRiderDraft(orderId: string, field: keyof RiderDraft, value: string) {
    setRiders((current) => ({
      ...current,
      [orderId]: {
        ...current[orderId],
        [field]: value,
      },
    }));
  }

  async function saveRider(orderId: string) {
    setSavingRider(orderId);
    setMessage("");
    const draft = riders[orderId];
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        riderName: draft.riderName,
        riderPhone: draft.riderPhone,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Could not save rider.");
      setSavingRider(null);
      return;
    }
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? data.order : order)),
    );
    setRiders((current) => ({
      ...current,
      [orderId]: riderDraftFromOrder(data.order),
    }));
    setMessage("Rider saved.");
    setSavingRider(null);
  }

  async function markDelivered(id: string) {
    setDelivering(id);
    setMessage("");
    const draft = riders[id];
    const response = await fetch(`/api/admin/orders/${id}/deliver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        riderName: draft.riderName,
        riderPhone: draft.riderPhone,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Could not mark delivered.");
      setDelivering(null);
      return;
    }
    setOrders((current) => current.filter((order) => order.id !== id));
    setDelivering(null);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Delivery queue"
        description="Assign a rider and mark orders delivered when they arrive."
      />

      {message && (
        <p className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      )}

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
          {orders.map((order) => {
            const draft = riders[order.id] ?? riderDraftFromOrder(order);

            return (
              <li
                key={order.id}
                className={`${adminCardClassName} space-y-4 p-5`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
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
                      {formatOrderDate(order.createdAt)} · {order.items.length} items ·{" "}
                      {formatKes(order.total)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className={adminLabelClassName}>Rider name</span>
                    <input
                      value={draft.riderName}
                      onChange={(event) =>
                        updateRiderDraft(order.id, "riderName", event.target.value)
                      }
                      placeholder="e.g. James"
                      className={adminInputClassName}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className={adminLabelClassName}>Rider phone</span>
                    <input
                      value={draft.riderPhone}
                      onChange={(event) =>
                        updateRiderDraft(order.id, "riderPhone", event.target.value)
                      }
                      placeholder="07XX XXX XXX"
                      inputMode="tel"
                      className={adminInputClassName}
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => saveRider(order.id)}
                    disabled={savingRider === order.id || delivering === order.id}
                    className={adminButtonSecondary}
                  >
                    {savingRider === order.id ? "Saving…" : "Save rider"}
                  </button>
                  <button
                    type="button"
                    onClick={() => markDelivered(order.id)}
                    disabled={delivering === order.id || savingRider === order.id}
                    className={adminButtonPrimary}
                  >
                    {delivering === order.id ? "Updating…" : "Mark delivered"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
