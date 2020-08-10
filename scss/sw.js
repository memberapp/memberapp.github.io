// sw.js

// A list of local resources we always want to be cached.

const PRECACHE_URLS = [
    'pwa/manifest.webmanifest',
    'css/article.css',
    'css/base.css',
    'img/bch.png',
    'js/leaflet/leaflet.js',
    'locale/en.json'
];

//If updating version here, also update version in login.js
const version = '4.0.11';

const RUNTIME = 'runtime-' + version;
const INSTALL = 'install-' + version;


self.addEventListener('install', (event) => {
    self.skipWaiting()
    event.waitUntil(
        caches.open(INSTALL).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

self.addEventListener("activate", function (event) {
    
    //console.log('[ServiceWorker] Activated.');
    const currentCaches = [INSTALL, RUNTIME];

    self.clients.matchAll({
        includeUncontrolled: true
      }).then(function(clientList) {
        var urls = clientList.map(function(client) {
          return client.url;
        });
        //console.log('[ServiceWorker] Matching clients:', urls.join(', '));
      });
      event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                if (cacheName !== !currentCaches.includes(cacheName)) {
                  //console.log('[ServiceWorker] Deleting old cache:', cacheName);
                  return caches.delete(cacheName);
                }
              })
            );
          }).then(function() {
            //console.log('[ServiceWorker] Claiming clients for version', version);
            return self.clients.claim();
          })
        );
});


self.addEventListener('fetch', function (event) {
    if (event.request.url.includes('/version')) {
        event.respondWith(new Response(version, {
          headers: {
            'content-type': 'text/plain'
          }
        }));
      }

    else if (event.request.url.startsWith(self.location.origin)) {
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


self.addEventListener('install', (event) => {
    self.skipWaiting();
});

