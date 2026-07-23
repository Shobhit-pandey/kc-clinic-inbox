// Service worker for the clinic inbox PWA: push notifications only (no caching).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let data = { title: "Clinic Inbox", body: "" };
  try { data = e.data.json(); } catch (_) { /* keep defaults */ }
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: "icon-192.png",
    badge: "icon-192.png",
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window" }).then((tabs) => {
    for (const t of tabs) return t.focus();
    return self.clients.openWindow("./");
  }));
});
