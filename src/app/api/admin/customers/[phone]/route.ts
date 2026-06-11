import { NextResponse } from "next/server";
import {
  getCustomerDetail,
  removeCustomer,
  updateCustomer,
} from "@/lib/customers";
import { requireAdminApi } from "@/lib/admin-guard";
import { normalizePhone } from "@/lib/format";

type Params = { params: Promise<{ phone: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { phone } = await params;
  const customer = await getCustomerDetail(decodeURIComponent(phone));

  if (!customer) {
    return NextResponse.json({ message: "Customer not found." }, { status: 404 });
  }

  return NextResponse.json({ customer });
}

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { phone } = await params;
  const normalizedPhone = normalizePhone(decodeURIComponent(phone));
  const body = await request.json();

  const updates: {
    name?: string;
    deliveryLocation?: string;
    notes?: string;
  } = {};

  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.deliveryLocation !== undefined) {
    updates.deliveryLocation = String(body.deliveryLocation).trim();
  }
  if (body.notes !== undefined) updates.notes = String(body.notes).trim();

  const result = await updateCustomer(normalizedPhone, updates);
  if (result.error) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const customer = await getCustomerDetail(normalizedPhone);
  return NextResponse.json({ customer });
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { phone } = await params;
  const result = await removeCustomer(decodeURIComponent(phone));

  if (result.error) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  return NextResponse.json({
    message: "Customer removed.",
    removedRequests: result.removedRequests,
  });
}
