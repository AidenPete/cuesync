"use client";

import { FormEvent, useState } from "react";
import {
  adminButtonDanger,
  adminButtonPrimary,
  adminInputClassName,
  adminLabelClassName,
  adminMessageError,
  adminMessageSuccess,
  adminPanelClassName,
} from "@/lib/admin-ui";

type CustomerFormValues = {
  name: string;
  phone: string;
  deliveryLocation: string;
  notes: string;
};

type Props = {
  mode: "create" | "edit";
  initial?: Partial<CustomerFormValues> & { phone?: string };
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export function CustomerForm({ mode, initial, onSubmit, onDelete }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(
    initial?.phone?.replace(/^254/, "0") ?? "",
  );
  const [deliveryLocation, setDeliveryLocation] = useState(
    initial?.deliveryLocation ?? "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await onSubmit({ name, phone, deliveryLocation, notes });
      setSuccess(mode === "create" ? "Customer created." : "Customer updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || !confirm("Delete this customer? Wishlists and preorders will be removed.")) {
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${adminPanelClassName} space-y-5`}>
      <div>
        <h2 className="text-lg font-semibold text-white">
          {mode === "create" ? "New customer" : "Edit customer"}
        </h2>
        <p className="text-sm text-emerald-100/60">
          {mode === "create"
            ? "Add a customer manually to send SMS or track details."
            : "Update contact details and notes."}
        </p>
      </div>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className={adminInputClassName}
          placeholder="Customer name"
        />
      </label>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Phone</span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          readOnly={mode === "edit"}
          className={`${adminInputClassName} ${mode === "edit" ? "opacity-70" : ""}`}
          placeholder="0712 345 678"
        />
        {mode === "edit" && (
          <p className="text-xs text-emerald-100/40">Phone number cannot be changed.</p>
        )}
      </label>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Delivery location</span>
        <input
          value={deliveryLocation}
          onChange={(event) => setDeliveryLocation(event.target.value)}
          className={adminInputClassName}
          placeholder="Westlands, Nairobi"
        />
      </label>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Notes</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className={`${adminInputClassName} resize-y`}
          placeholder="Internal notes about this customer"
        />
      </label>

      {success && <p className={adminMessageSuccess}>{success}</p>}
      {error && <p className={adminMessageError}>{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className={adminButtonPrimary}>
          {loading
            ? "Saving…"
            : mode === "create"
              ? "Create customer"
              : "Save changes"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={adminButtonDanger}
          >
            {deleting ? "Deleting…" : "Delete customer"}
          </button>
        )}
      </div>
    </form>
  );
}
