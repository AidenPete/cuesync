import { NextResponse } from "next/server";
import { lookupCustomerProfile } from "@/lib/customers";
import { findOrdersByPhone } from "@/lib/order-db";
import { getVerifiedPhone } from "@/lib/phone-session";

export async function GET() {
  const phone = await getVerifiedPhone();
  if (!phone) {
    return NextResponse.json({ message: "Sign in first." }, { status: 401 });
  }

  const [profile, orders] = await Promise.all([
    lookupCustomerProfile(phone),
    findOrdersByPhone(phone),
  ]);

  const activeOrders = orders.filter(
    (order) => order.status === "pending_delivery" || order.status === "in_transit",
  ).length;

  return NextResponse.json({
    phone,
    name: profile?.name ?? "",
    deliveryLocation: profile?.deliveryLocation ?? "",
    orderCount: orders.length,
    activeOrders,
  });
}
