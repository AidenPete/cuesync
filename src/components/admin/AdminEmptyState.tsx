type Props = {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function AdminEmptyState({
  emoji = "📭",
  title,
  description,
  action,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center">
      <p className="text-5xl">{emoji}</p>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-emerald-100/70">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
