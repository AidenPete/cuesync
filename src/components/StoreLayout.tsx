"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Chatbot } from "@/components/Chatbot";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PwaRegister } from "@/components/PwaRegister";
import { ShopMobileBottomNav } from "@/components/shop/ShopMobileBottomNav";
import { ShopMobileHeader } from "@/components/shop/ShopMobileHeader";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sidebarOpen]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-dvh bg-[#041912]">
        <ShopSidebar
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <ShopMobileHeader onMenuOpen={() => setSidebarOpen(true)} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8">
            {children}
          </main>

          <footer className="border-t border-white/10 py-6 text-center text-sm text-emerald-100/50">
            © {new Date().getFullYear()} {SITE_NAME} · {SITE_DOMAIN}
          </footer>
        </div>
      </div>

      <ShopMobileBottomNav />
      <Chatbot />
      <InstallPrompt />
      <PwaRegister />
    </>
  );
}
