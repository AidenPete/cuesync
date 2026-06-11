import { NextResponse } from "next/server";
import { createCustomer, listCustomers } from "@/lib/customers";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";
import { requireAdminApi } from "@/lib/admin-guard";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const customers = await listCustomers();
  return NextResponse.json({ customers });
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const phone = normalizePhone(String(body.phone ?? ""));
  const deliveryLocation = String(body.deliveryLocation ?? "").trim();
  const notes = body.notes ? String(body.notes).trim() : undefined;

  if (!name || !isValidKenyanPhone(phone)) {
    return NextResponse.json(
      { message: "Name and a valid phone number are required." },
      { status: 400 },
    );
  }

  const result = await createCustomer({
    phone,
    name,
    deliveryLocation,
    notes,
  });

  if (result.error || !result.record) {
    return NextResponse.json(
      { message: result.error ?? "Could not create customer." },
      { status: 400 },
    );
  }

  return NextResponse.json({ customer: result.record }, { status: 201 });
}
