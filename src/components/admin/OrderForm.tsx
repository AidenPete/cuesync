"use client";

import { FormEvent, useState } from "react";
import {
  adminButtonDanger,
  adminButtonPrimary,
  adminButtonSecondary,
  adminInputClassName,
  adminLabelClassName,
  adminMessageError,
  adminMessageSuccess,
  adminPanelClassName,
} from "@/lib/admin-ui";
import type { Order, OrderStatus } from "@/lib/order-types";

type Props = {
  order: Order;
  onSave: (updates: {
    name: string;
    phone: string;
    deliveryLocation: string;
    status: OrderStatus;
    riderName: string;
    riderPhone: string;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export function OrderForm({ order, onSave, onDelete }: Props) {
  const [name, setName] = useState(order.name);
  const [phone, setPhone] = useState(order.phone.replace(/^254/, "0"));
  const [deliveryLocation, setDeliveryLocation] = useState(order.deliveryLocation);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [riderName, setRiderName] = useState(order.riderName ?? "");
  const [riderPhone, setRiderPhone] = useState(
    order.riderPhone ? order.riderPhone.replace(/^254/, "0") : "",
  );
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
      await onSave({
        name,
        phone,
        deliveryLocation,
        status,
        riderName,
        riderPhone,
      });
      setSuccess("Order updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || !confirm("Delete this order permanently?")) return;
    setDeleting(true);
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
        <h2 className="text-lg font-semibold text-white">Edit order</h2>
        <p className="text-sm text-emerald-100/60">Update customer details or delivery status</p>
      </div>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Customer name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className={adminInputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Phone</span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          className={adminInputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Delivery location</span>
        <input
          value={deliveryLocation}
          onChange={(event) => setDeliveryLocation(event.target.value)}
          required
          className={adminInputClassName}
        />
      </label>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div>
          <h3 className="font-medium text-white">Delivery rider</h3>
          <p className="text-sm text-emerald-100/60">
            Person who delivered this order — for your records.
          </p>
        </div>
        <label className="block space-y-2">
          <span className={adminLabelClassName}>Rider name</span>
          <input
            value={riderName}
            onChange={(event) => setRiderName(event.target.value)}
            placeholder="e.g. James"
            className={adminInputClassName}
          />
        </label>
        <label className="block space-y-2">
          <span className={adminLabelClassName}>Rider phone</span>
          <input
            value={riderPhone}
            onChange={(event) => setRiderPhone(event.target.value)}
            placeholder="07XX XXX XXX"
            inputMode="tel"
            className={adminInputClassName}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          className={adminInputClassName}
        >
          <option value="pending_delivery">Pending delivery</option>
          <option value="delivered">Delivered</option>
        </select>
      </label>

      {success && <p className={adminMessageSuccess}>{success}</p>}
      {error && <p className={adminMessageError}>{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className={adminButtonPrimary}>
          {loading ? "Saving…" : "Save changes"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={adminButtonDanger}
          >
            {deleting ? "Deleting…" : "Delete order"}
          </button>
        )}
      </div>
    </form>
  );
}
