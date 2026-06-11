"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chatbot } from "@/components/Chatbot";
import { Header } from "@/components/Header";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PwaRegister } from "@/components/PwaRegister";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-emerald-100/50">
        © {new Date().getFullYear()} {SITE_NAME} · {SITE_DOMAIN}
      </footer>
      <Chatbot />
      <InstallPrompt />
      <PwaRegister />
    </>
  );
}
