// Service worker for the clinic inbox PWA: push notifications only (no caching).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = { title: "KC Clinic", body: "" };
  try { d = e.data.json(); } catch (_) { /* keep defaults */ }
  const opts = {
    body: d.body || "",
    icon: "icon-192.png",     // brand shield (rasterised from our SVG logo)
    badge: "badge-72.png",    // monochrome shield for the Android status bar
    tag: d.tag || "kc",       // same chat collapses to one, WhatsApp-style
    renotify: true,           // still buzz when a collapsed one updates
    vibrate: [70, 40, 70],
    data: { url: d.url || "./" },
  };
  e.waitUntil(self.registration.showNotification(d.title || "KC Clinic", opts));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((tabs) => {
      for (const t of tabs) {
        if ("focus" in t) { t.postMessage({ type: "navigate", url }); return t.focus(); }
      }
      return self.clients.openWindow(url);
    }),
  );
});
