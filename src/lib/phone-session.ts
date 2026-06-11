import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "cuesync-phone";
const MAX_AGE = 60 * 60 * 24 * 30;

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "cuesync-dev-secret-change-me",
  );
}

export async function setVerifiedPhoneCookie(phone: string) {
  const token = await new SignJWT({ phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearVerifiedPhoneCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getVerifiedPhone(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const phone = payload.phone;
    return typeof phone === "string" ? phone : null;
  } catch {
    return null;
  }
}
