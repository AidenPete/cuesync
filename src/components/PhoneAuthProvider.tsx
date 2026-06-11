"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type PhoneAuthContextValue = {
  phone: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const PhoneAuthContext = createContext<PhoneAuthContextValue | null>(null);

const POST_LOGOUT_PATHS = ["/orders", "/login"];

export function PhoneAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/otp/me");
      const data = await response.json();
      setPhone(data.phone ?? null);
    } catch {
      setPhone(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/otp/logout", { method: "POST" });
    setPhone(null);
    if (POST_LOGOUT_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      router.replace("/shop");
    }
  }, [pathname, router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PhoneAuthContext.Provider value={{ phone, loading, refresh, logout }}>
      {children}
    </PhoneAuthContext.Provider>
  );
}

export function usePhoneAuth() {
  const context = useContext(PhoneAuthContext);
  if (!context) {
    throw new Error("usePhoneAuth must be used within PhoneAuthProvider");
  }
  return context;
}
