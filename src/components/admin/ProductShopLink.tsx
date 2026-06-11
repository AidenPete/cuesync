"use client";

import { useState } from "react";
import Link from "next/link";
import { adminButtonSecondary } from "@/lib/admin-ui";
import { getProductShopUrl } from "@/lib/site";

type Props = {
  productId: string;
  compact?: boolean;
};

export function ProductShopLink({ productId, compact = false }: Props) {
  const url = getProductShopUrl(productId);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Link
          href={`/shop/${productId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-emerald-300 hover:text-emerald-200"
        >
          {url}
        </Link>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-full border border-white/15 px-2.5 py-1 font-semibold text-emerald-100/80 transition hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#041912]/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-100/50">
        Product link
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 break-all text-sm text-emerald-300 hover:text-emerald-200"
        >
          {url}
        </a>
        <button type="button" onClick={copyLink} className={adminButtonSecondary}>
          {copied ? "Copied" : "Copy link"}
        </button>
        <Link
          href={`/shop/${productId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={adminButtonSecondary}
        >
          Open ↗
        </Link>
      </div>
    </div>
  );
}
