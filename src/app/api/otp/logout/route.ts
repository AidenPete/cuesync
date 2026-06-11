import { NextResponse } from "next/server";
import { clearVerifiedPhoneCookie } from "@/lib/phone-session";

export async function POST() {
  await clearVerifiedPhoneCookie();
  return NextResponse.json({ success: true });
}
