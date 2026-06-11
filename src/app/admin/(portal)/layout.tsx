"use client";

import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#041912] text-white md:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <AdminAuthGuard>
          <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 p-4 pb-10 sm:p-6 sm:pb-12 md:p-8">
            {children}
          </main>
        </AdminAuthGuard>
      </div>
    </div>
  );
}
