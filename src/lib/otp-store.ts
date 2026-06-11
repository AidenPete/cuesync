type OtpRecord = {
  phone: string;
  code: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();

const OTP_TTL_MS = 10 * 60 * 1000;

export function createOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOtp(phone: string, code: string) {
  otpStore.set(phone, {
    phone,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function verifyOtp(phone: string, code: string): boolean {
  const record = otpStore.get(phone);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  if (record.code !== code.trim()) return false;
  otpStore.delete(phone);
  return true;
}
