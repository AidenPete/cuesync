import type { Order } from "@/lib/order-types";

export type SalesStats = {
  totalSales: number;
  salesToday: number;
  deliveredSales: number;
  pendingSales: number;
  averageOrderValue: number;
  orderCount: number;
};

export function computeSalesStats(orders: Order[]): SalesStats {
  const today = new Date().toDateString();
  let salesToday = 0;
  let deliveredSales = 0;
  let pendingSales = 0;

  for (const order of orders) {
    if (new Date(order.createdAt).toDateString() === today) {
      salesToday += order.total;
    }
    if (order.status === "delivered") {
      deliveredSales += order.total;
    } else {
      pendingSales += order.total;
    }
  }

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = orders.length;

  return {
    totalSales,
    salesToday,
    deliveredSales,
    pendingSales,
    averageOrderValue: orderCount > 0 ? Math.round(totalSales / orderCount) : 0,
    orderCount,
  };
}
