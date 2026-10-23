"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!window.isSecureContext) {
      console.warn(
        "El Service Worker necesita HTTPS o localhost para poder registrarse.",
      );
      return;
    }

    if (!("serviceWorker" in navigator)) {
      console.error("Este navegador no admite Service Workers.");
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error: unknown) => {
        console.error("No se pudo registrar el Service Worker.", error);
      });
  }, []);

  return null;
}
