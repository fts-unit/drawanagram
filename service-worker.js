// service-worker.js
var CACHE_STATIC_VERSION = 'static-v3';

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');

  e.waitUntil(
    caches.open(CACHE_STATIC_VERSION)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App...');
        cache.addAll([
          '/',
          '/src/',
          '/img/',
          '/img/chars/',
        ]);
      })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_VERSION && key !== CACHE_DYNAMIC_VERSION) {
            console.log('[Service Worker] Removing old cache...');
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

var CACHE_DYNAMIC_VERSION = 'dynamic-v3';

self.addEventListener('fetch', function(event) {
  console.log('[Service Worker] Fetch');
  event.respondWith(
    // キャッシュの存在チェック
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_VERSION)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function() {
            });
        }
      })
  );});