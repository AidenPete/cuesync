"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";
import { ProductShopLink } from "@/components/admin/ProductShopLink";
import {
  adminButtonDanger,
  adminButtonPrimary,
  adminButtonSecondary,
  adminInputClassName,
  adminLabelClassName,
  adminMessageError,
  adminPanelClassName,
} from "@/lib/admin-ui";
import { categories } from "@/lib/products";
import type { Product } from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  initial?: Product;
  onSubmit: (payload: Omit<Product, "id"> & { id?: string }) => Promise<void>;
  onDelete?: () => Promise<void>;
  image?: string;
  onImageChange?: (path: string) => void;
  hideImage?: boolean;
  onImageAutoSave?: (path: string) => Promise<void>;
};

export function ProductForm({
  mode,
  initial,
  onSubmit,
  onDelete,
  image: controlledImage,
  onImageChange,
  hideImage = false,
  onImageAutoSave,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [productId, setProductId] = useState(initial?.id ?? "");
  const [internalImage, setInternalImage] = useState(initial?.image ?? "");
  const [highlightsText, setHighlightsText] = useState(
    (initial?.highlights ?? []).join("\n"),
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const image = controlledImage ?? internalImage;
  const setImage = onImageChange ?? setInternalImage;

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setProductId(initial.id);
      if (controlledImage === undefined) {
        setInternalImage(initial.image);
      }
      setHighlightsText(initial.highlights.join("\n"));
    }
  }, [initial, controlledImage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!image.trim()) {
      setError("Upload a product image or enter an image path.");
      return;
    }

    setLoading(true);

    const form = new FormData(event.currentTarget);
    const highlights = highlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        id: mode === "create" ? productId.trim() : initial!.id,
        name: name.trim(),
        category: String(form.get("category")) as Product["category"],
        price: Number(form.get("price")),
        description: String(form.get("description")).trim(),
        image: image.trim(),
        accent: String(form.get("accent")).trim(),
        featured: form.get("featured") === "on",
        stock: Number(form.get("stock")),
        highlights,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || !confirm("Delete this product permanently?")) return;
    setDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
      setDeleting(false);
    }
  }

  const slugHint =
    productId.trim() ||
    (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "product-id");

  const imageBlock = !hideImage ? (
    <ProductImageUpload
      value={image}
      onChange={setImage}
      productId={mode === "edit" ? initial?.id : slugHint}
      productName={name || "Product"}
      autoSave={mode === "edit" && Boolean(onImageAutoSave)}
      onAutoSave={onImageAutoSave}
    />
  ) : null;

  return (
    <form onSubmit={handleSubmit} className={`${adminPanelClassName} space-y-5`}>
      {imageBlock}

      {mode === "create" && (
        <label className="block space-y-2">
          <span className={adminLabelClassName}>ID (slug)</span>
          <input
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            placeholder="auto-generated from name if empty"
            className={adminInputClassName}
          />
        </label>
      )}

      {initial?.id && <ProductShopLink productId={initial.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2 sm:col-span-2">
          <span className={adminLabelClassName}>Name</span>
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className={adminInputClassName}
          />
        </label>

        <label className="block space-y-2">
          <span className={adminLabelClassName}>Category</span>
          <select
            name="category"
            defaultValue={initial?.category ?? "cues"}
            required
            className={adminInputClassName}
          >
            {categories
              .filter((entry) => entry.id !== "all")
              .map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className={adminLabelClassName}>Price (KES)</span>
          <input
            name="price"
            type="number"
            min={1}
            defaultValue={initial?.price}
            required
            className={adminInputClassName}
          />
        </label>

        <label className="block space-y-2">
          <span className={adminLabelClassName}>Stock quantity</span>
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={initial?.stock ?? 10}
            required
            className={adminInputClassName}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Description</span>
        <textarea
          name="description"
          defaultValue={initial?.description}
          required
          rows={3}
          className={adminInputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Accent color</span>
        <input
          name="accent"
          defaultValue={initial?.accent ?? "#1a6b4a"}
          className={adminInputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Highlights (one per line)</span>
        <textarea
          value={highlightsText}
          onChange={(event) => setHighlightsText(event.target.value)}
          rows={4}
          className={adminInputClassName}
        />
      </label>

      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#041912]/60 px-4 py-3">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={initial?.featured}
          className="h-4 w-4 rounded border-white/20"
        />
        <span className="text-sm text-emerald-100">Show as popular on shop</span>
      </label>

      {error && <p className={adminMessageError}>{error}</p>}

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={loading || !image} className={adminButtonPrimary}>
          {loading ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        {initial && (
          <a
            href={`/shop/${initial.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={adminButtonSecondary}
          >
            Preview in shop ↗
          </a>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={adminButtonDanger}
          >
            {deleting ? "Deleting…" : "Delete product"}
          </button>
        )}
      </div>
    </form>
  );
}
