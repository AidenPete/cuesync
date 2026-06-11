"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSalesSummary } from "@/components/admin/AdminSalesSummary";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { formatKes } from "@/lib/format";
import { adminCardClassName } from "@/lib/admin-ui";
import { formatOrderDate } from "@/lib/orders";
import type { SalesStats } from "@/lib/sales";

type Stats = SalesStats & {
  pendingDelivery: number;
  ordersToday: number;
  productCount: number;
  customerCount: number;
  preorderCount: number;
  wishlistCount: number;
  lowStockCount: number;
  outOfStockCount: number;
};

type OrderRow = {
  id: string;
  name: string;
  total: number;
  status: "pending_delivery" | "delivered";
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading label="Loading dashboard…" />;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track orders, deliveries, and shop performance at a glance."
      />

      <AdminSalesSummary stats={stats} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Pending delivery"
          value={stats.pendingDelivery}
          href="/admin/delivery"
          detail="Needs action"
        />
        <AdminStatCard
          label="Orders today"
          value={stats.ordersToday}
          href="/admin/orders"
          detail={formatKes(stats.salesToday)}
        />
        <AdminStatCard
          label="Customers"
          value={stats.customerCount}
          href="/admin/customers"
        />
        <AdminStatCard
          label="Products"
          value={stats.productCount}
          href="/admin/products"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Out of stock"
          value={stats.outOfStockCount}
          href="/admin/products"
          detail="Needs restock or preorders"
        />
        <AdminStatCard
          label="Low stock"
          value={stats.lowStockCount}
          href="/admin/products"
          detail="5 or fewer left"
        />
        <AdminStatCard
          label="Preorders"
          value={stats.preorderCount}
          href="/admin/preorders"
        />
        <AdminStatCard
          label="Wishlists"
          value={stats.wishlistCount}
          href="/admin/preorders"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminStatCard
          label="Delivered sales"
          value={formatKes(stats.deliveredSales)}
          href="/admin/orders"
          detail={`${stats.pendingSales > 0 ? `${formatKes(stats.pendingSales)} pending` : "All fulfilled"}`}
        />
        <AdminStatCard
          label="Total requests"
          value={stats.preorderCount + stats.wishlistCount}
          href="/admin/preorders"
          detail="Preorders + wishlists"
        />
      </div>

      <section className={`${adminCardClassName} p-6`}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Recent orders</h2>
            <p className="text-sm text-emerald-100/60">Latest activity from checkout</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-emerald-100/50">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-semibold text-white transition hover:text-emerald-200"
                  >
                    {order.id}
                  </Link>
                  <p className="text-sm text-emerald-100/60">
                    {order.name} · {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <AdminStatusBadge status={order.status} />
                  <p className="font-bold text-emerald-300">{formatKes(order.total)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
