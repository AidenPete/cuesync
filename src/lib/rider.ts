import { isValidKenyanPhone, normalizePhone } from "@/lib/format";

export type RiderInput = {
  riderName?: string;
  riderPhone?: string;
};

export function parseRiderInput(
  body: Record<string, unknown>,
): { updates: RiderInput; error?: string } {
  const updates: RiderInput = {};

  if (body.riderName !== undefined) {
    updates.riderName = String(body.riderName).trim();
  }

  if (body.riderPhone !== undefined) {
    const raw = String(body.riderPhone).trim();
    if (!raw) {
      updates.riderPhone = "";
    } else {
      const phone = normalizePhone(raw);
      if (!isValidKenyanPhone(phone)) {
        return { updates, error: "Invalid rider phone number." };
      }
      updates.riderPhone = phone;
    }
  }

  return { updates };
}
