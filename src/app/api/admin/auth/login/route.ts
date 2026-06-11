import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { setAdminSession } from "@/lib/admin-session";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password ?? "");

  if (!password) {
    return NextResponse.json({ message: "Password required." }, { status: 400 });
  }

  const valid = await verifyAdminPassword(password);
  if (!valid) {
    return NextResponse.json({ message: "Invalid password." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ success: true });
}
