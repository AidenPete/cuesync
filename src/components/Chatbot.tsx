"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat-types";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the CueSync assistant. Ask about our cues, balls, or accessories — or tell me what you'd like to preorder.",
};

const STARTERS = [
  "What's your best cue?",
  "How does M-Pesa checkout work?",
  "I'd like to preorder a cue",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(1),
        }),
      });

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.message || "Sorry, no reply came through.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Connection failed. Check your network and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 sm:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
        {open && (
          <div className="flex h-[min(70vh,520px)] w-[min(calc(100vw-2rem),380px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#062318] shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg">
                  🎱
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">CueSync Assistant</p>
                  <p className="text-xs text-emerald-200/60">Inquiries & preorders</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-2 py-1 text-emerald-200/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-emerald-500 text-[#062318]"
                        : "bg-white/10 text-emerald-50"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/10 px-3.5 py-2.5 text-sm text-emerald-100/70">
                    Typing…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => sendMessage(starter)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-emerald-100 transition hover:bg-white/10"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="border-t border-white/10 p-3"
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask or preorder…"
                  className="flex-1 rounded-2xl border border-white/10 bg-[#041912] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:ring-2 focus:ring-emerald-400/40"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#062318] transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400"
          aria-label={open ? "Close assistant" : "Open assistant"}
        >
          {open ? "✕" : "💬"}
        </button>
      </div>
    </>
  );
}
