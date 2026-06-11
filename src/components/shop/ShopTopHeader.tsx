"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { ShopLogo } from "@/components/shop/ShopNavIcons";
import { SITE_NAME } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/ui";

export function ShopTopHeader() {
  const { phone, loading, logout } = usePhoneAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#062318]/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/shop" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-white shadow-lg shadow-emerald-900/40">
            <ShopLogo className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight text-white">{SITE_NAME}</p>
            <p className="truncate text-xs text-emerald-200/70">Pool & Billiard Gear</p>
          </div>
        </Link>

        {mounted && !loading && phone && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs text-emerald-100/50 sm:inline">
              {formatPhoneDisplay(phone)}
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-emerald-100/70 transition hover:bg-white/5 hover:text-white"
            >
              Sign out
            </button>
          </div>
        )}

        {mounted && !loading && !phone && (
          <Link
            href="/login"
            className="shrink-0 rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
