export function formatKes(amount: number): string {
  const formatted = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Ksh ${formatted}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;

  return digits;
}

export function isValidKenyanPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^2547\d{8}$/.test(normalized);
}
