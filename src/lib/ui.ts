export const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-[#041912] px-4 py-3 text-white outline-none ring-emerald-400/50 placeholder:text-white/30 focus:ring-2";

export function formatPhoneDisplay(phone: string): string {
  if (phone.startsWith("254") && phone.length === 12) {
    return `0${phone.slice(3)}`;
  }
  return phone;
}
