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

type Customer = {
  phone: string;
  name: string;
  deliveryLocation: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  pendingCount: number;
  wishlistCount: number;
  preorderCount: number;
  lastActivityAt: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data.customers ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((customer) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.deliveryLocation.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="People"
        title="Customers"
        description="Manage customer profiles, wishlists, preorders, and send product SMS."
        action={
          <Link href="/admin/customers/new" className={adminButtonPrimary}>
            + Add customer
          </Link>
        }
      />

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search customers…"
        className="w-full max-w-md rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white outline-none ring-emerald-400/50 placeholder:text-white/30 focus:ring-2"
      />

      {loading ? (
        <AdminLoading label="Loading customers…" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          emoji="👤"
          title="No customers yet"
          description="Add a customer manually or they will appear after an order, preorder, or wishlist."
          action={
            <Link href="/admin/customers/new" className={adminButtonPrimary}>
              Add customer
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((customer) => (
            <Link
              key={customer.phone}
              href={`/admin/customers/${encodeURIComponent(customer.phone)}`}
              className={`${adminCardClassName} block p-5 transition hover:border-emerald-400/30 hover:bg-white/[0.07]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                  <p className="text-sm text-emerald-100/70">
                    {formatPhoneDisplay(customer.phone)}
                  </p>
                  {customer.deliveryLocation && (
                    <p className="mt-2 line-clamp-2 text-sm text-emerald-100/50">
                      {customer.deliveryLocation}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {customer.pendingCount > 0 && (
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200">
                      {customer.pendingCount} pending
                    </span>
                  )}
                  {customer.wishlistCount > 0 && (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                      {customer.wishlistCount} wishlist
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm">
                <span className="text-emerald-100/60">
                  {customer.orderCount} order{customer.orderCount !== 1 ? "s" : ""}
                  {customer.preorderCount > 0
                    ? ` · ${customer.preorderCount} preorder${customer.preorderCount !== 1 ? "s" : ""}`
                    : ""}
                </span>
                <span className="font-bold text-emerald-300">
                  {customer.totalSpent > 0 ? formatKes(customer.totalSpent) : "—"}
                </span>
              </div>
              <p className="mt-2 text-xs text-emerald-100/40">
                Last activity {formatOrderDate(customer.lastActivityAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
