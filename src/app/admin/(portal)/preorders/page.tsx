"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { adminButtonDanger, adminCardClassName } from "@/lib/admin-ui";
import { formatOrderDate } from "@/lib/orders";
import { formatPhoneDisplay } from "@/lib/ui";
import type { ProductRequest } from "@/lib/product-request-types";

type Filter = "all" | "preorder" | "wishlist";

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "preorder", label: "Preorders" },
  { value: "wishlist", label: "Wishlists" },
];

const EMPTY_COPY: Record<Filter, { title: string; description: string }> = {
  all: {
    title: "No requests yet",
    description: "Preorders and wishlists from the shop or chat assistant will appear here.",
  },
  preorder: {
    title: "No preorders",
    description: "Preorder requests from the shop or chat will appear here.",
  },
  wishlist: {
    title: "No wishlists",
    description: "Wishlists from the chat assistant will appear here. The shop uses preorders only.",
  },
};

export default function AdminPreordersPage() {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [allRequests, setAllRequests] = useState<ProductRequest[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  function loadRequests() {
    setLoading(true);
    fetch("/api/admin/preorders", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setAllRequests(data.requests ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setRequests(allRequests);
      return;
    }
    setRequests(allRequests.filter((request) => request.type === filter));
  }, [allRequests, filter]);

  const counts = {
    all: allRequests.length,
    preorder: allRequests.filter((request) => request.type === "preorder").length,
    wishlist: allRequests.filter((request) => request.type === "wishlist").length,
  };

  async function removeRequest(id: string) {
    if (!confirm("Delete this request?")) return;
    setDeleting(id);
    await fetch(`/api/admin/preorders/${id}`, { method: "DELETE" });
    setAllRequests((current) => current.filter((entry) => entry.id !== id));
    setDeleting(null);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Demand"
        title="Preorders & wishlists"
        description="Customer preorders from the shop and chat assistant. Wishlists are collected via chat only."
      />

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

      {loading ? (
        <AdminLoading label="Loading requests…" />
      ) : requests.length === 0 ? (
        <AdminEmptyState
          emoji="💬"
          title={EMPTY_COPY[filter].title}
          description={EMPTY_COPY[filter].description}
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {requests.map((request) => (
            <li key={request.id} className={`${adminCardClassName} space-y-3 p-5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        request.type === "preorder"
                          ? "bg-amber-400/20 text-amber-200"
                          : "bg-emerald-500/20 text-emerald-200"
                      }`}
                    >
                      {request.type === "preorder" ? "Preorder" : "Wishlist"}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-emerald-100/70">
                      {request.source === "chat" ? "Chat" : "Shop"}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold text-white">{request.name}</p>
                  <p className="text-sm text-emerald-100/70">
                    {formatPhoneDisplay(request.phone)}
                  </p>
                  <Link
                    href={`/admin/customers/${encodeURIComponent(request.phone)}`}
                    className="mt-2 inline-block text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    View customer →
                  </Link>
                </div>
                <p className="text-xs text-emerald-100/40">
                  {formatOrderDate(request.createdAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#041912]/60 px-4 py-3 text-sm">
                <p className="text-emerald-100/60">Product</p>
                <p className="font-medium text-white">{request.productName}</p>
                {request.productId && (
                  <p className="text-xs text-emerald-100/40">{request.productId}</p>
                )}
              </div>

              {request.deliveryLocation && (
                <p className="text-sm text-emerald-100/70">{request.deliveryLocation}</p>
              )}
              {request.notes && (
                <p className="text-sm text-emerald-100/50">{request.notes}</p>
              )}

              <button
                type="button"
                onClick={() => removeRequest(request.id)}
                disabled={deleting === request.id}
                className={adminButtonDanger}
              >
                {deleting === request.id ? "Deleting…" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
