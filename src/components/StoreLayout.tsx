"use client";

import { usePathname } from "next/navigation";
import { Chatbot } from "@/components/Chatbot";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PwaRegister } from "@/components/PwaRegister";
import { ShopBottomNav } from "@/components/shop/ShopBottomNav";
import { ShopTopHeader } from "@/components/shop/ShopTopHeader";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-[#041912]">
        <ShopTopHeader />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8">
          {children}
        </main>

        <footer className="border-t border-white/10 py-6 pb-24 text-center text-sm text-emerald-100/50">
          © {new Date().getFullYear()} {SITE_NAME} · {SITE_DOMAIN}
        </footer>
      </div>

      <ShopBottomNav />
      <Chatbot />
      <InstallPrompt />
      <PwaRegister />
    </>
  );
}
