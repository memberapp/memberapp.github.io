// sw.js

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'manifest.json',
    'css/article.css',
    'img/bch.png',
    'css/base.css',
    'locale/en.json',
    'js/leaflet/leaflet.js'
];
const VERSION = '3.5.1.9';
const RUNTIME = 'runtime-' + VERSION;
const INSTALL = 'install-' + VERSION;


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(INSTALL).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

self.addEventListener("activate", function (event) {
    console.log('service worker activated.');
    const currentCaches = [INSTALL, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', function (event) {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        // Put a copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});

