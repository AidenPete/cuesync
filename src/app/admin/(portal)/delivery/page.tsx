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

function buildRiderState(orders: Order[]) {
  return Object.fromEntries(
    orders.map((order) => [order.id, riderDraftFromOrder(order)]),
  );
}

type OrderCardProps = {
  order: Order;
  draft: RiderDraft;
  savingRider: string | null;
  actionLoading: string | null;
  onRiderChange: (orderId: string, field: keyof RiderDraft, value: string) => void;
  onSaveRider: (orderId: string) => void;
  primaryAction: {
    label: string;
    loadingLabel: string;
    onClick: (orderId: string) => void;
    actionKey: string;
  };
};

function DeliveryOrderCard({
  order,
  draft,
  savingRider,
  actionLoading,
  onRiderChange,
  onSaveRider,
  primaryAction,
}: OrderCardProps) {
  const busy = savingRider === order.id || actionLoading === order.id;

  return (
    <li className={`${adminCardClassName} space-y-4 p-5`}>
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

      <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className={adminLabelClassName}>Rider name (optional)</span>
          <input
            value={draft.riderName}
            onChange={(event) => onRiderChange(order.id, "riderName", event.target.value)}
            placeholder="e.g. James"
            className={adminInputClassName}
          />
        </label>
        <label className="block space-y-2">
          <span className={adminLabelClassName}>Rider phone (optional)</span>
          <input
            value={draft.riderPhone}
            onChange={(event) => onRiderChange(order.id, "riderPhone", event.target.value)}
            placeholder="07XX XXX XXX"
            inputMode="tel"
            className={adminInputClassName}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSaveRider(order.id)}
          disabled={busy}
          className={adminButtonSecondary}
        >
          {savingRider === order.id ? "Saving…" : "Save rider"}
        </button>
        <button
          type="button"
          onClick={() => primaryAction.onClick(order.id)}
          disabled={busy}
          className={adminButtonPrimary}
        >
          {actionLoading === order.id ? primaryAction.loadingLabel : primaryAction.label}
        </button>
      </div>
    </li>
  );
}

export default function AdminDeliveryPage() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [transitOrders, setTransitOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [savingRider, setSavingRider] = useState<string | null>(null);
  const [riders, setRiders] = useState<Record<string, RiderDraft>>({});
  const [message, setMessage] = useState("");

  function loadQueue() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/orders?status=pending_delivery").then((response) => response.json()),
      fetch("/api/admin/orders?status=in_transit").then((response) => response.json()),
    ])
      .then(([pendingData, transitData]) => {
        const pending = (pendingData.orders ?? []) as Order[];
        const transit = (transitData.orders ?? []) as Order[];
        setPendingOrders(pending);
        setTransitOrders(transit);
        setRiders(buildRiderState([...pending, ...transit]));
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

  async function patchOrder(
    orderId: string,
    body: Record<string, string>,
  ): Promise<{ ok: boolean; order?: Order; message?: string }> {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return {
      ok: response.ok,
      order: data.order,
      message: data.message,
    };
  }

  async function saveRider(orderId: string) {
    setSavingRider(orderId);
    setMessage("");
    const draft = riders[orderId];
    const result = await patchOrder(orderId, {
      riderName: draft.riderName,
      riderPhone: draft.riderPhone,
    });
    if (!result.ok || !result.order) {
      setMessage(result.message || "Could not save rider.");
      setSavingRider(null);
      return;
    }
    const order = result.order;
    setPendingOrders((current) =>
      current.map((entry) => (entry.id === orderId ? order : entry)),
    );
    setTransitOrders((current) =>
      current.map((entry) => (entry.id === orderId ? order : entry)),
    );
    setRiders((current) => ({
      ...current,
      [orderId]: riderDraftFromOrder(order),
    }));
    setMessage("Rider saved.");
    setSavingRider(null);
  }

  async function markInTransit(id: string) {
    setActionLoading(id);
    setMessage("");
    const draft = riders[id];
    const result = await patchOrder(id, {
      status: "in_transit",
      riderName: draft.riderName,
      riderPhone: draft.riderPhone,
    });
    if (!result.ok || !result.order) {
      setMessage(result.message || "Could not update order.");
      setActionLoading(null);
      return;
    }
    const order = result.order;
    setPendingOrders((current) => current.filter((entry) => entry.id !== id));
    setTransitOrders((current) => [order, ...current.filter((entry) => entry.id !== id)]);
    setRiders((current) => ({
      ...current,
      [id]: riderDraftFromOrder(order),
    }));
    setMessage("Order marked on transit.");
    setActionLoading(null);
  }

  async function markDelivered(id: string) {
    setActionLoading(id);
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
      setActionLoading(null);
      return;
    }
    setTransitOrders((current) => current.filter((order) => order.id !== id));
    setMessage("Order marked delivered.");
    setActionLoading(null);
  }

  const queueEmpty = pendingOrders.length === 0 && transitOrders.length === 0;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Delivery queue"
        description="Assign an optional rider, mark orders on transit, then complete delivery."
      />

      {message && (
        <p className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      )}

      {loading ? (
        <AdminLoading label="Loading delivery queue…" />
      ) : queueEmpty ? (
        <AdminEmptyState
          emoji="✓"
          title="All caught up"
          description="No pending or in-transit deliveries right now."
          action={
            <Link href="/admin/orders" className={adminButtonPrimary}>
              View all orders
            </Link>
          }
        />
      ) : (
        <div className="space-y-10">
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Awaiting dispatch</h2>
              <p className="text-sm text-emerald-100/60">
                Orders ready to go out for delivery.
              </p>
            </div>
            {pendingOrders.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-100/60">
                No orders waiting for dispatch.
              </p>
            ) : (
              <ul className="space-y-4">
                {pendingOrders.map((order) => (
                  <DeliveryOrderCard
                    key={order.id}
                    order={order}
                    draft={riders[order.id] ?? riderDraftFromOrder(order)}
                    savingRider={savingRider}
                    actionLoading={actionLoading}
                    onRiderChange={updateRiderDraft}
                    onSaveRider={saveRider}
                    primaryAction={{
                      label: "Order on transit",
                      loadingLabel: "Updating…",
                      onClick: markInTransit,
                      actionKey: "transit",
                    }}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">On transit</h2>
              <p className="text-sm text-emerald-100/60">
                Orders currently out for delivery.
              </p>
            </div>
            {transitOrders.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-100/60">
                No orders in transit right now.
              </p>
            ) : (
              <ul className="space-y-4">
                {transitOrders.map((order) => (
                  <DeliveryOrderCard
                    key={order.id}
                    order={order}
                    draft={riders[order.id] ?? riderDraftFromOrder(order)}
                    savingRider={savingRider}
                    actionLoading={actionLoading}
                    onRiderChange={updateRiderDraft}
                    onSaveRider={saveRider}
                    primaryAction={{
                      label: "Mark delivered",
                      loadingLabel: "Updating…",
                      onClick: markDelivered,
                      actionKey: "deliver",
                    }}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
