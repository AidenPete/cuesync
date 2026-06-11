import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function safeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");
  const productId = String(formData.get("productId") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Choose an image to upload." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) {
    return NextResponse.json(
      { message: "Use a JPG, PNG, or WebP image." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "Image must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const baseName = safeSlug(productId) || `product-${Date.now().toString(36)}`;
  const filename = `${baseName}.${extension}`;
  const productsDir = path.join(process.cwd(), "public/products");
  const filePath = path.join(productsDir, filename);

  await fs.mkdir(productsDir, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    path: `/products/${filename}`,
    filename,
  });
}
