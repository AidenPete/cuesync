"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { formatPhoneDisplay } from "@/lib/ui";

type AccountProfile = {
  phone: string;
  name: string;
  deliveryLocation: string;
  orderCount: number;
  activeOrders: number;
};

export default function AccountPage() {
  const router = useRouter();
  const { phone, loading: authLoading, logout } = usePhoneAuth();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!phone) {
      router.replace("/login?next=/account");
      return;
    }

    fetch("/api/account/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.phone) setProfile(data);
      })
      .finally(() => setLoading(false));
  }, [phone, authLoading, router]);

  if (authLoading || loading || !phone) {
    return (
      <div className="mx-auto max-w-lg animate-pulse rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-emerald-100/60">
        Loading your account…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Your account</h1>
        <p className="mt-2 text-emerald-100/70">
          Signed in as {formatPhoneDisplay(phone)}
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
        {profile?.name && (
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-100/50">Name</p>
            <p className="font-medium text-white">{profile.name}</p>
          </div>
        )}
        {profile?.deliveryLocation && (
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-100/50">
              Default delivery
            </p>
            <p className="font-medium text-white">{profile.deliveryLocation}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
          <div>
            <p className="text-2xl font-bold text-emerald-300">{profile?.orderCount ?? 0}</p>
            <p className="text-sm text-emerald-100/60">Total orders</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-300">{profile?.activeOrders ?? 0}</p>
            <p className="text-sm text-emerald-100/60">Active deliveries</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/orders"
          className="rounded-full bg-emerald-500 px-6 py-3 text-center font-semibold text-[#062318] transition hover:bg-emerald-400"
        >
          View my orders
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-white/20 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
        >
          Continue shopping
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-full px-6 py-3 text-center text-sm text-emerald-100/60 transition hover:text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
