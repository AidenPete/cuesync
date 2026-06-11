import Link from "next/link";
import QRCode from "qrcode";
import { CATALOGUE_URL, SITE_NAME } from "@/lib/site";

export default async function QrPage() {
  const qrDataUrl = await QRCode.toDataURL(CATALOGUE_URL, {
    width: 320,
    margin: 2,
    color: {
      dark: "#062318",
      light: "#ffffff",
    },
  });

  return (
    <div className="mx-auto max-w-lg space-y-8 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
          Share the shop
        </p>
        <h1 className="text-3xl font-bold text-white">Show this QR to a friend</h1>
        <p className="text-emerald-100/70">
          Already on {SITE_NAME}? Let someone else scan this code to open the
          catalogue on their phone — no app needed. You can also download and
          print it for your pool shop.
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`QR code linking to ${CATALOGUE_URL}`}
          className="mx-auto h-auto w-full max-w-[320px]"
        />
        <p className="mt-6 font-mono text-sm text-[#062318]">{CATALOGUE_URL}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-[#062318] transition hover:bg-emerald-400"
        >
          Open catalogue
        </Link>
        <a
          href={qrDataUrl}
          download="cuesync-qr.png"
          className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          Download for print
        </a>
      </div>
    </div>
  );
}
