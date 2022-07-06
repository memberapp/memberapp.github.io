// sw.js

// A list of local resources we always want to be cached.

const PRECACHE_URLS = [
  //'pwa/manifest.webmanifest',
  //'css/feels.css',
  //'css/base.css',
  //'locale/en.json'
];

//If updating version here, also update version in login.js
const version = '8.1.3';

const RUNTIME = 'runtime-' + version;
const INSTALL = 'install-' + version;


const pushNotificationsPublicKey = 'BFG-5VUdKBFXFOOLxD5Jqmjbzw0lJaThIyVlx6QzsE70T_9_v0vgIn2IxYbKcgrXGLaiPmapddgAYFtdKe00q5A';
const SERVER_URL = '/v2/pn/sub';
var swpubkey = "";

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
  //self.skipWaiting()
  console.log('[ServiceWorker] Skipped Waiting:');
  event.waitUntil(
    caches.open(INSTALL).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener("activate", async function (event) {
  event.waitUntil(self.clients.claim());
  console.log('[ServiceWorker] Activated. v' + version);
  const currentCaches = [INSTALL, RUNTIME];

  self.clients.matchAll({
    includeUncontrolled: true
  }).then(function (clientList) {
    var urls = clientList.map(function (client) {
      return client.url;
    });
    console.log('[ServiceWorker] Matching clients:', urls.join(', '));
  });
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== !currentCaches.includes(cacheName)) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function () {
      console.log('[ServiceWorker] Claiming clients for version', version);
      return self.clients.claim();
    })
  );

  //self.onpushsubscriptionchange();


});



self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('/versionmember')) {
    event.respondWith(new Response(version, {
      headers: {
        'content-type': 'text/plain'
      }
    }));
  }
  else if (event.request.url.includes('/invalidatecache/')) {
    //caches.delete(event.request);
    /*caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
        })
      );
    })*/

    //Delete all caches
    caches.keys().then(function (names) {
      for (let name of names) {
        console.log('[ServiceWorker] Deleting old cache:', name);
        caches.delete(name);
      }
    });
    event.respondWith(
      new Response("sw.js invalidated cache "),
      { headers: { 'content-type': 'text/plain' } }
    );
  }
  else if (event.request.url.startsWith(self.location.origin) && !event.request.url.includes('/v2/')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          //console.log('[ServiceWorker] Returning Found In Cache:', event.request);
          return cachedResponse;
        }
        //console.log('[ServiceWorker] Not Found :', event.request);
        return caches.open(RUNTIME).then(cache => {
          //console.log('[ServiceWorker] Fetching :', event.request);
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            //console.log('[ServiceWorker] Caching :', event.request);
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

self.addEventListener('message', function (event) {
  //Message received from client
  console.log(event.data);

  if (event.data == 'subscribe') {
    self.onpushsubscriptionchange();
  } else {
    swpubkey = event.data;
  }
  //Send response to client using the port that was sent with the message
  //event.ports[0].postMessage("world");
});


//Push Notification Stuff

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


//self.onpushsubscriptionchange = subscribeForNotifications();

self.onpushsubscriptionchange = async function () {
  // Push Notifications Stuff
  // This will be called only once when the service worker is activated.
  try {
    const applicationServerKey = urlB64ToUint8Array(pushNotificationsPublicKey);
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    const response = await saveSubscription(subscription);
    console.log(JSON.stringify(response))
  } catch (err) {
    console.log('Error', err)
  }
}


// saveSubscription saves the subscription to the backend
const saveSubscription = async subscription => {
  console.log(subscription);
  console.log(SERVER_URL + swpubkey);
  const response = await fetch(SERVER_URL + '?' + new URLSearchParams({ subscription: JSON.stringify(subscription), address: swpubkey }), { method: 'get', headers: { 'Content-Type': 'application/json' } });
  console.log(response);
  return response;
}





self.addEventListener("push", function (event) {
  //console.log("Push event!! ", "test");
  //showLocalNotification("Yolo", "test", self.registration);

  if (event.data) {
    console.log("Push event!! ", event.data.json());
    showLocalNotification(event.data.json(), self.registration);
  } else {
    console.log("Push event but no data");
    showLocalNotification("Error", self.registration);
  }
});



const showLocalNotification = (payload, swRegistration) => {
  //swRegistration.showNotification(title, {});
  //showLocalNotification("Push Event", "Error", swRegistration);

  var txid;
  var name;
  var picurl;
  var pagingid;
  var icon;

  try {
    body = payload.type;
    txid = payload.txid;
    name = payload.name;
    picurl = payload.picurl;
    pagingid = payload.pagingid;
  } catch (err) {
    //Probably the old type where the action is the whole body
  }
  var title = "Error";
  var renotify = false;
  var text = "";

  switch (body) {
    case "rating":
      title = "Rated";
      text = "Rating from @" + pagingid;
      icon = "/img/notificationicons/rating.svg";
      renotify = true;
      break;
    case "purchase":
      title = "Purchase";
      text = "Purchase by @" + pagingid;
      icon = "/img/notificationicons/rating.svg";
      renotify = true;
      break;
    case "sale":
      title = "Sale";
      text = "Sale by @" + pagingid;
      icon = "/img/notificationicons/rating.svg";
      renotify = true;
      break;
    case "message":
      title = "Message";
      text = "Message from @" + pagingid;
      icon = "/img/notificationicons/message.svg";
      renotify = true;
      break;
    case "follow":
      title = "Followed";
      text = "Followed by @" + pagingid;
      icon = "/img/notificationicons/follow.svg";
      renotify = true;
      break;
    case "unfollow":
      title = "Unfollowed";
      text = "Unfollowed by @" + pagingid;
      icon = "/img/notificationicons/follow.svg";
      renotify = true;
      break;
    case "page":
      title = "Paged";
      text = "Paged by @" + pagingid;
      icon = "/img/notificationicons/page.svg";
      renotify = true;
      break;
    case "quoterepost":
      title = "Quote Remembered";
      text = "Quote Remembered by @" + pagingid;
      icon = "/img/notificationicons/repost.svg";
      renotify = true;
      break;
    case "repost":
      title = "Remembered";
      text = "Remembered by @" + pagingid;
      icon = "/img/notificationicons/repost.svg";
      renotify = true;
      break;
    case "tip":
      title = "Tipped";
      text = "Tipped by @" + pagingid;
      icon = "/img/notificationicons/tip.svg";
      renotify = true;
      break;
    case "reply":
      title = "Reply";
      text = "Reply from @" + pagingid;
      icon = "/img/notificationicons/reply.svg";
      renotify = true;
      break;
    case "like":
      title = "Liked";
      text = "Liked by @" + pagingid;
      icon = "/img/notificationicons/like.svg";
      break;
    case "thread":
      title = "Reply";
      text = "Thread reply by @" + pagingid;
      icon = "/img/notificationicons/thread.svg";
      break;
    case "topic":
      title = "Tag";
      text = "Subscribed Tag Post by @" + pagingid;
      icon = "/img/notificationicons/topic.svg";
      break;
    default:
  }

  const options = {
    body: text,
    tag: title,
    renotify: true,
    icon: icon,
    data: {
      time: new Date(Date.now()).toString(),
      txid: txid
    }
  };
  swRegistration.showNotification(title, options);

};


self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification;

  const page = '/index.html#notifications?txid=' + event.notification.data.txid;
  //const promiseChain = clients.openWindow(page);
  //event.waitUntil(promiseChain);

  //find open window to show notification 
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url.startsWith("https://member.cash") && windowClient.url.includes('#notifications')) {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      //matchingClient.url = "https://member.cash" + page;
      matchingClient.postMessage({
        notificationpage: "https://member.cash" + page
      });
      return matchingClient.focus();
    } else {
      return clients.openWindow(page).then(windowClient => windowClient ? windowClient.focus() : null);
    }
  });

  clickedNotification.close();

  event.waitUntil(promiseChain);


  // Do something as the result of the notification click
  //const promiseChain = doSomething();
  //event.waitUntil(promiseChain);
});

//https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns
function isClientFocused() {
  return clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let clientIsFocused = false;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused) {
        clientIsFocused = true;
        break;
      }
    }

    return clientIsFocused;
  });
}
