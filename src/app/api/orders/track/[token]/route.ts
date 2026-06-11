import { NextResponse } from "next/server";
import { findOrderByToken, isTrackLinkValid } from "@/lib/order-db";

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  const order = await findOrderByToken(token);

  if (!order) {
    return NextResponse.json({ order: null, expired: true }, { status: 404 });
  }

  if (!isTrackLinkValid(order)) {
    return NextResponse.json({ order: null, expired: true }, { status: 410 });
  }

  return NextResponse.json({ order, expired: false });
}
