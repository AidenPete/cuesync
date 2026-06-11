import { NextResponse } from "next/server";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";
import { createOtpCode, saveOtp } from "@/lib/otp-store";
import { formatPhoneDisplay } from "@/lib/ui";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = normalizePhone(String(body.phone ?? ""));

  if (!isValidKenyanPhone(phone)) {
    return NextResponse.json(
      { message: "Enter a valid phone number (e.g. 0712 345 678)." },
      { status: 400 },
    );
  }

  const code = createOtpCode();
  saveOtp(phone, code);

  const message = `Your CueSync code is ${code}. Valid for 10 minutes.`;
  console.log("[CueSync OTP SMS mock]", {
    to: formatPhoneDisplay(phone),
    message,
  });

  return NextResponse.json({
    message: `Code sent to ${formatPhoneDisplay(phone)}.`,
    demoCode: code,
  });
}
