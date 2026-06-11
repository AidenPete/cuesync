import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { markOrderDeliveredById } from "@/lib/order-db";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const order = await markOrderDeliveredById(id);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
