import { NextResponse } from "next/server";
import { getVerifiedPhone } from "@/lib/phone-session";

export async function GET() {
  const phone = await getVerifiedPhone();
  return NextResponse.json({ phone });
}
