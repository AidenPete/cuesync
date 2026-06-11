"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSalesSummary } from "@/components/admin/AdminSalesSummary";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { formatKes } from "@/lib/format";
import { adminCardClassName } from "@/lib/admin-ui";
import { formatOrderDate } from "@/lib/orders";
import { formatPhoneDisplay } from "@/lib/ui";
import { computeSalesStats } from "@/lib/sales";
import type { Order, OrderStatus } from "@/lib/order-types";

type StatusFilter = "all" | OrderStatus;

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending_delivery", label: "Pending" },
  { value: "delivered", label: "Delivered" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/orders", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      all: orders.length,
      pending_delivery: orders.filter((order) => order.status === "pending_delivery")
        .length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    }),
    [orders],
  );

  const statusFiltered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return statusFiltered;

    return statusFiltered.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        order.deliveryLocation.toLowerCase().includes(query),
    );
  }, [search, statusFiltered]);

  const visibleSales = useMemo(
    () => computeSalesStats(visibleOrders),
    [visibleOrders],
  );

  const emptyTitle =
    search.trim().length > 0
      ? "No matching orders"
      : filter === "pending_delivery"
        ? "No pending orders"
        : filter === "delivered"
          ? "No delivered orders"
          : "No orders found";

  const emptyDescription =
    search.trim().length > 0
      ? "Try a different search term or clear the search box."
      : filter === "pending_delivery"
        ? "Every order has been delivered. Check the delivery queue when new orders come in."
        : filter === "delivered"
          ? "Delivered orders will appear here once you mark them complete."
          : "Orders will appear here after checkout.";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Sales"
        title="Orders"
        description="View, edit, and manage every customer order."
      />

      {!loading && visibleOrders.length > 0 && (
        <AdminSalesSummary stats={visibleSales} compact />
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === value
                  ? "bg-emerald-400 text-[#062318]"
                  : "border border-white/10 bg-white/5 text-emerald-100/70 hover:bg-white/10"
              }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  filter === value
                    ? "bg-[#062318]/15 text-[#062318]"
                    : "bg-white/10 text-emerald-100/80"
                }`}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search orders…"
          className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white outline-none ring-emerald-400/50 placeholder:text-white/30 focus:ring-2 lg:max-w-xs"
        />
      </div>

      {loading ? (
        <AdminLoading label="Loading orders…" />
      ) : visibleOrders.length === 0 ? (
        <AdminEmptyState emoji="📦" title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="grid gap-4">
            {visibleOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className={`${adminCardClassName} block p-5 transition hover:border-emerald-400/30 hover:bg-white/[0.07]`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="mt-1 text-sm text-emerald-100/70">
                      {order.name} · {formatPhoneDisplay(order.phone)}
                    </p>
                    <p className="truncate text-sm text-emerald-100/50">
                      {order.deliveryLocation}
                    </p>
                    {order.riderName && (
                      <p className="mt-1 text-xs text-emerald-100/40">
                        Rider: {order.riderName}
                        {order.riderPhone
                          ? ` · ${formatPhoneDisplay(order.riderPhone)}`
                          : ""}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-300">
                      {formatKes(order.total)}
                    </p>
                    <div className="mt-2 flex justify-end">
                      <AdminStatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 text-xs text-emerald-100/40">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-center text-sm text-emerald-100/50">
            {visibleOrders.length} order{visibleOrders.length !== 1 ? "s" : ""}
            {filter !== "all" ? ` · ${FILTER_OPTIONS.find((option) => option.value === filter)?.label}` : ""}
            {search.trim() ? " · matching search" : ""} ·{" "}
            <span className="font-semibold text-emerald-300">
              {formatKes(visibleSales.totalSales)} total sales
            </span>
          </p>
        </>
      )}
    </div>
  );
}
