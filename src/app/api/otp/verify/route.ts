import { NextResponse } from "next/server";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";
import { verifyOtp } from "@/lib/otp-store";
import { setVerifiedPhoneCookie } from "@/lib/phone-session";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = normalizePhone(String(body.phone ?? ""));
  const code = String(body.code ?? "").trim();

  if (!isValidKenyanPhone(phone) || !code) {
    return NextResponse.json(
      { message: "Phone number and code are required." },
      { status: 400 },
    );
  }

  if (!verifyOtp(phone, code)) {
    return NextResponse.json(
      { message: "Invalid or expired code. Request a new one." },
      { status: 401 },
    );
  }

  await setVerifiedPhoneCookie(phone);

  return NextResponse.json({ phone, verified: true });
}
