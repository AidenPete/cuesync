"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let reloaded = false;

    async function register() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              worker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });

        await registration.update();
      } catch (error) {
        console.error("[CueSync PWA] Service worker registration failed:", error);
      }
    }

    function onControllerChange() {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    }

    function checkForUpdates() {
      navigator.serviceWorker.getRegistration().then((registration) => {
        registration?.update();
      });
    }

    register();
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        checkForUpdates();
      }
    });
    window.addEventListener("focus", checkForUpdates);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      window.removeEventListener("focus", checkForUpdates);
    };
  }, []);

  return null;
}
