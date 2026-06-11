import type { Order } from "@/lib/order-types";

export function formatOrderDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function sortOrdersNewestFirst(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function statusLabel(status: Order["status"]): string {
  return status === "pending_delivery" ? "Pending delivery" : "Delivered";
}

export function accessExpiryLabel(iso: string): string {
  return formatOrderDate(iso);
}
