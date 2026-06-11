"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type PhoneAuthContextValue = {
  phone: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const PhoneAuthContext = createContext<PhoneAuthContextValue | null>(null);

export function PhoneAuthProvider({ children }: { children: React.ReactNode }) {
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
  }, []);

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
