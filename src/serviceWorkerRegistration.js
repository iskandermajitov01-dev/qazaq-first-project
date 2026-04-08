export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      // In dev mode service worker caching breaks hot reload
      // and can cause blank screens due to stale asset caches.
      if (import.meta.env.DEV) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
        return;
      }
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        // ignore registration errors in MVP
      }
    });
  }
};

