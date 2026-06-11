"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminNavItems, AdminNavLink } from "@/components/admin/AdminAuthGuard";
import { SITE_NAME } from "@/lib/site";

export function AdminSidebar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#062318]/95 backdrop-blur-md md:sticky md:top-0 md:flex md:max-h-dvh md:overflow-y-auto">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-lg shadow-lg shadow-emerald-900/40">
            🎱
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">{SITE_NAME}</p>
            <p className="text-xs text-emerald-200/70">Admin portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {adminNavItems.map((item) => (
          <AdminNavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href="/shop"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl px-4 py-2.5 text-sm text-emerald-100/60 transition hover:bg-white/5 hover:text-white"
        >
          View shop ↗
        </a>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-2xl px-4 py-2.5 text-left text-sm text-emerald-100/60 transition hover:bg-white/5 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#062318]/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-base">
            🎱
          </span>
          <span className="font-bold text-white">Admin</span>
        </Link>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/admin/auth/logout", { method: "POST" });
            router.replace("/admin/login");
          }}
          className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-emerald-100/80"
        >
          Sign out
        </button>
      </div>
      <nav className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-3">
        {adminNavItems.map((item) => (
          <AdminNavLink key={item.href} {...item} compact />
        ))}
      </nav>
    </header>
  );
}
