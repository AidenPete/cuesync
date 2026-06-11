import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";

export async function requireAdminApi() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  return null;
}
