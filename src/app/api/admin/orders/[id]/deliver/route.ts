import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { markOrderDeliveredById, updateOrder } from "@/lib/order-db";
import { parseRiderInput } from "@/lib/rider";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { updates: riderUpdates, error: riderError } = parseRiderInput(body);
  if (riderError) {
    return NextResponse.json({ message: riderError }, { status: 400 });
  }

  if (Object.keys(riderUpdates).length > 0) {
    const updated = await updateOrder(id, riderUpdates);
    if (!updated) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }
  }

  const order = await markOrderDeliveredById(id);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
