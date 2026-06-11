import { NextResponse } from "next/server";
import { findOrdersByPhone, isTrackLinkValid } from "@/lib/order-db";
import { getVerifiedPhone } from "@/lib/phone-session";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const phone = await getVerifiedPhone();
  if (!phone) {
    return NextResponse.json({ orders: [] }, { status: 401 });
  }

  const rawOrders = await findOrdersByPhone(phone);
  const orders = rawOrders.map((order) => ({
    id: order.id,
    token: order.token,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    deliveryLocation: order.deliveryLocation,
    itemCount: order.items.length,
    trackUrl: `${SITE_URL}/track/${order.token}`,
    linkActive: isTrackLinkValid(order),
  }));

  return NextResponse.json({ orders });
}
