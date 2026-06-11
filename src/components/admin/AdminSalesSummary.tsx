import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { formatKes } from "@/lib/format";
import { adminCardClassName } from "@/lib/admin-ui";
import type { SalesStats } from "@/lib/sales";

type Props = {
  stats: SalesStats;
  compact?: boolean;
};

export function AdminSalesSummary({ stats, compact = false }: Props) {
  if (compact) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStatCard label="Total sales" value={formatKes(stats.totalSales)} />
        <AdminStatCard label="Sales today" value={formatKes(stats.salesToday)} />
        <AdminStatCard
          label="Avg. order"
          value={formatKes(stats.averageOrderValue)}
          detail={`${stats.orderCount} orders`}
        />
      </div>
    );
  }

  return (
    <section
      className={`${adminCardClassName} relative overflow-hidden bg-gradient-to-br from-[#0b4a33] via-[#062318] to-[#041912] p-6 sm:p-8`}
    >
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
            Total sales
          </p>
          <p className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            {formatKes(stats.totalSales)}
          </p>
          <p className="mt-2 text-emerald-100/70">
            {stats.orderCount} order{stats.orderCount !== 1 ? "s" : ""} · avg{" "}
            {formatKes(stats.averageOrderValue)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs text-emerald-100/60">Today</p>
            <p className="mt-1 text-lg font-bold text-emerald-300">
              {formatKes(stats.salesToday)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs text-emerald-100/60">Delivered</p>
            <p className="mt-1 text-lg font-bold text-white">
              {formatKes(stats.deliveredSales)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs text-emerald-100/60">Pending</p>
            <p className="mt-1 text-lg font-bold text-amber-200">
              {formatKes(stats.pendingSales)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
