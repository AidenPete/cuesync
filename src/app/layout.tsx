import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { PhoneAuthProvider } from "@/components/PhoneAuthProvider";
import { StoreLayout } from "@/components/StoreLayout";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  themeColor: "#062318",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Pool & Billiard Accessories`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop premium pool and billiard accessories. Scan, browse, and pay with M-Pesa on cuesync.pro.",
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
  openGraph: {
    title: SITE_NAME,
    description: "Pool & billiard gear — scan, shop, pay with M-Pesa.",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full bg-[#041912] font-sans text-white antialiased">
        <CartProvider>
          <PhoneAuthProvider>
            <StoreLayout>{children}</StoreLayout>
          </PhoneAuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
