import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { findOrderById, listOrders } from "@/lib/order-db";
import type { OrderStatus } from "@/lib/order-types";

export async function GET(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as OrderStatus | null;

  const orders = await listOrders(
    status === "pending_delivery" || status === "delivered"
      ? { status }
      : undefined,
  );

  return NextResponse.json({ orders });
}
