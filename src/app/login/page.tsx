"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OtpForm } from "@/components/OtpForm";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { phone, loading, refresh } = usePhoneAuth();
  const next = searchParams.get("next") || "/orders";

  if (loading) {
    return (
      <div className="mx-auto max-w-md animate-pulse rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-emerald-100/60">
        Loading…
      </div>
    );
  }

  if (phone) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-4xl">✓</p>
        <h1 className="mt-4 text-2xl font-bold text-white">You&apos;re signed in</h1>
        <p className="mt-2 text-emerald-100/70">
          Verified as {phone.replace(/^254/, "0")}
        </p>
        <Link
          href={next}
          className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white transition hover:bg-emerald-400"
        >
          Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Sign in</h1>
        <p className="mt-2 text-emerald-100/70">
          Verify your phone to view your orders.
        </p>
      </div>
      <OtpForm
        onVerified={async () => {
          await refresh();
          router.push(next);
        }}
      />
      <p className="text-center text-sm text-emerald-100/50">
        No account needed — checkout as guest anytime.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-emerald-100/60">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
