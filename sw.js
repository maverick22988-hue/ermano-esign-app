/* ERMANO e-Sign app shell: cached so the app opens instantly and offline shows its own screen.
   Calls to script.google.com are never intercepted: documents and signatures always come from the live server. */
const SHELL = 'esign-shell-214ffb5';
const ASSETS = ['./', './index.html', './sign.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(SHELL).then(c => c.put(e.request, copy)); return res; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html'))));
});
