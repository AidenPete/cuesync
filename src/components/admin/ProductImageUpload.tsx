"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  adminButtonSecondary,
  adminInputClassName,
  adminLabelClassName,
  adminMessageError,
  adminMessageSuccess,
} from "@/lib/admin-ui";

type Props = {
  value: string;
  onChange: (path: string) => void;
  productId?: string;
  productName?: string;
  autoSave?: boolean;
  onAutoSave?: (path: string) => Promise<void>;
};

export function ProductImageUpload({
  value,
  onChange,
  productId,
  productName = "Product",
  autoSave = false,
  onAutoSave,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [previewFailed, setPreviewFailed] = useState(false);

  const previewSrc = value
    ? `${value}${value.includes("?") ? "&" : "?"}v=${previewVersion}`
    : "";

  async function handleFile(file: File) {
    setError("");
    setNotice("");
    setPreviewFailed(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (productId) formData.append("productId", productId);

      const response = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed.");

      onChange(data.path);
      setPreviewVersion((current) => current + 1);

      if (autoSave && onAutoSave) {
        await onAutoSave(data.path);
        setNotice("Image saved to product.");
      } else {
        setNotice("Image ready — save the product to apply.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className={adminLabelClassName}>Product image</span>
        {value && !previewFailed && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
          >
            View full size ↗
          </a>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#041912]/60 shadow-xl shadow-black/10">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="group relative block aspect-[4/3] w-full bg-[#062318]"
          title="Click to change image"
        >
          {value && !previewFailed ? (
            <Image
              src={previewSrc}
              alt={productName}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 400px"
              onError={() => setPreviewFailed(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-emerald-100/50">
              <span className="text-4xl">{previewFailed ? "⚠️" : "🖼️"}</span>
              <p className="text-sm">
                {previewFailed ? "Image missing — upload a new one" : "No image yet"}
              </p>
            </div>
          )}

          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#041912]/80 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-[#062318]">
              {value ? "Change image" : "Upload image"}
            </span>
          </div>

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#041912]/70">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-300" />
            </div>
          )}
        </button>

        <div className="space-y-3 border-t border-white/10 p-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className={adminButtonSecondary}
            >
              {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setPreviewFailed(false);
                  setNotice("");
                  setError("");
                }}
                disabled={uploading}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>

          <label className="block space-y-2">
            <span className="text-xs text-emerald-100/50">Image path</span>
            <input
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
                setPreviewFailed(false);
                setPreviewVersion((current) => current + 1);
                setNotice("");
              }}
              onBlur={async () => {
                if (!autoSave || !onAutoSave || !value.trim()) return;
                try {
                  await onAutoSave(value.trim());
                  setNotice("Image path saved.");
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Could not save path.");
                }
              }}
              placeholder="/products/my-product.jpg"
              className={adminInputClassName}
            />
          </label>

          <p className="text-xs text-emerald-100/40">JPG, PNG, or WebP · max 5 MB · click preview to upload</p>
        </div>
      </div>

      {notice && <p className={adminMessageSuccess}>{notice}</p>}
      {error && <p className={adminMessageError}>{error}</p>}
    </div>
  );
}
