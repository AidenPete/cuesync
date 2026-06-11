import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  if (!hash && !plain) {
    return password === "cuesync-admin";
  }

  if (hash) {
    return bcrypt.compare(password, hash);
  }

  const a = Buffer.from(password);
  const b = Buffer.from(plain!);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
