"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { CustomerProductSms } from "@/components/admin/CustomerProductSms";
import { CustomerSmsComposer } from "@/components/admin/CustomerSmsComposer";
import { ProductShopLink } from "@/components/admin/ProductShopLink";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { formatKes } from "@/lib/format";
import {
  adminButtonDanger,
  adminCardClassName,
} from "@/lib/admin-ui";
import { formatOrderDate } from "@/lib/orders";
import { buildWishlistProductSms } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/ui";
import type { Order } from "@/lib/order-types";
import type { ProductRequest } from "@/lib/product-request-types";

type CustomerDetail = {
  phone: string;
  name: string;
  deliveryLocation: string;
  notes?: string;
  isStored: boolean;
  orders: Order[];
  wishlists: ProductRequest[];
  preorders: ProductRequest[];
  orderCount: number;
  totalSpent: number;
  wishlistCount: number;
  preorderCount: number;
};

export default function AdminCustomerDetailPage() {
  const params = useParams<{ phone: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingRequest, setDeletingRequest] = useState<string | null>(null);

  const loadCustomer = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/customers/${params.phone}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setCustomer(data.customer ?? null))
      .finally(() => setLoading(false));
  }, [params.phone]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  async function removeRequest(id: string) {
    if (!confirm("Remove this request?")) return;
    setDeletingRequest(id);
    await fetch(`/api/admin/preorders/${id}`, { method: "DELETE" });
    setCustomer((current) => {
      if (!current) return current;
      return {
        ...current,
        wishlists: current.wishlists.filter((entry) => entry.id !== id),
        preorders: current.preorders.filter((entry) => entry.id !== id),
        wishlistCount: current.wishlists.filter((entry) => entry.id !== id).length,
        preorderCount: current.preorders.filter((entry) => entry.id !== id).length,
      };
    });
    setDeletingRequest(null);
  }

  if (loading) return <AdminLoading label="Loading customer…" />;
  if (!customer) return <p className="text-red-200">Customer not found.</p>;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Customer"
        title={customer.name}
        description={`${formatPhoneDisplay(customer.phone)}${customer.deliveryLocation ? ` · ${customer.deliveryLocation}` : ""}`}
        backHref="/admin/customers"
        backLabel="Customers"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Orders" value={customer.orderCount} />
        <AdminStatCard label="Total spent" value={formatKes(customer.totalSpent)} />
        <AdminStatCard label="Wishlists" value={customer.wishlistCount} />
        <AdminStatCard label="Preorders" value={customer.preorderCount} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="space-y-8">
          <CustomerProductSms phone={customer.phone} customerName={customer.name} />

          {customer.wishlists.length > 0 && (
            <section className={`${adminCardClassName} p-6`}>
              <h2 className="mb-4 text-xl font-bold text-white">Wishlists</h2>
              <ul className="space-y-4">
                {customer.wishlists.map((request) => (
                  <li
                    key={request.id}
                    className="rounded-2xl border border-white/10 bg-[#041912]/40 p-4"
                  >
                    <div className="space-y-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{request.productName}</p>
                        <p className="mt-1 text-sm text-emerald-100/60">
                          Saved {formatOrderDate(request.createdAt)}
                          {request.source === "chat" ? " · via chat" : " · via shop"}
                        </p>
                        {request.productId && (
                          <div className="mt-3 space-y-2">
                            <ProductShopLink productId={request.productId} compact />
                            <Link
                              href={`/shop/${request.productId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-sm text-emerald-300 hover:text-emerald-200"
                            >
                              View product ↗
                            </Link>
                          </div>
                        )}
                        {request.notes && (
                          <p className="mt-3 text-sm text-emerald-100/50">{request.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <CustomerSmsComposer
                          phone={customer.phone}
                          productLabel={request.productName}
                          compact
                          initialMessage={buildWishlistProductSms(
                            customer.name,
                            request.productName,
                            request.productId,
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => removeRequest(request.id)}
                          disabled={deletingRequest === request.id}
                          className={adminButtonDanger}
                        >
                          {deletingRequest === request.id ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {customer.preorders.length > 0 && (
            <section className={`${adminCardClassName} p-6`}>
              <h2 className="mb-4 text-xl font-bold text-white">Preorders</h2>
              <ul className="space-y-4">
                {customer.preorders.map((request) => (
                  <li
                    key={request.id}
                    className="rounded-2xl border border-white/10 bg-[#041912]/40 p-4"
                  >
                    <div className="space-y-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{request.productName}</p>
                        <p className="mt-1 text-sm text-emerald-100/60">
                          Requested {formatOrderDate(request.createdAt)}
                        </p>
                        {request.productId && (
                          <div className="mt-3">
                            <ProductShopLink productId={request.productId} compact />
                          </div>
                        )}
                        {request.deliveryLocation && (
                          <p className="mt-2 text-sm text-emerald-100/70">
                            {request.deliveryLocation}
                          </p>
                        )}
                        {request.notes && (
                          <p className="mt-3 text-sm text-emerald-100/50">{request.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <CustomerSmsComposer
                          phone={customer.phone}
                          productLabel={request.productName}
                          compact
                          initialMessage={buildWishlistProductSms(
                            customer.name,
                            request.productName,
                            request.productId,
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => removeRequest(request.id)}
                          disabled={deletingRequest === request.id}
                          className={adminButtonDanger}
                        >
                          {deletingRequest === request.id ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {customer.orders.length > 0 ? (
            <section className={`${adminCardClassName} p-6`}>
              <h2 className="mb-4 text-xl font-bold text-white">Order history</h2>
              <ul className="divide-y divide-white/5">
                {customer.orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-white hover:text-emerald-200"
                      >
                        {order.id}
                      </Link>
                      <p className="text-sm text-emerald-100/60">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <AdminStatusBadge status={order.status} />
                      <p className="font-bold text-emerald-300">{formatKes(order.total)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className={`${adminCardClassName} p-6`}>
              <h2 className="mb-2 text-xl font-bold text-white">Order history</h2>
              <p className="text-sm text-emerald-100/60">No orders yet.</p>
            </section>
          )}
        </div>

        <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <CustomerForm
            mode="edit"
            initial={{
              name: customer.name,
              phone: customer.phone,
              deliveryLocation: customer.deliveryLocation,
              notes: customer.notes ?? "",
            }}
            onSubmit={async (values) => {
              const response = await fetch(
                `/api/admin/customers/${encodeURIComponent(customer.phone)}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: values.name,
                    deliveryLocation: values.deliveryLocation,
                    notes: values.notes,
                  }),
                },
              );
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.message || "Could not save customer.");
              }
              setCustomer(data.customer);
            }}
            onDelete={
              customer.orderCount > 0
                ? undefined
                : async () => {
                    const response = await fetch(
                      `/api/admin/customers/${encodeURIComponent(customer.phone)}`,
                      { method: "DELETE" },
                    );
                    const data = await response.json();
                    if (!response.ok) {
                      throw new Error(data.message || "Could not delete customer.");
                    }
                    router.push("/admin/customers");
                  }
            }
          />

          {customer.orderCount > 0 && (
            <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              Customers with orders cannot be deleted. Order history is kept on file.
            </p>
          )}

          {customer.notes && (
            <section className={`${adminCardClassName} p-5`}>
              <h3 className="text-sm font-medium text-emerald-100/60">Notes</h3>
              <p className="mt-2 text-sm text-white">{customer.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
