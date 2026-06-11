export function AdminLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-emerald-100/60">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-300" />
      {label}
    </div>
  );
}
