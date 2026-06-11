import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
      <p className="text-6xl">📡</p>
      <h1 className="text-3xl font-bold text-white">You&apos;re offline</h1>
      <p className="text-emerald-100/70">
        Check your connection and try again. Previously visited pages may still
        be available.
      </p>
      <Link
        href="/shop"
        className="inline-flex rounded-full bg-emerald-500 px-6 py-3 font-semibold text-[#062318] transition hover:bg-emerald-400"
      >
        Open catalogue
      </Link>
    </div>
  );
}
