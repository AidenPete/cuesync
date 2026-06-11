import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { getCustomerDetail } from "@/lib/customers";
import { normalizePhone } from "@/lib/format";
import { sendMockSms, smsSentMessage } from "@/lib/sms";

type Params = { params: Promise<{ phone: string }> };

const MAX_SMS_LENGTH = 480;

export async function POST(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { phone: rawPhone } = await params;
  const phone = normalizePhone(decodeURIComponent(rawPhone));
  const body = await request.json();
  const message = String(body.message ?? "").trim();

  if (!message) {
    return NextResponse.json({ message: "SMS message is required." }, { status: 400 });
  }

  if (message.length > MAX_SMS_LENGTH) {
    return NextResponse.json(
      { message: `Message must be ${MAX_SMS_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  const customer = await getCustomerDetail(phone);
  if (!customer) {
    return NextResponse.json({ message: "Customer not found." }, { status: 404 });
  }

  sendMockSms(phone, message);

  return NextResponse.json({
    message: smsSentMessage(phone),
  });
}
