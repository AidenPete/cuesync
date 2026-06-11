import { NextResponse } from "next/server";
import { lookupCustomerProfile } from "@/lib/customers";
import { getVerifiedPhone } from "@/lib/phone-session";
import { normalizePhone } from "@/lib/format";

export async function GET(request: Request) {
  const verifiedPhone = await getVerifiedPhone();
  if (!verifiedPhone) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requested = normalizePhone(searchParams.get("phone") ?? "");

  if (requested !== verifiedPhone) {
    return NextResponse.json({ customer: null }, { status: 403 });
  }

  const customer = await lookupCustomerProfile(verifiedPhone);
  return NextResponse.json({ customer });
}
