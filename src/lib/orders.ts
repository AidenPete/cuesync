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
  switch (status) {
    case "pending_delivery":
      return "Pending delivery";
    case "in_transit":
      return "On transit";
    case "delivered":
      return "Delivered";
  }
}

export function customerStatusLabel(status: Order["status"]): string {
  switch (status) {
    case "pending_delivery":
      return "Preparing";
    case "in_transit":
      return "On the way";
    case "delivered":
      return "Delivered";
  }
}

export function isOrderInFulfillment(status: Order["status"]): boolean {
  return status === "pending_delivery" || status === "in_transit";
}

export function accessExpiryLabel(iso: string): string {
  return formatOrderDate(iso);
}
