import Link from "next/link";
import { adminCardClassName } from "@/lib/admin-ui";

type Props = {
  label: string;
  value: React.ReactNode;
  href?: string;
  detail?: string;
};

export function AdminStatCard({ label, value, href, detail }: Props) {
  const content = (
    <>
      <p className="text-sm text-emerald-100/60">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-emerald-200/50">{detail}</p>}
    </>
  );

  const className = `${adminCardClassName} p-5 transition hover:border-emerald-400/30 hover:bg-white/[0.07]`;

  if (href) {
    return (
      <Link href={href} className={`block ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
