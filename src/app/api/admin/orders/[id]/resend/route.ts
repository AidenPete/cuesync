import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { findOrderById } from "@/lib/order-db";
import { SITE_URL } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/ui";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const order = await findOrderById(id);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  const trackUrl = `${SITE_URL}/track/${order.token}`;
  const message = `CueSync: Track order ${order.id} — ${trackUrl}`;

  console.log("[CueSync SMS mock]", {
    to: formatPhoneDisplay(order.phone),
    message,
  });

  return NextResponse.json({
    message: `Tracking link sent to ${formatPhoneDisplay(order.phone)}.`,
  });
}
