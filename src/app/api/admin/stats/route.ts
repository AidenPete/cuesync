import { NextResponse } from "next/server";
import { listCustomers } from "@/lib/customers";
import { requireAdminApi } from "@/lib/admin-guard";
import { listOrders } from "@/lib/order-db";
import { listProducts } from "@/lib/product-db";
import { countProductRequests } from "@/lib/product-requests";
import { computeSalesStats } from "@/lib/sales";
import { getAvailability } from "@/lib/inventory";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const [orders, products, customers, requestCounts] = await Promise.all([
    listOrders(),
    listProducts(),
    listCustomers(),
    countProductRequests(),
  ]);

  const pendingDelivery = orders.filter(
    (order) => order.status === "pending_delivery",
  ).length;
  const delivered = orders.filter((order) => order.status === "delivered").length;
  const sales = computeSalesStats(orders);
  const today = new Date().toDateString();
  const ordersToday = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === today,
  ).length;

  const lowStockCount = products.filter(
    (product) => getAvailability(product) === "low_stock",
  ).length;
  const outOfStockCount = products.filter(
    (product) => getAvailability(product) === "out_of_stock",
  ).length;

  return NextResponse.json({
    stats: {
      totalOrders: orders.length,
      orderCount: orders.length,
      pendingDelivery,
      delivered,
      revenue: sales.totalSales,
      totalSales: sales.totalSales,
      salesToday: sales.salesToday,
      deliveredSales: sales.deliveredSales,
      pendingSales: sales.pendingSales,
      averageOrderValue: sales.averageOrderValue,
      ordersToday,
      productCount: products.length,
      customerCount: customers.length,
      preorderCount: requestCounts.preorders,
      wishlistCount: requestCounts.wishlists,
      requestCount: requestCounts.total,
      lowStockCount,
      outOfStockCount,
    },
    sales,
    recentOrders: orders.slice(0, 5),
  });
}
