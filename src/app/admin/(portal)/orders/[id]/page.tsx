"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReceiptView } from "@/components/ReceiptView";
import { OrderForm } from "@/components/admin/OrderForm";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { formatKes } from "@/lib/format";
import {
  adminButtonSecondary,
  adminCardClassName,
  adminMessageSuccess,
} from "@/lib/admin-ui";
import { formatOrderDate } from "@/lib/orders";
import { formatPhoneDisplay } from "@/lib/ui";
import type { Order } from "@/lib/order-types";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState("");

  function loadOrder() {
    fetch(`/api/admin/orders/${params.id}`)
      .then((response) => response.json())
      .then((data) => setOrder(data.order ?? null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  async function resendSms() {
    setActionLoading("resend");
    setMessage("");
    const response = await fetch(`/api/admin/orders/${params.id}/resend`, {
      method: "POST",
    });
    const data = await response.json();
    setMessage(response.ok ? data.message : data.message || "Could not send SMS.");
    setActionLoading("");
  }

  if (loading) return <AdminLoading label="Loading order…" />;
  if (!order) return <p className="text-red-200">Order not found.</p>;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Order"
        title={order.id}
        description={[
          `Placed ${formatOrderDate(order.createdAt)} · ${formatKes(order.total)}`,
          order.riderName
            ? `Rider: ${order.riderName}${order.riderPhone ? ` · ${formatPhoneDisplay(order.riderPhone)}` : ""}`
            : null,
        ]
          .filter(Boolean)
          .join(" · ")}
        backHref="/admin/orders"
        backLabel="Orders"
        action={
          <div className="flex flex-wrap gap-2">
            <AdminStatusBadge status={order.status} />
            <Link href={`/track/${order.token}`} target="_blank" rel="noopener noreferrer" className={adminButtonSecondary}>
              Track page ↗
            </Link>
            <button
              type="button"
              onClick={resendSms}
              disabled={actionLoading === "resend"}
              className={adminButtonSecondary}
            >
              {actionLoading === "resend" ? "Sending…" : "Resend SMS"}
            </button>
          </div>
        }
      />

      {message && <p className={adminMessageSuccess}>{message}</p>}

      <div className="grid gap-6 xl:grid-cols-2">
        <OrderForm
          order={order}
          onSave={async (updates) => {
            const response = await fetch(`/api/admin/orders/${order.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updates),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Could not save.");
            setOrder(data.order);
          }}
          onDelete={async () => {
            const response = await fetch(`/api/admin/orders/${order.id}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || "Could not delete.");
            }
            router.push("/admin/orders");
          }}
        />

        <div className={`${adminCardClassName} p-6`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Receipt</h2>
            <Link
              href={`/admin/customers/${encodeURIComponent(order.phone)}`}
              className="text-sm text-emerald-300 hover:text-emerald-200"
            >
              View customer →
            </Link>
          </div>
          <ReceiptView order={order} />
        </div>
      </div>
    </div>
  );
}
