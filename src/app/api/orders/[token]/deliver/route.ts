import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { markOrderDelivered } from "@/lib/order-db";

type Params = { params: Promise<{ token: string }> };

export async function POST(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { token } = await params;
  const order = await markOrderDelivered(token);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
