import Link from "next/link";
import { adminEyebrowClassName } from "@/lib/admin-ui";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  action,
}: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            ← {backLabel}
          </Link>
        )}
        {eyebrow && <p className={adminEyebrowClassName}>{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-emerald-100/70">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
