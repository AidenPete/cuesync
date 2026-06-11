import type { OrderStatus } from "@/lib/order-types";
import { statusLabel } from "@/lib/orders";

export function AdminStatusBadge({ status }: { status: OrderStatus }) {
  const delivered = status === "delivered";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        delivered
          ? "bg-emerald-500/20 text-emerald-200"
          : "bg-amber-400/20 text-amber-200"
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}
