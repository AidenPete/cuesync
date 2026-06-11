import { NextResponse } from "next/server";
import { findOrdersByPhone } from "@/lib/order-db";
import { getVerifiedPhone } from "@/lib/phone-session";
import { SITE_URL } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/ui";

export async function POST(request: Request) {
  const phone = await getVerifiedPhone();
  if (!phone) {
    return NextResponse.json({ message: "Sign in first." }, { status: 401 });
  }

  const body = await request.json();
  const orderId = String(body.orderId ?? "");

  const orders = await findOrdersByPhone(phone);
  const order = orders.find((entry) => entry.id === orderId);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  const trackUrl = `${SITE_URL}/track/${order.token}`;
  const message = `CueSync: Track order ${order.id} — ${trackUrl}`;

  console.log("[CueSync SMS mock]", {
    to: formatPhoneDisplay(phone),
    message,
  });

  return NextResponse.json({
    message: `Tracking link sent to ${formatPhoneDisplay(phone)}.`,
  });
}
