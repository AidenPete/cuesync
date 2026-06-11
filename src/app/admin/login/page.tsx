"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminLogo } from "@/components/admin/AdminNavIcons";
import { adminMessageError, adminPanelClassName } from "@/lib/admin-ui";
import { inputClassName } from "@/lib/ui";
import { SITE_NAME } from "@/lib/site";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace(next.startsWith("/admin") ? next : "/admin");
        } else {
          setCheckingSession(false);
        }
      })
      .catch(() => setCheckingSession(false));
  }, [next, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed.");
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041912] px-4">
        <AdminLoading label="Checking session…" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041912] px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/admin/login" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-white shadow-lg shadow-emerald-900/40">
              <AdminLogo className="h-6 w-6" />
            </span>
          </Link>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">{SITE_NAME}</h1>
          <p className="mt-2 text-emerald-100/70">Sign in to manage your shop</p>
        </div>

        <form onSubmit={handleSubmit} className={`${adminPanelClassName} space-y-5`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-100">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className={inputClassName}
              placeholder="Enter admin password"
            />
          </label>

          {error && <p className={adminMessageError}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-400 py-3.5 font-semibold text-[#062318] transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-xs text-emerald-100/40">
            Default dev password: cuesync-admin
          </p>
        </form>

        <p className="text-center">
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-300 hover:text-emerald-200"
          >
            View shop ↗
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041912]">
          <AdminLoading label="Loading…" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
