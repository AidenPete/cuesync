"use client";

import { useEffect, useState } from "react";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminInputClassName,
  adminLabelClassName,
  adminMessageError,
  adminMessageSuccess,
} from "@/lib/admin-ui";

type CustomerSmsComposerProps = {
  phone: string;
  initialMessage: string;
  productLabel?: string;
  compact?: boolean;
  className?: string;
  startOpen?: boolean;
};

export function CustomerSmsComposer({
  phone,
  initialMessage,
  productLabel,
  compact = false,
  className = "",
  startOpen = false,
}: CustomerSmsComposerProps) {
  const [open, setOpen] = useState(startOpen);
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  function resetComposer() {
    setMessage(initialMessage);
    setFeedback("");
    setError("");
  }

  async function sendSms() {
    setLoading(true);
    setFeedback("");
    setError("");

    const response = await fetch(
      `/api/admin/customers/${encodeURIComponent(phone)}/sms`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Could not send SMS.");
      setLoading(false);
      return;
    }

    setFeedback(data.message);
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          resetComposer();
          setOpen(true);
        }}
        className={`${compact ? adminButtonSecondary : adminButtonPrimary} ${className}`.trim()}
      >
        Send SMS
      </button>
    );
  }

  return (
    <div
      className={`space-y-3 rounded-2xl border border-white/10 bg-[#041912]/60 p-4 ${className}`.trim()}
    >
      {!startOpen && productLabel && (
        <p className="text-sm text-emerald-100/70">
          Product link for <span className="font-medium text-white">{productLabel}</span>
        </p>
      )}

      <div>
        <label className={adminLabelClassName}>Custom SMS</label>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={compact ? 4 : 5}
          className={`${adminInputClassName} mt-2 resize-y`}
        />
        <p className="mt-1 text-xs text-emerald-100/40">{message.length}/480 characters</p>
      </div>

      {feedback && <p className={adminMessageSuccess}>{feedback}</p>}
      {error && <p className={adminMessageError}>{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={sendSms}
          disabled={loading || !message.trim()}
          className={adminButtonPrimary}
        >
          {loading ? "Sending…" : "Send SMS"}
        </button>
        <button
          type="button"
          onClick={() => setMessage(initialMessage)}
          disabled={loading}
          className={adminButtonSecondary}
        >
          Reset message
        </button>
        {!startOpen && (
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              resetComposer();
            }}
            disabled={loading}
            className={adminButtonSecondary}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
