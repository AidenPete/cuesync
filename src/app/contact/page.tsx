import Link from "next/link";
import {
  SITE_NAME,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_WHATSAPP,
} from "@/lib/site";

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Hi CueSync, I need help with my order.")}`;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Contact & help</h1>
        <p className="mt-2 text-emerald-100/70">
          Questions about an order, delivery, or a product? Reach {SITE_NAME} using
          any of the options below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 transition hover:border-emerald-400/40"
        >
          <p className="text-2xl">💬</p>
          <h2 className="mt-3 font-semibold text-white">WhatsApp</h2>
          <p className="mt-1 text-sm text-emerald-100/70">Fastest for order updates</p>
          <p className="mt-3 text-sm font-medium text-emerald-300">Message us →</p>
        </a>

        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
        >
          <p className="text-2xl">📞</p>
          <h2 className="mt-3 font-semibold text-white">Phone</h2>
          <p className="mt-1 text-sm text-emerald-100/70">Call during shop hours</p>
          <p className="mt-3 text-sm font-medium text-emerald-300">{SUPPORT_PHONE}</p>
        </a>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 sm:col-span-2"
        >
          <p className="text-2xl">✉️</p>
          <h2 className="mt-3 font-semibold text-white">Email</h2>
          <p className="mt-1 text-sm text-emerald-100/70">For detailed enquiries</p>
          <p className="mt-3 text-sm font-medium text-emerald-300">{SUPPORT_EMAIL}</p>
        </a>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-emerald-100/70">
        <h2 className="font-semibold text-white">Common questions</h2>
        <ul className="mt-3 space-y-2">
          <li>· Track your order from the SMS link or sign in to see all orders.</li>
          <li>· Delivery location is collected at checkout.</li>
          <li>· Out-of-stock items can be preordered from the product page.</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/orders"
            className="rounded-full border border-white/20 px-5 py-2.5 font-medium text-white transition hover:bg-white/10"
          >
            My orders
          </Link>
          <Link
            href="/shop"
            className="rounded-full bg-emerald-500 px-5 py-2.5 font-semibold text-[#062318] transition hover:bg-emerald-400"
          >
            Browse shop
          </Link>
        </div>
      </div>
    </div>
  );
}
