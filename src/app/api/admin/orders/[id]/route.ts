import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { deleteOrder, findOrderById, updateOrder } from "@/lib/order-db";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";
import { parseRiderInput } from "@/lib/rider";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const order = await findOrderById(id);
  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    order,
    trackUrl: `${SITE_URL}/track/${order.token}`,
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  const updates: {
    name?: string;
    phone?: string;
    deliveryLocation?: string;
    status?: "pending_delivery" | "in_transit" | "delivered";
    riderName?: string;
    riderPhone?: string;
  } = {};

  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.deliveryLocation !== undefined) {
    updates.deliveryLocation = String(body.deliveryLocation).trim();
  }
  if (body.phone !== undefined) {
    const phone = normalizePhone(String(body.phone));
    if (!isValidKenyanPhone(phone)) {
      return NextResponse.json({ message: "Invalid phone number." }, { status: 400 });
    }
    updates.phone = phone;
  }
  if (
    body.status === "pending_delivery" ||
    body.status === "in_transit" ||
    body.status === "delivered"
  ) {
    updates.status = body.status;
  }

  const { updates: riderUpdates, error: riderError } = parseRiderInput(body);
  if (riderError) {
    return NextResponse.json({ message: riderError }, { status: 400 });
  }
  Object.assign(updates, riderUpdates);

  const order = await updateOrder(id, updates);
  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const removed = await deleteOrder(id);
  if (!removed) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
