import type { OrderStatus } from "@/lib/order-types";
import { statusLabel } from "@/lib/orders";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending_delivery: "bg-amber-400/20 text-amber-200",
  in_transit: "bg-sky-400/20 text-sky-200",
  delivered: "bg-emerald-500/20 text-emerald-200",
};

export function AdminStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
