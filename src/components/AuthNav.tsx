"use client";

import Link from "next/link";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { formatPhoneDisplay } from "@/lib/ui";

export function AuthNav() {
  const { phone, loading, logout } = usePhoneAuth();

  if (loading) return null;

  if (phone) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/orders" className="transition hover:text-white">
          My orders
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="text-emerald-200/60 transition hover:text-white"
          title={formatPhoneDisplay(phone)}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="transition hover:text-white">
      Sign in
    </Link>
  );
}
