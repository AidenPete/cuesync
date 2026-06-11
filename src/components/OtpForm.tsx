"use client";

import { FormEvent, useState } from "react";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";
import { formatPhoneDisplay, inputClassName } from "@/lib/ui";

type OtpFormProps = {
  initialPhone?: string;
  onVerified?: (phone: string) => void;
  compact?: boolean;
  submitLabel?: string;
};

export function OtpForm({
  initialPhone = "",
  onVerified,
  compact = false,
  submitLabel = "Verify & continue",
}: OtpFormProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);

  async function handleSendCode(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!isValidKenyanPhone(phone)) {
      setError("Enter a valid phone number (e.g. 0712 345 678).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not send code.");
      setDemoCode(data.demoCode ?? null);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const normalized = normalizePhone(phone);
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid code.");
      onVerified?.(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const wrapperClass = compact
    ? "space-y-3 rounded-2xl border border-emerald-400/20 bg-emerald-950/30 p-4"
    : "space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6";

  if (step === "phone") {
    return (
      <form onSubmit={handleSendCode} className={wrapperClass}>
        {!compact && (
          <div>
            <h2 className="text-xl font-semibold text-white">Sign in with SMS</h2>
            <p className="mt-1 text-sm text-emerald-100/70">
              We&apos;ll text you a one-time code — no password needed.
            </p>
          </div>
        )}
        {compact && (
          <p className="text-sm text-emerald-100/80">
            Verify your number to load saved details securely.
          </p>
        )}
        <label className="block space-y-2">
          <span className="text-sm font-medium text-emerald-100">Phone number</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="0712 345 678"
            autoComplete="tel"
            className={inputClassName}
          />
        </label>
        {error && (
          <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send code"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className={wrapperClass}>
      <div>
        <h2 className={compact ? "text-sm font-semibold text-white" : "text-xl font-semibold text-white"}>
          Enter your code
        </h2>
        <p className="mt-1 text-sm text-emerald-100/70">
          Sent to {formatPhoneDisplay(normalizePhone(phone))}
        </p>
        {demoCode && (
          <p className="mt-2 rounded-xl bg-amber-500/15 px-3 py-2 text-xs text-amber-100">
            Demo code: <strong>{demoCode}</strong>
          </p>
        )}
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-100">6-digit code</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          autoComplete="one-time-code"
          className={`${inputClassName} text-center text-2xl tracking-[0.4em]`}
        />
      </label>
      {error && (
        <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#43a047] py-3 font-semibold text-white transition hover:bg-[#388e3c] disabled:opacity-60"
      >
        {loading ? "Verifying…" : submitLabel}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep("phone");
          setCode("");
          setDemoCode(null);
          setError("");
        }}
        className="w-full text-sm text-emerald-200/70 transition hover:text-white"
      >
        Use a different number
      </button>
    </form>
  );
}
