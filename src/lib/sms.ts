import { formatPhoneDisplay } from "@/lib/ui";

export function sendMockSms(phone: string, message: string) {
  console.log("[CueSync SMS mock]", {
    to: formatPhoneDisplay(phone),
    message,
  });
}

export function smsSentMessage(phone: string) {
  return `SMS sent to ${formatPhoneDisplay(phone)}.`;
}
