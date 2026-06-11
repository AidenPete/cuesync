"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const dismissed = localStorage.getItem("cuesync-install-dismissed");
    if (dismissed) {
      setHidden(true);
      return;
    }

    function handleBeforeInstall(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function handleInstall() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
    setHidden(true);
  }

  function handleDismiss() {
    localStorage.setItem("cuesync-install-dismissed", "1");
    setPromptEvent(null);
    setHidden(true);
  }

  if (hidden || !promptEvent) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-md sm:left-auto sm:right-24">
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-[#062318] p-4 shadow-xl shadow-black/30">
        <span className="text-2xl">📲</span>
        <div className="flex-1">
          <p className="font-semibold text-white">Install CueSync</p>
          <p className="mt-1 text-sm text-emerald-100/70">
            Add to your home screen for quick access to the shop.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#062318] transition hover:bg-emerald-400"
            >
              Install
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full px-4 py-2 text-sm text-emerald-200/70 transition hover:text-white"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
