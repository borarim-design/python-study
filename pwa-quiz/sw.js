/* 파이썬 학습 퀴즈 · 서비스워커
   - 오프라인 캐시(앱 셸)
   - 푸시 수신 → 알림 표시 (단, 오늘 이미 학습했으면 건너뜀)
   - 알림 클릭 → 앱 열기
*/
const CACHE = "pyquiz-v5";
const ASSETS = [
  "./", "./index.html", "./content.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png",
  "./icons/maskable-192.png", "./icons/maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).catch(() => c)));
});

// ---- IndexedDB 읽기 (앱이 저장한 '오늘 학습' 날짜) ----
function idbGet(key) {
  return new Promise((resolve) => {
    const r = indexedDB.open("pyquiz", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onerror = () => resolve(null);
    r.onsuccess = () => {
      try {
        const tx = r.result.transaction("kv", "readonly");
        const g = tx.objectStore("kv").get(key);
        g.onsuccess = () => resolve(g.result || null);
        g.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    };
  });
}
function todayStr() { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

// ---- 푸시 수신 ----
self.addEventListener("push", (e) => {
  e.waitUntil((async () => {
    let data = {};
    try { data = e.data ? e.data.json() : {}; } catch (_) { data = {}; }

    const studied = await idbGet("lastStudied");
    const doneToday = studied === todayStr();

    // 오늘 이미 학습을 마쳤으면 잔소리 알림은 건너뜀 (조용한 응원만 아주 짧게)
    if (doneToday) {
      // userVisibleOnly 규칙상 완전 무음은 권장되지 않아, 짧은 축하 알림으로 대체
      await self.registration.showNotification("🔥 오늘 학습 완료!", {
        body: "잘하고 있어요. 내일도 만나요!",
        icon: "./icons/icon-192.png", badge: "./icons/icon-192.png",
        tag: "pyquiz-daily", silent: true
      });
      return;
    }

    const title = data.title || "🐍 파이썬 공부할 시간!";
    const body = data.body || "오늘 30분, 퀴즈 한 판 풀어볼까요? 연속 기록을 이어가세요!";
    await self.registration.showNotification(title, {
      body, icon: "./icons/icon-192.png", badge: "./icons/icon-192.png",
      tag: "pyquiz-daily", requireInteraction: false,
      data: { url: "./index.html" }
    });
  })());
});

// ---- 알림 클릭 → 앱 열기 ----
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { if ("focus" in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow("./index.html");
  })());
});
